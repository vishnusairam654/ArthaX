'use client';

import React from 'react';
import { PortalAuthGuard } from '@/components/common/PortalAuthGuard';

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalAuthGuard requiredRole="USER">
      {children}
    </PortalAuthGuard>
  );
}
