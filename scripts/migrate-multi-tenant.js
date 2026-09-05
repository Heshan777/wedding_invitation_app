const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function migrate() {
  console.log("Starting multi-tenant database migration...");

  // 1. Ensure default EventManager exists
  let manager = await prisma.eventManager.findUnique({
    where: { username: "admin" },
  });

  if (!manager) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    manager = await prisma.eventManager.create({
      data: {
        username: "admin",
        password: hashedPassword,
        name: "Lead Wedding Planner",
        company: "Royal Digital Wedding Suite",
        email: "planner@royalevents.com",
        role: "SUPER_ADMIN",
      },
    });
    console.log("Created default EventManager:", manager.username, manager.id);
  } else {
    console.log("Existing EventManager found:", manager.username, manager.id);
  }

  // 2. Fetch existing EventSettings
  const settings = await prisma.eventSettings.findFirst({
    where: { id: "singleton" },
  });

  // 3. Ensure primary WeddingEvent exists
  let event = await prisma.weddingEvent.findFirst({
    where: { slug: "sandharu-sanduni-2026" },
  });

  if (!event) {
    event = await prisma.weddingEvent.create({
      data: {
        id: "event_sandharu_sanduni_2026",
        slug: "sandharu-sanduni-2026",
        managerId: manager.id,
        coupleNames: settings?.coupleNames || "Sandharu & Sanduni",
        hostIntro: settings?.hostIntro || "With gratitude and joyful hearts, we cordially invite",
        invitationBody: settings?.invitationBody || "to join us as we celebrate this special day...",
        eventDate: settings?.eventDate || new Date("2026-10-18T14:30:00.000Z"),
        venueName: settings?.venueName || "Grand Ballroom, The Kingsbury Colombo",
        venueAddress: settings?.venueAddress || "48 Janadhipathi Mawatha, Colombo 00100, Sri Lanka",
        venueLat: settings?.venueLat || 6.9344,
        venueLng: settings?.venueLng || 79.8428,
        contactPhone: settings?.contactPhone || "+94 77 123 4567",
        heroImageUrl: settings?.heroImageUrl || "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg",
        heroVideoUrl: settings?.heroVideoUrl || "/uploads/preshoot-video-0903-1788547888302-520.mp4",
        videoThumbnailUrl: settings?.videoThumbnailUrl || "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg",
        welcomeImageUrl: settings?.welcomeImageUrl || "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg",
        placeCardImageUrl: settings?.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg",
        placeCardNote: settings?.placeCardNote || "Thank you for sharing our joy and celebrating with us!",
        blessingImageUrl: settings?.blessingImageUrl || "/uploads/preshoot-photo-OIP2-1788547184704-193.webp",
        musicUrl: settings?.musicUrl || "/audio/background.mp3",
        dressCodeTitle: settings?.dressCodeTitle || "Royal Splendor & Black Tie",
        dressCodeDescription: settings?.dressCodeDescription || "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
        timelineJson: settings?.timelineJson,
        galleryJson: settings?.galleryJson,
      },
    });
    console.log("Created primary WeddingEvent:", event.coupleNames, event.id, event.slug);
  } else {
    console.log("Existing WeddingEvent found:", event.coupleNames, event.id);
  }

  // 4. Migrate galleryJson items to EventPhoto table
  if (settings?.galleryJson) {
    try {
      const photos = JSON.parse(settings.galleryJson);
      if (Array.isArray(photos)) {
        const currentPhotoCount = await prisma.eventPhoto.count({
          where: { eventId: event.id },
        });
        if (currentPhotoCount === 0) {
          for (let i = 0; i < photos.length; i++) {
            const p = photos[i];
            await prisma.eventPhoto.create({
              data: {
                eventId: event.id,
                url: p.src,
                title: p.title || `Moment ${i + 1}`,
                subtitle: p.subtitle || "",
                tag: p.tag || "Pre-Wedding",
                order: i,
              },
            });
          }
          console.log(`Migrated ${photos.length} photos into EventPhoto table!`);
        }
      }
    } catch (e) {
      console.warn("Could not parse galleryJson:", e.message);
    }
  }

  // 5. Link all orphaned Guests to this event
  const unlinkedGuests = await prisma.guest.findMany({
    where: { eventId: null },
  });
  if (unlinkedGuests.length > 0) {
    await prisma.guest.updateMany({
      where: { eventId: null },
      data: { eventId: event.id },
    });
    console.log(`Linked ${unlinkedGuests.length} existing guests to WeddingEvent: ${event.coupleNames}`);
  }

  // 6. Ensure default tables exist
  const tableCount = await prisma.eventTable.count({
    where: { eventId: event.id },
  });
  if (tableCount === 0) {
    const defaultTables = [
      { tableNumber: 1, tableName: "Royal Lotus VIP", capacity: 8 },
      { tableNumber: 2, tableName: "Golden Jasmine", capacity: 8 },
      { tableNumber: 3, tableName: "Emerald Orchid", capacity: 8 },
      { tableNumber: 4, tableName: "Sapphire Rose", capacity: 8 },
      { tableNumber: 5, tableName: "Ruby Blossom", capacity: 8 },
      { tableNumber: 6, tableName: "Pearl Lily", capacity: 8 },
      { tableNumber: 7, tableName: "Amber Marigold", capacity: 8 },
      { tableNumber: 8, tableName: "Crystal Daisy", capacity: 8 },
    ];
    for (const t of defaultTables) {
      await prisma.eventTable.create({
        data: {
          eventId: event.id,
          tableNumber: t.tableNumber,
          tableName: t.tableName,
          capacity: t.capacity,
        },
      });
    }
    console.log(`Seeded ${defaultTables.length} event tables for ${event.coupleNames}`);
  }

  console.log("Migration complete!");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
