import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedEventId = searchParams.get("eventId");
    const isSuperAdmin = manager.role === "SUPER_ADMIN";

    // 1. Fetch Events List with relational counts in parallel with Managers list
    const eventsQuery = prisma.weddingEvent.findMany({
      where: isSuperAdmin ? {} : { managerId: manager.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        managerId: true,
        coupleNames: true,
        eventDate: true,
        venueName: true,
        venueAddress: true,
        venueLat: true,
        venueLng: true,
        contactPhone: true,
        heroImageUrl: true,
        heroVideoUrl: true,
        videoThumbnailUrl: true,
        welcomeImageUrl: true,
        placeCardImageUrl: true,
        blessingImageUrl: true,
        musicUrl: true,
        dressCodeTitle: true,
        dressCodeDescription: true,
        timelineJson: true,
        galleryJson: true,
        manager: {
          select: {
            id: true,
            username: true,
            name: true,
            company: true,
          },
        },
        _count: {
          select: {
            guests: true,
            photos: true,
            tables: true,
            wishes: true,
          },
        },
      },
    });

    const managersQuery = isSuperAdmin
      ? prisma.eventManager.findMany({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            username: true,
            name: true,
            company: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            _count: {
              select: { events: true },
            },
            events: {
              select: {
                id: true,
                slug: true,
                coupleNames: true,
                eventDate: true,
                venueName: true,
              },
            },
          },
        })
      : Promise.resolve([]);

    const [events, managersList] = await Promise.all([eventsQuery, managersQuery]);

    // 2. Resolve target active event
    let targetEvent = null;
    if (requestedEventId) {
      targetEvent = events.find((e) => e.id === requestedEventId) || null;
    }
    if (!targetEvent && events.length > 0) {
      targetEvent = events[0];
    }

    // Security check: Regular managers cannot access another manager's event
    if (!isSuperAdmin && targetEvent && targetEvent.managerId !== manager.id) {
      targetEvent = events.find((e) => e.managerId === manager.id) || events[0] || null;
    }

    // 3. For target event, fetch guests, full settings, and photos in parallel
    let guests: any[] = [];
    let photos: any[] = [];
    let fullEventSettings: any = null;

    if (targetEvent) {
      const [eventDetails, eventGuests, eventPhotos] = await Promise.all([
        prisma.weddingEvent.findUnique({
          where: { id: targetEvent.id },
          include: {
            tables: { orderBy: { tableNumber: "asc" } },
          },
        }),
        prisma.guest.findMany({
          where: { eventId: targetEvent.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.eventPhoto.findMany({
          where: { eventId: targetEvent.id },
          orderBy: { order: "asc" },
        }),
      ]);

      fullEventSettings = eventDetails;
      guests = eventGuests;
      photos = eventPhotos;
    }

    // 4. Storage configuration status check
    const hasCloudinary = Boolean(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL
    );
    const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    const isVercel = Boolean(process.env.VERCEL);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || null;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || null;

    let storageConfigured = false;
    let storageProvider = "local";
    let storageMessage = "Local server storage active.";

    if (hasCloudinary) {
      storageConfigured = true;
      storageProvider = "cloudinary";
      storageMessage = `Cloudinary CDN active (${cloudName || "configured"}).`;
    } else if (hasBlobToken) {
      storageConfigured = true;
      storageProvider = "blob";
      storageMessage = "Vercel Blob Storage active.";
    } else if (isVercel) {
      storageMessage = "Ephemeral storage on Vercel. Configure Cloudinary for persistent media.";
    }

    const storageStatus = {
      configured: storageConfigured,
      provider: storageProvider,
      isVercel,
      hasCloudinary,
      hasBlobToken,
      cloudName,
      uploadPreset,
      message: storageMessage,
    };

    return NextResponse.json({
      success: true,
      manager,
      events,
      activeEventId: targetEvent?.id || "",
      settings: fullEventSettings,
      guests,
      photos,
      managers: managersList,
      storageStatus,
    });
  } catch (err: any) {
    console.error("Bootstrap API error:", err);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
