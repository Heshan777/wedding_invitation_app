import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedManager } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const manager = await getAuthenticatedManager();
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (manager && eventId) {
    const event = await prisma.weddingEvent.findFirst({
      where: { id: eventId, managerId: manager.id },
      include: {
        photos: { orderBy: { order: "asc" } },
        tables: { orderBy: { tableNumber: "asc" } },
      },
    });
    if (event) return NextResponse.json(event);
  }

  // Fallback to manager's latest event
  if (manager) {
    const event = await prisma.weddingEvent.findFirst({
      where: { managerId: manager.id },
      orderBy: { createdAt: "desc" },
      include: {
        photos: { orderBy: { order: "asc" } },
        tables: { orderBy: { tableNumber: "asc" } },
      },
    });
    if (event) return NextResponse.json(event);
  }

  // Fallback to legacy singleton
  const settings = await prisma.eventSettings.findUnique({
    where: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const manager = await getAuthenticatedManager();
  if (!manager) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const eventId = body.eventId || searchParams.get("eventId");

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
  } = body;

  // Update specific WeddingEvent if eventId is provided or manager has events
  if (eventId) {
    const event = await prisma.weddingEvent.findFirst({
      where: { id: eventId, managerId: manager.id },
    });
    if (event) {
      const updated = await prisma.weddingEvent.update({
        where: { id: event.id },
        data: {
          coupleNames,
          hostIntro,
          invitationBody,
          eventDate: eventDate ? new Date(eventDate) : undefined,
          venueName,
          venueAddress,
          venueLat: venueLat !== undefined ? Number(venueLat) : undefined,
          venueLng: venueLng !== undefined ? Number(venueLng) : undefined,
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
        },
      });

      // Also mirror to legacy EventSettings if it's the primary event
      await prisma.eventSettings.upsert({
        where: { id: "singleton" },
        update: {
          coupleNames,
          hostIntro,
          invitationBody,
          eventDate: eventDate ? new Date(eventDate) : undefined,
          venueName,
          venueAddress,
          venueLat: venueLat !== undefined ? Number(venueLat) : undefined,
          venueLng: venueLng !== undefined ? Number(venueLng) : undefined,
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
        },
        create: {
          id: "singleton",
          coupleNames: coupleNames || "Sandharu & Sanduni",
          hostIntro: hostIntro || "We cordially invite you",
          invitationBody: invitationBody || "to celebrate with us",
          eventDate: eventDate ? new Date(eventDate) : new Date(),
          venueName: venueName || "Rose Garden Banquet Hall",
          venueAddress: venueAddress || "Kadawatha",
          venueLat: Number(venueLat) || 7.00365,
          venueLng: Number(venueLng) || 79.9426,
        },
      }).catch(() => {});

      return NextResponse.json(updated);
    }
  }

  // Fallback: update legacy EventSettings
  const updated = await prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: {
      coupleNames,
      hostIntro,
      invitationBody,
      eventDate: eventDate ? new Date(eventDate) : undefined,
      venueName,
      venueAddress,
      venueLat: venueLat !== undefined ? Number(venueLat) : undefined,
      venueLng: venueLng !== undefined ? Number(venueLng) : undefined,
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
    },
    create: {
      id: "singleton",
      coupleNames: coupleNames || "Sandharu & Sanduni",
      hostIntro: hostIntro || "We cordially invite you",
      invitationBody: invitationBody || "to celebrate with us",
      eventDate: eventDate ? new Date(eventDate) : new Date(),
      venueName: venueName || "Rose Garden Banquet Hall",
      venueAddress: venueAddress || "Kadawatha",
      venueLat: Number(venueLat) || 7.00365,
      venueLng: Number(venueLng) || 79.9426,
    },
  });

  return NextResponse.json(updated);
}
