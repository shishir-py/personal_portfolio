'use client';

import { ThemeProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}