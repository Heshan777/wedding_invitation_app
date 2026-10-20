import React from "react";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationView from "@/components/InvitationView";
import GoldenMandalaInvitationView from "@/components/templates/GoldenMandalaInvitationView";
import BotanicalLaceInvitationView from "@/components/templates/BotanicalLaceInvitationView";
import NoirCathedralInvitationView from "@/components/templates/NoirCathedralInvitationView";
import TuscanVillaInvitationView from "@/components/templates/TuscanVillaInvitationView";
import BlushFloralInvitationView from "@/components/templates/BlushFloralInvitationView";
import { resolveTemplateIdFromParam } from "@/lib/templates";

export interface RenderInviteOptions {
  token: string;
  overrideTemplateId?: string;
  searchParams?: Promise<{ template?: string; t?: string; style?: string }> | { template?: string; t?: string; style?: string };
}

export async function renderInvitePage({
  token,
  overrideTemplateId,
  searchParams,
}: RenderInviteOptions) {
  let guest: any = null;
  let isRealGuestInDb = false;
  try {
    guest = await prisma.guest.findUnique({
      where: { token },
      include: {
        event: {
          include: {
            photos: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
    if (guest) {
      isRealGuestInDb = true;
    }
  } catch (err) {
    console.warn("Database lookup issue for token:", token, err);
  }

  // If token is not in DB or sample demo preview, provide graceful fallback so link never 404s
  if (!guest) {
    guest = {
      id: token,
      token: token,
      displayName: "Honored Guest",
      salutation: "Mr. & Mrs.",
      inviteType: "COUPLE",
      tableNumber: 1,
      phone: "+94 77 123 4567",
      rsvpStatus: "PENDING",
      attendeeCount: 2,
      dietary: "NONE",
      rsvpMessage: null,
      viewedAt: null,
      createdAt: new Date("2026-11-01T00:00:00.000Z"),
      updatedAt: new Date("2026-11-01T00:00:00.000Z"),
    };
  }

  // If the guest is linked to a WeddingEvent, use its event settings & photos
  let settings: any = guest.event;
  const photos = guest.event?.photos || [];

  // Fallback to legacy singleton or fallback default settings
  if (!settings) {
    try {
      settings = await prisma.eventSettings.findUnique({
        where: { id: "singleton" },
      });
    } catch {}
  }

  if (!settings) {
    settings = {
      id: "default-event",
      coupleNames: "Amaya & Dinuka",
      hostIntro: "Together with our families, we joyfully invite you to celebrate the homecoming of",
      invitationBody: "to witness our eternal vows and celebrate an unforgettable evening of sacred love and union.",
      eventDate: new Date("2026-12-12T18:30:00.000Z"),
      venueName: "Water's Edge, Battaramulla",
      venueAddress: "Battaramulla, Colombo, Sri Lanka",
      venueLat: 6.9015,
      venueLng: 79.9145,
      contactPhone: "+94 77 123 4567",
      heroImageUrl: "/images/couple-kiss.jpg",
      heroVideoUrl: null,
      videoThumbnailUrl: "/images/couple-kiss.jpg",
      welcomeImageUrl: "/images/couple-kiss.jpg",
      placeCardImageUrl: "/images/couple-kiss.jpg",
      placeCardNote: "Thank you for sharing in our joy!",
      blessingImageUrl: "/images/couple-kiss.jpg",
      musicUrl: "/audio/background.mp3",
      templateId: "velvet-homecoming",
    };
  }

  // Handle template overrides from endpoint or query parameters
  let resolvedTemplate = overrideTemplateId;
  if (!resolvedTemplate && searchParams) {
    const sp = await searchParams;
    resolvedTemplate = resolveTemplateIdFromParam(sp.template || sp.t || sp.style);
  }

  const effectiveTemplateId = resolvedTemplate || settings?.templateId || "golden-mandala-heritage";

  if (!guest.event) {
    const { getWedLinkTemplate } = await import("@/lib/template-engine");
    const { getTemplate } = await import("@/lib/templates");
    const wedlinkTheme = getWedLinkTemplate(effectiveTemplateId);
    const tmplMeta = getTemplate(effectiveTemplateId);
    const data = wedlinkTheme.sampleData;

    let heroPhoto = data.heroPhoto;
    if (effectiveTemplateId === "golden-mandala-heritage" || effectiveTemplateId === "nilame-traditional") {
      heroPhoto = data.cartoonCoupleArt || "/images/templates/kandyan/couple-art.png";
    } else if (effectiveTemplateId === "velvet-homecoming") {
      heroPhoto = "/images/templates/blush-floral/floral-header-arch.png";
    } else if (!heroPhoto) {
      heroPhoto = "/images/couple-kiss.jpg";
    }

    const schedulesList = data.schedules && data.schedules.length > 0
      ? data.schedules.map((s) => ({
          time: s.time,
          title: s.title,
          desc: s.description,
        }))
      : undefined;

    settings = {
      ...settings,
      id: "demo-event-" + effectiveTemplateId,
      coupleNames: tmplMeta.coupleDemoNames || data.coupleNames,
      hostIntro: data.heroGreeting
        ? `${data.heroGreeting} • ${data.heroSubtitle || "You are cordially invited"}`
        : settings.hostIntro,
      invitationBody: data.vowQuote || settings.invitationBody,
      eventDate: new Date(data.eventDate ? `${data.eventDate}T12:00:00.000Z` : "2026-12-18T18:30:00.000Z"),
      venueName: data.venueName || settings.venueName,
      venueAddress: data.venueAddress || settings.venueAddress,
      heroImageUrl: heroPhoto,
      videoThumbnailUrl: heroPhoto,
      welcomeImageUrl: heroPhoto,
      placeCardImageUrl: heroPhoto,
      blessingImageUrl: heroPhoto,
      timelineJson: schedulesList ? JSON.stringify(schedulesList) : settings.timelineJson,
      templateId: effectiveTemplateId,
    };
  } else if (resolvedTemplate) {
    settings = { ...settings, templateId: resolvedTemplate };
  }

  // Record view timestamp if not yet viewed (only for real database records)
  if (isRealGuestInDb && guest?.id && !guest.viewedAt) {
    try {
      await prisma.guest.update({
        where: { id: guest.id },
        data: { viewedAt: new Date() },
      });
    } catch (err) {
      console.warn("Failed to update guest view timestamp:", err);
    }
  }

  if (effectiveTemplateId === "golden-mandala-heritage" || effectiveTemplateId === "nilame-traditional") {
    return <GoldenMandalaInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (effectiveTemplateId === "botanical-silk-sanduni") {
    return <BotanicalLaceInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (effectiveTemplateId === "cathedral-palace-doors") {
    return <NoirCathedralInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (effectiveTemplateId === "embossed-ivory-envelope") {
    return <TuscanVillaInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (effectiveTemplateId === "velvet-homecoming") {
    return <BlushFloralInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  return <InvitationView guest={guest} settings={settings} photos={photos} />;
}
