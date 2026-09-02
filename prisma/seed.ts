import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const data = {
    coupleNames: "Sandharu & Sanduni",
    hostIntro: "We Pradeep and Lasanthi, with gratitude and joyful hearts, cordially invite",
    invitationBody: "to join us as we welcome our beloved son and his bride to their new journey together.",
    eventDate: new Date("2026-10-04T19:00:00+05:30"), // 7:00 PM
    venueName: "Rose Garden Banquet Hall",
    venueAddress: "93/4, 1st Kilometer Post, Ragama Road, Kadawatha",
    venueLat: 7.003650918373462,
    venueLng: 79.94263789236709,
    musicUrl: "/audio/background.mp3",
  };

  await prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  // Create demo guests if database is empty
  const existingCount = await prisma.guest.count();
  if (existingCount === 0) {
    await prisma.guest.createMany({
      data: [
        {
          token: "vip-demo-couple",
          displayName: "Pradeep Somasiri",
          salutation: "Mr & Mrs",
          inviteType: "COUPLE",
          tableNumber: 1,
          notes: "Family VIP Table",
        },
        {
          token: "vip-demo-family",
          displayName: "Samantha Silva",
          salutation: "Dr & Mrs",
          inviteType: "FAMILY",
          tableNumber: 2,
          notes: "Vegetarian meal preference",
        },
      ],
    });
  }

  console.log("Database seeded successfully with event settings and demo guests!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
