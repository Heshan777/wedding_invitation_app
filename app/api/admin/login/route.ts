import { NextRequest, NextResponse } from "next/server";
import { verifyManagerCredentials, createManagerSession } from "@/lib/auth";

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
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: err?.message || String(err),
        code: err?.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}