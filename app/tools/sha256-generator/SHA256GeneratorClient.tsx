'use client';

import React, { useState, useEffect } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { hashSHA256 } from '@/lib/crypto/sha256';

export default function SHA256GeneratorClient() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input) {
        const result = await hashSHA256(input);
        setHash(result);
      } else {
        setHash('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <ToolPageLayout
      title="SHA256 Hash Generator"
      description="Generate SHA256 hash instantly."
      category="crypto"
      keywords={['sha256 generator', 'sha256 hash online']}
    >
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Input</label>
            <Textarea
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">SHA256 Hash</label>
            <CopyButton value={hash} size="sm" />
          </div>
          
          <OutputDisplay
            value={hash}
            placeholder="Enter text above to generate hash"
            multiline
          />
        </div>
      </div>
    </ToolPageLayout>
  );
}
