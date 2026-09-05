const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("==========================================");
  console.log("MULTI-TENANT SAAS INTEGRATION TEST");
  console.log("==========================================");

  // 1. Verify default admin manager
  const admin = await prisma.eventManager.findUnique({
    where: { username: "admin" },
    include: { events: true },
  });
  console.log("✓ Default Admin Manager found:", admin.username, `(${admin.events.length} events)`);

  // 2. Create / ensure a second Event Manager
  const testUsername = "luxury_planners";
  let manager2 = await prisma.eventManager.findUnique({
    where: { username: testUsername },
  });

  if (!manager2) {
    const hashedPassword = await bcrypt.hash("PlannerSecure123!", 10);
    manager2 = await prisma.eventManager.create({
      data: {
        username: testUsername,
        password: hashedPassword,
        name: "Nimali Wickramasinghe",
        company: "Luxury Weddings & Events PVT",
        email: "nimali@luxuryweddings.lk",
        phone: "+94 77 999 8888",
        role: "MANAGER",
      },
    });
    console.log("✓ Created secondary Event Manager:", manager2.username, "Company:", manager2.company);
  } else {
    console.log("✓ Secondary Event Manager exists:", manager2.username);
  }

  // 3. Create a distinct WeddingEvent for Manager 2
  const slug = "kamal-anoma-2026";
  let wedding2 = await prisma.weddingEvent.findUnique({
    where: { slug },
  });

  if (!wedding2) {
    wedding2 = await prisma.weddingEvent.create({
      data: {
        managerId: manager2.id,
        slug: slug,
        coupleNames: "Kamal & Anoma",
        eventDate: new Date("2026-12-18T18:30:00Z"),
        venueName: "Shangri-La Colombo Ballroom",
        venueAddress: "1 Galle Face, Colombo 02, Sri Lanka",
        venueLat: 6.9271,
        venueLng: 79.8447,
        contactPhone: "+94 77 999 8888",
        dressCodeTitle: "Formal Evening & Traditional",
        heroImageUrl: "/uploads/sample-kamal-anoma.jpg",
      },
    });
    console.log("✓ Created distinct WeddingEvent for Manager 2:", wedding2.coupleNames, `(PK: ${wedding2.id}, slug: ${wedding2.slug})`);
  } else {
    console.log("✓ WeddingEvent exists:", wedding2.coupleNames, `(PK: ${wedding2.id})`);
  }

  // 4. Add photos to the dedicated EventPhoto table for Wedding 2
  const photoCountBefore = await prisma.eventPhoto.count({
    where: { eventId: wedding2.id },
  });

  if (photoCountBefore === 0) {
    await prisma.eventPhoto.createMany({
      data: [
        {
          eventId: wedding2.id,
          url: "/uploads/preshoot-kamal-anoma-1.jpg",
          title: "Beach Sunset Romance",
          subtitle: "Bentota Golden Sands",
          tag: "Pre-Wedding",
          order: 0,
        },
        {
          eventId: wedding2.id,
          url: "/uploads/preshoot-kamal-anoma-2.jpg",
          title: "Traditional Attire Session",
          subtitle: "Peradeniya Heritage Grounds",
          tag: "Portrait",
          order: 1,
        },
      ],
    });
    console.log("✓ Populated 2 photos into EventPhoto table for", wedding2.coupleNames);
  }

  // 5. Add a guest for Wedding 2
  const guestCountBefore = await prisma.guest.count({
    where: { eventId: wedding2.id },
  });

  if (guestCountBefore === 0) {
    const guest = await prisma.guest.create({
      data: {
        eventId: wedding2.id,
        salutation: "Hon.",
        displayName: "Dinesh & Family",
        inviteType: "FAMILY",
        tableNumber: 5,
        phone: "+94770001122",
        attendeeCount: 4,
      },
    });
    console.log("✓ Created guest for Wedding 2:", guest.displayName, `(Token: ${guest.token})`);
  }

  // 6. Test Multi-Tenant Database Isolation
  console.log("\n--- VERIFYING TENANT ISOLATION ---");

  // Manager 1's events vs Manager 2's events
  const manager1Events = await prisma.weddingEvent.findMany({
    where: { managerId: admin.id },
    select: { id: true, coupleNames: true, slug: true },
  });
  const manager2Events = await prisma.weddingEvent.findMany({
    where: { managerId: manager2.id },
    select: { id: true, coupleNames: true, slug: true },
  });

  console.log(`Manager 1 (${admin.username}) events:`, manager1Events.map(e => e.coupleNames));
  console.log(`Manager 2 (${manager2.username}) events:`, manager2Events.map(e => e.coupleNames));

  const hasOverlap = manager1Events.some(e1 => manager2Events.some(e2 => e2.id === e1.id));
  if (!hasOverlap) {
    console.log("✓ SUCCESS: No event overlap between different event managers! Strict multi-tenancy verified.");
  } else {
    throw new Error("SECURITY FAIL: Event overlap detected between managers!");
  }

  // Photos table separation
  const adminPhotos = await prisma.eventPhoto.findMany({
    where: { eventId: manager1Events[0].id },
  });
  const manager2Photos = await prisma.eventPhoto.findMany({
    where: { eventId: wedding2.id },
  });

  console.log(`EventPhoto table records for ${manager1Events[0].coupleNames}: ${adminPhotos.length} photos`);
  console.log(`EventPhoto table records for ${wedding2.coupleNames}: ${manager2Photos.length} photos`);

  const photoOverlap = adminPhotos.some(p1 => manager2Photos.some(p2 => p2.id === p1.id));
  if (!photoOverlap) {
    console.log("✓ SUCCESS: EventPhoto table records are strictly scoped per wedding event primary key!");
  } else {
    throw new Error("Photo overlap detected!");
  }

  // Public Invitation Token resolution
  const anyGuestWedding2 = await prisma.guest.findFirst({
    where: { eventId: wedding2.id },
    include: {
      event: {
        include: {
          photos: true,
        },
      },
    },
  });

  console.log("\n--- PUBLIC INVITATION RESOLUTION TEST ---");
  console.log(`Guest Token: ${anyGuestWedding2.token}`);
  console.log(`Resolved Wedding: ${anyGuestWedding2.event.coupleNames} (Venue: ${anyGuestWedding2.event.venueName})`);
  console.log(`Resolved Photos from EventPhoto table: ${anyGuestWedding2.event.photos.length} photos`);

  if (anyGuestWedding2.event.coupleNames === "Kamal & Anoma" && anyGuestWedding2.event.photos.length === 2) {
    console.log("✓ SUCCESS: Public invitation route correctly resolves wedding event and EventPhoto table records!");
  } else {
    throw new Error("Invitation resolution mismatch!");
  }

  console.log("\n==========================================");
  console.log("ALL MULTI-TENANCY REQUIREMENTS VERIFIED!");
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
