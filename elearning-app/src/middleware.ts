import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'vi'];
const defaultLocale = 'en';
const LOCALE_COOKIE = 'preferred_locale';

function getLocale(request: NextRequest): string {
    // 1. User's saved preference (set by LanguageSwitcher) takes priority
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    if (saved && locales.includes(saved)) return saved;

    // 2. Negotiate from browser's Accept-Language header
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    return match(languages, locales, defaultLocale);
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Redirect if there is no locale
    if (!pathnameHasLocale) {
        const locale = getLocale(req);
        req.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(req.nextUrl);
    }

    // Check auth
    const isLoggedIn = req.cookies.get('team_auth')?.value === 'true';

    // Extract the locale part from the beginning of the URL (e.g., /en/login -> login)
    const isLoginPage = pathname.endsWith('/login');

    if (isLoggedIn) {
        return NextResponse.next();
    }

    if (isLoginPage) {
        return NextResponse.next();
    }

    // Otherwise, they are not logged in and trying to access protected content. Redirect to locale login.
    const locale = pathname.split('/')[1] || defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
