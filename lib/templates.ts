export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "classic" | "modern" | "botanical" | "celestial";
  categoryLabel: string;
  badge?: string;
  primaryColor: string;
  accentColor: string;
  palette: ColorSwatch[];
  styles: {
    // Page & Backdrop
    pageBg: string;
    radialGlow: string;
    // Envelope Styling
    envelopeBoxGradient: string;
    envelopeFlapGradient: string;
    envelopePocketGradient: string;
    envelopeBorder: string;
    waxSealGradient: string;
    waxSealBorder: string;
    waxSealGlow: string;
    waxSealText: string;
    // Card Styling
    cardBg: string;
    cardBorder: string;
    cornerFlourishColor: string;
    headerAccentColor: string;
    textPrimary: string;
    textSecondary: string;
    buttonShimmerGradient: string;
    buttonText: string;
    // Falling Decor
    fallingDecorType: "petals" | "stardust" | "leaves" | "sparkles";
  };
  features: string[];
  recommendedMusicTitle: string;
  defaultDressCode: {
    title: string;
    description: string;
  };
}

export const INVITATION_TEMPLATES: Record<string, InvitationTemplate> = {
  "royal-heritage": {
    id: "royal-heritage",
    name: "Royal Heritage",
    tagline: "Regal Velvet Crimson & Imperial Gilded Gold",
    description: "The timeless grand royal wedding aesthetic. Deep velvet burgundy tones accented with opulent gold filigrees, ornate lotus corners, and a traditional crimson wax medallion.",
    category: "classic",
    categoryLabel: "Classic Royal",
    badge: "Most Popular",
    primaryColor: "#800020",
    accentColor: "#dfba73",
    palette: [
      { name: "Royal Velvet", hex: "#800020" },
      { name: "Imperial Gold", hex: "#dfba73" },
      { name: "Champagne Gold", hex: "#ffd700" },
      { name: "Antique Parchment", hex: "#fffdfa" },
      { name: "Obsidian Core", hex: "#140409" },
    ],
    styles: {
      pageBg: "bg-[#121013]",
      radialGlow: "rgba(128, 0, 32, 0.45)",
      envelopeBoxGradient: "from-[#3a101b] via-[#240810] to-[#140409]",
      envelopeFlapGradient: "from-[#471221] via-[#350d18] to-[#250810]",
      envelopePocketGradient: "from-[#20060e] via-[#2d0914] to-[#3a0d1a]",
      envelopeBorder: "border-[#c5a059]",
      waxSealGradient: "bg-gradient-to-br from-[#9e1b32] via-[#800020] to-[#470a16]",
      waxSealBorder: "border-[#ffd700]/80",
      waxSealGlow: "rgba(223, 186, 115, 0.5)",
      waxSealText: "text-[#fffdfa]",
      cardBg: "from-[#fffdfa] via-[#fcf8f0] to-[#f5ebd7]",
      cardBorder: "border-[#dfba73]",
      cornerFlourishColor: "#c5a059",
      headerAccentColor: "#ffd700",
      textPrimary: "#1a1517",
      textSecondary: "#8c6a2b",
      buttonShimmerGradient: "from-[#800020] via-[#a31536] to-[#6b0f24]",
      buttonText: "text-[#ffd700]",
      fallingDecorType: "petals",
    },
    features: [
      "3D Animated Royal Wax Seal",
      "Romantic Couple Walk & Kiss Stage",
      "Falling Crimson Rose Petals",
      "Multilingual Support (En / Si / Ta)",
      "Interactive Auspicious Countdown",
      "Interactive Wedding Map & RSVP",
    ],
    recommendedMusicTitle: "Royal Wedding March & Traditional Flute",
    defaultDressCode: {
      title: "Royal Splendor & Black Tie",
      description: "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
    },
  },

  "celestial-midnight": {
    id: "celestial-midnight",
    name: "Celestial Midnight",
    tagline: "Starry Twilight Sapphire & Luminescent Silver",
    description: "An enchanting evening wedding celebration under the starlit sky. Rich midnight navy and indigo textures infused with glittering diamond stardust and radiant silver filigrees.",
    category: "celestial",
    categoryLabel: "Evening & Celestial",
    badge: "New Release",
    primaryColor: "#0f172a",
    accentColor: "#38bdf8",
    palette: [
      { name: "Midnight Navy", hex: "#0b1329" },
      { name: "Twilight Indigo", hex: "#1e293b" },
      { name: "Starlight Silver", hex: "#e2e8f0" },
      { name: "Celestial Cyan", hex: "#38bdf8" },
      { name: "Moonlit Ice", hex: "#f8fafc" },
    ],
    styles: {
      pageBg: "bg-[#060a17]",
      radialGlow: "rgba(30, 58, 138, 0.45)",
      envelopeBoxGradient: "from-[#0f1d3b] via-[#091124] to-[#040812]",
      envelopeFlapGradient: "from-[#172c57] via-[#0f1f40] to-[#0a1429]",
      envelopePocketGradient: "from-[#081021] via-[#0f1d3b] to-[#162952]",
      envelopeBorder: "border-[#60a5fa]/70",
      waxSealGradient: "bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0b1329]",
      waxSealBorder: "border-[#93c5fd]/90",
      waxSealGlow: "rgba(96, 165, 250, 0.6)",
      waxSealText: "text-[#f0f9ff]",
      cardBg: "from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
      cardBorder: "border-[#93c5fd]",
      cornerFlourishColor: "#3b82f6",
      headerAccentColor: "#60a5fa",
      textPrimary: "#0f172a",
      textSecondary: "#334155",
      buttonShimmerGradient: "from-[#1e3a8a] via-[#2563eb] to-[#1e40af]",
      buttonText: "text-[#f0f9ff]",
      fallingDecorType: "stardust",
    },
    features: [
      "Luminescent Sapphire Wax Medallion",
      "Floating Celestial Stardust Particles",
      "Midnight Blue Parallax Envelope",
      "Starlight Auspicious Countdown",
      "Full Interactive Timeline & RSVP",
      "Crystal Chime & Orchestra Audio",
    ],
    recommendedMusicTitle: "Ethereal Moonlight Sonata & Celestial Strings",
    defaultDressCode: {
      title: "Starlight Glamour & Formal Evening",
      description: "Sophisticated formal wear in celestial shades of midnight blue, sparkling silver, slate, and shimmering accents.",
    },
  },

  "emerald-botanical": {
    id: "emerald-botanical",
    name: "Emerald Botanical",
    tagline: "Enchanted Forest Jade & Warm Champagne Gold",
    description: "Designed for garden, outdoor, and eco-luxury weddings. Lush deep emerald greens harmonious with champagne gold leaves, organic botanical curves, and soothing earthy warmth.",
    category: "botanical",
    categoryLabel: "Garden & Botanical",
    badge: "Trending",
    primaryColor: "#064e3b",
    accentColor: "#d4af37",
    palette: [
      { name: "Forest Emerald", hex: "#06231a" },
      { name: "Deep Jade", hex: "#064e3b" },
      { name: "Champagne Gold", hex: "#d4af37" },
      { name: "Botanical Cream", hex: "#f4f7f4" },
      { name: "Sage Earth", hex: "#2d6a4f" },
    ],
    styles: {
      pageBg: "bg-[#061510]",
      radialGlow: "rgba(6, 78, 59, 0.45)",
      envelopeBoxGradient: "from-[#0c2a20] via-[#071913] to-[#030d0a]",
      envelopeFlapGradient: "from-[#133d2e] via-[#0e2c21] to-[#081b14]",
      envelopePocketGradient: "from-[#05140f] via-[#0b261d] to-[#103528]",
      envelopeBorder: "border-[#d4af37]/80",
      waxSealGradient: "bg-gradient-to-br from-[#047857] via-[#064e3b] to-[#022c22]",
      waxSealBorder: "border-[#fef08a]/90",
      waxSealGlow: "rgba(212, 175, 55, 0.5)",
      waxSealText: "text-[#ecfdf5]",
      cardBg: "from-[#fbfdfb] via-[#f2f7f2] to-[#e5eee5]",
      cardBorder: "border-[#a7f3d0]",
      cornerFlourishColor: "#059669",
      headerAccentColor: "#d4af37",
      textPrimary: "#06231a",
      textSecondary: "#047857",
      buttonShimmerGradient: "from-[#064e3b] via-[#047857] to-[#065f46]",
      buttonText: "text-[#fef08a]",
      fallingDecorType: "leaves",
    },
    features: [
      "Natural Emerald & Gold Seal Crest",
      "Floating Golden Leaves & Petals",
      "Organic Vine Frame Accents",
      "Lush Botanical Countdown",
      "Integrated Directions & Navigation",
      "Acoustic Guitar Romance Audio",
    ],
    recommendedMusicTitle: "Acoustic Forest Symphony & Spanish Guitar",
    defaultDressCode: {
      title: "Garden Elegance & Earth Tones",
      description: "Semi-formal garden attire or tropical linen suits in natural tones of sage, eucalyptus, ivory, and warm champagne.",
    },
  },

  "ethereal-blush": {
    id: "ethereal-blush",
    name: "Ethereal Rose & Blush",
    tagline: "Romantic Dusty Rose & Radiant Rose Gold",
    description: "An intimate, delicate fairy-tale dreamscape. Tender pastel rose hues, shimmering rose gold calligraphy accents, and romantic fluttering cherry blossom petals.",
    category: "modern",
    categoryLabel: "Modern Luxe",
    badge: "Romantic",
    primaryColor: "#be185d",
    accentColor: "#f472b6",
    palette: [
      { name: "Dusty Rose", hex: "#be185d" },
      { name: "Pastel Blush", hex: "#fbcfe8" },
      { name: "Rose Gold", hex: "#e0a96d" },
      { name: "Silk Ivory", hex: "#fffafb" },
      { name: "Vintage Wine", hex: "#2b0a1a" },
    ],
    styles: {
      pageBg: "bg-[#140810]",
      radialGlow: "rgba(190, 24, 93, 0.35)",
      envelopeBoxGradient: "from-[#2f1120] via-[#1f0914] to-[#12040b]",
      envelopeFlapGradient: "from-[#41182c] via-[#2f1120] to-[#1a0812]",
      envelopePocketGradient: "from-[#17050e] via-[#280c1b] to-[#3a1327]",
      envelopeBorder: "border-[#f472b6]/70",
      waxSealGradient: "bg-gradient-to-br from-[#f43f5e] via-[#be185d] to-[#881337]",
      waxSealBorder: "border-[#fbcfe8]/90",
      waxSealGlow: "rgba(244, 114, 182, 0.5)",
      waxSealText: "text-[#fff1f2]",
      cardBg: "from-[#fffbfa] via-[#fdf2f4] to-[#f9e7ea]",
      cardBorder: "border-[#fbcfe8]",
      cornerFlourishColor: "#e11d48",
      headerAccentColor: "#fb7185",
      textPrimary: "#290916",
      textSecondary: "#9f1239",
      buttonShimmerGradient: "from-[#be185d] via-[#db2777] to-[#9d174d]",
      buttonText: "text-[#fff1f2]",
      fallingDecorType: "petals",
    },
    features: [
      "Rose Gold Wax Medallion Crest",
      "Floating Pink Rose Petal Rain",
      "Dreamy Soft Velvet Envelope",
      "Heartfelt Couple Story Showcase",
      "Personalized Guest Table Cards",
      "Tender Classical Violin Audio",
    ],
    recommendedMusicTitle: "Romantic Piano & Sweeping Violin Serenade",
    defaultDressCode: {
      title: "Pastel Chic & Floral Elegance",
      description: "Delicate spring and summer formal wear in blush pink, dusty rose, champagne, and soft neutral palettes.",
    },
  },

  "modern-ivory": {
    id: "modern-ivory",
    name: "Modern Obsidian & Ivory",
    tagline: "High-Fashion Minimalist & Platinum Champagne",
    description: "Sleek, avant-garde black-tie luxury. Clean geometric typography, stark obsidian contrasting against brilliant alabaster cardstock, and understated brushed champagne borders.",
    category: "modern",
    categoryLabel: "Modern Luxe",
    badge: "Minimalist",
    primaryColor: "#09090b",
    accentColor: "#d4af37",
    palette: [
      { name: "Obsidian Jet", hex: "#09090b" },
      { name: "Alabaster White", hex: "#f8fafc" },
      { name: "Platinum Champagne", hex: "#c5a059" },
      { name: "Slate Mist", hex: "#64748b" },
      { name: "Crisp Pure", hex: "#ffffff" },
    ],
    styles: {
      pageBg: "bg-[#09090b]",
      radialGlow: "rgba(197, 160, 89, 0.25)",
      envelopeBoxGradient: "from-[#1c1917] via-[#121110] to-[#0a0a0a]",
      envelopeFlapGradient: "from-[#292524] via-[#1c1917] to-[#141211]",
      envelopePocketGradient: "from-[#0f0e0d] via-[#1c1917] to-[#262322]",
      envelopeBorder: "border-[#c5a059]/80",
      waxSealGradient: "bg-gradient-to-br from-[#27272a] via-[#18181b] to-[#09090b]",
      waxSealBorder: "border-[#e4d5b7]",
      waxSealGlow: "rgba(197, 160, 89, 0.4)",
      waxSealText: "text-[#fafaf9]",
      cardBg: "from-[#ffffff] via-[#fafafa] to-[#f4f4f5]",
      cardBorder: "border-[#d4d4d8]",
      cornerFlourishColor: "#71717a",
      headerAccentColor: "#c5a059",
      textPrimary: "#09090b",
      textSecondary: "#52525b",
      buttonShimmerGradient: "from-[#18181b] via-[#27272a] to-[#09090b]",
      buttonText: "text-[#ffd700]",
      fallingDecorType: "sparkles",
    },
    features: [
      "Matte Obsidian & Platinum Wax Stamp",
      "Hairline Gilded Architectural Borders",
      "Sleek High-End Editorial Typography",
      "Minimalist Dynamic Countdown Timer",
      "Direct Google & Apple Maps Integration",
      "Smooth Contemporary Lounge Audio",
    ],
    recommendedMusicTitle: "Smooth Contemporary Piano & Ambient Cello",
    defaultDressCode: {
      title: "Black Tie & Contemporary Chic",
      description: "Sharp black-tie attire, modern tuxedos, and sleek monochrome or jewel-toned formal evening gowns.",
    },
  },
};

export const TEMPLATE_LIST: InvitationTemplate[] = Object.values(INVITATION_TEMPLATES);

/**
 * Safely resolves a template by ID, falling back to Royal Heritage if invalid or missing.
 */
export function getTemplate(id?: string | null): InvitationTemplate {
  if (!id) return INVITATION_TEMPLATES["royal-heritage"];
  return INVITATION_TEMPLATES[id] || INVITATION_TEMPLATES["royal-heritage"];
}

/**
 * Returns all templates grouped or filtered by category.
 */
export function getTemplatesByCategory(category?: string): InvitationTemplate[] {
  if (!category || category === "all") return TEMPLATE_LIST;
  return TEMPLATE_LIST.filter((t) => t.category === category);
}
