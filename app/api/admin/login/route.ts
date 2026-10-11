import { NextRequest, NextResponse } from "next/server";
import { verifyManagerCredentials, createManagerSession } from "@/lib/auth";

function isDatabaseUnavailable(error: unknown) {
  const candidate = error as { code?: string; message?: string } | null;
  return (
    candidate?.code === "P1001" ||
    candidate?.code === "P1002" ||
    candidate?.message?.includes("Can't reach database server")
  );
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    const manager = await verifyManagerCredentials(username, password);
    if (!manager) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    await createManagerSession(manager);
    return NextResponse.json({
      success: true,
      manager: {
        id: manager.id,
        username: manager.username,
        name: manager.name,
        role: manager.role,
      },
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    if (isDatabaseUnavailable(err)) {
      return NextResponse.json(
        { error: "Authentication service is temporarily unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Authentication failed",
        details: err instanceof Error ? err.message : String(err),
        code: (err as { code?: string })?.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}