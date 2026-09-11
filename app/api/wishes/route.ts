import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    // Enforce tenant boundary: Never return global wishes across all weddings
    if (!eventId) {
      return NextResponse.json([]);
    }

    const wishes = await prisma.guestbookWish.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(wishes);
  } catch (err: any) {
    console.error("Fetch wishes error:", err);
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id, authorName, message, eventId } = body;

    if (action === "like" && typeof id === "string" && id.trim()) {
      const updated = await prisma.guestbookWish.update({
        where: { id: id.trim() },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ success: true, wish: updated });
    }

    const cleanAuthor = authorName ? String(authorName).trim().slice(0, 100) : "";
    const cleanMessage = message ? String(message).trim().slice(0, 500) : "";

    if (cleanAuthor && cleanMessage) {
      const newWish = await prisma.guestbookWish.create({
        data: {
          eventId: eventId && typeof eventId === "string" ? eventId.trim() : null,
          authorName: cleanAuthor,
          message: cleanMessage,
        },
      });
      return NextResponse.json({ success: true, wish: newWish });
    }

    return NextResponse.json({ error: "Invalid wish payload" }, { status: 400 });
  } catch (err: any) {
    console.error("Wish action error:", err);
    return NextResponse.json({ error: "Failed to process wish" }, { status: 500 });
  }
}
