import { Metadata } from 'next';
import CurlBuilderClient from './CurlBuilderClient';

export const metadata: Metadata = {
  title: 'cURL Builder & API Playground',
  description: 'Build, import, test, and analyze HTTP requests directly from your browser. Lightweight online Postman alternative for fast API debugging.',
  keywords: [
    'curl builder',
    'api playground',
    'online postman',
    'test api online',
    'http request builder',
    'curl parser',
  ],
  openGraph: {
    title: 'cURL Builder & API Playground — Playground App',
    description: 'Test API endpoints, import cURL commands, and inspect response data instantly in a secure browser environment.',
    url: 'https://playgroundapp.online/tools/curl-builder',
  },
};

export default function Page() {
  return <CurlBuilderClient />;
}
