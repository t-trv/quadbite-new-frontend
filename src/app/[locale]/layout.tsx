import type { Metadata } from 'next';
import { Geist_Mono, Lexend } from 'next/font/google';
import { DictionaryProvider } from '@/contexts/DictionaryContext';
import { getDictionary } from '@/utils/dictionary';
import type { Locale } from '@/config/i18n';
import { Toaster } from 'react-hot-toast';

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
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = (await params) as { locale: Locale | 'favicon.ico' };

  let dict;

  if (locale === 'favicon.ico') {
    dict = await getDictionary('vi');
  } else {
    dict = await getDictionary(locale);
  }

  return (
    <html lang={locale} className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <DictionaryProvider dict={dict}>
          {children}
          <Toaster position="top-right" />
        </DictionaryProvider>
      </body>
    </html>
  );
}
