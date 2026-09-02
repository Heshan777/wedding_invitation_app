import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const wishes = await prisma.guestbookWish.findMany({
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
    const { action, id, authorName, message } = body;

    if (action === "like" && id) {
      const updated = await prisma.guestbookWish.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ success: true, wish: updated });
    }

    if (authorName && message) {
      const newWish = await prisma.guestbookWish.create({
        data: {
          authorName: String(authorName).trim(),
          message: String(message).trim(),
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
