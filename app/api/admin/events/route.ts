import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedManager } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Helper to generate a URL slug from couple names
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/events - List events (Super Admin sees all or filtered by managerId; regular managers see only their own)
export async function GET(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterManagerId = searchParams.get("managerId");

    const isSuperAdmin = manager.role === "SUPER_ADMIN";
    const whereClause: any = {};

    if (!isSuperAdmin) {
      whereClause.managerId = manager.id;
    } else if (filterManagerId) {
      whereClause.managerId = filterManagerId;
    }

    const events = await prisma.weddingEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        manager: {
          select: {
            id: true,
            username: true,
            name: true,
            company: true,
          },
        },
        _count: {
          select: {
            guests: true,
            photos: true,
            tables: true,
            wishes: true,
          },
        },
      },
    });

    return NextResponse.json({ events, manager });
  } catch (err: any) {
    console.error("Fetch events error:", err);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/admin/events - Create a new wedding event
export async function POST(req: NextRequest) {
  try {
    const manager = await getAuthenticatedManager();
    if (!manager) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      coupleNames,
      eventDate,
      venueName,
      venueAddress,
      venueLat,
      venueLng,
      contactPhone,
      slug: customSlug,
      managerId: requestedManagerId,
    } = body;

    // Super admin can assign wedding to any manager, else own manager ID
    let targetManagerId = manager.id;
    if (manager.role === "SUPER_ADMIN" && requestedManagerId) {
      const exists = await prisma.eventManager.findUnique({
        where: { id: requestedManagerId },
      });
      if (exists) {
        targetManagerId = requestedManagerId;
      }
    }

    if (!coupleNames || !eventDate || !venueName) {
      return NextResponse.json(
        { error: "Couple names, event date, and venue name are required" },
        { status: 400 }
      );
    }

    // Determine unique slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(coupleNames);
    if (!baseSlug) baseSlug = `wedding-${Date.now().toString().slice(-6)}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.weddingEvent.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newEvent = await prisma.weddingEvent.create({
      data: {
        slug: finalSlug,
        managerId: targetManagerId,
        coupleNames: coupleNames.trim(),
        hostIntro: body.hostIntro || "With gratitude and joyful hearts, we cordially invite",
        invitationBody: body.invitationBody || "to join us as we celebrate this special day...",
        eventDate: new Date(eventDate),
        venueName: venueName.trim(),
        venueAddress: venueAddress?.trim() || "Colombo, Sri Lanka",
        venueLat: typeof venueLat === "number" ? venueLat : 6.9271,
        venueLng: typeof venueLng === "number" ? venueLng : 79.8612,
        contactPhone: contactPhone?.trim() || manager.phone || "+94 77 123 4567",
        dressCodeTitle: body.dressCodeTitle || "Royal Splendor & Black Tie",
        dressCodeDescription:
          body.dressCodeDescription ||
          "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
      },
    });

    // Seed default tables for this new wedding
    const defaultTables = [
      { tableNumber: 1, tableName: "Royal Lotus VIP", capacity: 8 },
      { tableNumber: 2, tableName: "Golden Jasmine", capacity: 8 },
      { tableNumber: 3, tableName: "Emerald Orchid", capacity: 8 },
      { tableNumber: 4, tableName: "Sapphire Rose", capacity: 8 },
      { tableNumber: 5, tableName: "Ruby Blossom", capacity: 8 },
      { tableNumber: 6, tableName: "Pearl Lily", capacity: 8 },
    ];
    for (const t of defaultTables) {
      await prisma.eventTable.create({
        data: {
          eventId: newEvent.id,
          tableNumber: t.tableNumber,
          tableName: t.tableName,
          capacity: t.capacity,
        },
      });
    }

    return NextResponse.json({ success: true, event: newEvent });
  } catch (err: any) {
    console.error("Create event error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
