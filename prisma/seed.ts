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
    heroImageUrl: "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg",
    heroVideoUrl: "/uploads/preshoot-video-0903-1788547888302-520.mp4",
    videoThumbnailUrl: "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg",
    welcomeImageUrl: "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg",
    placeCardImageUrl: "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg",
    blessingImageUrl: "/uploads/preshoot-photo-OIP2-1788547184704-193.webp",
    galleryJson: JSON.stringify([
      {
        src: "/uploads/preshoot-photo-OIP1-1788547193363-824.webp",
        title: "A Timeless Bond",
        subtitle: "Two souls, one sacred journey under the stars",
        tag: "Pre-Wedding Shoot",
      },
      {
        src: "/uploads/preshoot-photo-OIP-1788547202839-374.webp",
        title: "Golden Hour Romance",
        subtitle: "Embracing a lifetime of love and shared dreams",
        tag: "Tender Moments",
      },
      {
        src: "/uploads/preshoot-photo-59eb71b052447c093b9c-1788547231474-321.jpg",
        title: "Walking into Forever",
        subtitle: "Hand in hand towards a bright new chapter",
        tag: "Celebration",
      },
      {
        src: "/uploads/preshoot-photo-pre-wedding-shoot-gu-1788547212295-734.jpg",
        title: "The Sacred Promise",
        subtitle: "Tokens of love and eternal devotion",
        tag: "Wedding Rings",
      },
    ]),
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
