import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const cookie = request.cookies.get('token')
    const token = cookie?.value;

    const pathname = request.nextUrl.pathname;

    const authenticated = token && token.trim() !== '';

    if (!authenticated && request.nextUrl.pathname.startsWith('/pizzahub')) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    if (authenticated && request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/pizzahub/dashboard', request.url))
    }

    const languagePattern = /^\/[a-z]{2}(-[a-z]{2})?$/;

    if (languagePattern.test(pathname)) {
        return NextResponse.redirect(new URL(`/`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/auth/:path*', '/pizzahub/:path*'],
};