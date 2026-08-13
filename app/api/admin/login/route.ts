import {NextRequest, NextResponse} from 'next/server';
import { verifyAdminCredentials, createAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const {username, password } = await req.json();

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