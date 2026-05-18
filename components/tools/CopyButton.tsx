'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: 'sm' | 'default';
}

export default function CopyButton({ value, label = 'Copy', size = 'default' }: CopyButtonProps) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      size={size}
      className={cn('gap-2', size === 'sm' ? 'h-8 px-2 text-xs' : '')}
      onClick={() => copy(value)}
    >
      {isCopied ? (
        <Check className={cn('h-4 w-4 text-green-500', size === 'sm' ? 'h-3 w-3' : '')} />
      ) : (
        <Copy className={cn('h-4 w-4', size === 'sm' ? 'h-3 w-3' : '')} />
      )}
      <span>{isCopied ? 'Copied!' : label}</span>
    </Button>
  );
}
