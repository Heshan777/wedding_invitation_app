import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import InvitationView from "@/components/InvitationView";

export const dynamic = "force-dynamic";

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
