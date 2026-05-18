import { Metadata } from 'next';
import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate secure, customizable passwords with entropy indicator. Free online password generator for developers.',
  keywords: [
    'secure password generator',
    'random password generator',
    'online password generator',
    'password entropy',
  ],
  openGraph: {
    title: 'Password Generator — Playground App',
    description: 'Generate secure passwords instantly. No data sent to server.',
    url: 'https://playgroundapp.online/tools/password-generator',
  },
};

export default function Page() {
  return <PasswordGeneratorClient />;
}
