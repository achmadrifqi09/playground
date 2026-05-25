import { Metadata } from 'next';

export const globalMetadata: Metadata = {
  metadataBase: new URL('https://playgroundapp.online'),
  title: {
    template: '%s | Playground App',
    default: 'Playground App — Free Developer Tools Online',
  },
  description:
    'A free collection of developer tools that run entirely in your browser. Generate UUIDs, decode JWTs, format SQL, build cURL commands, encrypt passwords, and more — no data ever sent to a server.',
  keywords: [
    'developer tools online',
    'free developer utilities',
    'browser based dev tools',
    'jwt decoder online',
    'uuid generator online',
    'sql formatter online',
    'base64 encoder decoder',
    'curl builder online',
    'password generator',
    'sha256 hash generator',
    'json to php array',
    'random secret generator',
    'devtools playground',
    'client side tools for developers',
  ],
  authors: [{ name: 'Playground App', url: 'https://playgroundapp.online' }],
  creator: 'Playground App',
  publisher: 'Playground App',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Playground App — Free Developer Tools Online',
    description:
      'A free collection of developer tools that run entirely in your browser. No data ever sent to a server.',
    url: 'https://playgroundapp.online',
    siteName: 'Playground App',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Playground App — Free Developer Tools Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground App — Free Developer Tools Online',
    description:
      'A free collection of developer tools that run entirely in your browser. No data ever sent to a server.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online',
  },
};

export const jwtDecoderMetadata: Metadata = {
  title: 'JWT Decoder & Inspector — Decode JSON Web Tokens Online for Free',
  description:
    'Decode and inspect JSON Web Tokens (JWT) instantly in your browser. View header, payload, claims, expiration date, issued-at time, and signature. 100% secure — your token never leaves your device.',
  keywords: [
    'jwt decoder online',
    'decode jwt token free',
    'json web token decoder',
    'jwt inspector',
    'jwt payload viewer',
    'jwt claims analyzer',
    'jwt expiration checker',
    'verify jwt signature online',
    'jwt header decoder',
    'secure jwt tool',
    'online jwt debugger',
  ],
  openGraph: {
    title: 'JWT Decoder & Inspector — Decode JSON Web Tokens Online | Playground App',
    description:
      'Decode JWT header, payload, and claims in your browser. Check expiration, issued-at time, and signature info. Your token never leaves your device.',
    url: 'https://playgroundapp.online/tools/jwt-decoder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'JWT Decoder & Inspector — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JWT Decoder & Inspector — Decode JSON Web Tokens Online for Free',
    description:
      'Decode JWT header, payload, and claims in your browser. Your token never leaves your device.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online/tools/jwt-decoder',
  },
};

export const uuidGeneratorMetadata: Metadata = {
  title: 'UUID Generator — Free Online UUID v4 Generator',
  description:
    'Generate one or multiple UUID v4 (Universally Unique Identifiers) instantly in your browser. Copy to clipboard with a single click. Free, fast, and 100% client-side — no data sent to a server.',
  keywords: [
    'uuid generator online',
    'uuid v4 generator free',
    'generate uuid online',
    'random uuid generator',
    'unique id generator online',
    'bulk uuid generator',
    'guid generator online',
    'uuid copy to clipboard',
    'online uuid creator',
    'universally unique identifier generator',
  ],
  openGraph: {
    title: 'UUID Generator — Free Online UUID v4 Generator | Playground App',
    description:
      'Generate UUID v4 identifiers instantly in your browser. Copy to clipboard in one click. Free, fast, and 100% client-side.',
    url: 'https://playgroundapp.online/tools/uuid-generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'UUID Generator — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UUID Generator — Free Online UUID v4 Generator',
    description:
      'Generate UUID v4 identifiers instantly in your browser. Copy to clipboard in one click.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online/tools/uuid-generator',
  },
};

export const base64GeneratorMetadata: Metadata = {
  title: 'Base64 Encoder & Decoder — Free Online Tool',
  description:
    'Encode text to Base64 or decode Base64 strings back to plain text instantly. Also generate random Base64 secrets for tokens and API keys. Free, fast, and 100% client-side.',
  keywords: [
    'base64 encoder online',
    'base64 decoder online',
    'encode text to base64',
    'decode base64 string',
    'random base64 generator',
    'base64 encode decode free',
    'base64 string generator',
    'base64 tool for developers',
    'online base64 converter',
  ],
  openGraph: {
    title: 'Base64 Encoder & Decoder — Free Online Tool | Playground App',
    description:
      'Encode or decode Base64 strings and generate random Base64 secrets instantly. 100% client-side — no data ever leaves your browser.',
    url: 'https://playgroundapp.online/tools/base64-generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Base64 Encoder & Decoder — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder & Decoder — Free Online Tool',
    description:
      'Encode or decode Base64 strings and generate random Base64 secrets instantly. No data leaves your browser.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online/tools/base64-generator',
  },
};

export const sha256GeneratorMetadata: Metadata = {
  title: 'SHA-256 Hash Generator — Free Online SHA256 Encryption Tool',
  description:
    'Generate SHA-256 cryptographic hashes from any text instantly in your browser. Free, fast, and 100% client-side — perfect for verifying data integrity, hashing passwords, and generating checksums.',
  keywords: [
    'sha256 hash generator online',
    'sha-256 encryption tool',
    'generate sha256 hash free',
    'sha256 checksum generator',
    'text to sha256 online',
    'sha256 password hash',
    'sha256 string hash',
    'sha256 hash calculator',
    'online sha256 tool',
    'sha256 data integrity checker',
  ],
  openGraph: {
    title: 'SHA-256 Hash Generator — Free Online SHA256 Encryption Tool | Playground App',
    description:
      'Generate SHA-256 hashes from any text instantly. 100% client-side — ideal for data integrity checks, password hashing, and checksums.',
    url: 'https://playgroundapp.online/tools/sha256-generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'SHA-256 Hash Generator — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHA-256 Hash Generator — Free Online SHA256 Encryption Tool',
    description:
      'Generate SHA-256 hashes from any text instantly. 100% client-side — perfect for data integrity checks.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online/tools/sha256-generator',
  },
};

export const randomSecretGeneratorMetadata: Metadata = {
  title: 'Random Secret Generator — Generate Cryptographically Secure Secrets Online',
  description:
    'Generate cryptographically secure random secrets, API keys, and tokens directly in your browser using the Web Crypto API. Choose output format: hex, base64, or alphanumeric. Perfect for JWT secrets, encryption keys, and session tokens.',
  keywords: [
    'random secret generator online',
    'cryptographically secure random string',
    'generate api key online',
    'random token generator',
    'jwt secret generator',
    'crypto random key generator',
    'base64 secret generator',
    'hex secret generator',
    'secure random string generator',
    'generate encryption key online',
    'session token generator',
  ],
  openGraph: {
    title: 'Random Secret Generator — Cryptographically Secure Secrets Online | Playground App',
    description:
      'Generate cryptographically secure random secrets, API keys, and tokens using Web Crypto API. Choose hex, base64, or alphanumeric output. 100% client-side.',
    url: 'https://playgroundapp.online/tools/random-secret-generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Random Secret Generator — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Secret Generator — Generate Cryptographically Secure Secrets Online',
    description:
      'Generate cryptographically secure random secrets, API keys, and tokens. Choose hex, base64, or alphanumeric output.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://playgroundapp.online/tools/random-secret-generator',
  },
};

export const passwordGeneratorMetadata: Metadata = {
  title: 'Secure Password Generator — Free Online Strong Password Tool',
  description:
    'Generate strong, random, and customizable passwords instantly in your browser. Set length, include uppercase, lowercase, numbers, and symbols. Shows password strength and entropy score. 100% client-side.',
  keywords: [
    'secure password generator online',
    'random password generator free',
    'strong password generator',
    'password strength checker',
    'password entropy calculator',
    'custom password generator',
    'online password creator',
    'generate random password',
    'password with symbols online',
    'developer password tool',
  ],
  openGraph: {
    title: 'Secure Password Generator — Free Online Strong Password Tool | Playground App',
    description:
      'Generate strong, random passwords with custom length and character sets. Includes entropy score. 100% client-side — no data ever sent to a server.',
    url: 'https://playgroundapp.online/tools/password-generator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Secure Password Generator — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Secure Password Generator — Free Online Strong Password Tool',
    description: 'Generate strong, random passwords with custom length and character sets.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://playgroundapp.online/tools/password-generator' },
};

export const sqlFormatterMetadata: Metadata = {
  title: 'SQL Formatter & Query Analyzer — Free Online SQL Beautifier',
  description:
    'Format, beautify, and minify SQL queries instantly in your browser. Detects dangerous patterns like UPDATE without WHERE, SELECT *, and missing indexes. Free, offline, and 100% client-side.',
  keywords: [
    'sql formatter online',
    'sql query beautifier',
    'format sql online free',
    'sql minifier online',
    'sql query analyzer',
    'sql pretty printer',
    'online sql formatter free',
    'beautify sql query',
    'sql dangerous query checker',
    'sql anti-pattern detector',
    'sql lint tool',
    'sql query formatter',
  ],
  openGraph: {
    title: 'SQL Formatter & Query Analyzer — Free Online SQL Beautifier | Playground App',
    description:
      'Format and analyze SQL queries in your browser. Detects dangerous UPDATE without WHERE, SELECT *, and other anti-patterns. 100% offline.',
    url: 'https://playgroundapp.online/tools/sql-formatter',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'SQL Formatter & Query Analyzer — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQL Formatter & Query Analyzer — Free Online SQL Beautifier',
    description:
      'Format and analyze SQL queries in your browser. Detects dangerous patterns and anti-patterns.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://playgroundapp.online/tools/sql-formatter' },
};

export const curlBuilderMetadata: Metadata = {
  title: 'cURL Builder & API Tester — Free Online HTTP Request Tool',
  description:
    'Build, import, and test HTTP API requests directly from your browser. Import existing cURL commands, set custom headers, inspect responses, and analyze status codes — a free, lightweight Postman alternative.',
  keywords: [
    'curl builder online',
    'api tester online',
    'http request builder',
    'online postman alternative',
    'curl command generator',
    'import curl command',
    'test api endpoints online',
    'rest api tester free',
    'api debugging tool',
    'http client online',
    'curl parser online',
    'build curl request',
  ],
  openGraph: {
    title: 'cURL Builder & API Tester — Free Online HTTP Request Tool | Playground App',
    description:
      'Build and test HTTP API requests in your browser. Import cURL commands, add headers, inspect responses — a lightweight, free Postman alternative.',
    url: 'https://playgroundapp.online/tools/curl-builder',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'cURL Builder & API Tester — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cURL Builder & API Tester — Free Online HTTP Request Tool',
    description:
      'Build and test HTTP API requests in your browser. Import cURL commands, add headers, inspect responses.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://playgroundapp.online/tools/curl-builder' },
};

export const jsonPhpConverterMetadata: Metadata = {
  title: 'JSON to PHP Array Converter — Free Online Tool',
  description:
    'Convert JSON to PHP associative array and PHP array back to JSON instantly. Supports nested objects, arrays, and complex structures. Free, fast, and 100% client-side — no data sent to a server.',
  keywords: [
    'json to php array converter',
    'php array to json converter',
    'convert json to php online',
    'php associative array from json',
    'json php converter free',
    'online php array generator',
    'nested json to php array',
    'php developer tools online',
  ],
  openGraph: {
    title: 'JSON to PHP Array Converter — Free Online Tool | Playground App',
    description:
      'Convert JSON to PHP associative array and PHP array to JSON instantly. Supports nested structures. 100% client-side.',
    url: 'https://playgroundapp.online/tools/json-php-converter',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'JSON to PHP Array Converter — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON to PHP Array Converter — Free Online Tool',
    description:
      'Convert JSON to PHP associative array and PHP array to JSON instantly. Supports nested structures.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://playgroundapp.online/tools/json-php-converter' },
};

export const scratchpadMetadata: Metadata = {
  title: 'Online Scratchpad — Temporary Workspace for Developers',
  description:
    'A free online scratchpad for developers. Write and store temporary .env variables, code snippets, SQL queries, bash commands, and notes — all saved locally in your browser.',
  keywords: [
    'online scratchpad for developers',
    'temporary code editor online',
    'env file editor online',
    'browser scratchpad',
    'temporary snippet storage',
    'online notepad for developers',
    'local storage scratchpad',
    'bash snippet organizer',
    'sql scratch editor',
  ],
  openGraph: {
    title: 'Online Scratchpad — Temporary Workspace for Developers | Playground App',
    description:
      'Write and organize temporary .env variables, SQL queries, code snippets, and bash commands. Everything stays in your browser — nothing is sent to a server.',
    url: 'https://playgroundapp.online/scratchpad',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Online Scratchpad for Developers — Playground App',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Scratchpad — Temporary Workspace for Developers',
    description:
      'Write and organize temporary .env variables, SQL queries, code snippets, and bash commands. Everything stays in your browser.',
    images: ['/og-image.jpg'],
  },
  alternates: { canonical: 'https://playgroundapp.online/scratchpad' },
};
