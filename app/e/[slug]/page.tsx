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

  if (!event) {
    notFound();
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
