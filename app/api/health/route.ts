import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";
  const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://");
  const isSqlite = dbUrl.startsWith("file:");
  const hasSecret = Boolean(process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);

  // Mask database URL for safety (only reveal host/protocol)
  let maskedUrl = "NOT_SET";
  if (dbUrl) {
    try {
      if (isSqlite) {
        maskedUrl = "file:***";
      } else {
        const parsed = new URL(dbUrl);
        maskedUrl = `${parsed.protocol}//***@${parsed.host}${parsed.pathname}`;
      }
    } catch {
      maskedUrl = dbUrl.substring(0, 12) + "...";
    }
  }

  let dbStatus = "unknown";
  let dbError: string | null = null;
  let dbErrorCode: string | null = null;
  let eventManagerCount: number | null = null;
  let tablesMissing = false;

  try {
    eventManagerCount = await prisma.eventManager.count();
    dbStatus = "connected";
  } catch (err: any) {
    dbStatus = "failed";
    dbError = err?.message || String(err);
    dbErrorCode = err?.code || null;
    if (
      dbError?.includes("does not exist") ||
      dbError?.includes("no such table") ||
      err?.code === "P2021"
    ) {
      tablesMissing = true;
    }
  }

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    isVercel: Boolean(process.env.VERCEL),
    database: {
      urlConfigured: Boolean(dbUrl),
      urlProtocol: isPostgres ? "postgresql" : isSqlite ? "sqlite" : "other/unknown",
      maskedUrl,
      status: dbStatus,
      eventManagerCount,
      tablesMissing,
      errorCode: dbErrorCode,
      error: dbError,
    },
    auth: {
      sessionSecretConfigured: hasSecret,
      adminUsernameConfigured: Boolean(process.env.ADMIN_USERNAME),
    },
  });
}
