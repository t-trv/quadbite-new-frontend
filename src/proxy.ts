import { NextRequest, NextResponse } from 'next/server';
import { localeMiddleware } from '@/middlewares/locale';
import { authMiddleware } from '@/middlewares/auth';
import { i18n } from '@/config/i18n';

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname; // Tại đây có thể kiểm tra pathname để apply middleware

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    const res1 = localeMiddleware(req);
    if (res1) return res1;
  }

  // if (pathname.startsWith('/vi/app') || pathname.startsWith('/vi/admin')) {
  //   const res2 = authMiddleware(req);
  //   if (res2) return res2;
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next/data).*)'],
};
