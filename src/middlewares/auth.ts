import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function authMiddleware(req: NextRequest) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/vi/signin', req.url));
  }
}
