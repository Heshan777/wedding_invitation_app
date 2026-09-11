import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationView from "@/components/InvitationView";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Find guest and include the linked wedding event and its photos from EventPhoto table
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

  if (!guest) notFound();

  // If the guest is linked to a WeddingEvent, use its event settings & photos
  let settings: any = guest.event;
  const photos = guest.event?.photos || [];

  // Fallback to legacy singleton if event is not attached
  if (!settings) {
    settings = await prisma.eventSettings.findUnique({
      where: { id: "singleton" },
    });
  }

  if (!settings) notFound();

  // Record view timestamp if not yet viewed
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

  return <InvitationView guest={guest} settings={settings} photos={photos} />;
}