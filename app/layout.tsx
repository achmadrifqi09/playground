import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

import { globalMetadata } from '@/constants/metadata';
export const metadata = globalMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="bg-grid-fade"></div>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
