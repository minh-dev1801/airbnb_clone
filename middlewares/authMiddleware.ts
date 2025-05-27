import { NextRequest, NextResponse } from 'next/server';

export async function authMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('info-user')) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  return NextResponse.next();
}
