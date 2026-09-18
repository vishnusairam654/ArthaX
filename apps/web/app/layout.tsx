import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARTHAX — Sovereign Monetary Infrastructure & Central Guide',
  description: 'The architectural standard for digital financial sovereignty, central settlement, multi-bank ecosystems, and real-time double-entry ledger finality.',
  icons: {
    icon: '/assets/brand/favicon.png',
  },
};

import { SkipToContent } from '@/components/common/SkipToContent';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-off-white font-body text-ink antialiased selection:bg-arth-gold selection:text-white min-h-screen">
        <SkipToContent />
        <main id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
