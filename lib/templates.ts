export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "classic" | "modern" | "botanical" | "celestial" | "traditional" | "luxury" | "minimalist";
  categoryLabel: string;
  badge?: string;
  primaryColor: string;
  accentColor: string;
  palette: ColorSwatch[];
  coupleDemoNames: string;
  demoDate: string;
  coverStyle: "mandala" | "arch-doors" | "wax-envelope" | "floral-silk" | "luxury-gate" | "minimalist-modern";
  previewAccentRgb?: string;
  previewImage?: string;
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
  // 1. Traditional Poruwa & Gold Mandala (Screen 1 from user photo: Nethmi & Sanuja)
  "golden-mandala-heritage": {
    id: "golden-mandala-heritage",
    name: "Golden Mandala & Silk",
    tagline: "Auspicious Poruwa Mandala & Gilded Silk Brocade",
    description: "Ornate traditional Sri Lankan aesthetic with intricate sacred mandala filigree, draping cream silk curtains, and auspicious golden typography.",
    category: "traditional",
    categoryLabel: "Traditional Sri Lankan",
    badge: "Trending in Colombo",
    primaryColor: "#c5a059",
    accentColor: "#8b1e2a",
    coupleDemoNames: "Nethmi & Sanuja",
    demoDate: "Saturday, 12th December 2026",
    coverStyle: "mandala",
    previewImage: "/images/templates/covers/golden-mandala.jpg",
    previewAccentRgb: "197, 160, 89",
    palette: [
      { name: "Gilded Mandala", hex: "#c5a059" },
      { name: "Cream Silk", hex: "#fcf8f0" },
      { name: "Crimson Maroon", hex: "#8b1e2a" },
      { name: "Warm Champagne", hex: "#edd892" },
      { name: "Antique Filigree", hex: "#9e7834" },
    ],
    styles: {
      pageBg: "bg-[#fcf8f0]",
      radialGlow: "rgba(197, 160, 89, 0.3)",
      envelopeBoxGradient: "from-[#f7eedf] via-[#efe3cc] to-[#e4d2b2]",
      envelopeFlapGradient: "from-[#edd892] via-[#dfba73] to-[#c5a059]",
      envelopePocketGradient: "from-[#e8d5b5] via-[#f2e6d3] to-[#fcf8f0]",
      envelopeBorder: "border-[#c5a059]",
      waxSealGradient: "bg-gradient-to-br from-[#c5a059] via-[#edd892] to-[#9e7834]",
      waxSealBorder: "border-[#ffd700]",
      waxSealGlow: "rgba(197, 160, 89, 0.4)",
      waxSealText: "text-[#422c07]",
      cardBg: "from-[#fffdfa] via-[#fcf8f0] to-[#f6ecda]",
      cardBorder: "border-[#c5a059]",
      cornerFlourishColor: "#c5a059",
      headerAccentColor: "#8b1e2a",
      textPrimary: "#362208",
      textSecondary: "#8a5d20",
      buttonShimmerGradient: "from-[#c5a059] via-[#dfba73] to-[#a87e2e]",
      buttonText: "text-[#362208]",
      fallingDecorType: "petals",
    },
    features: [
      "Sacred Gold Mandala Heading",
      "Draping Ivory Silk Fabric Texture",
      "Traditional Poruwa Auspicious Timings",
      "Sinhala & English Bilingual Invitation",
      "Custom Guest Salutations & Table Cards",
    ],
    recommendedMusicTitle: "Auspicious Poruwa Flute & Magul Bera",
    defaultDressCode: {
      title: "Traditional Splendor / Kandyan Silk",
      description: "Osariya or traditional national attire with ivory, gold, or champagne accents.",
    },
  },

  // 2. Botanical Silk Sage (Screen 2 from user photo: Sanduni & Ravindu)
  "botanical-silk-sanduni": {
    id: "botanical-silk-sanduni",
    name: "Botanical Silk & Gold",
    tagline: "Eucalyptus Foliage, Gold Mandala & Pure Ivory Silk",
    description: "A harmonious fusion of Sri Lankan golden mandala crest with soft watercolor eucalyptus greenery and ripples of elegant ivory satin fabric.",
    category: "botanical",
    categoryLabel: "Garden & Botanical",
    badge: "Eco-Luxury",
    primaryColor: "#2d6a4f",
    accentColor: "#c5a059",
    coupleDemoNames: "Sanduni & Ravindu",
    demoDate: "Saturday, 12th December 2026",
    coverStyle: "floral-silk",
    previewImage: "/images/templates/covers/botanical-silk.jpg",
    previewAccentRgb: "45, 106, 79",
    palette: [
      { name: "Eucalyptus Green", hex: "#2d6a4f" },
      { name: "Mandala Gold", hex: "#c5a059" },
      { name: "Soft Silk Cream", hex: "#fbfcf9" },
      { name: "Champagne Glow", hex: "#e9d8a6" },
      { name: "Sage Mist", hex: "#52796f" },
    ],
    styles: {
      pageBg: "bg-[#f8faf7]",
      radialGlow: "rgba(45, 106, 79, 0.25)",
      envelopeBoxGradient: "from-[#ecf3eb] via-[#dfebde] to-[#d3e3d2]",
      envelopeFlapGradient: "from-[#c5a059] via-[#edd892] to-[#a87e2e]",
      envelopePocketGradient: "from-[#dce9da] via-[#eaf2e9] to-[#f8faf7]",
      envelopeBorder: "border-[#2d6a4f]/60",
      waxSealGradient: "bg-gradient-to-br from-[#2d6a4f] via-[#40916c] to-[#1b4332]",
      waxSealBorder: "border-[#e9d8a6]",
      waxSealGlow: "rgba(45, 106, 79, 0.4)",
      waxSealText: "text-[#f8faf7]",
      cardBg: "from-[#ffffff] via-[#f7faf6] to-[#eef4ee]",
      cardBorder: "border-[#2d6a4f]/40",
      cornerFlourishColor: "#2d6a4f",
      headerAccentColor: "#c5a059",
      textPrimary: "#1b4332",
      textSecondary: "#40916c",
      buttonShimmerGradient: "from-[#2d6a4f] via-[#52796f] to-[#1b4332]",
      buttonText: "text-[#ffffff]",
      fallingDecorType: "leaves",
    },
    features: [
      "Watercolor Botanical Foliage Corners",
      "Gilded Auspicious Crest & Monogram",
      "Interactive Google Maps Directions",
      "Live RSVP Status with Dietary Options",
      "Guest Personalized WhatsApp Share",
    ],
    recommendedMusicTitle: "Acoustic Forest Symphony & Spanish Guitar",
    defaultDressCode: {
      title: "Garden Elegance & Earth Tones",
      description: "Semi-formal garden attire or tropical linen in natural tones of sage, ivory, and champagne.",
    },
  },

  // 3. Cathedral White Palace Doors (Screen 3 from user photo: Shenali & Rovan)
  "cathedral-palace-doors": {
    id: "cathedral-palace-doors",
    name: "Cathedral Palace Doors",
    tagline: "Grand Ivory Carved French Doors & Gilded Brass Handles",
    description: "A show-stopping interactive cathedral opening. Guests tap the antique brass door knockers as the regal double doors swing open to reveal the wedding decree.",
    category: "classic",
    categoryLabel: "Classic Royal",
    badge: "Interactive Doors",
    primaryColor: "#4a3b32",
    accentColor: "#c5a059",
    coupleDemoNames: "Kavindi & Shenal",
    demoDate: "Sunday, 27th December 2026",
    coverStyle: "arch-doors",
    previewImage: "/images/templates/covers/cathedral-doors.jpg",
    previewAccentRgb: "197, 160, 89",
    palette: [
      { name: "French Palace Ivory", hex: "#fcfaf7" },
      { name: "Carved Wood Cream", hex: "#eee6dc" },
      { name: "Antique Brass Gold", hex: "#c5a059" },
      { name: "Deep Charcoal", hex: "#2b2623" },
      { name: "Quatrefoil Gold", hex: "#edd892" },
    ],
    styles: {
      pageBg: "bg-[#fcfaf7]",
      radialGlow: "rgba(197, 160, 89, 0.3)",
      envelopeBoxGradient: "from-[#f5eee6] via-[#eae0d5] to-[#decbc0]",
      envelopeFlapGradient: "from-[#edd892] via-[#dfba73] to-[#c5a059]",
      envelopePocketGradient: "from-[#decbc0] via-[#ede4da] to-[#fcfaf7]",
      envelopeBorder: "border-[#c5a059]",
      waxSealGradient: "bg-gradient-to-br from-[#c5a059] via-[#dfba73] to-[#9e7834]",
      waxSealBorder: "border-[#ffffff]",
      waxSealGlow: "rgba(197, 160, 89, 0.4)",
      waxSealText: "text-[#2b2623]",
      cardBg: "from-[#ffffff] via-[#fbf8f4] to-[#f4eee6]",
      cardBorder: "border-[#c5a059]",
      cornerFlourishColor: "#c5a059",
      headerAccentColor: "#2b2623",
      textPrimary: "#2b2623",
      textSecondary: "#8a6d3b",
      buttonShimmerGradient: "from-[#2b2623] via-[#4a3b32] to-[#1c1815]",
      buttonText: "text-[#edd892]",
      fallingDecorType: "sparkles",
    },
    features: [
      "Interactive 3D Opening Double Cathedral Doors",
      "Antique Brass Door Handles & Quatrefoil Carvings",
      "Cathedral Organ & Romantic Strings Audio",
      "Church Nuptials & Sacred Mass Schedules",
      "Table Seating Arrangement Cards",
    ],
    recommendedMusicTitle: "Pachelbel Canon in D & Royal Strings",
    defaultDressCode: {
      title: "Black Tie & Elegant Church Attire",
      description: "Sophisticated formal evening wear, dark suits or tuxedos, and graceful long gowns.",
    },
  },

  // 4. Tuscan Villa Romance (Sophia & Marcus)
  "embossed-ivory-envelope": {
    id: "embossed-ivory-envelope",
    name: "Tuscan Villa Romance",
    tagline: "Italian Riviera Fresco, Terracotta Rose & Lake Como Splendor",
    description: "Inspired by sun-drenched Italian lake villas. Elegant fresco architecture, warm terracotta rose accents, alternating love story years, and classic Roman typography.",
    category: "luxury",
    categoryLabel: "Italian Villa",
    badge: "Riviera Luxe",
    primaryColor: "#5c1c2e",
    accentColor: "#dfba73",
    coupleDemoNames: "Sophia & Marcus",
    demoDate: "Saturday, 24th October 2026",
    coverStyle: "wax-envelope",
    previewImage: "/images/templates/covers/tuscan-villa.jpg",
    previewAccentRgb: "155, 67, 86",
    palette: [
      { name: "Pearl Cotton Paper", hex: "#f9f8f5" },
      { name: "Debossed Shadow", hex: "#e7e4dc" },
      { name: "Champagne Wax", hex: "#d6a97a" },
      { name: "Sepia Slate", hex: "#574d43" },
      { name: "Soft Silk Ribbon", hex: "#faf5ed" },
    ],
    styles: {
      pageBg: "bg-[#f9f8f5]",
      radialGlow: "rgba(214, 169, 122, 0.3)",
      envelopeBoxGradient: "from-[#f2eee7] via-[#e5ded3] to-[#d8d0c2]",
      envelopeFlapGradient: "from-[#f9f8f5] via-[#eee7db] to-[#e0d7c7]",
      envelopePocketGradient: "from-[#ded6c7] via-[#ece4d7] to-[#f9f8f5]",
      envelopeBorder: "border-[#d6a97a]/50",
      waxSealGradient: "bg-gradient-to-br from-[#edd892] via-[#d6a97a] to-[#ab8055]",
      waxSealBorder: "border-[#ffffff]",
      waxSealGlow: "rgba(214, 169, 122, 0.5)",
      waxSealText: "text-[#403426]",
      cardBg: "from-[#ffffff] via-[#faf8f5] to-[#f3efe8]",
      cardBorder: "border-[#e0d7c7]",
      cornerFlourishColor: "#d6a97a",
      headerAccentColor: "#574d43",
      textPrimary: "#403426",
      textSecondary: "#8a7560",
      buttonShimmerGradient: "from-[#574d43] via-[#75685a] to-[#403426]",
      buttonText: "text-[#ffffff]",
      fallingDecorType: "petals",
    },
    features: [
      "Tactile 3D Floral Blind-Deboss Texture",
      "Botanical Olive Branch Wax Medallion",
      "Interactive Wax Peeling & Flap Unfolding Animation",
      "Clean Minimalist Editorial Typography",
      "Personalized Guest Table Cards & QR Access",
    ],
    recommendedMusicTitle: "Romantic Acoustic Piano Serenade",
    defaultDressCode: {
      title: "Neutral Elegance & Champagne Tones",
      description: "Classy cocktail or formal attire in warm neutral shades of beige, champagne, and ivory.",
    },
  },

  // 5. Royal Velvet Crimson & Gold (Our Signature Classic)
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
    coupleDemoNames: "Kasun & Dinithi",
    demoDate: "Saturday, 28th November 2026",
    coverStyle: "wax-envelope",
    previewImage: "/images/templates/covers/royal-heritage.jpg",
    previewAccentRgb: "223, 186, 115",
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

  // 6. Celestial Midnight Sapphire
  "celestial-midnight": {
    id: "celestial-midnight",
    name: "Celestial Midnight",
    tagline: "Starry Twilight Sapphire & Luminescent Silver",
    description: "An enchanting evening wedding celebration under the starlit sky. Rich midnight navy and indigo textures infused with glittering diamond stardust and radiant silver filigrees.",
    category: "celestial",
    categoryLabel: "Evening & Celestial",
    badge: "Night Romance",
    primaryColor: "#0f172a",
    accentColor: "#38bdf8",
    coupleDemoNames: "Akash & Tara",
    demoDate: "Friday, 18th December 2026",
    coverStyle: "wax-envelope",
    previewImage: "/images/templates/covers/celestial-midnight.jpg",
    previewAccentRgb: "56, 189, 248",
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

  // 7. Ethereal Blush & Cherry Blossoms
  "ethereal-blush": {
    id: "ethereal-blush",
    name: "Ethereal Rose & Blush",
    tagline: "Romantic Dusty Rose & Radiant Rose Gold",
    description: "An intimate, delicate fairy-tale dreamscape. Tender pastel rose hues, shimmering rose gold calligraphy accents, and romantic fluttering cherry blossom petals.",
    category: "modern",
    categoryLabel: "Modern Luxe",
    badge: "Fairy Tale",
    primaryColor: "#be185d",
    accentColor: "#f472b6",
    coupleDemoNames: "Nisali & Tharindu",
    demoDate: "Sunday, 14th February 2027",
    coverStyle: "floral-silk",
    previewImage: "/images/templates/covers/ethereal-blush.jpg",
    previewAccentRgb: "244, 114, 182",
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

  // 8. Modern Obsidian & Ivory
  "modern-ivory": {
    id: "modern-ivory",
    name: "Modern Obsidian & Ivory",
    tagline: "High-Fashion Minimalist & Platinum Champagne",
    description: "Sleek, avant-garde black-tie luxury. Clean geometric typography, stark obsidian contrasting against brilliant alabaster cardstock, and understated brushed champagne borders.",
    category: "minimalist",
    categoryLabel: "Minimalist Luxe",
    badge: "Editorial Chic",
    primaryColor: "#09090b",
    accentColor: "#d4af37",
    coupleDemoNames: "Malik & Sara",
    demoDate: "Saturday, 5th June 2027",
    coverStyle: "minimalist-modern",
    previewImage: "/images/templates/covers/modern-ivory.jpg",
    previewAccentRgb: "212, 175, 55",
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

  // 8. Blush Floral & Coastal Romance (Sachin & Kavindi - Matching user's exact uploaded design)
  "velvet-homecoming": {
    id: "velvet-homecoming",
    name: "Blush Floral Romance",
    tagline: "Pastel English Roses, White Anemones & Hikkaduwa Beach Sunset",
    description: "A romantic seaside celebration framed in watercolor pastel English roses, creamy white anemones, eucalyptus greens, and classic typography.",
    category: "luxury",
    categoryLabel: "Blush Floral Romance",
    badge: "Trending Romance",
    primaryColor: "#8a3b53",
    accentColor: "#d6a57c",
    coupleDemoNames: "Sachin & Kavindi",
    demoDate: "Saturday, 14th November 2026",
    coverStyle: "wax-envelope",
    previewImage: "/images/templates/covers/blush-floral.jpg",
    previewAccentRgb: "84, 18, 33",
    palette: [
      { name: "Burgundy Dahlia", hex: "#541221" },
      { name: "Vintage Cream", hex: "#faf5eb" },
      { name: "Gilded Gold", hex: "#c5a059" },
      { name: "Crimson Butterfly", hex: "#b91c1c" },
    ],
    styles: {
      pageBg: "bg-[#fffdfa]",
      radialGlow: "rgba(84, 18, 33, 0.45)",
      envelopeBoxGradient: "from-[#380612] via-[#541221] to-[#25040b]",
      envelopeFlapGradient: "from-[#6e162a] via-[#541221] to-[#380612]",
      envelopePocketGradient: "from-[#25040b] via-[#380612] to-[#541221]",
      envelopeBorder: "border-[#c5a059]",
      waxSealGradient: "bg-gradient-to-br from-[#73172c] via-[#541221] to-[#360914]",
      waxSealBorder: "border-[#c5a059]",
      waxSealGlow: "rgba(197, 160, 89, 0.5)",
      waxSealText: "text-[#ffd700]",
      cardBg: "from-[#fffdfa] via-[#faf5eb] to-[#f4ebe0]",
      cardBorder: "border-[#c5a059]",
      cornerFlourishColor: "#c5a059",
      headerAccentColor: "#541221",
      textPrimary: "#3b1720",
      textSecondary: "#7a4855",
      buttonShimmerGradient: "from-[#541221] via-[#73172c] to-[#380612]",
      buttonText: "text-[#edd892]",
      fallingDecorType: "petals",
    },
    features: [
      "Velvet Burgundy Dahlia & Floral Border Accents",
      "Fluttering Red Butterfly Details",
      "Interactive Joyfully Accept / Regretfully Decline RSVP",
      "Guest Number Selector with Send Button",
      "Water's Edge Battaramulla Google Maps Integration",
      "Atmospheric Cinematic Background Instrumental",
    ],
    recommendedMusicTitle: "Enchanted Strings & Romantic Flute Melody",
    defaultDressCode: {
      title: "Formal Evening / Black Tie or Rich Jewel Tones",
      description: "Guests are warmly encouraged to wear deep burgundy, ruby, emerald, or sophisticated evening wear.",
    },
  },
};

export const TEMPLATE_LIST: InvitationTemplate[] = Object.values(INVITATION_TEMPLATES);

/**
 * Safely resolves a template by ID, falling back to Golden Mandala or Royal Heritage if invalid or missing.
 */
export function getTemplate(id?: string | null): InvitationTemplate {
  if (!id) return INVITATION_TEMPLATES["golden-mandala-heritage"] || INVITATION_TEMPLATES["royal-heritage"];
  if (INVITATION_TEMPLATES[id]) return INVITATION_TEMPLATES[id];

  // Map preset IDs to catalog templates
  if (id === "velvet-homecoming" || id === "homecoming-reception" || id === "amaya-and-dinuka") {
    return INVITATION_TEMPLATES["velvet-homecoming"];
  }
  if (id === "nilame-traditional") return INVITATION_TEMPLATES["golden-mandala-heritage"];
  if (id === "emerald-elegance") return INVITATION_TEMPLATES["botanical-silk-sanduni"];
  if (id === "modern-floral-romance") return INVITATION_TEMPLATES["embossed-ivory-envelope"];

  return INVITATION_TEMPLATES["golden-mandala-heritage"] || INVITATION_TEMPLATES["royal-heritage"];
}

/**
 * Returns all templates grouped or filtered by category.
 */
export function getTemplatesByCategory(category?: string): InvitationTemplate[] {
  if (!category || category === "all") return TEMPLATE_LIST;
  return TEMPLATE_LIST.filter((t) => t.category === category);
}

/**
 * Mapping of numeric indices (invite1, invite2...) and short slugs to actual template IDs.
 */
export const TEMPLATE_ENDPOINT_MAP: Record<string, string> = {
  "1": "golden-mandala-heritage",
  "2": "botanical-silk-sanduni",
  "3": "cathedral-palace-doors",
  "4": "embossed-ivory-envelope",
  "5": "velvet-homecoming",
  "6": "modern-ivory",
  "7": "celestial-midnight",
  "8": "ethereal-blush",
  "9": "royal-heritage",
  // Common aliases & short slugs
  "mandala": "golden-mandala-heritage",
  "poruwa": "golden-mandala-heritage",
  "traditional": "golden-mandala-heritage",
  "botanical": "botanical-silk-sanduni",
  "eucalyptus": "botanical-silk-sanduni",
  "cathedral": "cathedral-palace-doors",
  "church": "cathedral-palace-doors",
  "doors": "cathedral-palace-doors",
  "embossed": "embossed-ivory-envelope",
  "ivory": "embossed-ivory-envelope",
  "velvet": "velvet-homecoming",
  "homecoming": "velvet-homecoming",
  "modern": "modern-ivory",
  "obsidian": "modern-ivory",
  "minimalist": "modern-ivory",
  "celestial": "celestial-midnight",
  "midnight": "celestial-midnight",
  "starlight": "celestial-midnight",
  "blush": "ethereal-blush",
  "ethereal": "ethereal-blush",
  "rose": "ethereal-blush",
  "royal": "royal-heritage",
};

export function resolveTemplateIdFromParam(param?: string | null): string | undefined {
  if (!param) return undefined;
  const clean = param.toLowerCase().trim();
  if (TEMPLATE_ENDPOINT_MAP[clean]) return TEMPLATE_ENDPOINT_MAP[clean];
  if (INVITATION_TEMPLATES[clean]) return clean;
  return undefined;
}

export const TEMPLATE_TO_ENDPOINT_NUMBER: Record<string, number> = {
  "golden-mandala-heritage": 1,
  "botanical-silk-sanduni": 2,
  "cathedral-palace-doors": 3,
  "embossed-ivory-envelope": 4,
  "velvet-homecoming": 5,
  "modern-ivory": 6,
  "celestial-midnight": 7,
  "ethereal-blush": 8,
  "royal-heritage": 9,
};


