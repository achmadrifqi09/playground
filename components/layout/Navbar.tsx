import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top: 0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Terminal className="h-5 w-5 text-primary" />
            <span>playground</span>
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline-block">
            all data stays in your browser
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/scratchpad" className="text-muted-foreground hover:text-foreground transition-colors">
            Scratchpad
          </Link>
          <Link href="/#tools" className="text-muted-foreground hover:text-foreground transition-colors">
            Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
