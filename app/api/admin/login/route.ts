import {NextRequest, NextResponse} from 'next/server';
import { verifyAdminCredentials, createAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const {username, password } = await req.json();

    console.log("DEBUG username env:", process.env.ADMIN_USERNAME);
    console.log("DEBUG hash env:", process.env.ADMIN_PASSWORD_HASH);
    console.log("DEBUG received username:", username);

    if (!username || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const valid = await verifyAdminCredentials(username, password);
    if (!valid) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    
    await createAdminSession();
    return NextResponse.json({ success: true });
}