import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GOV — Identity Gateway',
  description:
    'Government Identity Gateway — verify your email and receive your unique GOV ID, the foundation of your ARTHAX identity.',
};

export default function GovLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
