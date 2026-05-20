import { Metadata } from 'next';
import JwtDecoderClient from './JwtDecoderClient';

export const metadata: Metadata = {
  title: 'JWT Decoder & Inspector',
  description: 'Decode, inspect, and analyze JSON Web Tokens (JWT) locally and securely in your browser. Analyze claims, expiration timeline, and verify signatures.',
  keywords: [
    'jwt decoder',
    'jwt inspector',
    'decode jwt online',
    'verify jwt',
    'jwt expiration analyzer',
    'secure jwt tool',
  ],
  openGraph: {
    title: 'JWT Decoder & Inspector — Playground App',
    description: 'Decode, verify, and inspect JWT tokens instantly. 100% secure, all decoding runs client-side.',
    url: 'https://playgroundapp.online/tools/jwt-decoder',
  },
};

export default function Page() {
  return <JwtDecoderClient />;
}
