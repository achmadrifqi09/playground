import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Playground App</h3>
            <p className="text-sm text-muted-foreground">
              Developer utilities that run entirely in your browser.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h4 className="font-semibold text-foreground mb-1">Quick Links</h4>
            <Link href="/scratchpad" className="text-muted-foreground hover:text-foreground transition-colors">
              Scratchpad
            </Link>
            <Link href="/tools/password-generator" className="text-muted-foreground hover:text-foreground transition-colors">
              Password Generator
            </Link>
            <Link href="/tools/random-secret-generator" className="text-muted-foreground hover:text-foreground transition-colors">
              Secret Generator
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © 2025 Playground App
        </div>
      </div>
    </footer>
  );
}
