import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InvitationView from "@/components/InvitationView";
import { resolveTemplateIdFromParam } from "@/lib/templates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await prisma.weddingEvent.findUnique({
      where: { slug },
      select: {
        coupleNames: true,
        eventDate: true,
        venueName: true,
        heroImageUrl: true,
      },
    });

    if (!event) return { title: "Wedding Invitation" };

    const dateStr = new Date(event.eventDate).toLocaleDateString("en-US", {
      dateStyle: "full",
    });

    const title = `${event.coupleNames} • Wedding Invitation`;
    const description = `You are cordially invited to celebrate our wedding on ${dateStr} at ${event.venueName}.`;
    const image = event.heroImageUrl || "/images/templates/golden-mandala.jpg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: event.coupleNames }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "Wedding Invitation" };
  }
}

export default async function WeddingPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ template?: string; opened?: string }>;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};

  // Find the specific wedding event by slug
  let event = null;
  try {
    event = await prisma.weddingEvent.findUnique({
      where: { slug },
      include: {
        photos: {
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    console.warn("Database connection issue when loading wedding event:", error);
  }

  // Graceful fallback for previewing or when database is waking up
  if (!event) {
    const slugParts = slug.replace(/-\d{4}$/, "").split(/-and-|-with-|-/);
    const groom = slugParts[0] ? slugParts[0].charAt(0).toUpperCase() + slugParts[0].slice(1) : "Nethmi";
    const bride = slugParts[1] ? slugParts[1].charAt(0).toUpperCase() + slugParts[1].slice(1) : "Sanuja";
    const requestedTpl = sp.template ? (resolveTemplateIdFromParam(sp.template) || sp.template) : "golden-mandala-heritage";

    event = {
      id: "demo-event-" + slug,
      slug,
      managerId: "demo-manager",
      coupleNames: `${groom} & ${bride}`,
      hostIntro: "ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM!",
      invitationBody: "We cordially invite you to celebrate our holy union & Poruwa ceremony.",
      eventDate: new Date("2026-12-12T10:00:00.000Z"),
      venueName: "Rose Garden Banquet Hall, Kadawatha",
      venueAddress: "Kandy Road, Kadawatha, Sri Lanka",
      venueLat: 6.9942,
      venueLng: 79.9542,
      contactPhone: "+94 77 123 4567",
      heroImageUrl: "/images/wedding-portrait.jpg",
      heroVideoUrl: null,
      videoThumbnailUrl: null,
      welcomeImageUrl: null,
      placeCardImageUrl: null,
      placeCardNote: "Thank you for sharing our joy and celebrating with us!",
      blessingImageUrl: null,
      musicUrl: "/audio/background.mp3",
      templateId: requestedTpl,
      dressCodeTitle: "Traditional Sri Lankan Elegance",
      dressCodeDescription: "Kandyan Sarees, National Dress, or Lounge Suits in warm festive tones.",
      timelineJson: null,
      galleryJson: null,
      plan: "FREE",
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
  }

  // Allow URL template override if explicitly passed in searchParams
  if (sp.template) {
    const resolvedTpl = resolveTemplateIdFromParam(sp.template) || sp.template;
    event = { ...event, templateId: resolvedTpl };
  }

  // Safe isolated preview guest: Zero DB queries on real guest records, preventing PII leaks and RSVP hijacking
  const previewGuest = {
    id: "preview",
    token: "preview",
    eventId: event.id,
    displayName: "Distinguished Guest",
    salutation: "Honored Guest",
    inviteType: "COUPLE" as const,
    tableNumber: 1,
    phone: null,
    notes: "Wedding Preview Mode",
    dietary: "NONE",
    rsvpStatus: "PENDING" as const,
    attendeeCount: 2,
    rsvpMessage: null,
    viewedAt: null,
    rsvpSubmittedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // By default on live invitation card (/e/[slug]), show the invitation card directly with zero flashing overlay
  const shouldOpen = sp.opened !== "false";

  return (
    <InvitationView
      guest={previewGuest}
      settings={event}
      photos={event.photos}
      initialOpened={shouldOpen}
    />
  );
}
