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
  const requestedEventId = searchParams.get("eventId");
  const isSuperAdmin = manager.role === "SUPER_ADMIN";

  let targetEventId: string | null = null;

  if (isSuperAdmin) {
    if (requestedEventId) {
      targetEventId = requestedEventId;
    } else {
      const firstEvent = await prisma.weddingEvent.findFirst({
        orderBy: { createdAt: "desc" },
      });
      targetEventId = firstEvent?.id || null;
    }
  } else {
    // Regular Event Manager: 1-to-1 Architecture
    const ownEvent = await prisma.weddingEvent.findFirst({
      where: { managerId: manager.id },
    });

    if (!ownEvent) {
      return NextResponse.json([]);
    }

    if (requestedEventId && requestedEventId !== ownEvent.id) {
      return NextResponse.json(
        { error: "Access Denied: You can only view guests for your dedicated wedding event." },
        { status: 403 }
      );
    }

    targetEventId = ownEvent.id;
  }

  if (!targetEventId) {
    return NextResponse.json([]);
  }

  const guests = await prisma.guest.findMany({
    where: { eventId: targetEventId },
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
  const requestedEventId = body.eventId;

  let targetEventId: string;

  if (isSuperAdmin) {
    if (requestedEventId) {
      targetEventId = requestedEventId;
    } else {
      const firstEvent = await prisma.weddingEvent.findFirst({
        orderBy: { createdAt: "desc" },
      });
      if (!firstEvent) {
        return NextResponse.json({ error: "No wedding event found on platform" }, { status: 400 });
      }
      targetEventId = firstEvent.id;
    }
  } else {
    // Regular Event Manager: 1-to-1 Architecture
    const ownEvent = await prisma.weddingEvent.findFirst({
      where: { managerId: manager.id },
    });

    if (!ownEvent) {
      return NextResponse.json(
        { error: "No dedicated wedding event found for your account" },
        { status: 404 }
      );
    }

    if (requestedEventId && requestedEventId !== ownEvent.id) {
      return NextResponse.json(
        { error: "Security Restriction: You do not have permission to add guests to another wedding event." },
        { status: 403 }
      );
    }

    targetEventId = ownEvent.id;
  }

  // Bulk Import support (Optimized batch insert)
  if (body.action === "bulk" && Array.isArray(body.guests)) {
    const validGuests = body.guests
      .filter((item: any) => item && item.displayName)
      .map((item: any) => ({
        eventId: targetEventId,
        displayName: String(item.displayName).trim(),
        salutation: item.salutation ? String(item.salutation).trim() : "Mr & Mrs",
        inviteType: ["SINGLE", "COUPLE", "FAMILY"].includes(item.inviteType) ? item.inviteType : "COUPLE",
        tableNumber: Number(item.tableNumber) || 1,
        phone: item.phone ? String(item.phone).trim() : null,
        notes: item.notes ? String(item.notes).trim() : null,
        dietary: item.dietary ? String(item.dietary).trim() : "NONE",
        rsvpStatus: ["ATTENDING", "DECLINED", "PENDING"].includes(item.rsvpStatus) ? item.rsvpStatus : "PENDING",
        attendeeCount:
          Number(item.attendeeCount) || (item.inviteType === "FAMILY" ? 4 : item.inviteType === "COUPLE" ? 2 : 1),
      }));

    if (validGuests.length === 0) {
      return NextResponse.json({ error: "No valid guests provided" }, { status: 400 });
    }

    await prisma.guest.createMany({
      data: validGuests,
    });

    const refreshedGuests = await prisma.guest.findMany({
      where: { eventId: targetEventId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: validGuests.length, guests: refreshedGuests });
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