import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/admin/photos?eventId=... - Fetch photos for an event
export async function GET(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    // Verify manager owns this event
    const event = await prisma.weddingEvent.findFirst({
      where: { id: eventId, managerId: manager.id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 });
    }

    const photos = await prisma.eventPhoto.findMany({
      where: { eventId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ photos });
  } catch (err: any) {
    console.error("Fetch photos error:", err);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

// POST /api/admin/photos - Add a photo to EventPhoto table
export async function POST(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, url, title, subtitle, tag, order } = body;

    if (!eventId || !url) {
      return NextResponse.json({ error: "eventId and url are required" }, { status: 400 });
    }

    // Verify ownership
    const event = await prisma.weddingEvent.findFirst({
      where: { id: eventId, managerId: manager.id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 });
    }

    // Determine order
    const nextOrder =
      typeof order === "number"
        ? order
        : (await prisma.eventPhoto.count({ where: { eventId } }));

    const photo = await prisma.eventPhoto.create({
      data: {
        eventId,
        url,
        title: title || "Wedding Moment",
        subtitle: subtitle || "",
        tag: tag || "Pre-Wedding",
        order: nextOrder,
      },
    });

    return NextResponse.json({ success: true, photo });
  } catch (err: any) {
    console.error("Add photo error:", err);
    return NextResponse.json({ error: "Failed to add photo" }, { status: 500 });
  }
}

// DELETE /api/admin/photos?id=... - Delete a photo
export async function DELETE(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Photo id is required" }, { status: 400 });
    }

    const photo = await prisma.eventPhoto.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!photo || photo.event.managerId !== manager.id) {
      return NextResponse.json({ error: "Photo not found or access denied" }, { status: 404 });
    }

    await prisma.eventPhoto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete photo error:", err);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
