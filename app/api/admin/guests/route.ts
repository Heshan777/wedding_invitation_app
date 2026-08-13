import {NextRequest, NextResponse} from 'next/server';
import {prisma} from '@/lib/db';
import {isAdminAuthenticated} from '@/lib/auth';

export async function GET() {

    if(!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const guests = await prisma.guest.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
    if(!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const {displayName, salutation, inviteType, tableNumber, notes} = body;

    if (!displayName || !salutation || !inviteType || !tableNumber) {
        return NextResponse.json({error:"Missing required fields"},{status:400});
    }

    const guest = await prisma.guest.create({
        data:{
            displayName,
            salutation,
            inviteType,
            tableNumber: Number(tableNumber),
            notes: notes || null,
        },
    });
    return NextResponse.json(guest);
}