import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Helper to generate slug
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/managers - List all Event Managers (Super Admin only)
export async function GET() {
  try {
    const currentManager = await getAuthenticatedManager();
    if (!currentManager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentManager.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const managers = await prisma.eventManager.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
          },
        },
        events: {
          select: {
            id: true,
            slug: true,
            coupleNames: true,
            eventDate: true,
            venueName: true,
            venueAddress: true,
            contactPhone: true,
            heroImageUrl: true,
            templateId: true,
            plan: true,
            _count: {
              select: {
                guests: true,
                photos: true,
                tables: true,
                wishes: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ managers });
  } catch (err: any) {
    console.error("Fetch managers error:", err);
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 });
  }
}

// POST /api/admin/managers - Create a new Event Manager (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    const currentManager = await getAuthenticatedManager();
    if (!currentManager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentManager.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      username,
      password,
      name,
      company,
      email,
      phone,
      role = "MANAGER",
      createStarterWedding = false,
      starterCoupleNames = "",
      starterVenueName = "",
      starterVenueAddress = "",
      starterTemplateId = "royal-heritage",
      starterPlan = "FREE",
      starterContactPhone = "",
    } = body;

    // Validation
    const cleanUsername = (username || "").trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9_-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, hyphens, and underscores" },
        { status: 400 }
      );
    }

    if (!password || password.length < 5) {
      return NextResponse.json(
        { error: "Password must be at least 5 characters long" },
        { status: 400 }
      );
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Full Name of the event planner is required" },
        { status: 400 }
      );
    }

    // Check unique username
    const existingUser = await prisma.eventManager.findUnique({
      where: { username: cleanUsername },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: `The username "${cleanUsername}" is already taken. Please choose another.` },
        { status: 409 }
      );
    }

    // Check unique email if provided
    if (email && email.trim()) {
      const existingEmail = await prisma.eventManager.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: `The email "${email.trim()}" is already registered.` },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Manager
    const newManager = await prisma.eventManager.create({
      data: {
        username: cleanUsername,
        password: hashedPassword,
        name: name.trim(),
        company: company ? company.trim() : null,
        email: email ? email.trim().toLowerCase() : null,
        phone: phone ? phone.trim() : null,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MANAGER",
      },
      select: {
        id: true,
        username: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // 1-to-1 Architecture: Provision initial dedicated wedding event for the new Event Manager
    let starterEvent: any = null;
    if (newManager.role === "MANAGER" || (createStarterWedding && starterCoupleNames && starterCoupleNames.trim())) {
      const couple = (starterCoupleNames && starterCoupleNames.trim()) || "Couple Names (E.g. Rowan & Maya)";
      const baseSlug = slugify(couple) || `${cleanUsername}-wedding`;
      let uniqueSlug = `${baseSlug}-2026`;
      let counter = 1;
      while (await prisma.weddingEvent.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-2026-${counter++}`;
      }

      starterEvent = await prisma.weddingEvent.create({
        data: {
          managerId: newManager.id,
          slug: uniqueSlug,
          coupleNames: couple,
          eventDate: new Date(Date.now() + 60 * 24 * 3600 * 1000), // ~60 days ahead
          venueName: starterVenueName ? starterVenueName.trim() : "Grand Ballroom & Royal Garden",
          venueAddress: starterVenueAddress ? starterVenueAddress.trim() : "Colombo, Sri Lanka",
          venueLat: 6.9271,
          venueLng: 79.8447,
          templateId: starterTemplateId || "royal-heritage",
          plan: (starterPlan || "FREE").toUpperCase(),
          contactPhone: starterContactPhone ? starterContactPhone.trim() : phone ? phone.trim() : "+94 77 123 4567",
        },
      });

      // Also create default seating tables for starter wedding
      const tableData = Array.from({ length: 6 }, (_, i) => ({
        eventId: starterEvent.id,
        tableNumber: i + 1,
        tableName: `Table ${String(i + 1).padStart(2, "0")}`,
        capacity: 8,
      }));
      await prisma.eventTable.createMany({ data: tableData });
    }

    return NextResponse.json({
      success: true,
      manager: newManager,
      starterEvent,
    });
  } catch (err: any) {
    console.error("Create manager error:", err);
    return NextResponse.json({ error: "Failed to create event manager" }, { status: 500 });
  }
}

// DELETE /api/admin/managers - Delete an Event Manager (Super Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const currentManager = await getAuthenticatedManager();
    if (!currentManager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentManager.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("id");

    if (!targetId) {
      return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });
    }

    // Safety: Cannot delete self
    if (targetId === currentManager.id) {
      return NextResponse.json(
        { error: "You cannot delete your own active Super Admin account" },
        { status: 400 }
      );
    }

    // Safety: Protect the primary "admin" account
    const targetManager = await prisma.eventManager.findUnique({
      where: { id: targetId },
    });
    if (!targetManager) {
      return NextResponse.json({ error: "Event Manager not found" }, { status: 404 });
    }

    if (targetManager.username === "admin") {
      return NextResponse.json(
        { error: "The default platform admin account cannot be deleted" },
        { status: 400 }
      );
    }

    // Delete manager (Prisma cascade will remove their events, photos, guests)
    await prisma.eventManager.delete({
      where: { id: targetId },
    });

    return NextResponse.json({
      success: true,
      message: `Event Manager "${targetManager.username}" deleted successfully`,
    });
  } catch (err: any) {
    console.error("Delete manager error:", err);
    return NextResponse.json({ error: "Failed to delete event manager" }, { status: 500 });
  }
}

// PATCH /api/admin/managers - Update an Event Manager or reset their password (Super Admin only)
export async function PATCH(req: NextRequest) {
  try {
    const currentManager = await getAuthenticatedManager();
    if (!currentManager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentManager.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      id,
      name,
      company,
      email,
      phone,
      role,
      newPassword,
      weddingId,
      coupleNames,
      venueName,
      venueAddress,
      contactPhone,
      templateId,
      plan,
      slug,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });
    }

    const targetManager = await prisma.eventManager.findUnique({
      where: { id },
      include: { events: true },
    });

    if (!targetManager) {
      return NextResponse.json({ error: "Event Manager not found" }, { status: 404 });
    }

    // Build update payload
    const updateData: any = {};

    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (company !== undefined) {
      updateData.company = company ? company.trim() : null;
    }

    if (phone !== undefined) {
      updateData.phone = phone ? phone.trim() : null;
    }

    if (email !== undefined) {
      const cleanEmail = email ? email.trim().toLowerCase() : null;
      if (cleanEmail && cleanEmail !== targetManager.email) {
        const existingEmail = await prisma.eventManager.findUnique({
          where: { email: cleanEmail },
        });
        if (existingEmail && existingEmail.id !== id) {
          return NextResponse.json(
            { error: `The email "${cleanEmail}" is already used by another account.` },
            { status: 409 }
          );
        }
      }
      updateData.email = cleanEmail;
    }

    if (role !== undefined) {
      // Default admin must remain SUPER_ADMIN
      if (targetManager.username === "admin" && role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "The default platform admin account must remain Super Admin" },
          { status: 400 }
        );
      }
      updateData.role = role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MANAGER";
    }

    if (newPassword && newPassword.trim()) {
      if (newPassword.trim().length < 5) {
        return NextResponse.json(
          { error: "New password must be at least 5 characters long" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword.trim(), 10);
    }

    // Optional: Update associated wedding event details if provided
    const targetWedding = weddingId
      ? targetManager.events.find((e: any) => e.id === weddingId)
      : targetManager.events[0];

    if (targetWedding) {
      const weddingUpdateData: any = {};
      if (coupleNames !== undefined && coupleNames.trim()) {
        weddingUpdateData.coupleNames = coupleNames.trim();
      }
      if (venueName !== undefined && venueName.trim()) {
        weddingUpdateData.venueName = venueName.trim();
      }
      if (venueAddress !== undefined) {
        weddingUpdateData.venueAddress = venueAddress.trim();
      }
      if (contactPhone !== undefined) {
        weddingUpdateData.contactPhone = contactPhone.trim();
      }
      if (templateId !== undefined && templateId.trim()) {
        weddingUpdateData.templateId = templateId.trim();
      }
      if (plan !== undefined && plan.trim()) {
        weddingUpdateData.plan = plan.trim().toUpperCase();
      }
      if (slug !== undefined && slug.trim()) {
        const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
        if (cleanSlug !== targetWedding.slug) {
          const conflict = await prisma.weddingEvent.findUnique({
            where: { slug: cleanSlug },
          });
          if (conflict && conflict.id !== targetWedding.id) {
            return NextResponse.json(
              { error: `The link slug "${cleanSlug}" is already in use by another wedding.` },
              { status: 409 }
            );
          }
          weddingUpdateData.slug = cleanSlug;
        }
      }

      if (Object.keys(weddingUpdateData).length > 0) {
        await prisma.weddingEvent.update({
          where: { id: targetWedding.id },
          data: weddingUpdateData,
        });
      }
    }

    const updated = await prisma.eventManager.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        company: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            events: true,
          },
        },
        events: {
          select: {
            id: true,
            slug: true,
            coupleNames: true,
            eventDate: true,
            venueName: true,
            venueAddress: true,
            contactPhone: true,
            heroImageUrl: true,
            templateId: true,
            plan: true,
            _count: {
              select: {
                guests: true,
                photos: true,
                tables: true,
                wishes: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      manager: updated,
      message: "Event Manager updated successfully",
    });
  } catch (err: any) {
    console.error("Update manager error:", err);
    return NextResponse.json({ error: "Failed to update event manager" }, { status: 500 });
  }
}

