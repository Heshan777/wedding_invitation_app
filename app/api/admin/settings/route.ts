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
    musicUrl,
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
      venueLat: venueLat ? Number(venueLat) : undefined,
      venueLng: venueLng ? Number(venueLng) : undefined,
      musicUrl,
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
      musicUrl: musicUrl || "/audio/background.mp3",
    },
  });

  return NextResponse.json(updated);
}
