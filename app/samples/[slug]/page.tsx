"use client";

import React, { use } from "react";
import TemplateSlugPreviewPage from "@/app/templates/[id]/page";

export default function SamplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <TemplateSlugPreviewPage params={Promise.resolve({ id: slug })} />;
}
