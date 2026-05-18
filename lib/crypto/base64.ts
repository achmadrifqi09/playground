import { Base64Result } from '@/types/crypto';

export function generateRandomBase64(bytes: number): Base64Result {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must be run in the browser');
  }

  const array = new Uint8Array(bytes);
  window.crypto.getRandomValues(array);
  
  const value = btoa(String.fromCharCode(...Array.from(array)));
  
  return {
    value,
    bytes,
    generatedAt: Date.now(),
  };
}

export function encodeToBase64(text: string): string {
  if (typeof window === 'undefined') {
    throw new Error('Browser APIs required');
  }
  return btoa(text);
}

export function decodeFromBase64(base64: string): string {
  if (typeof window === 'undefined') {
    throw new Error('Browser APIs required');
  }
  try {
    return atob(base64);
  } catch (e) {
    throw new Error('Invalid base64 string');
  }
}
