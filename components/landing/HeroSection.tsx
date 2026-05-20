import Link from 'next/link';
import { Terminal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-4 min-h-[60vh]">
      <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground mb-6">
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
        local-first • no login
      </div>

      <div className="mb-6">
        <Terminal className="h-12 w-12 text-primary mx-auto" />
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 max-w-4xl">
        Developer Playground & <span className="text-primary">Operational Utilities</span>
      </h1>

      <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
        Temporary workspace and utility tools for developers, DevOps, and engineers. All run in the
        browser — no data is sent to the server.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/scratchpad">
            Open Scratchpad
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="#tools">Explore Tools</Link>
        </Button>
      </div>
    </section>
  );
}
