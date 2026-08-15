import {SignJWT, jwtVerify} from 'jose';
import {cookies} from 'next/headers';
import bycrypt from 'bcryptjs';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!);
const COOKIE_NAME = 'admin_session';

export async function verifyAdminCredentials(username: string, password: string){
    if (username !== process.env.ADMIN_USERNAME) return false;
    return bycrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!);
}

export async function createAdminSession(){
    const token = await new SignJWT({ role:"admin"})
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime("12h")
        .sign(secret);

        const cookieStore = await cookies();
        cookieStore.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: "/",
            maxAge: 12 * 60 * 60, // 12 hours in seconds
    });
}

export async function destroyAdminSession(){
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean>{
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    try{
        await jwtVerify(token, secret);
        return true;
    } catch {
        return false;
    }
}