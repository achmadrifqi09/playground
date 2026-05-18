import { Metadata } from 'next';
import Base64GeneratorClient from './Base64GeneratorClient';

export const metadata: Metadata = {
  title: 'Base64 Generator',
  description: 'Generate random base64 strings or encode/decode text. Free online base64 tool for developers.',
  keywords: [
    'base64 generator',
    'random base64 online',
    'base64 encode decode',
  ],
  openGraph: {
    title: 'Base64 Generator — Playground App',
    description: 'Generate random base64 strings or encode/decode text.',
    url: 'https://playgroundapp.online/tools/base64-generator',
  },
};

export default function Page() {
  return <Base64GeneratorClient />;
}
