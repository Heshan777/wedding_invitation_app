import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationView from "@/components/InvitationView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WeddingPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

  return (
    <InvitationView
      guest={previewGuest}
      settings={event}
      photos={event.photos}
    />
  );
}
