import type { Metadata } from "next";
import { fraunces, cantarell, amarante } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARTHAX — The Ledger Gazette",
  description: "Unified financial ecosystem — banks, stocks, and shop in ARTH.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${cantarell.variable} ${amarante.variable}`}>
      <body>{children}</body>
    </html>
  );
}
