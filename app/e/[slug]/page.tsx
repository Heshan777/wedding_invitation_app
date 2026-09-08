import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationView from "@/components/InvitationView";

export const revalidate = 60;

export default async function WeddingPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Find the specific wedding event by slug
  const event = await prisma.weddingEvent.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Find the first guest for this event to show authentic preview, or construct preview guest
  const firstGuest = await prisma.guest.findFirst({
    where: { eventId: event.id },
    orderBy: { createdAt: "asc" },
  });

  const previewGuest = firstGuest || {
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
      guest={previewGuest as any}
      settings={event}
      photos={event.photos}
    />
  );
}
