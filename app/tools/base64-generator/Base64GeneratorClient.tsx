'use client';

import React, { useState } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateRandomBase64, encodeToBase64, decodeFromBase64 } from '@/lib/crypto/base64';

interface Base64GeneratorClientProps {
  infoSection?: React.ReactNode;
}

export default function Base64GeneratorClient({ infoSection }: Base64GeneratorClientProps) {
  const [bytes, setBytes] = useState(32);
  const [generatedBase64, setGeneratedBase64] = useState('');

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const result = generateRandomBase64(bytes);
    setGeneratedBase64(result.value);
  };

  const handleEncode = () => {
    try {
      const result = encodeToBase64(inputText);
      setOutputText(result);
      setError('');
    } catch (e) {
      setError('Failed to encode');
      setOutputText('');
    }
  };

  const handleDecode = () => {
    try {
      const result = decodeFromBase64(inputText);
      setOutputText(result);
      setError('');
    } catch (e) {
      setError('Invalid base64 string');
      setOutputText('');
    }
  };

  return (
    <ToolPageLayout
      title="Base64 Generator & Encoder"
      description="Generate random base64 strings or encode/decode text."
      category="crypto"
      keywords={['base64 generator', 'random base64 online', 'base64 encode decode']}
      infoSection={infoSection}
    >
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="encode-decode">Encode / Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-4">
          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Byte Size</label>
              <ToggleGroup type="single" value={bytes.toString()} onValueChange={(val) => val && setBytes(parseInt(val))}>
                <ToggleGroupItem value="16" className="flex-1">16</ToggleGroupItem>
                <ToggleGroupItem value="32" className="flex-1">32</ToggleGroupItem>
                <ToggleGroupItem value="64" className="flex-1">64</ToggleGroupItem>
                <ToggleGroupItem value="128" className="flex-1">128</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <Button onClick={handleGenerate} className="w-full">
              Generate
            </Button>
          </div>

          {generatedBase64 && (
            <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Output</label>
                <CopyButton value={generatedBase64} size="sm" />
              </div>
              <OutputDisplay value={generatedBase64} multiline />
            </div>
          )}
        </TabsContent>

        <TabsContent value="encode-decode" className="space-y-6 mt-4">
          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input</label>
              <Textarea
                placeholder="Enter text to encode or decode..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleEncode}>Encode →</Button>
              <Button onClick={handleDecode} variant="outline">← Decode</Button>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="border border-border rounded-lg p-6 bg-card text-card-foreground space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Output</label>
              <CopyButton value={outputText} size="sm" />
            </div>
            <OutputDisplay value={outputText} multiline />
          </div>
        </TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
