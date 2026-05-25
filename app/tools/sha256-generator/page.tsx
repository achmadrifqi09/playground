import SHA256GeneratorClient from './SHA256GeneratorClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { sha256GeneratorMetadata } from '@/constants/metadata';
export const metadata = sha256GeneratorMetadata;

const sha256InfoSection = (
  <ToolInfoSection
    introduction="SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that produces a fixed 256-bit (32-byte) hash value from any input. It is a one-way function — you cannot reverse a SHA-256 hash to recover the original input. SHA-256 is widely used in blockchain, digital signatures, certificate verification, and data integrity validation. This tool computes SHA-256 hashes in real time, entirely within your browser."
    steps={[
      {
        step: 1,
        title: 'Enter your text',
        description:
          'Type or paste any text into the input field. The SHA-256 hash is computed automatically as you type with a short debounce.',
      },
      {
        step: 2,
        title: 'View the hash output',
        description:
          'The resulting 64-character hexadecimal SHA-256 hash appears instantly in the output section below.',
      },
      {
        step: 3,
        title: 'Copy the hash',
        description:
          'Click the copy button to copy the hash to your clipboard and use it in your application, database, or verification workflow.',
      },
    ]}
    features={[
      {
        title: 'Real-Time Hashing',
        description: 'SHA-256 hash is computed automatically as you type — no button required.',
      },
      {
        title: 'Web Crypto API',
        description:
          "Uses the browser's native SubtleCrypto API for accurate and standards-compliant SHA-256 computation.",
      },
      {
        title: 'Hex Output Format',
        description:
          'Outputs the hash as a 64-character lowercase hexadecimal string, the most common representation.',
      },
      {
        title: '100% Client-Side',
        description:
          'All hashing happens locally in your browser. Your input text is never sent to any server.',
      },
    ]}
    faqs={[
      {
        question: 'What is SHA-256 used for?',
        answer:
          'SHA-256 is used for verifying data integrity (checksums), storing passwords securely (with salt), signing digital certificates (SSL/TLS), generating block hashes in blockchain systems, and verifying file downloads.',
      },
      {
        question: 'Can I reverse a SHA-256 hash?',
        answer:
          'No. SHA-256 is a one-way cryptographic function. It is computationally infeasible to reverse a hash to its original input. This property makes it suitable for storing passwords and verifying data without exposing the source.',
      },
      {
        question: 'Is SHA-256 the same as SHA-2?',
        answer:
          'SHA-2 is a family of hash functions. SHA-256 is the most popular member of the SHA-2 family, producing a 256-bit hash. Other members include SHA-224, SHA-384, and SHA-512.',
      },
      {
        question: 'Is SHA-256 safe for hashing passwords?',
        answer:
          'SHA-256 alone is not recommended for password hashing because it is fast, which makes brute-force attacks easier. For passwords, use algorithms specifically designed for the purpose such as bcrypt, scrypt, or Argon2, which are intentionally slow and include built-in salting.',
      },
    ]}
  />
);

export default function Page() {
  return <SHA256GeneratorClient infoSection={sha256InfoSection} />;
}
