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

  // Super Admin can view any event by ID or fallback to latest
  if (isSuperAdmin) {
    if (requestedEventId) {
      const event = await prisma.weddingEvent.findUnique({
        where: { id: requestedEventId },
        include: {
          photos: { orderBy: { order: "asc" } },
          tables: { orderBy: { tableNumber: "asc" } },
        },
      });
      if (event) return NextResponse.json(event);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const firstEvent = await prisma.weddingEvent.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        photos: { orderBy: { order: "asc" } },
        tables: { orderBy: { tableNumber: "asc" } },
      },
    });
    if (firstEvent) return NextResponse.json(firstEvent);
  }

  // Regular Event Manager: 1-to-1 Architecture (Strict Isolation)
  const ownEvent = await prisma.weddingEvent.findFirst({
    where: { managerId: manager.id },
    include: {
      photos: { orderBy: { order: "asc" } },
      tables: { orderBy: { tableNumber: "asc" } },
    },
  });

  if (!ownEvent) {
    return NextResponse.json({ error: "No dedicated wedding event found for this manager" }, { status: 404 });
  }

  // Security check: If another event ID was requested, reject immediately
  if (requestedEventId && requestedEventId !== ownEvent.id) {
    return NextResponse.json(
      { error: "Access Denied: You do not have permission to view settings for another wedding event." },
      { status: 403 }
    );
  }

  return NextResponse.json(ownEvent);
}

export async function PATCH(req: NextRequest) {
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSuperAdmin = manager.role === "SUPER_ADMIN";
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const requestedEventId = body.eventId || searchParams.get("eventId");

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
    // Regular Event Manager: Strict 1-to-1 Isolation
    const ownEvent = await prisma.weddingEvent.findFirst({
      where: { managerId: manager.id },
    });

    if (!ownEvent) {
      return NextResponse.json(
        { error: "No dedicated wedding event found for your account." },
        { status: 404 }
      );
    }

    // Security Check: Block attempts to modify another wedding's settings
    if (requestedEventId && requestedEventId !== ownEvent.id) {
      return NextResponse.json(
        {
          error:
            "Security Restriction: You do not have permission to modify settings for other weddings. You can only manage your own dedicated wedding.",
        },
        { status: 403 }
      );
    }

    targetEventId = ownEvent.id;
  }

  const existing = await prisma.weddingEvent.findUnique({
    where: { id: targetEventId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Wedding event not found" }, { status: 404 });
  }

  // Double-verify manager ownership for non-super-admin
  if (!isSuperAdmin && existing.managerId !== manager.id) {
    return NextResponse.json(
      { error: "Security Restriction: Access denied to this wedding event." },
      { status: 403 }
    );
  }

  const {
    coupleNames,
    hostIntro,
    invitationBody,
    eventDate,
    venueName,
    venueAddress,
    venueLat,
    venueLng,
    heroImageUrl,
    heroVideoUrl,
    videoThumbnailUrl,
    galleryJson,
    blessingImageUrl,
    welcomeImageUrl,
    placeCardImageUrl,
    placeCardNote,
    musicUrl,
    dressCodeTitle,
    dressCodeDescription,
    timelineJson,
    contactPhone,
    templateId,
  } = body;

  const updated = await prisma.weddingEvent.update({
    where: { id: targetEventId },
    data: {
      coupleNames: coupleNames !== undefined ? coupleNames : existing.coupleNames,
      hostIntro: hostIntro !== undefined ? hostIntro : existing.hostIntro,
      invitationBody: invitationBody !== undefined ? invitationBody : existing.invitationBody,
      eventDate: eventDate ? new Date(eventDate) : existing.eventDate,
      venueName: venueName !== undefined ? venueName : existing.venueName,
      venueAddress: venueAddress !== undefined ? venueAddress : existing.venueAddress,
      venueLat: venueLat !== undefined ? Number(venueLat) : existing.venueLat,
      venueLng: venueLng !== undefined ? Number(venueLng) : existing.venueLng,
      heroImageUrl: heroImageUrl !== undefined ? heroImageUrl : existing.heroImageUrl,
      heroVideoUrl: heroVideoUrl !== undefined ? heroVideoUrl : existing.heroVideoUrl,
      videoThumbnailUrl: videoThumbnailUrl !== undefined ? videoThumbnailUrl : existing.videoThumbnailUrl,
      galleryJson: galleryJson !== undefined ? galleryJson : existing.galleryJson,
      blessingImageUrl: blessingImageUrl !== undefined ? blessingImageUrl : existing.blessingImageUrl,
      welcomeImageUrl: welcomeImageUrl !== undefined ? welcomeImageUrl : existing.welcomeImageUrl,
      placeCardImageUrl: placeCardImageUrl !== undefined ? placeCardImageUrl : existing.placeCardImageUrl,
      placeCardNote: placeCardNote !== undefined ? placeCardNote : existing.placeCardNote,
      musicUrl: musicUrl !== undefined ? musicUrl : existing.musicUrl,
      dressCodeTitle: dressCodeTitle !== undefined ? dressCodeTitle : existing.dressCodeTitle,
      dressCodeDescription: dressCodeDescription !== undefined ? dressCodeDescription : existing.dressCodeDescription,
      timelineJson: timelineJson !== undefined ? timelineJson : existing.timelineJson,
      contactPhone: contactPhone !== undefined ? contactPhone : existing.contactPhone,
      ...(templateId !== undefined ? { templateId } : {}),
    },
  });

  // Notice: We strictly DO NOT touch or overwrite the global singleton 'eventSettings'.
  // Every wedding event is saved exclusively to its own isolated database row.
  return NextResponse.json(updated);
}
