import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET /api/admin/events/[id] - Get event details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isSuperAdmin = manager.role === "SUPER_ADMIN";
    const event = await prisma.weddingEvent.findFirst({
      where: isSuperAdmin ? { id } : { id, managerId: manager.id },
      include: {
        photos: { orderBy: { order: "asc" } },
        tables: { orderBy: { tableNumber: "asc" } },
        _count: {
          select: {
            guests: true,
            wishes: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (err: any) {
    console.error("Get event error:", err);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PUT /api/admin/events/[id] - Update event details
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isSuperAdmin = manager.role === "SUPER_ADMIN";

    // Strict ownership verification:
    const existing = await prisma.weddingEvent.findFirst({
      where: isSuperAdmin ? { id } : { id, managerId: manager.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Event not found or you do not have permission to modify it" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updated = await prisma.weddingEvent.update({
      where: { id },
      data: {
        coupleNames: body.coupleNames ?? existing.coupleNames,
        hostIntro: body.hostIntro ?? existing.hostIntro,
        invitationBody: body.invitationBody ?? existing.invitationBody,
        eventDate: body.eventDate ? new Date(body.eventDate) : existing.eventDate,
        venueName: body.venueName ?? existing.venueName,
        venueAddress: body.venueAddress ?? existing.venueAddress,
        venueLat: typeof body.venueLat === "number" ? body.venueLat : existing.venueLat,
        venueLng: typeof body.venueLng === "number" ? body.venueLng : existing.venueLng,
        contactPhone: body.contactPhone ?? existing.contactPhone,
        dressCodeTitle: body.dressCodeTitle ?? existing.dressCodeTitle,
        dressCodeDescription: body.dressCodeDescription ?? existing.dressCodeDescription,
        heroImageUrl: body.heroImageUrl ?? existing.heroImageUrl,
        heroVideoUrl: body.heroVideoUrl ?? existing.heroVideoUrl,
        videoThumbnailUrl: body.videoThumbnailUrl ?? existing.videoThumbnailUrl,
        welcomeImageUrl: body.welcomeImageUrl ?? existing.welcomeImageUrl,
        placeCardImageUrl: body.placeCardImageUrl ?? existing.placeCardImageUrl,
        placeCardNote: body.placeCardNote ?? existing.placeCardNote,
        blessingImageUrl: body.blessingImageUrl ?? existing.blessingImageUrl,
        musicUrl: body.musicUrl ?? existing.musicUrl,
        timelineJson: body.timelineJson ?? existing.timelineJson,
      },
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    console.error("Update event error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/admin/events/[id] - Delete event and cascade children (Super Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (manager.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Security Restriction: Event Managers cannot delete their dedicated wedding. Only Super Admin can delete wedding events." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await prisma.weddingEvent.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.weddingEvent.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
