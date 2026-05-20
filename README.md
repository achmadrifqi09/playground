# Playground App — Developer & Operational Utilities Platform

Playground App is a client-side utility suite designed for developers, DevOps, and engineers. It offers a local-first sandbox environment where all operations, formatters, generators, and decoders run entirely inside the user's web browser using native APIs and Web Workers. Your sensitive parameters, keys, queries, and authorization tokens never leave your local machine.

---

## Key Pillars & Architecture

### 1. Privacy-First & Local-First Execution

Unlike traditional online utility tools that send inputs, secrets, and payloads to backend servers, Playground App performs **100% of its computation client-side**:

- **Native Web Crypto APIs**: Cryptographically secure operations like random secret generators and password creation use browser-level secure entropy libraries (`window.crypto`).
- **Zero Tracker Scripts**: No telemetry, database logging, third-party user-tracking cookies, or remote data persistence.
- **Local Storage Sandbox**: Any saved query history, local configuration parameters, or variables persist locally inside the user's browser sandbox and never sync to external databases.

### 2. Modern Technologies

- **Framework**: Next.js 16.x (App Router) configured with Turbopack for compilation.
- **Styling**: Vanilla CSS variable overrides alongside custom utility combinations.
- **Icons**: Lucide React for modern, consistent design aesthetics.
- **Deployment**: Highly compatible with Vercel and Cloudflare Workers (using `@opennextjs/cloudflare` / Wrangler).

---

## Folder Structure

```text
playgroundapp/
├── app/                      # Next.js App Router Page Segments
│   ├── about/                # SEO Optimized About Page
│   ├── scratchpad/           # Scratchpad Workspace (default.env, JSON, SQL, bash)
│   ├── tools/                # Specialized Browser-Based Utilities
│   │   ├── base64-generator/ # Base64 encoder and decoder
│   │   ├── curl-builder/     # cURL Request Builder & API Playground
│   │   ├── jwt-decoder/      # JWT Claims Decoder & Signature Auditor
│   │   ├── password-generator/
│   │   ├── random-secret-generator/
│   │   ├── sha256-generator/
│   │   ├── sql-formatter/    # SQL dialector beautifier & diagnostics
│   │   └── uuid-generator/
│   ├── globals.css           # Styling system & dark-mode custom grids
│   ├── layout.tsx            # Root component layout (sticky header / dynamic footer)
│   └── sitemap.ts            # Dynamic SEO Sitemap generator
├── components/               # UI and Layout Components
│   ├── landing/              # Hero & Showcase grids
│   ├── layout/               # Header navbar & dynamic copyright year footer
│   ├── shared/               # Badges and indicators
│   └── ui/                   # Modular input, buttons, and textarea widgets
├── lib/                      # Core Logic and Utilities
│   ├── constants/            # Metadata declarations for available tools
│   └── utils/                # Zero-comment, typed logic handlers (SQL, JWT, cURL)
└── types/                    # Common TypeScript definitions
```

---

## Detailed Tool Showcase

| Tool Name                          | Core Capability                                                                                                            | Offline Edge & SEO Keyword                  |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| **Scratchpad Workspace**           | Edit `.env`, JSON payloads, SQL blocks, or bash commands simultaneously with local storage persistence.                    | `env editor online` / `online scratchpad`   |
| **JWT Decoder & Inspector**        | Decode header & payload properties, check active validation states, audit claims, and verify signatures using HS256/RS256. | `jwt decoder` / `verify jwt`                |
| **cURL Builder & API Playground**  | Paste cURL parameters, specify workspace variables, set up assertions, and generate integration code (Fetch, Axios).       | `curl builder` / `api playground`           |
| **SQL Formatter & Query Analyzer** | Format SQL dialects (MySQL, PG, SQLite, SQL Server) and compute readability, depth, and dangerous operation alerts.        | `sql formatter` / `beautify sql`            |
| **Random Secret Generator**        | Compute crypto-secure random hex, base64, and string payloads.                                                             | `crypto random generator`                   |
| **Password Generator**             | Generate customizable secure passwords with targeted character-set parameters.                                             | `secure password generator`                 |
| **Base64 Converter**               | Instantly encode or decode text strings to/from standard Base64 representation.                                            | `base64 encode decode`                      |
| **UUID Generator**                 | Instantly generate single or bulk compliant UUID v4 identifiers.                                                           | `uuid generator online`                     |
| **SHA256 Generator**               | Local high-speed SHA-256 hashing.                                                                                          | `sha256 hash online`                        |
| **JSON ⇄ PHP Array Converter**     | Double-sided conversion mapping between standard JSON objects and associative PHP array definitions.                       | `json to php array` / `php array converter` |

---

## Local Development Workflow

First, clone the repository and install dependencies:

```bash
npm install
```

Start the interactive development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Verify static page compilations, TypeScript typings, and builds:

```bash
npm run build
```
