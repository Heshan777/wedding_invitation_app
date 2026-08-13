import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        const token = req.cookies.get("admin_session")?.value;
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
        try {
            await jwtVerify(token, secret);
        } catch {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};