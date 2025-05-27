import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { authMiddleware } from '../middlewares/authMiddleware';

export default async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  const intlResponse = intlMiddleware(request);

  if (intlResponse.status !== 200 || intlResponse.headers.has('Location')) {
    return intlResponse;
  }

  return authMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)',
};
