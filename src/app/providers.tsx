'use client';

import { AuthProvider } from '@/lib/auth-context';
import { AppContentProvider } from '@/lib/app-content-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContentProvider>{children}</AppContentProvider>
    </AuthProvider>
  );
}
