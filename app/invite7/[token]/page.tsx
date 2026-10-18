import { renderInvitePage } from "@/lib/render-invite";

export const dynamic = "force-dynamic";

export default async function Invite7Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ template?: string; t?: string; style?: string }>;
}) {
  const { token } = await params;
  return renderInvitePage({
    token,
    overrideTemplateId: "celestial-midnight",
    searchParams,
  });
}
