'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { generateMultipleUUIDs } from '@/lib/crypto/uuid';

export default function UUIDGeneratorClient() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const results = generateMultipleUUIDs(count);
    setUuids(results.map((r) => r.value));
  }, [count]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const outputValue = uuids.join('\n');

  return (
    <ToolPageLayout
      title="UUID v4 Generator"
      description="Generate UUID v4 instantly."
      category="crypto"
      keywords={['uuid generator online', 'uuid v4 generator']}
    >
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Count</label>
            <ToggleGroup type="single" value={count.toString()} onValueChange={(val) => val && setCount(parseInt(val))}>
              <ToggleGroupItem value="1" className="flex-1">1</ToggleGroupItem>
              <ToggleGroupItem value="5" className="flex-1">5</ToggleGroupItem>
              <ToggleGroupItem value="10" className="flex-1">10</ToggleGroupItem>
              <ToggleGroupItem value="20" className="flex-1">20</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            Generate UUIDs
          </Button>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={outputValue} size="sm" label="Copy All" />
          </div>
          
          <OutputDisplay value={outputValue} multiline={count > 1} />
        </div>
      </div>
    </ToolPageLayout>
  );
}
