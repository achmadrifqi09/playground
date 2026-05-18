import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
}

export function useCopyToClipboard(resetDelay: number = 2000): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API not available');
      }
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);
      setTimeout(() => setIsCopied(false), resetDelay);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to copy');
      setIsCopied(false);
    }
  }, [resetDelay]);

  return { copy, isCopied, error };
}
