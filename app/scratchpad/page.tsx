import { Metadata } from 'next';
import ScratchpadClient from './ScratchpadClient';

export const metadata: Metadata = {
  title: 'Scratchpad',
  description: 'Temporary workspace for .env, snippets, SQL, and bash commands. Free online scratchpad for developers.',
  keywords: [
    'env editor online',
    'temporary snippet storage',
    'online scratchpad',
  ],
  openGraph: {
    title: 'Scratchpad — Playground App',
    description: 'Temporary workspace for .env, snippets, SQL, and bash commands.',
    url: 'https://playgroundapp.online/scratchpad',
  },
};

export default function Page() {
  return <ScratchpadClient />;
}
