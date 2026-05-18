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
}

export default function ToolPageLayout({
  title,
  description,
  category,
  keywords,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
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

      {/* Header */}
      <div className="space-y-4 mb-8">
        <CategoryBadge category={category} />
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {/* Content */}
      <div>{children}</div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': title,
            'description': description,
            'applicationCategory': 'DeveloperApplication',
            'operatingSystem': 'Web',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            }
          })
        }}
      />
    </div>
  );
}
