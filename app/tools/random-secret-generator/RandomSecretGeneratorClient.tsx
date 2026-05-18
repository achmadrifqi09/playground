'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { generateSecret } from '@/lib/crypto/secretGenerator';
import { SecretFormat } from '@/types/crypto';
import { Shuffle } from 'lucide-react';

export default function RandomSecretGeneratorClient() {
  const [format, setFormat] = useState<SecretFormat>('base64');
  const [bytes, setBytes] = useState(32);
  const [secret, setSecret] = useState('');

  const handleGenerate = useCallback(() => {
    const result = generateSecret({ bytes, format });
    setSecret(result.value);
  }, [bytes, format]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  return (
    <ToolPageLayout
      title="Random Secret Generator"
      description="Generate secure random strings based on crypto."
      category="security"
      keywords={['random secret generator', 'crypto random generator', 'base64 secret generator']}
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground">
          <div className="space-y-4">
            {/* Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <ToggleGroup type="single" value={format} onValueChange={(val) => val && setFormat(val as SecretFormat)}>
                <ToggleGroupItem value="base64" className="flex-1">Base64</ToggleGroupItem>
                <ToggleGroupItem value="hex" className="flex-1">Hex</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Size</label>
              <ToggleGroup type="single" value={bytes.toString()} onValueChange={(val) => val && setBytes(parseInt(val))}>
                <ToggleGroupItem value="16" className="flex-1">16 bytes</ToggleGroupItem>
                <ToggleGroupItem value="32" className="flex-1">32 bytes</ToggleGroupItem>
                <ToggleGroupItem value="48" className="flex-1">48 bytes</ToggleGroupItem>
                <ToggleGroupItem value="64" className="flex-1">64 bytes</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button onClick={handleGenerate} className="w-full gap-2">
              <Shuffle className="h-4 w-4" />
              Generate Secret
            </Button>
          </div>
        </div>

        {/* Output Card */}
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Generated Secret</label>
              <div className="flex gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {bytes} bytes
                </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded capitalize">
                  {format}
                </span>
                <CopyButton value={secret} size="sm" />
              </div>
            </div>
            <OutputDisplay value={secret} />
          </div>
        </div>

        {/* Info Section */}
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <p className="text-sm font-medium mb-1">Node.js equivalent:</p>
          <pre className="text-xs text-muted-foreground font-mono">
            require(&apos;crypto&apos;).randomBytes({bytes}).toString(&apos;{format}&apos;)
          </pre>
        </div>
      </div>
    </ToolPageLayout>
  );
}
