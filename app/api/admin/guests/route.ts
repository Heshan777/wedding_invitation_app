import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedManager } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  let eventId = searchParams.get("eventId");

  // If no eventId specified, default to the manager's most recent event
  if (!eventId) {
    const firstEvent = await prisma.weddingEvent.findFirst({
      where: { managerId: manager.id },
      orderBy: { createdAt: "desc" },
    });
    eventId = firstEvent?.id || null;
  }

  if (!eventId) {
    return NextResponse.json([]);
  }

  // Verify manager owns this event (Super Admin can access any event)
  const isSuperAdmin = manager.role === "SUPER_ADMIN";
  const event = await prisma.weddingEvent.findFirst({
    where: isSuperAdmin ? { id: eventId } : { id: eventId, managerId: manager.id },
  });

  if (!event) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const guests = await prisma.guest.findMany({
    where: { eventId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSuperAdmin = manager.role === "SUPER_ADMIN";
  const body = await req.json();
  let targetEventId = body.eventId;

  if (!targetEventId) {
    const firstEvent = await prisma.weddingEvent.findFirst({
      where: isSuperAdmin ? {} : { managerId: manager.id },
      orderBy: { createdAt: "desc" },
    });
    targetEventId = firstEvent?.id;
  }

  if (!targetEventId) {
    return NextResponse.json({ error: "No wedding event found to attach guest" }, { status: 400 });
  }

  // Verify ownership
  const event = await prisma.weddingEvent.findFirst({
    where: isSuperAdmin ? { id: targetEventId } : { id: targetEventId, managerId: manager.id },
  });

  if (!event) {
    return NextResponse.json({ error: "Access denied to event" }, { status: 403 });
  }

  // Bulk Import support
  if (body.action === "bulk" && Array.isArray(body.guests)) {
    const createdGuests = [];
    for (const item of body.guests) {
      if (!item.displayName) continue;
      const newGuest = await prisma.guest.create({
        data: {
          eventId: targetEventId,
          displayName: String(item.displayName).trim(),
          salutation: item.salutation ? String(item.salutation).trim() : "Mr & Mrs",
          inviteType: ["SINGLE", "COUPLE", "FAMILY"].includes(item.inviteType) ? item.inviteType : "COUPLE",
          tableNumber: Number(item.tableNumber) || 1,
          phone: item.phone ? String(item.phone).trim() : null,
          notes: item.notes ? String(item.notes).trim() : null,
          dietary: item.dietary ? String(item.dietary).trim() : "NONE",
          rsvpStatus: ["ATTENDING", "DECLINED", "PENDING"].includes(item.rsvpStatus) ? item.rsvpStatus : "PENDING",
          attendeeCount: Number(item.attendeeCount) || 1,
        },
      });
      createdGuests.push(newGuest);
    }
    return NextResponse.json({ success: true, count: createdGuests.length, guests: createdGuests });
  }

  const { displayName, salutation, inviteType, tableNumber, notes, phone, dietary, rsvpStatus, attendeeCount } = body;

  if (!displayName || !salutation || !inviteType || !tableNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const guest = await prisma.guest.create({
    data: {
      eventId: targetEventId,
      displayName: String(displayName).trim(),
      salutation: String(salutation).trim(),
      inviteType,
      tableNumber: Number(tableNumber),
      phone: phone ? String(phone).trim() : null,
      notes: notes ? String(notes).trim() : null,
      dietary: dietary || "NONE",
      rsvpStatus: rsvpStatus || "PENDING",
      attendeeCount: Number(attendeeCount) || (inviteType === "FAMILY" ? 4 : inviteType === "COUPLE" ? 2 : 1),
    },
  });
  return NextResponse.json(guest);
}