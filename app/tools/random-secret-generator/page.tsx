import RandomSecretGeneratorClient from './RandomSecretGeneratorClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { randomSecretGeneratorMetadata } from '@/constants/metadata';
export const metadata = randomSecretGeneratorMetadata;

const secretInfoSection = (
  <ToolInfoSection
    introduction="A cryptographically secure random secret is essential for signing JWTs, encrypting data, generating API keys, and creating session tokens. This tool uses the browser's Web Crypto API (crypto.getRandomValues) to generate high-entropy random secrets that are safe to use in production systems. All generation is done locally — your secrets are never transmitted to any server."
    steps={[
      {
        step: 1,
        title: 'Select output format',
        description:
          'Choose between Base64 (for JWT secrets and API keys) or Hex (for cryptographic keys and checksums) output formats.',
      },
      {
        step: 2,
        title: 'Choose the secret size',
        description:
          'Select the byte size: 16 bytes (128-bit), 32 bytes (256-bit), 48 bytes (384-bit), or 64 bytes (512-bit). For most applications, 32 bytes is the recommended minimum.',
      },
      {
        step: 3,
        title: 'Click Generate Secret',
        description:
          'A new cryptographically random secret is generated instantly using the Web Crypto API. Click again to regenerate.',
      },
      {
        step: 4,
        title: 'Copy and store securely',
        description:
          'Copy the secret to your clipboard and store it in a secure location such as an environment variable or secrets manager.',
      },
    ]}
    features={[
      {
        title: 'Web Crypto API',
        description:
          'Uses browser-native crypto.getRandomValues() for cryptographically secure randomness — not Math.random().',
      },
      {
        title: 'Multiple Output Formats',
        description:
          'Generate secrets in Base64 or Hex format depending on the requirements of your application.',
      },
      {
        title: 'Configurable Size',
        description:
          'Choose secret length from 16 to 64 bytes to match the security requirements of your use case.',
      },
      {
        title: 'Never Leaves Your Browser',
        description:
          'Secrets are generated and displayed entirely client-side. No network requests are made.',
      },
    ]}
    faqs={[
      {
        question: 'What makes a random secret cryptographically secure?',
        answer:
          "A cryptographically secure random number generator (CSPRNG) produces values that are computationally unpredictable. The Web Crypto API uses the operating system's entropy sources (hardware noise, timing jitter) to generate values that cannot be predicted even with knowledge of past outputs.",
      },
      {
        question: 'How long should my JWT secret be?',
        answer:
          'For HMAC-SHA256 (HS256) JWT signing, use a minimum of 256 bits (32 bytes). This provides sufficient security against brute-force attacks. A 32-byte Base64 secret from this tool is ideal.',
      },
      {
        question: 'What is the difference between Hex and Base64 output?',
        answer:
          'Hex encoding uses characters 0-9 and a-f, producing a string twice the length of the byte count. Base64 uses A-Z, a-z, 0-9, +, /, producing a string about 1.33× the byte count. Base64 is more compact and widely used in authentication headers, while Hex is common in cryptographic checksums.',
      },
      {
        question: 'Can I use these secrets in production?',
        answer:
          'Yes. The secrets generated here use the same cryptographic quality as server-side secret generators. They are safe for JWT signing keys, API keys, encryption keys, and session secrets.',
      },
    ]}
  />
);

export default function Page() {
  return <RandomSecretGeneratorClient infoSection={secretInfoSection} />;
}
