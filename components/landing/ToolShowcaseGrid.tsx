import Link from 'next/link';
import { TOOLS } from '@/lib/constants/tools';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { Terminal, Shield, Lock, Key, Fingerprint, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap: Record<string, React.ElementType> = {
  Terminal,
  Shield,
  Lock,
  Key,
  Fingerprint,
  Hash,
};

export default function ToolShowcaseGrid() {
  return (
    <section id="tools" className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-2">Available Tools</h2>
        <p className="text-muted-foreground">A collection of utility tools that run entirely in your browser.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon] || Terminal;
          return (
            <div
              key={tool.id}
              className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 rounded-md p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CategoryBadge category={tool.category} />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
              </div>
              <Button asChild variant="ghost" className="justify-start p-0 h-auto hover:bg-transparent hover:text-primary text-foreground">
                <Link href={tool.href}>
                  {tool.quickActionLabel}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
