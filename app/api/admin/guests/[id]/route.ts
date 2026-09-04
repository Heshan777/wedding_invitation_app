import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  const guest = await prisma.guest.update({
    where: { id },
    data: {
      displayName: body.displayName !== undefined ? body.displayName : undefined,
      salutation: body.salutation !== undefined ? body.salutation : undefined,
      inviteType: body.inviteType !== undefined ? body.inviteType : undefined,
      tableNumber: body.tableNumber !== undefined ? Number(body.tableNumber) : undefined,
      phone: body.phone !== undefined ? body.phone : undefined,
      rsvpStatus: body.rsvpStatus !== undefined ? body.rsvpStatus : undefined,
      attendeeCount: body.attendeeCount !== undefined ? Number(body.attendeeCount) : undefined,
      dietary: body.dietary !== undefined ? body.dietary : undefined,
      notes: body.notes !== undefined ? body.notes : undefined,
    },
  });


  return NextResponse.json(guest);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}