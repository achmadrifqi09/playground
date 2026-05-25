import Base64GeneratorClient from './Base64GeneratorClient';
import ToolInfoSection from '@/components/tools/ToolInfoSection';

import { base64GeneratorMetadata } from '@/constants/metadata';
export const metadata = base64GeneratorMetadata;

const base64InfoSection = (
  <ToolInfoSection
    introduction="Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It is widely used in web development, APIs, and cryptography to safely transfer binary data through text-based channels such as HTTP headers, JSON payloads, and email. This tool lets you encode text to Base64, decode Base64 strings, and generate cryptographically random Base64 secrets — all without any data leaving your browser."
    steps={[
      {
        step: 1,
        title: 'Choose your operation',
        description:
          'Select the "Generate" tab to create a random Base64 secret, or switch to "Encode / Decode" to convert between plain text and Base64.',
      },
      {
        step: 2,
        title: 'For generation: select byte size',
        description:
          'Choose the byte size (16, 32, 64, or 128 bytes) for your random Base64 string. Larger values produce longer, more secure secrets.',
      },
      {
        step: 3,
        title: 'For encode/decode: enter your text or Base64 string',
        description:
          'Type or paste your input into the text area. Click "Encode" to convert text to Base64 or "Decode" to convert Base64 back to plain text.',
      },
      {
        step: 4,
        title: 'Copy the result',
        description:
          'Use the copy button to copy the output to your clipboard and use it in your project.',
      },
    ]}
    features={[
      {
        title: 'Text to Base64 Encoding',
        description:
          'Encode any plain text string into its Base64 representation using the btoa standard.',
      },
      {
        title: 'Base64 to Text Decoding',
        description: 'Decode any Base64 string back into its original plain text representation.',
      },
      {
        title: 'Random Base64 Secret Generation',
        description:
          'Generate cryptographically random Base64 strings using the Web Crypto API — perfect for API keys and secrets.',
      },
      {
        title: '100% Client-Side & Private',
        description:
          'All encoding, decoding, and generation happens locally in your browser. No data is ever transmitted.',
      },
    ]}
    faqs={[
      {
        question: 'What is Base64 encoding?',
        answer:
          'Base64 is an encoding scheme that converts binary data into a text format using 64 ASCII characters (A-Z, a-z, 0-9, +, /). It is commonly used to embed binary data such as images, cryptographic keys, and files inside JSON, HTML, or HTTP headers.',
      },
      {
        question: 'Is Base64 encryption?',
        answer:
          'No. Base64 is encoding, not encryption. Anyone can decode a Base64 string back to its original form without a key. It is used for data transport and formatting purposes, not for security.',
      },
      {
        question: 'When should I use Base64?',
        answer:
          'Use Base64 when you need to embed binary data in text-based formats (e.g., images in CSS/HTML data URIs), send binary data in JSON or XML, or store binary data in environment variables and config files.',
      },
      {
        question: 'What is the difference between standard Base64 and URL-safe Base64?',
        answer:
          'Standard Base64 uses + and / characters which can cause issues in URLs. URL-safe Base64 replaces + with - and / with _ to make the output safe for use in URLs and filenames.',
      },
    ]}
  />
);

export default function Page() {
  return <Base64GeneratorClient infoSection={base64InfoSection} />;
}
