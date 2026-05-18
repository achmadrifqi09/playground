import { Metadata } from 'next';
import UUIDGeneratorClient from './UUIDGeneratorClient';

export const metadata: Metadata = {
  title: 'UUID Generator',
  description: 'Generate UUID v4 instantly. Free online UUID generator for developers.',
  keywords: [
    'uuid generator online',
    'uuid v4 generator',
  ],
  openGraph: {
    title: 'UUID Generator — Playground App',
    description: 'Generate UUID v4 instantly.',
    url: 'https://playgroundapp.online/tools/uuid-generator',
  },
};

export default function Page() {
  return <UUIDGeneratorClient />;
}
