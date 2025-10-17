// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casa Privé - Exclusive Members Club',
  description: 'The epitome of luxury and bespoke entertainment. An exclusive members-only sanctuary celebrating the art of living.',
  keywords: 'luxury club, members club, exclusive events, private dining, Casa Privé',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}