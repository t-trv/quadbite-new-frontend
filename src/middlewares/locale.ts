import { NextRequest, NextResponse } from 'next/server';
import { i18n } from '@/config/i18n';

export async function localeMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect to default locale if no locale is present
  const locale = i18n.defaultLocale;
  req.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(req.nextUrl);
}
