import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const guests = await prisma.guest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(guests);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  // Bulk Import support
  if (body.action === "bulk" && Array.isArray(body.guests)) {
    const createdGuests = [];
    for (const item of body.guests) {
      if (!item.displayName) continue;
      const newGuest = await prisma.guest.create({
        data: {
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