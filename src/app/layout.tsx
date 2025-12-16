import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';
import { PageLoader } from '@/components/LoadingSpinner';
import { getProfile } from '@/lib/profile';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();

  const title = profile?.fullName
    ? `${profile.fullName} | ${profile.title || 'Data Scientist'}`
    : 'Tara Prasad Pandey | Data Scientist & ML Engineer';

  const description = profile?.shortBio || 'Expert Data Scientist and Machine Learning Engineer from Nepal specializing in advanced analytics, automation, and data-driven solutions.';

  return {
    title: {
      default: title,
      template: `%s | ${profile?.fullName || 'Tara Prasad Pandey'}`
    },
    description,
    keywords: ['Data Science', 'Machine Learning', 'Python', 'Analytics', 'Automation', 'Nepal', 'Data Visualization', 'AI'],
    authors: [{ name: profile?.fullName || 'Tara Prasad Pandey' }],
    creator: profile?.fullName || 'Tara Prasad Pandey',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://taraprasadpandey.com',
      siteName: `${profile?.fullName || 'Tara Prasad Pandey'} Portfolio`,
      title: title,
      description: description,
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${profile?.fullName || 'Tara Prasad Pandey'} - Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-image.jpg'],
      creator: '@taraprasadpandey',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <Providers profile={profile}>
          <Suspense fallback={<PageLoader />}>
            <div className="relative">
              {children}
            </div>
          </Suspense>
        </Providers>

        {/* Performance optimizations */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}