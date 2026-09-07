import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/admin/photos?eventId=... - Fetch photos for an event
export async function GET(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedEventId = searchParams.get("eventId");
    const isSuperAdmin = manager.role === "SUPER_ADMIN";

    let targetEventId: string | null = null;

    if (isSuperAdmin) {
      targetEventId = requestedEventId;
      if (!targetEventId) {
        const first = await prisma.weddingEvent.findFirst({ orderBy: { createdAt: "desc" } });
        targetEventId = first?.id || null;
      }
    } else {
      // Regular Event Manager: 1-to-1 Architecture
      const ownEvent = await prisma.weddingEvent.findFirst({
        where: { managerId: manager.id },
      });

      if (!ownEvent) {
        return NextResponse.json({ photos: [] });
      }

      if (requestedEventId && requestedEventId !== ownEvent.id) {
        return NextResponse.json(
          { error: "Access Denied: You can only view photos for your dedicated wedding event." },
          { status: 403 }
        );
      }

      targetEventId = ownEvent.id;
    }

    if (!targetEventId) {
      return NextResponse.json({ photos: [] });
    }

    const photos = await prisma.eventPhoto.findMany({
      where: { eventId: targetEventId },
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

    const isSuperAdmin = manager.role === "SUPER_ADMIN";
    const body = await req.json();
    const { url, title, subtitle, tag, order } = body;
    const requestedEventId = body.eventId;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    let targetEventId: string;

    if (isSuperAdmin) {
      if (requestedEventId) {
        targetEventId = requestedEventId;
      } else {
        const first = await prisma.weddingEvent.findFirst({ orderBy: { createdAt: "desc" } });
        if (!first) {
          return NextResponse.json({ error: "No wedding event found on platform" }, { status: 404 });
        }
        targetEventId = first.id;
      }
    } else {
      // Regular Event Manager: 1-to-1 Architecture
      const ownEvent = await prisma.weddingEvent.findFirst({
        where: { managerId: manager.id },
      });

      if (!ownEvent) {
        return NextResponse.json(
          { error: "No dedicated wedding event found for your account." },
          { status: 404 }
        );
      }

      if (requestedEventId && requestedEventId !== ownEvent.id) {
        return NextResponse.json(
          { error: "Security Restriction: You cannot add photos to another wedding." },
          { status: 403 }
        );
      }

      targetEventId = ownEvent.id;
    }

    // Verify target event exists
    const event = await prisma.weddingEvent.findUnique({
      where: { id: targetEventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Determine order
    const nextOrder =
      typeof order === "number"
        ? order
        : (await prisma.eventPhoto.count({ where: { eventId: targetEventId } }));

    const photo = await prisma.eventPhoto.create({
      data: {
        eventId: targetEventId,
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

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Regular managers can only delete photos from their own wedding
    if (manager.role !== "SUPER_ADMIN") {
      if (!photo.event || photo.event.managerId !== manager.id) {
        return NextResponse.json(
          { error: "Security Restriction: You cannot delete photos belonging to another wedding." },
          { status: 403 }
        );
      }
    }

    await prisma.eventPhoto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete photo error:", err);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
