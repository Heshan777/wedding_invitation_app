import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const data = {
    coupleNames: "Sandharu & Sanduni",
    hostIntro: "We Pradeep and Lasanthi, with gratitude and joyful hearts, cordially invite",
    invitationBody: "to join us as we welcome our beloved son and his bride...",
    eventDate: new Date("2026-10-04T19:00:00+05:30"), // 7:00 PM
    venueName: "Rose Garden Banquet Hall",
    venueAddress: "93/4, 1st Kilometer Post, Ragama Road, Kadawatha",
    venueLat: 7.003650918373462,
    venueLng: 79.94263789236709,
  };

  await prisma.eventSettings.upsert({
    where: { id: "singleton" },
    update: data,   // ← now actually updates existing row
    create: { id: "singleton", ...data },
  });
}

main().finally(() => prisma.$disconnect());