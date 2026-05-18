import { GenerateSecretOptions, GeneratedSecret } from '@/types/crypto';

export function generateSecret(options: GenerateSecretOptions): GeneratedSecret {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must be run in the browser');
  }

  const array = new Uint8Array(options.bytes);
  window.crypto.getRandomValues(array);

  let value = '';
  if (options.format === 'base64') {
    // PRD suggestion: btoa(String.fromCharCode(...array))
    value = btoa(String.fromCharCode(...Array.from(array)));
  } else if (options.format === 'hex') {
    value = Array.from(array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  return {
    value,
    format: options.format,
    bytes: options.bytes,
    generatedAt: Date.now(),
  };
}
