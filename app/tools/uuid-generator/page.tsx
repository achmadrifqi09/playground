import UUIDGeneratorClient from './UUIDGeneratorClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { uuidGeneratorMetadata } from '@/constants/metadata';
export const metadata = uuidGeneratorMetadata;

const uuidInfoSection = (
  <ToolInfoSection
    introduction="A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify information in computer systems. UUID v4 is the most widely used version, generated using random numbers. This tool generates cryptographically random UUID v4 values instantly in your browser — no server involved."
    steps={[
      {
        step: 1,
        title: 'Select the quantity',
        description:
          'Choose how many UUIDs you need: 1, 5, 10, or 20. All generated at once with a single click.',
      },
      {
        step: 2,
        title: 'Click Generate UUIDs',
        description:
          "Each UUID is generated using the browser's built-in crypto.randomUUID() API, ensuring cryptographic randomness.",
      },
      {
        step: 3,
        title: 'Copy and use',
        description:
          'Click the Copy All button to copy all generated UUIDs to your clipboard in one action, ready to paste into your code or database.',
      },
    ]}
    features={[
      {
        title: 'UUID v4 Standard Compliance',
        description:
          "Generates RFC 4122-compliant UUID v4 values using the browser's native crypto API.",
      },
      {
        title: 'Bulk Generation',
        description:
          'Generate up to 20 UUIDs at once — useful for seeding databases, test data, or batch operations.',
      },
      {
        title: 'One-Click Copy',
        description:
          'Copy all generated UUIDs to your clipboard instantly with a single button click.',
      },
      {
        title: '100% Client-Side',
        description:
          'All UUID generation happens locally in your browser. No data is ever sent to a server.',
      },
    ]}
    faqs={[
      {
        question: 'What is a UUID v4?',
        answer:
          'UUID v4 (version 4) is a randomly generated universally unique identifier defined by RFC 4122. It consists of 32 hexadecimal characters displayed in the format 8-4-4-4-12. The randomness makes the probability of a collision virtually zero.',
      },
      {
        question: 'Is this UUID truly random and unique?',
        answer:
          "Yes. This tool uses the browser's built-in crypto.randomUUID() API, which generates cryptographically secure random values. The chance of generating two identical UUIDs is astronomically small (1 in 2^122).",
      },
      {
        question: 'What is the difference between UUID and GUID?',
        answer:
          "UUID and GUID refer to the same concept. GUID (Globally Unique Identifier) is Microsoft's term for the same 128-bit identifier standard. They are interchangeable in most contexts.",
      },
      {
        question: 'Can I use these UUIDs in production?',
        answer:
          'Yes. The UUIDs generated here are cryptographically random and safe to use as primary keys in databases, resource identifiers in APIs, file names, and any other scenario requiring unique identifiers.',
      },
    ]}
  />
);

export default function Page() {
  return <UUIDGeneratorClient infoSection={uuidInfoSection} />;
}
