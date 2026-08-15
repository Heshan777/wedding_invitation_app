import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      coupleNames: "Sandharu & Sanduni",
      hostIntro: "We Pradeep and Lasanthi, with gratitude and joyful hearts, cordially invite",
      invitationBody: "to join us as we welcome our beloved son and his bride...",
      eventDate: new Date("2026-10-04T19:00:00+05:30"),
      venueName: "Rose Garden Banquet Hall",
      venueAddress: "93/4, 1st Kilometer Post, Ragama Road, Kadawatha",
      venueLat: 7.003650918373462,
      venueLng: 79.94263789236709,
    },
  });
}

main().finally(() => prisma.$disconnect());