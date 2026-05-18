import { Metadata } from 'next';
import RandomSecretGeneratorClient from './RandomSecretGeneratorClient';

export const metadata: Metadata = {
  title: 'Random Secret Generator',
  description: 'Generate secure random strings based on crypto. Free online secret generator for developers.',
  keywords: [
    'random secret generator',
    'crypto random generator',
    'base64 secret generator',
  ],
  openGraph: {
    title: 'Random Secret Generator — Playground App',
    description: 'Generate secure random strings based on crypto.',
    url: 'https://playgroundapp.online/tools/random-secret-generator',
  },
};

export default function Page() {
  return <RandomSecretGeneratorClient />;
}
