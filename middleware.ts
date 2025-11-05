import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes/'];
const authRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get('accessToken')?.value;
  const refreshToken = cookiesStore.get('refreshToken')?.value;

  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkSession();
      const setCookie = data.headers['set-cookie'];
      if (setCookie) {
        const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookie of cookiesArray) {
          const parsed = parse(cookie);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed['Max-Age']),
          };
          if (parsed.accessToken) {
            cookiesStore.set('accessToken', parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            cookiesStore.set('refreshToken', parsed.refreshToken, options);
          }
        }
        if (isAuthRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookiesStore.toString(),
            },
          });
        }
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookiesStore.toString(),
            },
          });
        }
      }
    }
    if (isAuthRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
