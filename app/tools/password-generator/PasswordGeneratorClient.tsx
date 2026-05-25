'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolPageLayout from '@/components/tools/ToolPageLayout';
import OutputDisplay from '@/components/tools/OutputDisplay';
import CopyButton from '@/components/tools/CopyButton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { generatePassword } from '@/lib/crypto/passwordGenerator';
import { PasswordOptions } from '@/types/crypto';
import { RefreshCw } from 'lucide-react';

interface PasswordGeneratorClientProps {
  infoSection?: React.ReactNode;
}

export default function PasswordGeneratorClient({ infoSection }: PasswordGeneratorClientProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const [password, setPassword] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(() => {
    try {
      const result = generatePassword(options);
      setPassword(result.value);
      setEntropy(result.entropy);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate password');
      setPassword('');
      setEntropy(0);
    }
  }, [options]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const getEntropyStrength = (bits: number) => {
    if (bits < 40) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
    if (bits < 60) return { label: 'Fair', color: 'bg-yellow-500', text: 'text-yellow-500' };
    if (bits < 80) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
    return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
  };

  const strength = getEntropyStrength(entropy);

  return (
    <ToolPageLayout
      title="Password Generator"
      description="Generate secure, customizable passwords with entropy indicator."
      category="security"
      keywords={['secure password generator', 'random password generator', 'online password generator']}
      infoSection={infoSection}
    >
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Length: {options.length}</label>
                <input
                  type="number"
                  value={options.length}
                  onChange={(e) => setOptions({ ...options, length: Math.min(128, Math.max(8, parseInt(e.target.value) || 8)) })}
                  className="w-16 h-8 text-sm bg-muted border border-border rounded-md px-2 text-center"
                  min={8}
                  max={128}
                />
              </div>
              <Slider
                value={[options.length]}
                onValueChange={(value) => setOptions({ ...options, length: value[0] })}
                min={8}
                max={128}
                step={1}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={options.uppercase}
                  onCheckedChange={(checked) => setOptions({ ...options, uppercase: !!checked })}
                />
                <label htmlFor="uppercase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Uppercase (A-Z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={options.lowercase}
                  onCheckedChange={(checked) => setOptions({ ...options, lowercase: !!checked })}
                />
                <label htmlFor="lowercase" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Lowercase (a-z)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={options.numbers}
                  onCheckedChange={(checked) => setOptions({ ...options, numbers: !!checked })}
                />
                <label htmlFor="numbers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Numbers (0-9)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={options.symbols}
                  onCheckedChange={(checked) => setOptions({ ...options, symbols: !!checked })}
                />
                <label htmlFor="symbols" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Symbols (!@#...)
                </label>
              </div>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button onClick={handleGenerate} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate Password
            </Button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6 bg-card text-card-foreground">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Generated Password</label>
              <CopyButton value={password} size="sm" />
            </div>
            <OutputDisplay value={password} />

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Entropy: {entropy.toFixed(1)} bits</span>
                <span className={strength.text}>{strength.label}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${strength.color}`}
                  style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
