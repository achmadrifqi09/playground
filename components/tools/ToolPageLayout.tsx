import React from 'react';
import Link from 'next/link';
import { ToolCategory } from '@/types/tools';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { ChevronRight } from 'lucide-react';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  children: React.ReactNode;
  infoSection?: React.ReactNode;
  maxWidth?: string;
}

export default function ToolPageLayout({
  title,
  description,
  category,
  keywords,
  children,
  infoSection,
  maxWidth = 'max-w-2xl',
}: ToolPageLayoutProps) {
  return (
    <div className={`${maxWidth} mx-auto px-4 py-8`}>
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/#tools" className="hover:text-foreground transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      <div className="space-y-4 mb-8">
        <CategoryBadge category={category} />
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div>{children}</div>

      {infoSection}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: title,
            description: description,
            keywords: keywords.join(', '),
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </div>
  );
}
