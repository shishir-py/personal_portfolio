'use client';

import { ThemeProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Profile } from '@prisma/client';

export function Providers({ children, profile }: { children: React.ReactNode; profile: Profile | null }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <NextUIProvider>
        <AuthProvider>
          <ProfileProvider profile={profile}>
            {children}
          </ProfileProvider>
        </AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
}