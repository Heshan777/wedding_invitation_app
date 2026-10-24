import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createManagerSession } from "@/lib/auth";
import { resolveTemplateIdFromParam } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      templateId,
      groomName,
      brideName,
      coupleNames,
      slug,
      eventDate,
      venueName,
      venueAddress,
      primaryEventTime,
      secondaryEventTitle,
      secondaryEventTime,
      secondaryEventVenue,
      dressCodeTitle,
      dressCodeDescription,
      musicTitle,
      musicUrl,
      hostIntro,
      invitationBody,
      phone,
      email,
      password,
      accountName,
    } = body;

    // Validate couple names
    const resolvedCoupleNames =
      coupleNames?.trim() ||
      `${groomName?.trim() || "Groom"} & ${brideName?.trim() || "Bride"}`;

    if (!resolvedCoupleNames || resolvedCoupleNames === " & ") {
      return NextResponse.json(
        { error: "Please enter the bride and groom names." },
        { status: 400 }
      );
    }

    // Validate slug
    const cleanSlug = (slug || `${resolvedCoupleNames.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (cleanSlug.length < 3) {
      return NextResponse.json(
        { error: "Website URL slug must be at least 3 characters." },
        { status: 400 }
      );
    }

    // Check if slug is already taken, and find a guaranteed unique available slug
    let finalSlug = cleanSlug;
    const existingSlug = await prisma.weddingEvent.findUnique({
      where: { slug: cleanSlug },
      select: { id: true },
    });

    if (existingSlug) {
      const year = new Date().getFullYear();
      let candidate = `${cleanSlug}-${year}`;
      let check = await prisma.weddingEvent.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });

      if (!check) {
        finalSlug = candidate;
      } else {
        let counter = 2;
        while (check) {
          candidate = `${cleanSlug}-${year}-${counter}`;
          check = await prisma.weddingEvent.findUnique({
            where: { slug: candidate },
            select: { id: true },
          });
          counter++;
          if (counter > 50) {
            candidate = `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`;
            break;
          }
        }
        finalSlug = candidate;
      }
    }

    // Generate credentials
    const cleanUsername = finalSlug.slice(0, 25);
    const cleanPassword = password && password.length >= 6 ? password : "wedding2026";
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    // Create unique username for EventManager if taken
    let finalUsername = cleanUsername;
    const existingManager = await prisma.eventManager.findUnique({
      where: { username: finalUsername },
    });
    if (existingManager) {
      finalUsername = `${cleanUsername}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Check email uniqueness if provided
    let finalEmail = email?.trim().toLowerCase() || null;
    if (finalEmail) {
      const emailExists = await prisma.eventManager.findUnique({
        where: { email: finalEmail },
      });
      if (emailExists) {
        finalEmail = null; // Don't block onboarding if email is duplicate, decouple
      }
    }

    // Create EventManager account
    const newManager = await prisma.eventManager.create({
      data: {
        username: finalUsername,
        password: hashedPassword,
        name: accountName?.trim() || resolvedCoupleNames,
        company: "Self-Serve Couple",
        email: finalEmail,
        phone: phone?.trim() || null,
        role: "MANAGER",
      },
    });

    // Parse event date
    const parsedEventDate = eventDate ? new Date(eventDate) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // Timeline JSON construction for multiple events
    const timelineData = [
      {
        title: "Poruwa Ceremony & Sacred Customs",
        time: primaryEventTime || "09:18 AM",
        location: venueName || "Grand Ballroom, Colombo",
        description: "Traditional Sri Lankan Poruwa ceremony with auspicious Nekath blessings and Magul Bera.",
      },
    ];

    if (secondaryEventTitle) {
      timelineData.push({
        title: secondaryEventTitle || "Evening Reception & Dinner Dance",
        time: secondaryEventTime || "06:30 PM",
        location: secondaryEventVenue || venueName || "Grand Ballroom, Colombo",
        description: "Join us for champagne toasts, banquet dinner, and dancing.",
      });
    }

    // Resolve template ID safely
    const resolvedTemplateId = resolveTemplateIdFromParam(templateId) || templateId || "golden-mandala-heritage";
    let defaultHeroImage = "/images/couple-kiss.jpg";
    if (resolvedTemplateId === "golden-mandala-heritage") {
      defaultHeroImage = "/images/templates/kandyan/couple-art.png";
    } else if (resolvedTemplateId === "botanical-silk-sanduni") {
      defaultHeroImage = "/images/templates/botanical/hydrangea-garden.jpg";
    } else if (resolvedTemplateId === "cathedral-palace-doors") {
      defaultHeroImage = "/images/templates/noir/noir-hero.jpg";
    } else if (resolvedTemplateId === "embossed-ivory-envelope") {
      defaultHeroImage = "/images/templates/tuscan/villa-hero.jpg";
    } else if (resolvedTemplateId === "velvet-homecoming") {
      defaultHeroImage = "/images/templates/blush-floral/floral-header-arch.png";
    }

    // Create WeddingEvent
    const weddingEvent = await prisma.weddingEvent.create({
      data: {
        slug: finalSlug,
        managerId: newManager.id,
        templateId: resolvedTemplateId,
        coupleNames: resolvedCoupleNames,
        hostIntro: hostIntro || "With joyful hearts and the blessings of our parents, we cordially invite",
        invitationBody: invitationBody || "to share in our joy as we celebrate the sacred union of our lives...",
        eventDate: parsedEventDate,
        venueName: venueName || "Shangri-La Ballroom",
        venueAddress: venueAddress || "Colombo 02, Sri Lanka",
        venueLat: 6.9271,
        venueLng: 79.8612,
        contactPhone: phone?.trim() || "+94 77 123 4567",
        heroImageUrl: defaultHeroImage,
        videoThumbnailUrl: defaultHeroImage,
        welcomeImageUrl: defaultHeroImage,
        dressCodeTitle: dressCodeTitle || "Traditional Sri Lankan Elegance or Black Tie",
        dressCodeDescription: dressCodeDescription || "Formal evening attire in warm tones of gold, burgundy, and ivory.",
        musicUrl: musicUrl || "/audio/background.mp3",
        timelineJson: JSON.stringify(timelineData),
        plan: ["SILVER", "GOLD", "PLATINUM"].includes(String(body.plan || "").toUpperCase())
          ? String(body.plan).toUpperCase()
          : "FREE",
      },
    });

    // Create default sample VIP guest for the couple
    const sampleGuest = await prisma.guest.create({
      data: {
        eventId: weddingEvent.id,
        displayName: "Honored Guest",
        salutation: "Dear",
        inviteType: "COUPLE",
        tableNumber: 1,
        notes: "Sample guest link to test WhatsApp sharing",
        rsvpStatus: "PENDING",
        attendeeCount: 2,
      },
    });

    // Automatically set authenticated manager session cookie
    await createManagerSession({
      id: newManager.id,
      username: newManager.username,
      name: newManager.name,
      role: newManager.role,
    });

    return NextResponse.json({
      success: true,
      slug: cleanSlug,
      eventId: weddingEvent.id,
      guestToken: sampleGuest.token,
      username: finalUsername,
      message: "Wedding invitation created successfully!",
      redirectUrl: "/admin/dashboard",
    });
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred while creating your invitation." },
      { status: 500 }
    );
  }
}
