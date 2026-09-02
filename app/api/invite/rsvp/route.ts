import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, status, guestCount, message } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({ where: { token } });
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    // Format RSVP note
    const rsvpEntry = `[RSVP: ${status.toUpperCase()} | Guests: ${guestCount || 1}${
      message ? ` | Wish: "${message}"` : ""
    }]`;
    
    const existingNotes = guest.notes ? guest.notes + " " : "";
    const updatedNotes = (existingNotes + rsvpEntry).trim();

    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        notes: updatedNotes,
        viewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, guest: updatedGuest });
  } catch (err: any) {
    console.error("RSVP Error:", err);
    return NextResponse.json({ error: "Failed to record RSVP" }, { status: 500 });
  }
}
