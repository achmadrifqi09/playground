'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto pt-8 pb-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Playground App</h3>
            <p className="text-sm text-muted-foreground">
              Developer utilities that run entirely in your browser.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <h4 className="font-semibold text-foreground mb-1">Quick Links</h4>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © {currentYear} Playground App - From developers for developers 😘
        </div>
      </div>
    </footer>
  );
}
