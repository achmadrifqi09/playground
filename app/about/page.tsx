import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Terminal,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Hash,
  RefreshCw,
  Eye,
  Globe,
  Database,
  Cpu,
  Award,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Playground App — Developer & Operational Utilities Platform',
  description:
    'Learn more about Playground App, our privacy-first local-first developer utilities, including JWT decoding, SQL formatting, and cURL building.',
  keywords: [
    'privacy-first developer tools',
    'local-first tools',
    'about playgroundapp',
    'jwt decoder offline',
    'browser-based developer tools',
  ],
};

interface ToolDetail {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  benefit: string;
  href: string;
}

const toolDetails: ToolDetail[] = [
  {
    id: 'tool-scratchpad',
    name: 'Scratchpad Workspace',
    description:
      'A powerful scratchpad that lets you quickly compose, edit, and keep track of .env parameters, JSON documents, SQL scripts, or bash commands.',
    icon: Terminal,
    benefit: 'Fast local storage persistence with zero external server syncing.',
    href: '/scratchpad',
  },
  {
    id: 'tool-jwt-decoder',
    name: 'JWT Decoder & Inspector',
    description:
      'Directly analyze, verify, and audit JSON Web Tokens. Parse headers, claims, signature algorithm status, and lifespan expiration progress.',
    icon: Eye,
    benefit: 'Safely verify signatures with private keys without risking key exposure.',
    href: '/tools/jwt-decoder',
  },
  {
    id: 'tool-curl-builder',
    name: 'cURL Builder & API Playground',
    description:
      'Import cURL commands, configure basic auth, API keys, headers, query parameters, request bodies, custom variables, and execute validations.',
    icon: Globe,
    benefit: 'Run API queries locally with auto-chaining response variables.',
    href: '/tools/curl-builder',
  },
  {
    id: 'tool-sql-formatter',
    name: 'SQL Formatter & Query Analyzer',
    description:
      'Format SQL statements using different dialects like MySQL, PostgreSQL, SQLite, or SQL Server. Audit queries for security, dangerous operations, and nesting depth.',
    icon: Database,
    benefit: 'Analyze performance and security issues before running queries in production.',
    href: '/tools/sql-formatter',
  },
  {
    id: 'tool-random-secret',
    name: 'Random Secret Generator',
    description:
      'Generate high-entropy cryptographically secure random bytes in hex, base64, and string formats.',
    icon: Shield,
    benefit: 'Uses secure native browser window.crypto libraries.',
    href: '/tools/random-secret-generator',
  },
  {
    id: 'tool-password-generator',
    name: 'Password Generator',
    description:
      'Create customized secure passwords using customizable configuration options like symbols, numbers, and uppercase characters.',
    icon: Lock,
    benefit: 'Completely client-side generation ensures absolute secrecy.',
    href: '/tools/password-generator',
  },
  {
    id: 'tool-base64-generator',
    name: 'Base64 Generator',
    description:
      'Convert plain text data to Base64 standard format or decode existing Base64 strings instantly.',
    icon: Key,
    benefit: 'Performs instant encoding and decoding inside your local sandbox.',
    href: '/tools/base64-generator',
  },
  {
    id: 'tool-uuid-generator',
    name: 'UUID Generator',
    description:
      'Generate universally unique identifiers (UUID v4) instantly for database keys or request IDs.',
    icon: Fingerprint,
    benefit: 'Supports bulk generation of standards-compliant random UUIDs.',
    href: '/tools/uuid-generator',
  },
  {
    id: 'tool-sha256-generator',
    name: 'SHA256 Generator',
    description:
      'Compute secure hash algorithms (SHA-256) for documents, payloads, credentials, or checking integrity.',
    icon: Hash,
    benefit: 'Instant browser computation with native Web Crypto APIs.',
    href: '/tools/sha256-generator',
  },
  {
    id: 'tool-json-php-converter',
    name: 'JSON ⇄ PHP Array Converter',
    description:
      'Seamlessly convert complex nested JSON objects into associative PHP arrays and vice versa.',
    icon: RefreshCw,
    benefit: 'Saves time when refactoring backend code structures.',
    href: '/tools/json-php-converter',
  },
];

export default function AboutPage() {
  return (
    <article className="min-h-screen relative py-16 px-4 max-w-6xl mx-auto z-10">
      <header className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs text-primary font-semibold mb-2">
          <Award className="h-3.5 w-3.5" />
          <span>Local-First & Client-Side Sandbox</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          About{' '}
          <span className="text-primary bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Playground App
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Playground App is a premium, client-side developer utility platform designed to solve
          daily engineering tasks. By combining security, speed, and elegance, we provide a local
          sandbox where your sensitive parameters remain completely yours.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="border border-border rounded-2xl p-6 md:p-8 bg-card/40 backdrop-blur space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-xl p-3 text-primary w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Privacy & Security Architecture</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Standard online tools process your inputs, JWT secrets, database queries, and
              credentials on their backend servers. This introduces severe security hazards and
              potential leaks. Playground App operates differently: we guarantee that{' '}
              <strong>100% of the computation happens in your local browser sandbox</strong>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/50 text-xs">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Zero server latency</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No user tracking cookies</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Native Web Crypto APIs</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Local storage persistence</span>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-2xl p-6 md:p-8 bg-card/40 backdrop-blur space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-primary/10 rounded-xl p-3 text-primary w-fit">
              <Cpu className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Designed for Modern Workflows</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We focus on building developer utilities that don&apos;t just format or generate, but
              actively analyze your code. From auditing SQL performance and detecting dangerous
              patterns to parsing claims inside JSON Web Tokens, our platform serves as a smart
              assistant built directly into your desktop ecosystem.
            </p>
          </div>
          <div className="pt-4 border-t border-border/50">
            <Link
              id="btn-explore-workspace"
              href="/scratchpad"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <span>Explore Scratchpad Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-8 mb-16">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-foreground">Our Modular Ecosystem</h2>
          <p className="text-muted-foreground text-sm">
            Deep-dive into each specialized utility we provide in the browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolDetails.map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="border border-border rounded-xl p-5 bg-card/20 backdrop-blur hover:border-primary/50 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-primary/10 rounded-lg p-2.5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Browser Local
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg">{tool.name}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/30 space-y-3">
                  <p className="text-[10px] text-primary font-semibold italic">{tool.benefit}</p>
                  <Link
                    id={`link-${tool.id}`}
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary transition-colors"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </article>
  );
}
