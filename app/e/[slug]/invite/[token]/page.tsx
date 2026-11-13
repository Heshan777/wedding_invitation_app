import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InvitationView from "@/components/InvitationView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}): Promise<Metadata> {
  const { slug, token } = await params;
  try {
    const guest = await prisma.guest.findUnique({
      where: { token },
      include: {
        event: {
          select: {
            coupleNames: true,
            eventDate: true,
            venueName: true,
            heroImageUrl: true,
          },
        },
      },
    });

    if (!guest || !guest.event) return { title: "Wedding Invitation" };

    const dateStr = new Date(guest.event.eventDate).toLocaleDateString("en-US", {
      dateStyle: "full",
    });

    const title = `${guest.displayName ? `${guest.displayName} • ` : ""}${guest.event.coupleNames} Wedding Invitation`;
    const description = `Personal wedding invitation for ${guest.displayName || "our honored guest"} to celebrate with ${guest.event.coupleNames} on ${dateStr} at ${guest.event.venueName}.`;
    const image = guest.event.heroImageUrl || "/images/templates/golden-mandala.jpg";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: guest.event.coupleNames }],
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

export default async function SlugInvitePage({
  params,
}: {
  params: Promise<{ slug: string; token: string }>;
}) {
  const { slug, token } = await params;

  // Find guest and ensure it belongs to the event with the requested slug
  const guest = await prisma.guest.findUnique({
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

  if (!guest || !guest.event || guest.event.slug !== slug) {
    notFound();
  }

  if (!guest.viewedAt) {
    try {
      await prisma.guest.update({
        where: { id: guest.id },
        data: { viewedAt: new Date() },
      });
    } catch (err) {
      console.error("Failed to update guest view timestamp:", err);
    }
  }

  return (
    <InvitationView
      guest={guest}
      settings={guest.event}
      photos={guest.event.photos}
    />
  );
}
