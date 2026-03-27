import type { Metadata } from 'next';
import { Geist_Mono, Lexend } from 'next/font/google';
import { DictionaryProvider } from '@/contexts/DictionaryContext';
import { getDictionary } from '@/utils/dictionary';
import type { Locale } from '@/config/i18n';

import '@/styles/global.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Base Project',
  description: 'Base Project',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang="vi" className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <DictionaryProvider dict={dict}>{children}</DictionaryProvider>
      </body>
    </html>
  );
}
