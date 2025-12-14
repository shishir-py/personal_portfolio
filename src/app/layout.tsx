import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Suspense } from 'react';
import { PageLoader } from '@/components/LoadingSpinner';

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

export const metadata: Metadata = {
  title: {
    default: 'Tara Prasad Pandey | Data Scientist & ML Engineer',
    template: '%s | Tara Prasad Pandey'
  },
  description: 'Expert Data Scientist and Machine Learning Engineer from Nepal specializing in advanced analytics, automation, and data-driven solutions. Transforming complex data into actionable insights.',
  keywords: ['Data Science', 'Machine Learning', 'Python', 'Analytics', 'Automation', 'Nepal', 'Data Visualization', 'AI'],
  authors: [{ name: 'Tara Prasad Pandey' }],
  creator: 'Tara Prasad Pandey',
  publisher: 'Tara Prasad Pandey',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://taraprasadpandey.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taraprasadpandey.com',
    siteName: 'Tara Prasad Pandey Portfolio',
    title: 'Tara Prasad Pandey | Data Scientist & ML Engineer',
    description: 'Expert Data Scientist and Machine Learning Engineer from Nepal specializing in advanced analytics, automation, and data-driven solutions.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tara Prasad Pandey - Data Scientist Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tara Prasad Pandey | Data Scientist & ML Engineer',
    description: 'Expert Data Scientist and Machine Learning Engineer from Nepal specializing in advanced analytics, automation, and data-driven solutions.',
    images: ['/og-image.jpg'],
    creator: '@taraprasadpandey',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <Providers>
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