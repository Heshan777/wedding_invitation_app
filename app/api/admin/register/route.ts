import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createManagerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, name, company, email, phone } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Name, username, and password are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long for account security" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.eventManager.findUnique({
      where: { username: cleanUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    if (email) {
      const existingEmail = await prisma.eventManager.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newManager = await prisma.eventManager.create({
      data: {
        username: cleanUsername,
        password: hashedPassword,
        name: name.trim(),
        company: company?.trim() || "Wedding Planning Agency",
        email: email?.trim().toLowerCase() || null,
        phone: phone?.trim() || null,
        role: "MANAGER",
      },
    });

    // Create an initial wedding event for this manager
    const starterSlug = `${cleanUsername}-wedding-${Date.now().toString().slice(-4)}`;
    await prisma.weddingEvent.create({
      data: {
        slug: starterSlug,
        managerId: newManager.id,
        coupleNames: "Couple Names (E.g. Rowan & Maya)",
        hostIntro: "With joyful hearts and blessings, we cordially invite",
        invitationBody: "to join us as we celebrate our holy union and homecoming...",
        eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days in future
        venueName: "Grand Ballroom & Royal Garden",
        venueAddress: "Colombo, Sri Lanka",
        venueLat: 6.9271,
        venueLng: 79.8612,
        contactPhone: phone?.trim() || "+94 77 000 0000",
        dressCodeTitle: "Royal Splendor & Traditional Elegance",
        dressCodeDescription: "Formal or traditional attire in warm festive tones.",
      },
    });

    // Automatically create session
    await createManagerSession({
      id: newManager.id,
      username: newManager.username,
      name: newManager.name,
      role: newManager.role,
    });

    return NextResponse.json({
      success: true,
      manager: {
        id: newManager.id,
        username: newManager.username,
        name: newManager.name,
        company: newManager.company,
      },
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Failed to create event manager account" },
      { status: 500 }
    );
  }
}
