import { Metadata } from 'next';
import JsonPhpConverterClient from './JsonPhpConverterClient';

export const metadata: Metadata = {
  title: 'JSON ⇄ PHP Array Converter',
  description: 'Convert JSON to PHP Array and vice versa. Free online utility for developers.',
  keywords: [
    'json to php array',
    'php array to json',
    'php array converter',
    'online converter',
  ],
  openGraph: {
    title: 'JSON ⇄ PHP Array Converter — Playground App',
    description: 'Convert JSON to PHP Array and vice versa instantly. No data sent to server.',
    url: 'https://playgroundapp.online/tools/json-php-converter',
  },
};

export default function Page() {
  return <JsonPhpConverterClient />;
}
