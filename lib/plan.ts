export type PlanTier = "FREE" | "SILVER" | "GOLD" | "PLATINUM";

export interface PlanConfig {
  id: PlanTier;
  name: string;
  badge: string;
  priceLkr: number;
  priceDisplay: string;
  maxGuests: number;
  allowCustomPhotos: boolean;
  maxPhotos: number;
  allowCustomVideos: boolean;
  features: string[];
  description: string;
}

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  FREE: {
    id: "FREE",
    name: "Free Preview",
    badge: "Free Trial",
    priceLkr: 0,
    priceDisplay: "රු. 0 (Free)",
    maxGuests: 4,
    allowCustomPhotos: false,
    maxPhotos: 0,
    allowCustomVideos: false,
    description: "Try WedLink for free with up to 4 personalized invitation links.",
    features: [
      "Up to 4 Guest Invitation Links",
      "Interactive 3D Wax Seal Reveal",
      "Template Previews & Nekath Timings",
      "Live RSVP Testing (4 guests)",
      "Standard Web Address",
    ],
  },
  SILVER: {
    id: "SILVER",
    name: "Silver Royal",
    badge: "Silver Package",
    priceLkr: 5000,
    priceDisplay: "රු. 5,000",
    maxGuests: 100,
    allowCustomPhotos: true,
    maxPhotos: 10,
    allowCustomVideos: false,
    description: "Ideal for intimate Sri Lankan weddings and close gatherings.",
    features: [
      "Up to 100 Guest Invitation Links",
      "High-Resolution Pre-Shoot Gallery (10 Photos)",
      "Live RSVP Tracking & Guest Headcounts",
      "Google Maps Direction Pin",
      "Standard WhatsApp 1-Click Sharing",
      "Digital Save the Date .ICS Sync",
    ],
  },
  GOLD: {
    id: "GOLD",
    name: "Gold Prestige",
    badge: "Most Popular",
    priceLkr: 8500,
    priceDisplay: "රු. 8,500",
    maxGuests: 999999, // Unlimited
    allowCustomPhotos: true,
    maxPhotos: 50,
    allowCustomVideos: true,
    description: "Everything you need for a grand Sri Lankan banquet & homecoming.",
    features: [
      "Unlimited Guest Invitation Links",
      "2 Separate Invitations (Wedding & Homecoming)",
      "Full Pre-Shoot Gallery (Up to 50 Photos)",
      "Cinematic 4K Pre-Shoot Video Embed",
      "Personalized WhatsApp Bulk Message Inviter",
      "Interactive Seating & Table Manager",
      "Bilingual Display (English & Sinhala)",
      "Guestbook Wishes Wall",
      "Bar & Liquor Planner Tool",
    ],
  },
  PLATINUM: {
    id: "PLATINUM",
    name: "Platinum Heritage",
    badge: "VIP Royal",
    priceLkr: 14500,
    priceDisplay: "රු. 14,500",
    maxGuests: 999999, // Unlimited
    allowCustomPhotos: true,
    maxPhotos: 150,
    allowCustomVideos: true,
    description: "Full-service VIP luxury experience with dedicated support.",
    features: [
      "Everything in Gold Prestige",
      "Dedicated WedLink Wedding Specialist Support",
      "Custom Domain / Subdomain Setup",
      "Priority Cloudinary CDN Streaming",
      "Uncapped High-Res Photos (150+)",
      "RSVP Concierge & Follow-up Dashboard",
      "QR Code Print Cards (300 DPI)",
    ],
  },
};

/**
 * Determine the active plan of an event.
 * Safe fallback to "FREE" if not set or invalid.
 */
export function getEventPlan(event: any): PlanTier {
  if (!event) return "FREE";
  
  // Direct plan field on WeddingEvent
  const rawPlan = String(event.plan || "").toUpperCase();
  if (rawPlan === "SILVER" || rawPlan === "GOLD" || rawPlan === "PLATINUM") {
    return rawPlan as PlanTier;
  }
  
  // Fallback metadata check in galleryJson or timelineJson
  try {
    if (event.galleryJson) {
      const parsed = typeof event.galleryJson === "string" ? JSON.parse(event.galleryJson) : event.galleryJson;
      if (parsed?.plan && (parsed.plan === "SILVER" || parsed.plan === "GOLD" || parsed.plan === "PLATINUM")) {
        return parsed.plan as PlanTier;
      }
    }
  } catch {}

  return "FREE";
}

/**
 * Check if a new guest can be added under the current plan.
 */
export function checkGuestAdditionLimit(event: any, currentCount: number, additionalCount: number = 1): {
  allowed: boolean;
  currentCount: number;
  maxGuests: number;
  plan: PlanTier;
  error?: string;
} {
  const plan = getEventPlan(event);
  const config = PLAN_CONFIGS[plan];
  const max = config.maxGuests;

  if (currentCount + additionalCount > max) {
    return {
      allowed: false,
      currentCount,
      maxGuests: max,
      plan,
      error: `Free Tier Limit Reached (${currentCount}/${max} guests). Please upgrade to a Paid Tier (Silver, Gold, or Platinum) to invite more guests.`,
    };
  }

  return {
    allowed: true,
    currentCount,
    maxGuests: max,
    plan,
  };
}

/**
 * Check if photo upload is allowed under current plan.
 */
export function checkPhotoUploadPermission(event: any, currentPhotoCount: number = 0): {
  allowed: boolean;
  plan: PlanTier;
  error?: string;
} {
  const plan = getEventPlan(event);
  const config = PLAN_CONFIGS[plan];

  if (!config.allowCustomPhotos) {
    return {
      allowed: false,
      plan,
      error: "Uploading custom pre-shoot photos requires a Paid Tier (Silver, Gold, or Platinum). Upgrade to unlock your photo gallery.",
    };
  }

  if (currentPhotoCount >= config.maxPhotos) {
    return {
      allowed: false,
      plan,
      error: `Photo limit reached for ${config.name} (${currentPhotoCount}/${config.maxPhotos} photos). Upgrade to Gold or Platinum for more.`,
    };
  }

  return {
    allowed: true,
    plan,
  };
}

/**
 * Check if video upload / embed is allowed under current plan.
 */
export function checkVideoPermission(event: any): {
  allowed: boolean;
  plan: PlanTier;
  error?: string;
} {
  const plan = getEventPlan(event);
  const config = PLAN_CONFIGS[plan];

  if (!config.allowCustomVideos) {
    return {
      allowed: false,
      plan,
      error: "Cinematic pre-shoot video embed & streaming is a Premium feature. Upgrade to Gold Prestige or Platinum Heritage to add your video.",
    };
  }

  return {
    allowed: true,
    plan,
  };
}
