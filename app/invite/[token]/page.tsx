import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import InvitationView from "@/components/InvitationView";

export const dynamic = "force-dynamic";

export default async function InvitePage({params}:{params:Promise<{token:string}>}) {
    const {token} = await params;

    const guest = await prisma.guest.findUnique({ where:{token}});
    if (!guest) notFound();

    const settings = await prisma.eventSettings.findUnique({where: {id:"singleton"}});
    if (!settings) notFound();

    prisma.guest
    .update({where: {id: guest.id}, data: {viewedAt: new Date()}}).catch(() => {});

    return <InvitationView guest={guest} settings={settings} />;
}