import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug || slug.trim().length < 3) {
      return NextResponse.json({ available: false, message: "URL slug must be at least 3 characters." });
    }

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.weddingEvent.findUnique({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    return NextResponse.json({
      available: !existing,
      slug: cleanSlug,
      message: existing ? "This link is already taken." : "This link is available!",
    });
  } catch (error: any) {
    return NextResponse.json({ available: false, error: error.message }, { status: 500 });
  }
}
