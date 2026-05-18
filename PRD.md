# Product Requirements Document (PRD)

# Playground App — Developer Utility Platform

**Version:** 1.0.0  
**Domain:** playgroundapp.online  
**Status:** Ready for Development  
**Last Updated:** 2025

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Technical Stack](#2-technical-stack)
3. [Project Structure](#3-project-structure)
4. [Design System & Theme](#4-design-system--theme)
5. [Global Architecture](#5-global-architecture)
6. [Pages & Routes](#6-pages--routes)
7. [Feature Specifications](#7-feature-specifications)
   - 7.1 [Landing Page](#71-landing-page)
   - 7.2 [Scratchpad Workspace](#72-scratchpad-workspace)
   - 7.3 [Random Secret Generator](#73-random-secret-generator)
   - 7.4 [Password Generator](#74-password-generator)
   - 7.5 [Crypto Utilities](#75-crypto-utilities)
8. [Shared Components](#8-shared-components)
9. [SEO Requirements](#9-seo-requirements)
10. [Security Constraints](#10-security-constraints)
11. [Code Quality Rules](#11-code-quality-rules)
12. [Non-Goals](#12-non-goals)

---

## 1. Product Overview

Playground App adalah platform utility tools berbasis web yang dirancang untuk developer, DevOps engineer, dan system administrator. Platform ini menyediakan workspace sementara dan kumpulan tools kriptografi/generator yang dapat digunakan langsung di browser tanpa memerlukan login.

**Core Value Proposition:**

- Local-first: semua data tersimpan di browser, tidak ada transmisi ke server
- Zero friction: tidak ada onboarding, langsung pakai
- Utility-focused: setiap halaman adalah tools yang berdiri sendiri
- SEO-friendly: setiap tools memiliki halaman dan URL tersendiri

---

## 2. Technical Stack

| Layer            | Technology       | Version         | Notes                                     |
| ---------------- | ---------------- | --------------- | ----------------------------------------- |
| Framework        | Next.js          | 15 (App Router) | Gunakan App Router (`/app` directory)     |
| Language         | TypeScript       | 5.x             | Strict mode, NO `any` types               |
| Styling          | Tailwind CSS     | 3.x             | Dengan shadcn/ui custom theme             |
| UI Components    | shadcn/ui        | latest          | Custom blue primary theme                 |
| Code Editor      | Monaco Editor    | latest          | Via `@monaco-editor/react`                |
| State Management | Zustand          | latest          | Untuk scratchpad state                    |
| Local Storage    | IndexedDB        | native          | Via `idb` package untuk scratchpad        |
| Crypto           | Node.js `crypto` | native          | Hanya di Server Component / Server Action |
| Browser Crypto   | `window.crypto`  | native          | Untuk client-side generation              |

### Dependency List

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@monaco-editor/react": "^4.6.0",
    "zustand": "^4.5.0",
    "idb": "^8.0.0",
    "nanoid": "^5.0.0",
    "uuid": "^9.0.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/uuid": "^9.0.0",
    "tailwindcss": "^3.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

## 3. Project Structure

```
playground-app/
├── app/
│   ├── layout.tsx                  # Root layout dengan metadata global
│   ├── page.tsx                    # Landing page (/)
│   ├── scratchpad/
│   │   └── page.tsx                # Scratchpad workspace (/scratchpad)
│   └── tools/
│       ├── layout.tsx              # Shared tools layout
│       ├── password-generator/
│       │   └── page.tsx
│       ├── random-secret-generator/
│       │   └── page.tsx
│       ├── base64-generator/
│       │   └── page.tsx
│       ├── uuid-generator/
│       │   └── page.tsx
│       └── sha256-generator/
│           └── page.tsx
├── components/
│   ├── ui/                         # shadcn/ui components (generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   └── ToolShowcaseGrid.tsx
│   ├── scratchpad/
│   │   ├── ScratchpadEditor.tsx
│   │   ├── TabBar.tsx
│   │   └── TabItem.tsx
│   ├── tools/
│   │   ├── ToolPageLayout.tsx      # Shared layout untuk semua tools page
│   │   ├── OutputDisplay.tsx       # Shared output box dengan copy button
│   │   └── CopyButton.tsx
│   └── shared/
│       ├── PageMeta.tsx
│       └── CategoryBadge.tsx
├── lib/
│   ├── crypto/
│   │   ├── secretGenerator.ts      # Random secret generation logic
│   │   ├── passwordGenerator.ts    # Password generation logic
│   │   ├── sha256.ts               # SHA256 hashing
│   │   └── base64.ts               # Base64 encoding/decoding
│   ├── storage/
│   │   ├── scratchpadStorage.ts    # IndexedDB operations untuk scratchpad
│   │   └── storageKeys.ts          # Konstanta storage keys
│   ├── utils/
│   │   ├── cn.ts                   # className merger utility
│   │   └── clipboard.ts            # Copy to clipboard helper
│   └── constants/
│       ├── tools.ts                # Tools metadata (nama, deskripsi, icon, route)
│       └── workspaceTypes.ts       # Tipe workspace scratchpad
├── hooks/
│   ├── useScratchpad.ts            # Zustand store hook untuk scratchpad
│   ├── useCopyToClipboard.ts       # Hook untuk copy dengan feedback
│   └── useLocalStorage.ts          # Generic localStorage hook
├── store/
│   └── scratchpadStore.ts          # Zustand store definition
├── types/
│   ├── scratchpad.ts               # Type definitions untuk scratchpad
│   ├── tools.ts                    # Type definitions untuk tools
│   └── crypto.ts                   # Type definitions untuk crypto outputs
├── public/
│   └── favicon.ico
├── tailwind.config.ts
├── components.json                 # shadcn/ui config
├── tsconfig.json
└── next.config.ts
```

---

## 4. Design System & Theme

### 4.1 shadcn/ui Configuration

File `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils/cn"
  }
}
```

### 4.2 Tailwind Config

File `tailwind.config.ts` harus mendefinisikan custom blue primary:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};

export default config;
```

### 4.3 CSS Variables (globals.css)

Default mode adalah **dark**. Definisikan dark theme sebagai default:

```css
:root {
  --background: 222 47% 8%; /* #0d1117 dark navy */
  --foreground: 210 40% 98%;

  --card: 222 47% 11%;
  --card-foreground: 210 40% 98%;

  --border: 217 33% 17%;
  --input: 217 33% 17%;

  --primary: 217 91% 60%; /* Blue #3b82f6 */
  --primary-foreground: 222 47% 8%;

  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;

  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;

  --ring: 217 91% 60%;
  --radius: 0.5rem;
}

.light {
  --background: 0 0% 100%;
  --foreground: 222 47% 8%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 8%;
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 8%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 8%;
  --ring: 217 91% 60%;
}
```

### 4.4 Design Principles

- **Dark mode default** — dokumen `<html>` harus memiliki class `dark` secara default
- **Monospace feel** — gunakan font `JetBrains Mono` atau `Fira Code` untuk output/kode
- **Dense UI** — padding lebih kecil dari SaaS biasa, lebih mirip IDE
- **No decorative illustrations** — tidak ada hero image berlebihan, fokus pada tools
- **Blue accent** — primary color `#3b82f6` (Tailwind blue-500) untuk semua CTA dan highlight

---

## 5. Global Architecture

### 5.1 Root Layout

File `app/layout.tsx` harus:

- Set `<html lang="en" className="dark">` — dark mode default, non-toggle pada MVP
- Set font via `next/font` (Inter untuk body, JetBrains Mono untuk mono)
- Include `<Navbar />` dan `<Footer />`
- Definisikan `metadata` global (title template, description, openGraph)

### 5.2 Navbar Component

Komponen `components/layout/Navbar.tsx`:

**Elemen yang harus ada:**

- Logo kiri: teks `playground` dengan ikon terminal/code (lucide-react `Terminal`)
- Nav links (desktop): `Scratchpad`, `Tools` (dropdown atau link ke section landing)
- Badge "local-first" di sebelah logo atau nav — teks kecil muted "all data stays in your browser"
- Tidak ada tombol Login/Sign up

**Behavior:**

- Sticky di atas (position: sticky, top: 0)
- Background `bg-background/80 backdrop-blur` untuk efek blur saat scroll
- Border bottom `border-b border-border`

### 5.3 Footer Component

Komponen `components/layout/Footer.tsx`:

**Elemen:**

- Teks copyright: `© 2025 Playground App`
- Tagline: `Developer utilities that run entirely in your browser.`
- Link ke tools utama (Scratchpad, Password Generator, Secret Generator)
- Tidak ada social media links

---

## 6. Pages & Routes

| Route                            | Komponen                                     | Deskripsi               |
| -------------------------------- | -------------------------------------------- | ----------------------- |
| `/`                              | `app/page.tsx`                               | Landing page            |
| `/scratchpad`                    | `app/scratchpad/page.tsx`                    | Workspace editor        |
| `/tools/password-generator`      | `app/tools/password-generator/page.tsx`      | Password generator      |
| `/tools/random-secret-generator` | `app/tools/random-secret-generator/page.tsx` | Crypto secret generator |
| `/tools/base64-generator`        | `app/tools/base64-generator/page.tsx`        | Base64 tool             |
| `/tools/uuid-generator`          | `app/tools/uuid-generator/page.tsx`          | UUID v4 generator       |
| `/tools/sha256-generator`        | `app/tools/sha256-generator/page.tsx`        | SHA256 hash generator   |

Setiap route tools harus memiliki `export const metadata` dengan title dan description unik.

---

## 7. Feature Specifications

### 7.1 Landing Page

**File:** `app/page.tsx`

#### 7.1.1 Hero Section

Komponen: `components/landing/HeroSection.tsx`

**Layout:** Full-width section, minimum height `min-h-[60vh]`, vertikal center.

**Konten yang harus dirender:**

```
[Icon: Terminal atau Code2 dari lucide-react]
Headline (h1): "Developer Playground & Operational Utilities"
Subheadline (p): "Workspace sementara dan utility tools untuk developer, DevOps, dan engineer. Semua berjalan di browser — tidak ada data yang dikirim ke server."
CTA Buttons:
  - Primary: "Open Scratchpad" → href="/scratchpad"
  - Secondary (outlined): "Explore Tools" → scroll to tools section
Badge di atas headline: "local-first • no login • no tracking"
```

**Typography:**

- `h1`: font-size `text-4xl md:text-6xl`, font-weight bold
- Headline harus menggunakan warna `text-foreground`
- Kata kunci seperti "developer", "DevOps", "engineer" boleh diberi highlight dengan warna `text-primary`

#### 7.1.2 Tool Showcase Grid

Komponen: `components/landing/ToolShowcaseGrid.tsx`

**Section heading:** "Available Tools" dengan anchor `id="tools"`

**Layout:** CSS Grid, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, gap `gap-4`

**Tools yang ditampilkan (6 tool cards):**

Setiap card dirender dari data array konstanta di `lib/constants/tools.ts`.

```typescript
// types/tools.ts
export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  href: string;
  icon: string; // Nama lucide-react icon
  keywords: string[]; // Untuk SEO meta
  quickActionLabel: string;
}

export type ToolCategory = 'workspace' | 'security' | 'crypto' | 'utility';
```

**Data tools (lib/constants/tools.ts):**

| id                 | name                    | description                                                | category  | href                           |
| ------------------ | ----------------------- | ---------------------------------------------------------- | --------- | ------------------------------ |
| scratchpad         | Scratchpad              | Workspace sementara untuk .env, snippet, SQL, bash command | workspace | /scratchpad                    |
| random-secret      | Random Secret Generator | Generate secure random string berbasis crypto              | security  | /tools/random-secret-generator |
| password-generator | Password Generator      | Generate password aman dan customizable                    | security  | /tools/password-generator      |
| base64-generator   | Base64 Generator        | Generate random base64 string untuk token dan secret       | crypto    | /tools/base64-generator        |
| uuid-generator     | UUID Generator          | Generate UUID v4 secara instan                             | crypto    | /tools/uuid-generator          |
| sha256-generator   | SHA256 Generator        | Generate SHA256 hash secara instan                         | crypto    | /tools/sha256-generator        |

**Struktur setiap Tool Card:**

```
[Card wrapper: border border-border rounded-lg p-4 hover:border-primary/50 transition-colors]
  [Header row]
    [Icon wrapper: bg-primary/10 rounded-md p-2]
      <LucideIcon />
    [Category Badge: pill kecil, warna berdasarkan kategori]
  [nama tools: font-semibold text-foreground]
  [description: text-sm text-muted-foreground]
  [keywords: hidden, hanya untuk SEO — render sebagai meta di halaman tools]
  [Quick Action Button: "Open →" atau "Generate →" → link ke href]
```

**Warna Category Badge:**

- `workspace` → `bg-blue-500/10 text-blue-400`
- `security` → `bg-green-500/10 text-green-400`
- `crypto` → `bg-purple-500/10 text-purple-400`
- `utility` → `bg-orange-500/10 text-orange-400`

---

### 7.2 Scratchpad Workspace

**File:** `app/scratchpad/page.tsx`

#### 7.2.1 Overview

Scratchpad adalah editor berbasis Monaco Editor dengan sistem multi-tab. Setiap tab memiliki tipe workspace sendiri. Semua data disimpan di IndexedDB via `idb` package — tidak ada request ke server.

#### 7.2.2 Type Definitions

```typescript
// types/scratchpad.ts

export type WorkspaceType = 'env' | 'bash' | 'sql' | 'json' | 'notes';

export interface Tab {
  id: string; // UUID v4
  label: string; // Nama tab, bisa diedit
  type: WorkspaceType; // Tipe menentukan syntax highlighting
  content: string; // Isi editor
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface ScratchpadState {
  tabs: Tab[];
  activeTabId: string | null;
}
```

#### 7.2.3 Zustand Store

**File:** `store/scratchpadStore.ts`

Store harus mendefinisikan interface (tanpa `any`):

```typescript
interface ScratchpadStore {
  tabs: Tab[];
  activeTabId: string | null;
  // Actions
  addTab: (type: WorkspaceType) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  renameTab: (tabId: string, label: string) => void;
  clearTabContent: (tabId: string) => void;
  loadFromStorage: () => Promise<void>;
}
```

**Behavior store:**

- `addTab`: generate UUID via `uuid`, buat tab baru dengan default content per type
- `removeTab`: jika tab yang dihapus adalah activeTab, pindah ke tab sebelumnya atau tab pertama
- `updateTabContent`: debounce 500ms sebelum persist ke IndexedDB
- `loadFromStorage`: dipanggil sekali saat mount komponen utama

#### 7.2.4 IndexedDB Storage

**File:** `lib/storage/scratchpadStorage.ts`

Gunakan package `idb` untuk operasi IndexedDB:

```typescript
import { openDB, IDBPDatabase } from 'idb';
import type { Tab } from '@/types/scratchpad';

const DB_NAME = 'playground-scratchpad';
const DB_VERSION = 1;
const STORE_NAME = 'tabs';

// Fungsi yang harus diimplementasikan:
export async function initDB(): Promise<IDBPDatabase>;
export async function saveTabs(tabs: Tab[]): Promise<void>;
export async function loadTabs(): Promise<Tab[]>;
export async function clearAllTabs(): Promise<void>;
```

#### 7.2.5 Monaco Editor Configuration

**Monaco language mapping per WorkspaceType:**

| WorkspaceType | Monaco Language      |
| ------------- | -------------------- |
| env           | ini (atau plaintext) |
| bash          | shell                |
| sql           | sql                  |
| json          | json                 |
| notes         | markdown             |

**Editor options yang harus dikonfigurasi:**

```typescript
const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  lineNumbers: 'on',
  wordWrap: 'on',
  theme: 'vs-dark', // Selalu dark
  scrollBeyondLastLine: false,
  automaticLayout: true, // Resize otomatis
  padding: { top: 16, bottom: 16 },
  overviewRulerLanes: 0,
  renderLineHighlight: 'line',
  cursorBlinking: 'smooth',
};
```

#### 7.2.6 UI Layout Scratchpad

**Layout keseluruhan:**

```
[Full screen layout: h-screen flex flex-col]
  [Inline page header: px-4 py-2 border-b]
    Judul "Scratchpad" + badge "local-first"
    Tombol "New Tab" (dropdown pilih type)
  [TabBar: horizontal scroll, border-b]
    [Tab items... dengan X untuk close]
  [Editor area: flex-1 overflow-hidden]
    [Monaco Editor: width 100%, height 100%]
  [Status bar: px-4 py-1 text-xs border-t bg-muted/30]
    "Tab type: ENV | Autosaved | {updatedAt timestamp}"
```

**TabBar behavior:**

- Tab aktif diberi warna `border-b-2 border-primary text-foreground`
- Tab non-aktif: `text-muted-foreground hover:text-foreground`
- Tombol `+` di kanan tab list membuka dropdown pilih type workspace
- Setiap tab punya tombol `×` kecil untuk menutup
- Jika hanya 1 tab, tombol `×` tetap tampil tapi saat diklik tambah 1 tab kosong dulu baru hapus tab lama

**New Tab Dropdown (pilih WorkspaceType):**

```
[Dropdown menu]
  ENV         — .env variables
  Bash        — Shell commands
  SQL         — Database queries
  JSON        — JSON data
  Notes       — Markdown notes
```

**Warning sebelum clear:** Saat user klik "Clear" (reset isi tab), tampilkan dialog konfirmasi menggunakan shadcn/ui `AlertDialog`:

```
Title: "Clear workspace?"
Description: "This will permanently delete all content in this tab. This action cannot be undone."
Cancel: "Cancel"
Confirm: "Clear" (warna destructive/merah)
```

#### 7.2.7 Toolbar Actions

Toolbar kecil di atas editor (atau di status bar) harus memiliki:

- **Copy** — copy seluruh isi editor ke clipboard, tampilkan toast "Copied!"
- **Clear** — trigger AlertDialog konfirmasi
- **Type indicator** — tampilkan tipe workspace aktif sebagai badge

---

### 7.3 Random Secret Generator

**File:** `app/tools/random-secret-generator/page.tsx`

#### 7.3.1 Logic

**File:** `lib/crypto/secretGenerator.ts`

```typescript
export type SecretFormat = 'base64' | 'hex';

export interface GenerateSecretOptions {
  bytes: number; // Jumlah bytes: 16 | 32 | 48 | 64
  format: SecretFormat;
}

export interface GeneratedSecret {
  value: string;
  format: SecretFormat;
  bytes: number;
  generatedAt: number;
}

// Implementasi menggunakan window.crypto.getRandomValues (client-side)
// JANGAN gunakan Math.random()
export function generateSecret(options: GenerateSecretOptions): GeneratedSecret;
```

**Implementasi `generateSecret`:**

1. Buat `Uint8Array` dengan panjang `options.bytes`
2. Isi dengan `window.crypto.getRandomValues(array)`
3. Convert ke format yang dipilih:
   - `base64`: `btoa(String.fromCharCode(...array))`
   - `hex`: `Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')`

#### 7.3.2 UI

**Layout halaman (gunakan `ToolPageLayout`):**

```
[ToolPageLayout title="Random Secret Generator" description="..."]

  [Control Section: Card]
    [Row 1: Format selector]
      Label: "Output Format"
      ToggleGroup (shadcn): "Base64" | "Hex"

    [Row 2: Byte size selector]
      Label: "Size"
      ToggleGroup: "16 bytes" | "32 bytes" | "48 bytes" | "64 bytes"

    [Row 3: Generate button]
      Button primary full-width: "Generate Secret"
      dengan icon Shuffle dari lucide-react

  [Output Section: Card]
    Label: "Generated Secret"
    [OutputDisplay: monospace textarea readonly dengan value]
    [Row: CopyButton | badge "X bytes" | badge "format"]

  [Info Section: code block kecil]
    "Node.js equivalent:"
    require('crypto').randomBytes(N).toString('format')
```

**Behavior:**

- Saat halaman pertama load, langsung generate 1 secret (32 bytes, base64) secara otomatis
- Klik "Generate Secret" atau klik ikon Shuffle → generate ulang
- Copy button menggunakan hook `useCopyToClipboard`, tampilkan ikon checkmark selama 2 detik setelah copy

---

### 7.4 Password Generator

**File:** `app/tools/password-generator/page.tsx`

#### 7.4.1 Logic

**File:** `lib/crypto/passwordGenerator.ts`

```typescript
export interface PasswordOptions {
  length: number; // 8–128
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface GeneratedPassword {
  value: string;
  entropy: number; // Bits of entropy
  options: PasswordOptions;
}

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function generatePassword(options: PasswordOptions): GeneratedPassword;
export function calculateEntropy(charsetSize: number, length: number): number;
```

**Implementasi `generatePassword`:**

1. Validasi: minimal 1 karakter set harus aktif, throw `Error` jika tidak ada
2. Bangun charset dari options yang aktif
3. Generate menggunakan `window.crypto.getRandomValues` — JANGAN `Math.random()`
4. Pastikan minimal 1 karakter dari setiap charset yang aktif dimasukkan (untuk memenuhi complexity requirement)
5. Shuffle hasil array menggunakan Fisher-Yates dengan crypto random

**Implementasi `calculateEntropy`:**
`entropy = length * Math.log2(charsetSize)`

#### 7.4.2 UI

```
[ToolPageLayout title="Password Generator"]

  [Controls Card]
    [Length slider]
      Label: "Length: {value}"
      shadcn Slider: min=8, max=128, step=1, default=16
      Input number di samping untuk input manual

    [Character sets: 4 checkbox baris]
      [x] Uppercase (A-Z)
      [x] Lowercase (a-z)
      [x] Numbers (0-9)
      [ ] Symbols (!@#...)

    [Generate Button: primary, full-width]
      "Generate Password" + icon RefreshCw

  [Output Card]
    Label: "Generated Password"
    [OutputDisplay monospace]
    [CopyButton]

    [Entropy indicator]
      Label: "Entropy: {N} bits"
      Progress bar:
        - < 40 bits → red (Weak)
        - 40–60 bits → yellow (Fair)
        - 60–80 bits → blue (Good)
        - > 80 bits → green (Strong)
      Badge teks: "Weak" | "Fair" | "Good" | "Strong"
```

**Behavior:**

- Auto-generate saat halaman load dengan default options
- Re-generate otomatis saat user mengubah opsi apapun (dengan debounce 300ms)
- Jika semua checkbox dinonaktifkan, tampilkan error inline "Select at least one character type"
- Slider dan number input harus sinkron dua arah

---

### 7.5 Crypto Utilities

Terdiri dari 3 halaman tools terpisah:

#### 7.5.1 Base64 Generator

**File:** `app/tools/base64-generator/page.tsx`  
**Logic:** `lib/crypto/base64.ts`

```typescript
export interface Base64Result {
  value: string;
  bytes: number;
  generatedAt: number;
}

// Mode 1: Generate random base64 (berbeda dari secret generator — hanya base64)
export function generateRandomBase64(bytes: number): Base64Result;

// Mode 2: Encode text ke base64
export function encodeToBase64(text: string): string;

// Mode 3: Decode base64 ke text
export function decodeFromBase64(base64: string): string; // throw jika invalid
```

**UI Layout:**

```
[ToolPageLayout title="Base64 Generator & Encoder"]

  [Tab: "Generate" | "Encode / Decode"]

  --- Tab: Generate ---
  [Card]
    Label: "Byte Size"
    ToggleGroup: 16 | 32 | 64 | 128
    Button: "Generate"
    [OutputDisplay]
    [CopyButton]

  --- Tab: Encode / Decode ---
  [Card]
    Label: "Input"
    Textarea (plaintext input)
    Row buttons: "Encode →" | "← Decode"
    Label: "Output"
    [OutputDisplay]
    [CopyButton]
    Error message inline jika decode gagal: "Invalid base64 string"
```

#### 7.5.2 UUID Generator

**File:** `app/tools/uuid-generator/page.tsx`

```typescript
// lib/crypto/uuid.ts
// Gunakan package 'uuid' untuk generate
import { v4 as uuidv4 } from 'uuid';

export interface UUIDResult {
  value: string;
  version: 4;
  generatedAt: number;
}

export function generateUUID(): UUIDResult;
export function generateMultipleUUIDs(count: number): UUIDResult[];
```

**UI Layout:**

```
[ToolPageLayout title="UUID v4 Generator"]

  [Card]
    Label: "Count"
    ToggleGroup: 1 | 5 | 10 | 20
    Button: "Generate UUIDs"

    [Output area]
      Jika count = 1: OutputDisplay single line
      Jika count > 1: Textarea multi-line (satu UUID per baris)
    [CopyButton: "Copy All"]
```

#### 7.5.3 SHA256 Generator

**File:** `app/tools/sha256-generator/page.tsx`  
**Logic:** `lib/crypto/sha256.ts`

```typescript
// Gunakan Web Crypto API (window.crypto.subtle) - tidak perlu library
export async function hashSHA256(input: string): Promise<string>;
// Returns lowercase hex string
```

**Implementasi `hashSHA256`:**

1. `TextEncoder().encode(input)`
2. `crypto.subtle.digest('SHA-256', encoded)`
3. Convert `ArrayBuffer` ke hex string

**UI Layout:**

```
[ToolPageLayout title="SHA256 Hash Generator"]

  [Card]
    Label: "Input"
    Textarea: placeholder "Enter text to hash..."
    [Output]
      Label: "SHA256 Hash"
      OutputDisplay monospace (hasil hash)
      [CopyButton]

  [Behavior: hash otomatis saat user mengetik (debounce 300ms)]
  [Jika input kosong: tampilkan placeholder di output "Enter text above to generate hash"]
```

---

## 8. Shared Components

### 8.1 ToolPageLayout

**File:** `components/tools/ToolPageLayout.tsx`

```typescript
interface ToolPageLayoutProps {
  title: string;
  description: string;
  category: ToolCategory;
  keywords: string[]; // Untuk meta hidden
  children: React.ReactNode;
}
```

**Struktur render:**

```
[Container max-w-2xl mx-auto px-4 py-8]
  [Breadcrumb: Home > Tools > {title}]
  [Header]
    [CategoryBadge]
    h1: {title}
    p: {description}
  [Content: {children}]
```

### 8.2 OutputDisplay

**File:** `components/tools/OutputDisplay.tsx`

```typescript
interface OutputDisplayProps {
  value: string;
  placeholder?: string;
  multiline?: boolean; // default false
  className?: string;
}
```

Render sebagai `<pre>` atau `<textarea readOnly>` dengan styling:

- Font monospace
- Background `bg-muted/50`
- Border `border border-border`
- `break-all` untuk string panjang
- Minimum height `min-h-[48px]`

### 8.3 CopyButton

**File:** `components/tools/CopyButton.tsx`

```typescript
interface CopyButtonProps {
  value: string;
  label?: string; // default "Copy"
  size?: 'sm' | 'default';
}
```

**Behavior:**

- Gunakan hook `useCopyToClipboard`
- Setelah copy berhasil: ganti icon dari `Copy` ke `Check` selama 2000ms
- Gunakan `navigator.clipboard.writeText` — tidak ada fallback ke `execCommand`

### 8.4 CategoryBadge

**File:** `components/shared/CategoryBadge.tsx`

```typescript
interface CategoryBadgeProps {
  category: ToolCategory;
}
```

Render pill kecil dengan warna sesuai kategori (lihat bagian 7.1.2).

### 8.5 useCopyToClipboard Hook

**File:** `hooks/useCopyToClipboard.ts`

```typescript
interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
}

export function useCopyToClipboard(resetDelay?: number): UseCopyToClipboardReturn;
// resetDelay default: 2000ms
```

---

## 9. SEO Requirements

### 9.1 Metadata Per Halaman

Setiap halaman harus mengekspor `metadata` menggunakan Next.js App Router metadata API:

```typescript
// Contoh untuk password generator
export const metadata: Metadata = {
  title: 'Password Generator — Playground App',
  description:
    'Generate secure, customizable passwords with entropy indicator. Free online password generator for developers.',
  keywords: [
    'secure password generator',
    'random password generator',
    'online password generator',
    'password entropy',
  ],
  openGraph: {
    title: 'Password Generator — Playground App',
    description: 'Generate secure passwords instantly. No data sent to server.',
    url: 'https://playgroundapp.online/tools/password-generator',
  },
};
```

### 9.2 Target Keywords Per Halaman

| Halaman                          | Primary Keyword           | Secondary Keywords                                   |
| -------------------------------- | ------------------------- | ---------------------------------------------------- |
| `/`                              | developer tools online    | developer playground, operational toolbox            |
| `/scratchpad`                    | env editor online         | temporary snippet storage, online scratchpad         |
| `/tools/password-generator`      | secure password generator | random password generator, online password generator |
| `/tools/random-secret-generator` | random secret generator   | crypto random generator, base64 secret generator     |
| `/tools/base64-generator`        | base64 generator          | random base64 online, base64 encode decode           |
| `/tools/uuid-generator`          | uuid generator online     | uuid v4 generator                                    |
| `/tools/sha256-generator`        | sha256 generator          | sha256 hash online                                   |

### 9.3 Sitemap

Buat `app/sitemap.ts` yang menghasilkan sitemap XML otomatis untuk semua route.

### 9.4 Structured Data

Setiap tools page harus menyertakan JSON-LD schema type `WebApplication`:

```typescript
// Di dalam halaman tools
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Password Generator',
  url: 'https://playgroundapp.online/tools/password-generator',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0' },
};
```

---

## 10. Security Constraints

Ini adalah aturan keamanan yang **wajib** diimplementasikan, bukan opsional:

1. **No server-side storage** — tidak ada API route yang menerima konten editor atau generated values
2. **Crypto-safe random** — SELALU gunakan `window.crypto.getRandomValues()` untuk semua generation. DILARANG menggunakan `Math.random()`
3. **No analytics on content** — tidak ada tracking/logging terhadap isi scratchpad atau generated values
4. **No clipboard persistence** — tidak ada mekanisme yang menyimpan history clipboard
5. **Local-only scratchpad** — IndexedDB hanya untuk tab saat ini, tidak ada sync ke server
6. **Warning before destructive actions** — `AlertDialog` konfirmasi sebelum Clear/Delete
7. **No external requests dari tools** — semua computation di client, tidak ada fetch ke API eksternal untuk generate nilai

---

## 11. Code Quality Rules

Aturan ini **tidak boleh dilanggar** oleh AI agent yang mengimplementasikan:

### TypeScript

- **DILARANG KERAS menggunakan `any`** — gunakan `unknown` jika tipe tidak pasti, kemudian narrow dengan type guard
- Aktifkan `strict: true` di `tsconfig.json`
- Semua props komponen harus memiliki interface/type yang eksplisit
- Gunakan `type` untuk union/intersection, gunakan `interface` untuk object shapes
- Return type fungsi harus eksplisit jika tidak trivially inferable

### React / Next.js

- Gunakan **Server Components** by default, tambahkan `"use client"` hanya jika perlu (interaktivitas, hooks, browser API)
- Komponen yang menggunakan Monaco Editor, Zustand, IndexedDB, atau `window.crypto` harus `"use client"`
- Hindari prop drilling lebih dari 2 level — gunakan Zustand atau React Context
- Gunakan `React.memo` untuk komponen yang render dalam list (TabItem, ToolCard)

### Clean Code

- Panjang fungsi maksimal 30 baris — extract ke fungsi terpisah jika lebih
- Nama variabel harus deskriptif dan dalam bahasa Inggris
- Tidak ada magic numbers — gunakan konstanta dengan nama
- Setiap file maksimal 150 baris kode (diluar types/interfaces)
- Import harus dikelompokkan: (1) React/Next, (2) external packages, (3) internal modules, dipisahkan blank line

### Error Handling

- Semua operasi async (IndexedDB, clipboard, crypto.subtle) harus di-wrap `try/catch`
- Error state harus ditampilkan ke user, bukan hanya `console.error`
- Gunakan Error Boundary di level `app/layout.tsx` untuk global error handling

### File Naming

- Komponen React: `PascalCase.tsx`
- Utility/hooks/store: `camelCase.ts`
- Type files: `camelCase.ts` di folder `types/`

---

## 12. Non-Goals

Fitur berikut **tidak akan diimplementasikan** pada MVP ini:

- User authentication / login system
- Cloud sync atau server-side storage
- Collaborative editing
- Social sharing / public snippet links
- JWT decoder (dijadwalkan Phase 2)
- bcrypt generator (dijadwalkan Phase 2)
- JSON formatter (dijadwalkan Phase 2)
- Regex tester (dijadwalkan Phase 2)
- Webhook inspector (dijadwalkan Phase 3)
- Docker compose visualizer (dijadwalkan Phase 3)
- Light/dark mode toggle — dark mode saja pada MVP
- Mobile app (pure web, responsive tapi tidak React Native)
- Analytics dashboard untuk admin
- Rate limiting atau abuse prevention (no server = no problem)

---

## Appendix: Checklist Implementasi

AI agent yang mengimplementasikan PRD ini harus menyelesaikan item berikut secara berurutan:

### Phase 1 — Setup

- [ ] Init Next.js 15 project dengan TypeScript strict
- [ ] Install semua dependencies
- [ ] Setup shadcn/ui dengan custom blue theme
- [ ] Konfigurasi `globals.css` dengan CSS variables dark theme
- [ ] Buat root layout dengan Navbar dan Footer

### Phase 2 — Types & Utils

- [ ] Definisikan semua types di `types/`
- [ ] Implementasikan `lib/utils/cn.ts`
- [ ] Implementasikan `lib/utils/clipboard.ts`
- [ ] Implementasikan semua crypto utilities di `lib/crypto/`
- [ ] Implementasikan `lib/storage/scratchpadStorage.ts`

### Phase 3 — Hooks & Store

- [ ] Implementasikan `hooks/useCopyToClipboard.ts`
- [ ] Implementasikan `store/scratchpadStore.ts`
- [ ] Implementasikan `hooks/useScratchpad.ts`

### Phase 4 — Shared Components

- [ ] Implementasikan `ToolPageLayout`
- [ ] Implementasikan `OutputDisplay`
- [ ] Implementasikan `CopyButton`
- [ ] Implementasikan `CategoryBadge`

### Phase 5 — Pages

- [ ] Landing page dengan HeroSection dan ToolShowcaseGrid
- [ ] Scratchpad page dengan Monaco Editor dan multi-tab
- [ ] Password Generator page
- [ ] Random Secret Generator page
- [ ] Base64 Generator page
- [ ] UUID Generator page
- [ ] SHA256 Generator page

### Phase 6 — SEO & Polish

- [ ] Metadata untuk setiap halaman
- [ ] Sitemap
- [ ] JSON-LD schema per tools page
- [ ] Favicon dan OG image
- [ ] Final review: tidak ada `any`, tidak ada `Math.random()`, tidak ada server storage

---

_PRD ini adalah dokumen tunggal yang menjadi sumber kebenaran untuk implementasi MVP Playground App. Setiap perubahan arsitektur atau fitur harus diupdate di dokumen ini terlebih dahulu._
