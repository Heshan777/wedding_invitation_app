import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { token, status, guestCount, attendeeCount, dietary, message } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const guest = await prisma.guest.findUnique({ where: { token } });
    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    const isAttending = String(status).toLowerCase() === "attending";
    const finalRsvpStatus = isAttending ? "ATTENDING" : "DECLINED";
    const finalCount = isAttending ? Math.max(1, Number(attendeeCount || guestCount || 1)) : 0;
    const finalDietary = dietary || "NONE";

    // Format RSVP note for compatibility
    const rsvpEntry = `[RSVP: ${finalRsvpStatus} | Guests: ${finalCount} | Dietary: ${finalDietary}${
      message ? ` | Wish: "${message}"` : ""
    }]`;
    
    const existingNotes = guest.notes ? guest.notes + " " : "";
    const updatedNotes = (existingNotes + rsvpEntry).trim();

    const updatedGuest = await prisma.guest.update({
      where: { id: guest.id },
      data: {
        rsvpStatus: finalRsvpStatus,
        attendeeCount: finalCount,
        dietary: finalDietary,
        rsvpMessage: message ? String(message).trim() : null,
        rsvpSubmittedAt: new Date(),
        notes: updatedNotes,
        viewedAt: new Date(),
      },
    });

    // If a sweet message was written, also publish to Guestbook linked to the guest's event
    const cleanMessage = message ? String(message).trim().slice(0, 500) : "";
    if (cleanMessage.length > 0 && guest.eventId) {
      const rawAuthor = guest.salutation ? `${guest.salutation} ${guest.displayName}` : guest.displayName;
      const author = rawAuthor.trim().slice(0, 100);
      await prisma.guestbookWish.create({
        data: {
          eventId: guest.eventId,
          authorName: author,
          message: cleanMessage,
        },
      });
    }

    return NextResponse.json({ success: true, guest: updatedGuest });
  } catch (err: any) {
    console.error("RSVP Error:", err);
    return NextResponse.json({ error: "Failed to record RSVP" }, { status: 500 });
  }
}

