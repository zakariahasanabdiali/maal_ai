import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Maal-AI — Smart Community Finance Platform',
    template: '%s · Maal-AI',
  },
  description:
    'Maal-AI is a modern Somali-focused AI-powered financial management platform for individuals, families, small businesses, and communities.',
  keywords: [
    'Maal-AI',
    'Somali fintech',
    'community finance',
    'budgeting',
    'savings',
    'AI finance',
  ],
  openGraph: {
    title: 'Maal-AI — Smart Community Finance Platform',
    description:
      'AI-powered money management, smart budgeting, and community savings for modern Somali communities.',
    type: 'website',
    url: 'https://maal-ai.app',
  },
  metadataBase: new URL('https://maal-ai.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
