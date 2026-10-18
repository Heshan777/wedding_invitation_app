import { renderInvitePage } from "@/lib/render-invite";
import { resolveTemplateIdFromParam } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default async function InviteTemplateSlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string; token: string }>;
  searchParams?: Promise<{ template?: string; t?: string; style?: string }>;
}) {
  const { templateId, token } = await params;
  const resolved = resolveTemplateIdFromParam(templateId);

  return renderInvitePage({
    token,
    overrideTemplateId: resolved || templateId,
    searchParams,
  });
}
