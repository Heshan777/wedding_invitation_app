import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedManager } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  // Check guest ownership
  const existing = await prisma.guest.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!existing || (existing.event && existing.event.managerId !== manager.id)) {
    return NextResponse.json({ error: "Guest not found or access denied" }, { status: 404 });
  }

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
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const existing = await prisma.guest.findUnique({
    where: { id },
    include: { event: true },
  });

  if (!existing || (existing.event && existing.event.managerId !== manager.id)) {
    return NextResponse.json({ error: "Guest not found or access denied" }, { status: 404 });
  }

  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}