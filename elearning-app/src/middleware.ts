import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    // Check for the auth cookie set by the login page
    const isLoggedIn = req.cookies.get('team_auth')?.value === 'true';

    // If already logged in, let them access the app
    if (isLoggedIn) {
        return NextResponse.next();
    }

    // If they are trying to access the login page while NOT logged in, let them
    if (req.nextUrl.pathname === '/login') {
        return NextResponse.next();
    }

    // Otherwise, they are not logged in and trying to access protected content. Redirect to login.
    return NextResponse.redirect(new URL('/login', req.url));
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
