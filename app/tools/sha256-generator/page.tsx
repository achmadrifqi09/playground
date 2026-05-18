import { Metadata } from 'next';
import SHA256GeneratorClient from './SHA256GeneratorClient';

export const metadata: Metadata = {
  title: 'SHA256 Generator',
  description: 'Generate SHA256 hash instantly. Free online SHA256 generator for developers.',
  keywords: [
    'sha256 generator',
    'sha256 hash online',
  ],
  openGraph: {
    title: 'SHA256 Generator — Playground App',
    description: 'Generate SHA256 hash instantly.',
    url: 'https://playgroundapp.online/tools/sha256-generator',
  },
};

export default function Page() {
  return <SHA256GeneratorClient />;
}
