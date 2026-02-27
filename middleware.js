import { NextResponse } from 'next/server';

export function middleware(request) {
  var path = request.nextUrl.pathname;
  if (path.startsWith('/dashboard')) {
    var token = request.cookies.get('kumo_token');
    if (!token) return NextResponse.redirect(new URL('/', request.url));
  }
  if (path === '/') {
    var token = request.cookies.get('kumo_token');
    if (token) return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  return NextResponse.next();
}

export var config = { matcher: ['/', '/dashboard/:path*'] };
