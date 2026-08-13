import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if(!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const guest = await prisma.guest.update({
        where: { id },
        data: {
            displayName: body.displayName,
            salutation: body.salutation,
            inviteType: body.inviteType,
            tableNumber: body.tableNumber ? Number(body.tableNumber) : undefined,
            notes: body.notes,
        }
    });
    return NextResponse.json(guest);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if(!(await isAdminAuthenticated())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await prisma.guest.delete({where: { id }});
    return NextResponse.json({ success: true });
}