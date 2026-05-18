import { PasswordOptions, GeneratedPassword } from '@/types/crypto';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function calculateEntropy(charsetSize: number, length: number): number {
  return length * Math.log2(charsetSize);
}

export function generatePassword(options: PasswordOptions): GeneratedPassword {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must be run in the browser');
  }

  const { length, uppercase, lowercase, numbers, symbols } = options;

  let charset = '';
  const guaranteedChars: string[] = [];

  if (uppercase) {
    charset += UPPERCASE;
    guaranteedChars.push(getRandomChar(UPPERCASE));
  }
  if (lowercase) {
    charset += LOWERCASE;
    guaranteedChars.push(getRandomChar(LOWERCASE));
  }
  if (numbers) {
    charset += NUMBERS;
    guaranteedChars.push(getRandomChar(NUMBERS));
  }
  if (symbols) {
    charset += SYMBOLS;
    guaranteedChars.push(getRandomChar(SYMBOLS));
  }

  if (charset === '') {
    throw new Error('Select at least one character type');
  }

  const remainingLength = length - guaranteedChars.length;
  const passwordArray: string[] = [...guaranteedChars];

  if (remainingLength > 0) {
    const randomValues = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = randomValues[i] % charset.length;
      passwordArray.push(charset[randomIndex]);
    }
  }

  // Shuffle using Fisher-Yates with crypto random
  shuffleArray(passwordArray);

  const value = passwordArray.join('');
  const entropy = calculateEntropy(charset.length, length);

  return {
    value,
    entropy,
    options,
  };
}

function getRandomChar(set: string): string {
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);
  return set[randomValues[0] % set.length];
}

function shuffleArray(array: string[]) {
  const randomValues = new Uint32Array(array.length);
  window.crypto.getRandomValues(randomValues);

  for (let i = array.length - 1; i > 0; i--) {
    const j = randomValues[i] % (i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
}
