import { Metadata } from 'next';
import SqlFormatterClient from './SqlFormatterClient';

export const metadata: Metadata = {
  title: 'SQL Formatter & Query Analyzer',
  description: 'Beautify, format, minify, and analyze your SQL queries locally. Automatically checks for dangerous updates, select * anti-patterns, and query readability.',
  keywords: [
    'sql formatter',
    'sql query analyzer',
    'beautify sql',
    'minify sql',
    'dangerous query checker',
    'sql formatter online',
  ],
  openGraph: {
    title: 'SQL Formatter & Query Analyzer — Playground App',
    description: 'Format nested SQL statements and evaluate query safety on-the-fly. 100% secure offline client-side parsing.',
    url: 'https://playgroundapp.online/tools/sql-formatter',
  },
};

export default function Page() {
  return <SqlFormatterClient />;
}
