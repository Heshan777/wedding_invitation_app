import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PLAN_CONFIGS, PlanTier } from "@/lib/plan";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId, plan } = body;

    const validPlans: PlanTier[] = ["FREE", "SILVER", "GOLD", "PLATINUM"];
    if (!plan || !validPlans.includes(plan as PlanTier)) {
      return NextResponse.json(
        { error: "Invalid plan. Choose FREE, SILVER, GOLD, or PLATINUM." },
        { status: 400 }
      );
    }

    const isSuperAdmin = manager.role === "SUPER_ADMIN";

    // Find the event
    let targetEvent: any = null;
    if (eventId) {
      targetEvent = await prisma.weddingEvent.findFirst({
        where: isSuperAdmin ? { id: eventId } : { id: eventId, managerId: manager.id },
      });
    } else {
      targetEvent = await prisma.weddingEvent.findFirst({
        where: isSuperAdmin ? {} : { managerId: manager.id },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!targetEvent) {
      return NextResponse.json(
        { error: "Wedding event not found or access denied." },
        { status: 404 }
      );
    }

    // Update plan in DB
    const updated = await prisma.weddingEvent.update({
      where: { id: targetEvent.id },
      data: {
        plan: plan,
      },
    });

    const planConfig = PLAN_CONFIGS[plan as PlanTier];

    return NextResponse.json({
      success: true,
      plan: updated.plan || plan,
      planConfig,
      message: `Event successfully updated to ${planConfig.name}!`,
    });
  } catch (err: any) {
    console.error("Upgrade error:", err);
    return NextResponse.json({ error: "Failed to upgrade plan" }, { status: 500 });
  }
}
