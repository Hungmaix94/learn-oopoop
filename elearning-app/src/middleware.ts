import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    // Add Basic Auth so only the team can access the site
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        // Base64 decode to get username:password
        const decodedValue = atob(authValue);
        const [user, pwd] = decodedValue.split(':');

        // Simple team security
        if (user === 'team' && pwd === '123456') {
            return NextResponse.next();
        }
    }

    return new NextResponse('Team Authentication Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure E-Learning Area"',
        },
    });
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
