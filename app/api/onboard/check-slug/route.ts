import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  let cleanSlug = "";
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug || slug.trim().length < 3) {
      return NextResponse.json({ available: false, message: "URL slug must be at least 3 characters." });
    }

    cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await prisma.weddingEvent.findUnique({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    let suggestedSlug: string | undefined = undefined;
    if (existing) {
      const year = new Date().getFullYear();
      let candidate = `${cleanSlug}-${year}`;
      let candidateCheck = await prisma.weddingEvent.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!candidateCheck) {
        suggestedSlug = candidate;
      } else {
        let counter = 2;
        while (candidateCheck) {
          candidate = `${cleanSlug}-${year}-${counter}`;
          candidateCheck = await prisma.weddingEvent.findUnique({
            where: { slug: candidate },
            select: { id: true },
          });
          counter++;
          if (counter > 50) {
            candidate = `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;
            break;
          }
        }
        suggestedSlug = candidate;
      }
    }

    return NextResponse.json({
      available: !existing,
      slug: cleanSlug,
      suggestedSlug,
      message: existing
        ? `This link is already reserved. Try "${suggestedSlug}" instead.`
        : "This link is available!",
    });
  } catch (error: any) {
    console.error("Check slug error:", error);
    // If database check is temporarily unreachable, allow user to proceed with clean slug
    return NextResponse.json({
      available: true,
      slug: cleanSlug,
      message: "Link format is valid.",
    });
  }
}
