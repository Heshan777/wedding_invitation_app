import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.eventSettings.findUnique({
    where: { id: "singleton" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
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
      heroImageUrl: heroImageUrl || "/images/couple-portrait-1.jpg",
      heroVideoUrl: heroVideoUrl || null,
      videoThumbnailUrl: videoThumbnailUrl || null,
      galleryJson: galleryJson || null,
      blessingImageUrl: blessingImageUrl || "/images/couple-portrait-2.jpg",
      welcomeImageUrl: welcomeImageUrl || "/images/couple-welcome.jpg",
      placeCardImageUrl: placeCardImageUrl || "/images/couple-sweet.jpg",
      placeCardNote: placeCardNote || "Thank you for sharing our joy and celebrating with us!",
      musicUrl: musicUrl || "/audio/background.mp3",
      dressCodeTitle: dressCodeTitle || "Royal Splendor & Black Tie",
      dressCodeDescription: dressCodeDescription || "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
      timelineJson: timelineJson || null,
      contactPhone: contactPhone || "+94 77 123 4567",
    },
  });


  return NextResponse.json(updated);
}



