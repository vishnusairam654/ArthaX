import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARTHAX",
  description: "Unified financial ecosystem — banks, stocks, and shop in ARTH.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
