export interface ColorSwatch {
  name: string;
  hex: string;
}

export type WeddingEventScheduleItem = {
  time: string;
  title: string;
  description: string;
  iconName?: string;
  isNekath?: boolean;
};

export type StoryMilestone = {
  year: string;
  title: string;
  description: string;
};

export type GalleryPhoto = {
  url: string;
  caption: string;
  alt: string;
};

export interface WeddingDataPayload {
  coupleNames: string;
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  eventDate: string; // ISO or YYYY-MM-DD
  nekathTime: string; // e.g. "09:18 AM"
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl?: string;
  heroPhoto: string;
  heroGreeting?: string;
  heroSubtitle?: string;
  coupleSubtitle?: string;
  vowQuote?: string;
  cartoonCoupleArt?: string;
  peraheraFrieze?: string;
  story: StoryMilestone[];
  schedules: WeddingEventScheduleItem[];
  gallery: GalleryPhoto[];
  musicUrl: string;
  musicTitle: string;
  dressCodeTitle: string;
  dressCodeDescription: string;
  hashtag?: string;
}

export interface WedLinkTemplateTheme {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "traditional" | "botanical" | "romance" | "royal" | "modern" | "classic" | "celestial" | "luxury";
  categoryLabel: string;
  badge?: string;
  
  // 1. Typography Definition
  typography: {
    headingFont: string;
    scriptFont: string;
    bodyFont: string;
    auspiciousSin: string;
  };

  // 2. Color Palette
  palette: {
    primary: string;
    secondary: string;
    goldAccent: string;
    goldLight: string;
    bgPage: string;
    bgCard: string;
    textPrimary: string;
    textMuted: string;
    borderGlow: string;
    swatches: ColorSwatch[];
  };

  // 3. Motifs & Visual Patterns
  motifs: {
    patternType: "liyawela" | "emerald-leaves" | "blush-petals" | "quatrefoil" | "velvet-flora" | "celestial-stars" | "royal-fleur";
    cornerFlourish: string;
    borderStyle: string;
    curtainSilkOverlay?: boolean;
    backdropBanner?: string;
  };

  // 4. Envelope & Wax Seal
  envelope: {
    style: "nilame-maroon" | "emerald-foil" | "pearl-blush" | "velvet-burgundy" | "cathedral-brass" | "celestial-sapphire" | "royal-crimson";
    waxColor: string;
    waxBorder: string;
    waxSealSymbol: "crown" | "mandala" | "heart" | "monogram" | "butterfly" | "star";
    stampLabel: string;
    flapColor: string;
    confettiColors: string[];
  };

  // Default sample dataset for this template
  sampleData: WeddingDataPayload;
}

export const WEDLINK_TEMPLATES: Record<string, WedLinkTemplateTheme> = {
  // =========================================================================
  // 1. TRADITIONAL PORUWA & GOLD MANDALA (Nethmi & Sanuja)
  // =========================================================================
  "golden-mandala-heritage": {
    id: "golden-mandala-heritage",
    name: "Golden Mandala & Silk",
    tagline: "Auspicious Poruwa Mandala & Gilded Silk Brocade",
    description: "Honoring ancient Sri Lankan wedding customs. Rich Kandyan maroon velvet, imperial gold leaf borders, sacred Poruwa Nekath timestamps, and auspicious Sinhala blessings.",
    category: "traditional",
    categoryLabel: "Kandyan Royal",
    badge: "Most Popular in SL",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#6b0f24",
      secondary: "#380612",
      goldAccent: "#c5a059",
      goldLight: "#edd892",
      bgPage: "bg-[#fffdfa]",
      bgCard: "bg-[#fcf7ee]",
      textPrimary: "#29151c",
      textMuted: "#7a5763",
      borderGlow: "rgba(197, 160, 89, 0.4)",
      swatches: [
        { name: "Kandyan Maroon", hex: "#6b0f24" },
        { name: "Gilded Gold", hex: "#c5a059" },
        { name: "Antique Ivory", hex: "#fffdfa" },
        { name: "Champagne Glow", hex: "#edd892" },
      ],
    },
    motifs: {
      patternType: "liyawela",
      cornerFlourish: "⚜",
      borderStyle: "border-[#c5a059]",
      curtainSilkOverlay: true,
    },
    envelope: {
      style: "nilame-maroon",
      waxColor: "bg-gradient-to-br from-[#800020] via-[#6b0f24] to-[#420614]",
      waxBorder: "border-[#ffd700]",
      waxSealSymbol: "mandala",
      stampLabel: "PORUWA SEAL",
      flapColor: "from-[#4a0818] via-[#6b0f24] to-[#360511]",
      confettiColors: ["#c5a059", "#ffd700", "#6b0f24", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Nethmi & Sanuja",
      groomName: "Sanuja Fernando",
      brideName: "Nethmi Rajapaksha",
      groomParents: "Son of Mr. & Mrs. Fernando",
      brideParents: "Daughter of Mr. & Mrs. Rajapaksha",
      eventDate: "2026-12-12",
      nekathTime: "10:00 AM",
      venueName: "The Grand Kandyan, Kandy",
      venueAddress: "89/10 Lady Gordon's Drive, Kandy, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=The+Grand+Kandyan+Kandy",
      heroPhoto: "/images/templates/kandyan/couple-art.png",
      cartoonCoupleArt: "/images/templates/kandyan/couple-art.png",
      peraheraFrieze: "/images/templates/kandyan/perahera-frieze.png",
      heroGreeting: "ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM!",
      heroSubtitle: "YOU ARE INVITED TO THE AUSPICIOUS PORUWA CEREMONY OF",
      coupleSubtitle: "Daughter of Mr. & Mrs. Rajapaksha • Son of Mr. & Mrs. Fernando",
      vowQuote: "May the sacred Poruwa blessings illuminate our path together forever.",
      story: [
        {
          year: "2020",
          title: "The Auspicious First Encounter",
          description: "Crossed paths at the University of Colombo annual gala under starry December lights.",
        },
        {
          year: "2023",
          title: "Growing Together",
          description: "Endless tea conversations across Galle Face Green and hiking through the misty Knuckles peaks.",
        },
        {
          year: "2025",
          title: "Forever Begins",
          description: "On a sunset stroll along Mirissa bay, with the blessings of our parents, we promised forever.",
        },
      ],
      schedules: [
        {
          time: "08:45 AM",
          title: "Arrival of Groom & Relatives",
          description: "Welcome accompaniment with traditional Kandyan Magul Bera drummers and jasmine garlands.",
        },
        {
          time: "10:00 AM",
          title: "Sacred Poruwa Ceremony",
          description: "Auspicious Nekath moment: Chanting of Mangala Jayamangala Gatha, exchange of rings & tying of Pirith Nool.",
          isNekath: true,
        },
        {
          time: "11:15 AM",
          title: "State Civil Registration",
          description: "Official signing of the state marriage register witnessed by beloved family mentors.",
        },
        {
          time: "12:30 PM",
          title: "Grand Banquet & Toast",
          description: "Cutting of the wedding cake, royal buffet feast, and afternoon celebration with live flute serenade.",
        },
      ],
      gallery: [
        {
          url: "/images/templates/kandyan/gallery-1.png",
          caption: "Sun-dappled pre-shoot in scenic Ceylon tea hills",
          alt: "Couple smiling in scenic green hills",
        },
        {
          url: "/images/templates/kandyan/gallery-2.png",
          caption: "Together overlooking misty mountain peaks",
          alt: "Couple embracing in mountain scenery",
        },
        {
          url: "/images/templates/kandyan/gallery-3.png",
          caption: "Intimate golden embrace in pine forest",
          alt: "Couple in pine forest",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Traditional Sri Lankan Flute & Sacred Magul Bera (Instrumental)",
      dressCodeTitle: "Traditional Kandyan Splendor or Black Tie",
      dressCodeDescription: "Guests are warmly invited to wear traditional sarees/national wear or elegant formal evening attire in gold and maroon hues.",
      hashtag: "#NethmiWedsSanuja2026",
    },
  },

  // Alias for legacy calls
  "nilame-traditional": {
    id: "nilame-traditional",
    name: "Nilame Traditional / Kandyan Royal",
    tagline: "Sacred Liya-wela Filigree & Imperial Kandyan Maroon",
    description: "Honoring ancient Sri Lankan wedding customs. Rich Kandyan maroon velvet, imperial gold leaf borders, sacred Poruwa Nekath timestamps, and auspicious Sinhala blessings.",
    category: "traditional",
    categoryLabel: "Kandyan Royal",
    badge: "Most Popular in SL",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#6b0f24",
      secondary: "#380612",
      goldAccent: "#c5a059",
      goldLight: "#edd892",
      bgPage: "bg-[#fffdfa]",
      bgCard: "bg-[#fcf7ee]",
      textPrimary: "#29151c",
      textMuted: "#7a5763",
      borderGlow: "rgba(197, 160, 89, 0.4)",
      swatches: [
        { name: "Kandyan Maroon", hex: "#6b0f24" },
        { name: "Gilded Gold", hex: "#c5a059" },
        { name: "Antique Ivory", hex: "#fffdfa" },
        { name: "Champagne Glow", hex: "#edd892" },
      ],
    },
    motifs: {
      patternType: "liyawela",
      cornerFlourish: "⚜",
      borderStyle: "border-[#c5a059]",
      curtainSilkOverlay: true,
    },
    envelope: {
      style: "nilame-maroon",
      waxColor: "bg-gradient-to-br from-[#800020] via-[#6b0f24] to-[#420614]",
      waxBorder: "border-[#ffd700]",
      waxSealSymbol: "mandala",
      stampLabel: "PORUWA SEAL",
      flapColor: "from-[#4a0818] via-[#6b0f24] to-[#360511]",
      confettiColors: ["#c5a059", "#ffd700", "#6b0f24", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Nethmi & Sanuja",
      groomName: "Sanuja Fernando",
      brideName: "Nethmi Rajapaksha",
      groomParents: "Son of Mr. & Mrs. Fernando",
      brideParents: "Daughter of Mr. & Mrs. Rajapaksha",
      eventDate: "2026-12-12",
      nekathTime: "10:00 AM",
      venueName: "The Grand Kandyan, Kandy",
      venueAddress: "89/10 Lady Gordon's Drive, Kandy, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=The+Grand+Kandyan+Kandy",
      heroPhoto: "/images/templates/kandyan/couple-art.png",
      cartoonCoupleArt: "/images/templates/kandyan/couple-art.png",
      peraheraFrieze: "/images/templates/kandyan/perahera-frieze.png",
      heroGreeting: "ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM!",
      heroSubtitle: "YOU ARE INVITED TO THE AUSPICIOUS PORUWA CEREMONY OF",
      coupleSubtitle: "Daughter of Mr. & Mrs. Rajapaksha • Son of Mr. & Mrs. Fernando",
      vowQuote: "May the sacred Poruwa blessings illuminate our path together forever.",
      story: [
        {
          year: "2020",
          title: "The Auspicious First Encounter",
          description: "Crossed paths at the University of Colombo annual gala under starry December lights.",
        },
        {
          year: "2023",
          title: "Growing Together",
          description: "Endless tea conversations across Galle Face Green and hiking through the misty Knuckles peaks.",
        },
        {
          year: "2025",
          title: "Forever Begins",
          description: "On a sunset stroll along Mirissa bay, with the blessings of our parents, we promised forever.",
        },
      ],
      schedules: [
        {
          time: "08:45 AM",
          title: "Arrival of Groom & Relatives",
          description: "Welcome accompaniment with traditional Kandyan Magul Bera drummers and jasmine garlands.",
        },
        {
          time: "10:00 AM",
          title: "Sacred Poruwa Ceremony",
          description: "Auspicious Nekath moment: Chanting of Mangala Jayamangala Gatha, exchange of rings & tying of Pirith Nool.",
          isNekath: true,
        },
        {
          time: "11:15 AM",
          title: "State Civil Registration",
          description: "Official signing of the state marriage register witnessed by beloved family mentors.",
        },
        {
          time: "12:30 PM",
          title: "Grand Banquet & Toast",
          description: "Cutting of the wedding cake, royal buffet feast, and afternoon celebration with live flute serenade.",
        },
      ],
      gallery: [
        {
          url: "/images/templates/kandyan/gallery-1.png",
          caption: "Sun-dappled pre-shoot in scenic Ceylon tea hills",
          alt: "Couple smiling in scenic green hills",
        },
        {
          url: "/images/templates/kandyan/gallery-2.png",
          caption: "Together overlooking misty mountain peaks",
          alt: "Couple embracing in mountain scenery",
        },
        {
          url: "/images/templates/kandyan/gallery-3.png",
          caption: "Intimate golden embrace in pine forest",
          alt: "Couple in pine forest",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Traditional Sri Lankan Flute & Sacred Magul Bera (Instrumental)",
      dressCodeTitle: "Traditional Kandyan Splendor or Black Tie",
      dressCodeDescription: "Guests are warmly invited to wear traditional sarees/national wear or elegant formal evening attire in gold and maroon hues.",
      hashtag: "#NethmiWedsSanuja2026",
    },
  },

  // =========================================================================
  // 2. BOTANICAL SILK & GOLD (Sanduni & Ravindu)
  // =========================================================================
  "botanical-silk-sanduni": {
    id: "botanical-silk-sanduni",
    name: "Botanical Silk & Gold",
    tagline: "Eucalyptus Foliage, Gold Mandala & Pure Ivory Silk",
    description: "A harmonious fusion of Sri Lankan golden accents with watercolor eucalyptus greenery and ripples of elegant ivory silk.",
    category: "botanical",
    categoryLabel: "Garden & Eco-Luxe",
    badge: "Eco-Luxury",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#14422e",
      secondary: "#092518",
      goldAccent: "#d4af37",
      goldLight: "#f3e5ab",
      bgPage: "bg-[#fbfcfb]",
      bgCard: "bg-[#f2f7f3]",
      textPrimary: "#0d2b1d",
      textMuted: "#3a6550",
      borderGlow: "rgba(212, 175, 55, 0.4)",
      swatches: [
        { name: "Forest Emerald", hex: "#14422e" },
        { name: "Champagne Gold", hex: "#d4af37" },
        { name: "Botanical Cream", hex: "#fbfcfb" },
        { name: "Sage Mist", hex: "#749b86" },
      ],
    },
    motifs: {
      patternType: "emerald-leaves",
      cornerFlourish: "❦",
      borderStyle: "border-[#d4af37]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "emerald-foil",
      waxColor: "bg-gradient-to-br from-[#1b5e3f] via-[#14422e] to-[#0a271a]",
      waxBorder: "border-[#d4af37]",
      waxSealSymbol: "crown",
      stampLabel: "ROYAL CREST",
      flapColor: "from-[#0a271a] via-[#14422e] to-[#1b5e3f]",
      confettiColors: ["#14422e", "#d4af37", "#a3e635", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Sanduni & Ravindu",
      groomName: "Ravindu Jayasuriya",
      brideName: "Sanduni Alwis",
      groomParents: "Son of Mr. & Mrs. Ranjith Jayasuriya",
      brideParents: "Daughter of Mr. & Mrs. Rohan Alwis",
      eventDate: "2026-12-12",
      nekathTime: "10:24 AM",
      venueName: "The Secret Garden Pavilion, Kandy",
      venueAddress: "Heerassagala Road, Kandy, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=The+Secret+Garden+Kandy",
      heroPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "THE WEDDING CELEBRATION OF",
      heroSubtitle: "JOIN US AMIDST BLOSSOMS & GREENERY AS WE CELEBRATE OUR LOVE",
      coupleSubtitle: "Daughter of Mr. & Mrs. Rohan Alwis • Son of Mr. & Mrs. Ranjith Jayasuriya",
      vowQuote: "Two souls entwined, blooming together for a lifetime in nature's grace.",
      story: [
        {
          year: "2021",
          title: "Coffee in Colombo 07",
          description: "A spontaneous rainy afternoon cafe meetup that turned into an unforgettable 5-hour conversation.",
        },
        {
          year: "2023",
          title: "Adventures Across Sri Lanka",
          description: "Camping under starry skies in Ella and watching whales breach along Mirissa bay.",
        },
        {
          year: "2025",
          title: "The Mountain Proposal",
          description: "Surrounded by misty green tea estates, Ravindu asked the question that changed our lives.",
        },
      ],
      schedules: [
        {
          time: "09:30 AM",
          title: "Garden Gathering & Welcome Punch",
          description: "Acoustic strings welcome with fresh king coconut & cinnamon iced tea.",
        },
        {
          time: "10:24 AM",
          title: "Auspicious Vows & Poruwa",
          description: "Ceremony overlooking the misty Hanthana mountain range.",
          isNekath: true,
        },
        {
          time: "12:00 PM",
          title: "Garden Lawn Reception & Toast",
          description: "Live acoustic Spanish guitar, curated Ceylon fusion lunch, and celebratory cocktails.",
        },
        {
          time: "04:30 PM",
          title: "Homecoming Departure",
          description: "Farewell blessings and evening departure amidst sparkler lights.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          caption: "Sun-dappled afternoon in Hanthana hills",
          alt: "Couple laughing outdoors",
        },
        {
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
          caption: "Tea estate sunset embrace",
          alt: "Couple against lush green tea hills",
        },
        {
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
          caption: "The promise of forever",
          alt: "Close up of rings and hands",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Enchanted Garden Acoustic Guitar & Cello Romance",
      dressCodeTitle: "Garden Elegance & Earth Tones",
      dressCodeDescription: "Semi-formal garden attire or tropical linen suits in natural shades of sage, eucalyptus, ivory, and warm champagne.",
      hashtag: "#SanduniFoundHerRavi",
    },
  },

  // Alias for emerald elegance
  "emerald-elegance": {
    id: "emerald-elegance",
    name: "Emerald Elegance",
    tagline: "Rich Forest Jade & Warm Gilded Champagne Foil",
    description: "Designed for garden weddings and luxury outdoor celebrations. Lush forest emerald tones infused with radiant gold foil botanical borders and soothing acoustics.",
    category: "botanical",
    categoryLabel: "Garden & Eco-Luxe",
    badge: "Trending in Kandy",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#14422e",
      secondary: "#092518",
      goldAccent: "#d4af37",
      goldLight: "#f3e5ab",
      bgPage: "bg-[#fbfcfb]",
      bgCard: "bg-[#f2f7f3]",
      textPrimary: "#0d2b1d",
      textMuted: "#3a6550",
      borderGlow: "rgba(212, 175, 55, 0.4)",
      swatches: [
        { name: "Forest Emerald", hex: "#14422e" },
        { name: "Champagne Gold", hex: "#d4af37" },
        { name: "Botanical Cream", hex: "#fbfcfb" },
        { name: "Sage Mist", hex: "#749b86" },
      ],
    },
    motifs: {
      patternType: "emerald-leaves",
      cornerFlourish: "❦",
      borderStyle: "border-[#d4af37]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "emerald-foil",
      waxColor: "bg-gradient-to-br from-[#1b5e3f] via-[#14422e] to-[#0a271a]",
      waxBorder: "border-[#d4af37]",
      waxSealSymbol: "crown",
      stampLabel: "ROYAL CREST",
      flapColor: "from-[#0a271a] via-[#14422e] to-[#1b5e3f]",
      confettiColors: ["#14422e", "#d4af37", "#a3e635", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Sanduni & Ravindu",
      groomName: "Ravindu Jayasuriya",
      brideName: "Sanduni Alwis",
      groomParents: "Son of Mr. & Mrs. Ranjith Jayasuriya",
      brideParents: "Daughter of Mr. & Mrs. Rohan Alwis",
      eventDate: "2026-12-12",
      nekathTime: "10:24 AM",
      venueName: "The Secret Garden Pavilion, Kandy",
      venueAddress: "Heerassagala Road, Kandy, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=The+Secret+Garden+Kandy",
      heroPhoto: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "THE WEDDING CELEBRATION OF",
      heroSubtitle: "JOIN US AMIDST BLOSSOMS & GREENERY AS WE CELEBRATE OUR LOVE",
      coupleSubtitle: "Daughter of Mr. & Mrs. Rohan Alwis • Son of Mr. & Mrs. Ranjith Jayasuriya",
      vowQuote: "Two souls entwined, blooming together for a lifetime.",
      story: [
        {
          year: "2021",
          title: "Coffee in Colombo 07",
          description: "A spontaneous rainy afternoon cafe meetup that turned into an unforgettable 5-hour conversation.",
        },
        {
          year: "2023",
          title: "Adventures Across Sri Lanka",
          description: "Camping under starry skies in Ella and watching whales breach in Mirissa.",
        },
        {
          year: "2025",
          title: "The Mountain Proposal",
          description: "Surrounded by misty green tea estates, Ravindu asked the question that changed our lives.",
        },
      ],
      schedules: [
        {
          time: "09:30 AM",
          title: "Garden Gathering & Welcome Punch",
          description: "Acoustic strings welcome with fresh king coconut & cinnamon iced tea.",
        },
        {
          time: "10:24 AM",
          title: "Auspicious Vows & Poruwa",
          description: "Ceremony overlooking the misty Hanthana mountain range.",
          isNekath: true,
        },
        {
          time: "12:00 PM",
          title: "Garden Lawn Reception & Toast",
          description: "Live acoustic Spanish guitar, curated Ceylon fusion lunch, and celebratory cocktails.",
        },
        {
          time: "04:30 PM",
          title: "Homecoming Departure",
          description: "Farewell blessings and evening departure amidst sparkler lights.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          caption: "Sun-dappled afternoon in Hanthana hills",
          alt: "Couple laughing outdoors",
        },
        {
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
          caption: "Tea estate sunset embrace",
          alt: "Couple against lush green tea hills",
        },
        {
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
          caption: "The promise of forever",
          alt: "Close up of rings and hands",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Enchanted Garden Acoustic Guitar & Cello Romance",
      dressCodeTitle: "Garden Elegance & Earth Tones",
      dressCodeDescription: "Semi-formal garden attire or tropical linen suits in natural shades of sage, eucalyptus, ivory, and warm champagne.",
      hashtag: "#SanduniFoundHerRavi",
    },
  },

  // =========================================================================
  // 3. CATHEDRAL PALACE DOORS (Shenali & Rovan)
  // =========================================================================
  "cathedral-palace-doors": {
    id: "cathedral-palace-doors",
    name: "Cathedral Palace Doors",
    tagline: "Grand Ivory Carved French Doors & Gilded Brass Handles",
    description: "A show-stopping interactive cathedral opening. Guests tap the antique brass door knockers as the regal double doors swing open to reveal the royal nuptials.",
    category: "classic",
    categoryLabel: "Classic Royal",
    badge: "Interactive Doors",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#2b2623",
      secondary: "#1c1815",
      goldAccent: "#c5a059",
      goldLight: "#edd892",
      bgPage: "bg-[#fcfaf7]",
      bgCard: "bg-[#f4eee6]",
      textPrimary: "#2b2623",
      textMuted: "#8a6d3b",
      borderGlow: "rgba(197, 160, 89, 0.4)",
      swatches: [
        { name: "French Palace Ivory", hex: "#fcfaf7" },
        { name: "Carved Wood Cream", hex: "#eee6dc" },
        { name: "Antique Brass Gold", hex: "#c5a059" },
        { name: "Deep Charcoal", hex: "#2b2623" },
      ],
    },
    motifs: {
      patternType: "quatrefoil",
      cornerFlourish: "⚜",
      borderStyle: "border-[#c5a059]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "cathedral-brass",
      waxColor: "bg-gradient-to-br from-[#c5a059] via-[#dfba73] to-[#9e7834]",
      waxBorder: "border-[#ffffff]",
      waxSealSymbol: "crown",
      stampLabel: "ROYAL DECREE",
      flapColor: "from-[#2b2623] via-[#3d332c] to-[#1c1815]",
      confettiColors: ["#c5a059", "#edd892", "#2b2623", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Kavindi & Shenal",
      groomName: "Shenal Fernando",
      brideName: "Kavindi De Silva",
      groomParents: "Son of Mr. & Mrs. Fernando",
      brideParents: "Daughter of Mr. & Mrs. De Silva",
      eventDate: "2026-12-27",
      nekathTime: "05:00 PM",
      venueName: "The Grand Ballroom, Galle Face Hotel",
      venueAddress: "2 Galle Road, Colombo 03, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Galle+Face+Hotel+Colombo",
      heroPhoto: "/images/templates/noir/noir-hero.jpg",
      heroGreeting: "IN THE PRESENCE OF GOD & OUR FAMILIES",
      heroSubtitle: "WE REQUEST THE HONOUR OF YOUR PRESENCE AT THE HOLY MATRIMONY OF",
      coupleSubtitle: "Daughter of Mr. & Mrs. De Silva • Son of Mr. & Mrs. Perera",
      vowQuote: "What God has joined together, let no one separate. United in faith and eternal devotion.",
      story: [
        {
          year: "2019",
          title: "Choir Harmonies in Colombo",
          description: "Met during annual cathedral Christmas carols rehearsal, united by shared melodies.",
        },
        {
          year: "2022",
          title: "A Shared Journey of Faith",
          description: "Navigating life through laughter, weekly Sunday breakfasts, and heartfelt prayers.",
        },
        {
          year: "2025",
          title: "The Palace Promenade",
          description: "On the grand stone steps of St. Andrew's, Rovan asked Shenali to be his forever.",
        },
      ],
      schedules: [
        {
          time: "09:45 AM",
          title: "Cathedral Bells & Seating",
          description: "Guests seated to the solemn hymns of the pipe organ and violin quartet.",
        },
        {
          time: "10:30 AM",
          title: "Holy Matrimony & Sacred Mass",
          description: "Sacred exchange of vows, blessing of rings, and solemn nuptial blessing.",
          isNekath: true,
        },
        {
          time: "12:00 PM",
          title: "Grand Ballroom Reception",
          description: "Champagne toast, ceremonial cake cutting, and royal banquet lunch.",
        },
        {
          time: "03:30 PM",
          title: "First Dance & Celebrations",
          description: "Waltz serenade with family and joyous departures.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1519225424626-d6210f011ec5?auto=format&fit=crop&w=800&q=80",
          caption: "Under the grand cathedral vaulted arches",
          alt: "Cathedral architectural vows",
        },
        {
          url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
          caption: "Black-tie elegance on the royal stone steps",
          alt: "Couple in formal black tie attire",
        },
        {
          url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80",
          caption: "Golden hour romance by stained glass",
          alt: "Golden hour portrait",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Pachelbel Canon in D & Royal Strings (Orchestral)",
      dressCodeTitle: "Black Tie & Regal Formal Church Attire",
      dressCodeDescription: "Sophisticated formal evening wear, dark suits or tuxedos, and graceful long gowns.",
      hashtag: "#ShenaliAndRovan2026",
    },
  },

  // =========================================================================
  // 4. EMBOSSED PEARL & WAX SEAL (Hiruni & Kavindu)
  // =========================================================================
  "embossed-ivory-envelope": {
    id: "embossed-ivory-envelope",
    name: "Embossed Pearl & Wax Seal",
    tagline: "Textured Floral Blind-Deboss & Champagne Wax Stamp",
    description: "The epitome of timeless luxury stationery. Heavyweight textured cotton paper with tactile embossed botanical relief and a realistic wax medallion.",
    category: "luxury",
    categoryLabel: "Modern Luxe",
    badge: "Haute Couture",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-sans",
    },
    palette: {
      primary: "#574d43",
      secondary: "#332d26",
      goldAccent: "#d6a97a",
      goldLight: "#fcecef",
      bgPage: "bg-[#f9f8f5]",
      bgCard: "bg-[#f3efe8]",
      textPrimary: "#403426",
      textMuted: "#8a7560",
      borderGlow: "rgba(214, 169, 122, 0.4)",
      swatches: [
        { name: "Pearl Cotton Paper", hex: "#f9f8f5" },
        { name: "Champagne Wax", hex: "#d6a97a" },
        { name: "Sepia Slate", hex: "#574d43" },
        { name: "Soft Silk Ribbon", hex: "#faf5ed" },
      ],
    },
    motifs: {
      patternType: "blush-petals",
      cornerFlourish: "❀",
      borderStyle: "border-[#d6a97a]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "pearl-blush",
      waxColor: "bg-gradient-to-br from-[#edd892] via-[#d6a97a] to-[#ab8055]",
      waxBorder: "border-[#ffffff]",
      waxSealSymbol: "heart",
      stampLabel: "FOREVER LOVE",
      flapColor: "from-[#f9f8f5] via-[#eee7db] to-[#e0d7c7]",
      confettiColors: ["#d6a97a", "#edd892", "#574d43", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Hiruni & Kavindu",
      groomName: "Kavindu Gunawardena",
      brideName: "Hiruni Perera",
      groomParents: "Son of Mr. & Mrs. Susantha Gunawardena",
      brideParents: "Daughter of Mr. & Mrs. Priyantha Perera",
      eventDate: "2027-01-23",
      nekathTime: "11:08 AM",
      venueName: "Cinnamon Grand Ballroom, Colombo",
      venueAddress: "77 Galle Road, Colombo 03, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Cinnamon+Grand+Colombo",
      heroPhoto: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "TWO HEARTS • ONE JOURNEY",
      heroSubtitle: "CORDIALLY INVITE YOU TO CELEBRATE THEIR WEDDING CELEBRATION",
      coupleSubtitle: "Daughter of Mr. & Mrs. Priyantha Perera • Son of Mr. & Mrs. Susantha Gunawardena",
      vowQuote: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.",
      story: [
        {
          year: "2022",
          title: "Serendipity in London",
          description: "Both attending postgraduate university miles away from home, bonding over authentic Ceylon tea.",
        },
        {
          year: "2024",
          title: "Returning Home",
          description: "Coming back to Sri Lanka to build our joint dreams together with our beloved families.",
        },
        {
          year: "2026",
          title: "A Beachside Promise",
          description: "Under moonlight at Bentota beach, we celebrated saying yes to a lifetime of adventures.",
        },
      ],
      schedules: [
        {
          time: "10:15 AM",
          title: "Guest Arrival & Welcome Music",
          description: "Soft piano & violin instrumental covers of beloved love songs.",
        },
        {
          time: "11:08 AM",
          title: "Ceremonial Exchange of Rings",
          description: "Sacred marriage oaths and auspicious exchange of garlands in presence of loved ones.",
          isNekath: true,
        },
        {
          time: "12:30 PM",
          title: "Lunch Banquet & Toast",
          description: "Culinary celebration, wedding toasts by parents, and first dance.",
        },
        {
          time: "03:30 PM",
          title: "Evening Cake & Farewell",
          description: "Traditional milk-rice and cake presentation with close friends.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
          caption: "Minimalist pre-shoot in Colombo art gallery",
          alt: "Couple in modern elegant attire",
        },
        {
          url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
          caption: "Sweet moments of unfiltered laughter",
          alt: "Couple smiling joyfully",
        },
        {
          url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
          caption: "Golden hour sunset portrait",
          alt: "Couple silhouetted by sunset",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Romantic Acoustic Piano Serenade & Sweeping Violins",
      dressCodeTitle: "Blush, Champagne & Neutral Elegance",
      dressCodeDescription: "Guests are invited to dress in romantic pastel hues of blush, dusty rose, champagne gold, or light summer suits.",
      hashtag: "#HiruniKavinduForever",
    },
  },

  // Alias for modern floral romance
  "modern-floral-romance": {
    id: "modern-floral-romance",
    name: "Modern Floral Romance",
    tagline: "Pastel Blush & Minimalist Editorial Elegance",
    description: "An intimate fairy-tale dreamscape. Soft blush pinks, tactile blind-deboss floral details, shimmering rose-gold accents, and delicate editorial typography.",
    category: "romance",
    categoryLabel: "Modern Romance",
    badge: "Contemporary Chic",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-sans",
    },
    palette: {
      primary: "#9d254b",
      secondary: "#610f2b",
      goldAccent: "#d6a97a",
      goldLight: "#fcecef",
      bgPage: "bg-[#fffbfa]",
      bgCard: "bg-[#fdf3f5]",
      textPrimary: "#361622",
      textMuted: "#885265",
      borderGlow: "rgba(214, 169, 122, 0.4)",
      swatches: [
        { name: "Dusty Blossom", hex: "#9d254b" },
        { name: "Pastel Blush", hex: "#fcecef" },
        { name: "Rose Gold", hex: "#d6a97a" },
        { name: "Pure Silk", hex: "#fffbfa" },
      ],
    },
    motifs: {
      patternType: "blush-petals",
      cornerFlourish: "❀",
      borderStyle: "border-[#d6a97a]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "pearl-blush",
      waxColor: "bg-gradient-to-br from-[#d6a97a] via-[#e2be96] to-[#ab7f53]",
      waxBorder: "border-[#ffffff]",
      waxSealSymbol: "heart",
      stampLabel: "FOREVER LOVE",
      flapColor: "from-[#f4e2e6] via-[#fbf2f4] to-[#fae6ea]",
      confettiColors: ["#d62851", "#fcecef", "#d6a97a", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Hiruni & Kavindu",
      groomName: "Kavindu Gunawardena",
      brideName: "Hiruni Perera",
      groomParents: "Son of Mr. & Mrs. Susantha Gunawardena",
      brideParents: "Daughter of Mr. & Mrs. Priyantha Perera",
      eventDate: "2027-01-23",
      nekathTime: "11:08 AM",
      venueName: "Cinnamon Grand Ballroom, Colombo",
      venueAddress: "77 Galle Road, Colombo 03, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Cinnamon+Grand+Colombo",
      heroPhoto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "TWO HEARTS • ONE JOURNEY",
      heroSubtitle: "CORDIALLY INVITE YOU TO WITNESS THEIR WEDDING CELEBRATION",
      coupleSubtitle: "Daughter of Mr. & Mrs. Priyantha Perera • Son of Mr. & Mrs. Susantha Gunawardena",
      vowQuote: "Two souls, one heartbeat, beginning an extraordinary forever.",
      story: [
        {
          year: "2022",
          title: "Serendipity in London",
          description: "Both attending postgraduate university miles away from home, bonding over authentic Ceylon tea.",
        },
        {
          year: "2024",
          title: "Returning Home",
          description: "Coming back to Sri Lanka to build our joint dreams together with our families.",
        },
        {
          year: "2026",
          title: "A Beachside Promise",
          description: "Under moonlight at Bentota beach, we celebrated saying yes to a lifetime of adventures.",
        },
      ],
      schedules: [
        {
          time: "10:15 AM",
          title: "Guest Arrival & Welcome Music",
          description: "Soft piano & violin instrumental covers of beloved love songs.",
        },
        {
          time: "11:08 AM",
          title: "Ceremonial Exchange of Rings",
          description: "Sacred marriage oaths and auspicious exchange of garlands in presence of loved ones.",
          isNekath: true,
        },
        {
          time: "12:30 PM",
          title: "Lunch Banquet & Toast",
          description: "Culinary celebration, wedding toasts by parents, and first dance.",
        },
        {
          time: "03:30 PM",
          title: "Evening Cake & Farewell",
          description: "Traditional milk-rice and cake presentation with close friends.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
          caption: "Minimalist pre-shoot in Colombo gallery",
          alt: "Couple in modern elegant attire",
        },
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          caption: "Sweet moments of laughter",
          alt: "Couple smiling joyfully",
        },
        {
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          caption: "Golden hour sunset portrait",
          alt: "Couple silhouetted by sunset",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Romantic Acoustic Piano Serenade & Sweeping Violins",
      dressCodeTitle: "Blush, Champagne & Neutral Elegance",
      dressCodeDescription: "Guests are invited to dress in romantic pastel hues of blush, dusty rose, champagne gold, or light summer suits.",
      hashtag: "#HiruniKavinduForever",
    },
  },

  // =========================================================================
  // 5. VELVET HOMECOMING (Amaya & Dinuka)
  // =========================================================================
  "velvet-homecoming": {
    id: "velvet-homecoming",
    name: "Velvet Homecoming",
    tagline: "Rich Burgundy Dahlias, Gilded Borders & Red Butterflies",
    description: "A cinematic celebration of love, family, and new beginnings. Luxurious deep burgundy dahlia blooms, delicate crimson butterflies, warm golden foil typography, and an interactive attendance counter.",
    category: "royal",
    categoryLabel: "Velvet Homecoming",
    badge: "Trending Homecoming",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#541221",
      secondary: "#380612",
      goldAccent: "#c5a059",
      goldLight: "#edd892",
      bgPage: "bg-[#fffdfa]",
      bgCard: "bg-[#fcf8f0]",
      textPrimary: "#3b1720",
      textMuted: "#7a4855",
      borderGlow: "rgba(197, 160, 89, 0.45)",
      swatches: [
        { name: "Burgundy Dahlia", hex: "#541221" },
        { name: "Vintage Cream", hex: "#faf5eb" },
        { name: "Gilded Gold", hex: "#c5a059" },
        { name: "Crimson Butterfly", hex: "#b91c1c" },
      ],
    },
    motifs: {
      patternType: "velvet-flora",
      cornerFlourish: "🦋",
      borderStyle: "border-[#c5a059]",
      curtainSilkOverlay: false,
      backdropBanner: "/images/templates/velvet-homecoming/backdrop-banner.jpg",
    },
    envelope: {
      style: "velvet-burgundy",
      waxColor: "bg-gradient-to-br from-[#73172c] via-[#541221] to-[#360914]",
      waxBorder: "border-[#c5a059]",
      waxSealSymbol: "butterfly",
      stampLabel: "HOMECOMING SEAL",
      flapColor: "from-[#380612] via-[#541221] to-[#6e162a]",
      confettiColors: ["#b91c1c", "#c5a059", "#ffd700", "#541221", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Amaya & Dinuka",
      groomName: "Dinuka Senanayake",
      brideName: "Amaya Weerasinghe",
      groomParents: "Son of Mr. & Mrs. Senanayake",
      brideParents: "Daughter of Mr. & Mrs. Weerasinghe",
      eventDate: "2026-12-12",
      nekathTime: "06:30 PM",
      venueName: "Water's Edge, Battaramulla",
      venueAddress: "316 Pannipitiya Road, Battaramulla, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Waters+Edge+Battaramulla",
      heroPhoto: "/images/templates/velvet-homecoming/phone-preview-card.jpg",
      cartoonCoupleArt: "/images/templates/velvet-homecoming/card-hero-full.jpg",
      heroGreeting: "HOMECOMING RECEPTION OF",
      heroSubtitle: "A CINEMATIC CELEBRATION OF LOVE & NEW BEGINNINGS",
      coupleSubtitle: "Daughter of Mr. & Mrs. Weerasinghe • Son of Mr. & Mrs. Senanayake",
      vowQuote: "Welcoming Amaya into our hearts, our home, and our forever journey.",
      story: [
        {
          year: "2021",
          title: "The First Chapter",
          description: "A chance conversation at a cozy Colombo lakeside cafe that soon sparked an unbreakable bond.",
        },
        {
          year: "2024",
          title: "Building Our World",
          description: "Countless shared road trips, quiet sunset coffees, and dreaming together for our shared future.",
        },
        {
          year: "2026",
          title: "The Homecoming Celebration",
          description: "Welcoming Amaya into our new home with eternal warmth, love, and joyous celebrations.",
        },
      ],
      schedules: [
        {
          time: "06:30 PM",
          title: "Arrival of Guests & Cocktail Hour",
          description: "Welcome cocktails and live instrumental serenade amidst the lakeside gardens.",
        },
        {
          time: "07:30 PM",
          title: "Grand Entrance of the Couple",
          description: "Joyous reception entrance of Amaya & Dinuka with family champagne toast.",
          isNekath: true,
        },
        {
          time: "08:30 PM",
          title: "Gourmet Dinner Buffet & Speeches",
          description: "Lavish culinary experience accompanied by live acoustic jazz performance.",
        },
        {
          time: "10:30 PM",
          title: "Music, Dancing & Farewell",
          description: "Celebratory party and warm departure under glowing fairy lights.",
        },
      ],
      gallery: [
        {
          url: "/images/templates/velvet-homecoming/phone-preview-card.jpg",
          caption: "A cinematic celebration of love and new beginnings",
          alt: "Amaya and Dinuka pre-shoot",
        },
        {
          url: "/images/templates/velvet-homecoming/card-hero-full.jpg",
          caption: "Together at Water's Edge",
          alt: "Couple smiling at lakeside venue",
        },
        {
          url: "/images/templates/velvet-homecoming/screen-details.png",
          caption: "Save the Date: 12 . 12 . 26",
          alt: "Save the Date details card",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Enchanted Strings & Romantic Flute Melody",
      dressCodeTitle: "Formal Evening / Black Tie or Rich Jewel Tones",
      dressCodeDescription: "Guests are warmly encouraged to wear deep burgundy, ruby, emerald, or sophisticated evening wear.",
      hashtag: "#AmayaAndDinukaHomecoming",
    },
  },

  // =========================================================================
  // 6. ROYAL HERITAGE (Kasun & Dinithi)
  // =========================================================================
  "royal-heritage": {
    id: "royal-heritage",
    name: "Royal Heritage",
    tagline: "Regal Velvet Crimson & Imperial Gilded Gold",
    description: "The timeless grand royal wedding aesthetic. Deep velvet burgundy tones accented with opulent gold filigrees, ornate lotus corners, and an imperial gold wax medallion.",
    category: "classic",
    categoryLabel: "Classic Royal",
    badge: "Most Imperial",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-serif",
    },
    palette: {
      primary: "#800020",
      secondary: "#470a16",
      goldAccent: "#dfba73",
      goldLight: "#ffd700",
      bgPage: "bg-[#121013]",
      bgCard: "bg-[#fcf8f0]",
      textPrimary: "#1a1517",
      textMuted: "#8c6a2b",
      borderGlow: "rgba(223, 186, 115, 0.45)",
      swatches: [
        { name: "Royal Velvet", hex: "#800020" },
        { name: "Imperial Gold", hex: "#dfba73" },
        { name: "Champagne Gold", hex: "#ffd700" },
        { name: "Antique Parchment", hex: "#fffdfa" },
      ],
    },
    motifs: {
      patternType: "royal-fleur",
      cornerFlourish: "⚜",
      borderStyle: "border-[#dfba73]",
      curtainSilkOverlay: true,
    },
    envelope: {
      style: "royal-crimson",
      waxColor: "bg-gradient-to-br from-[#9e1b32] via-[#800020] to-[#470a16]",
      waxBorder: "border-[#ffd700]/80",
      waxSealSymbol: "crown",
      stampLabel: "ROYAL SEAL",
      flapColor: "from-[#471221] via-[#350d18] to-[#250810]",
      confettiColors: ["#800020", "#dfba73", "#ffd700", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Kasun & Dinithi",
      groomName: "Kasun Jayawardena",
      brideName: "Dinithi Senaratne",
      groomParents: "Son of Mr. & Mrs. Jayawardena",
      brideParents: "Daughter of Mr. & Mrs. Senaratne",
      eventDate: "2026-11-28",
      nekathTime: "07:00 PM",
      venueName: "Shangri-La Grand Ballroom, Colombo",
      venueAddress: "1 Galle Face, Colombo 02, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Shangri-La+Colombo",
      heroPhoto: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "ROYAL WEDDING DECREE",
      heroSubtitle: "UNDER THE AUSPICIOUS BLESSINGS OF OUR FAMILIES",
      coupleSubtitle: "Daughter of Mr. & Mrs. Senaratne • Son of Mr. & Mrs. Jayawardena",
      vowQuote: "A grand monarch love story crowned in eternal devotion and regal splendor.",
      story: [
        {
          year: "2020",
          title: "The Diplomatic Gala",
          description: "Introduced during the prestigious Colombo charitable foundation gala evening.",
        },
        {
          year: "2023",
          title: "Across Continents",
          description: "Adventures traveling across European castles and returning to embrace Sri Lanka's heritage.",
        },
        {
          year: "2025",
          title: "The Royal Promise",
          description: "Under the golden chandeliers of the colonial ballroom, we promised our lives to one another.",
        },
      ],
      schedules: [
        {
          time: "06:15 PM",
          title: "Arrival of Guests & Champagne Reception",
          description: "Welcome accompaniment with royal chamber orchestra in the foyer.",
        },
        {
          time: "07:00 PM",
          title: "Grand Entrance & Royal Toast",
          description: "Grand banquet entrance with celebratory champagne fountain.",
          isNekath: true,
        },
        {
          time: "08:15 PM",
          title: "Imperial Dinner Banquet",
          description: "Curated 7-course culinary journey with live classical harpist.",
        },
        {
          time: "10:30 PM",
          title: "Waltz of Forever",
          description: "First royal dance surrounded by loved ones.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          caption: "Under the golden ballroom chandeliers",
          alt: "Couple in ballroom",
        },
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          caption: "Aristocratic golden hour portrait",
          alt: "Couple portrait",
        },
        {
          url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
          caption: "Timeless imperial devotion",
          alt: "Couple embracing",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Royal Wedding March & Traditional Flute (Instrumental)",
      dressCodeTitle: "Royal Splendor & Black Tie",
      dressCodeDescription: "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
      hashtag: "#KasunWedsDinithi",
    },
  },

  // =========================================================================
  // 7. CELESTIAL MIDNIGHT (Akash & Tara)
  // =========================================================================
  "celestial-midnight": {
    id: "celestial-midnight",
    name: "Celestial Midnight",
    tagline: "Starry Twilight Sapphire & Luminescent Silver",
    description: "An enchanting evening wedding celebration under the starlit sky. Rich midnight navy and indigo textures infused with glittering diamond stardust and radiant silver filigrees.",
    category: "celestial",
    categoryLabel: "Evening & Celestial",
    badge: "Night Romance",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-sans",
    },
    palette: {
      primary: "#0b1329",
      secondary: "#1e293b",
      goldAccent: "#38bdf8",
      goldLight: "#e2e8f0",
      bgPage: "bg-[#060a17]",
      bgCard: "bg-[#0f1d3b]",
      textPrimary: "#f0f9ff",
      textMuted: "#94a3b8",
      borderGlow: "rgba(56, 189, 248, 0.45)",
      swatches: [
        { name: "Midnight Navy", hex: "#0b1329" },
        { name: "Twilight Indigo", hex: "#1e293b" },
        { name: "Starlight Silver", hex: "#e2e8f0" },
        { name: "Celestial Cyan", hex: "#38bdf8" },
      ],
    },
    motifs: {
      patternType: "celestial-stars",
      cornerFlourish: "✦",
      borderStyle: "border-[#38bdf8]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "celestial-sapphire",
      waxColor: "bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0b1329]",
      waxBorder: "border-[#93c5fd]/90",
      waxSealSymbol: "star",
      stampLabel: "STARLIGHT SEAL",
      flapColor: "from-[#172c57] via-[#0f1f40] to-[#0a1429]",
      confettiColors: ["#38bdf8", "#60a5fa", "#e2e8f0", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Akash & Tara",
      groomName: "Akash Dissanayake",
      brideName: "Tara Wickramasinghe",
      groomParents: "Son of Eng. & Mrs. Dissanayake",
      brideParents: "Daughter of Dr. & Mrs. Wickramasinghe",
      eventDate: "2026-12-18",
      nekathTime: "06:45 PM",
      venueName: "Jetwing Lighthouse, Galle",
      venueAddress: "Dadella, Galle, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Jetwing+Lighthouse+Galle",
      heroPhoto: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "WRITTEN IN THE STARS",
      heroSubtitle: "UNDER A CANOPY OF STARS, JOIN US AS WE UNITE OUR DESTINIES",
      coupleSubtitle: "Daughter of Dr. & Mrs. Wickramasinghe • Son of Eng. & Mrs. Dissanayake",
      vowQuote: "You are the universe's most radiant constellation, guiding my heart across every horizon.",
      story: [
        {
          year: "2021",
          title: "Stargazing at Horton Plains",
          description: "Met under the southern night skies during an astronomical observation camp in the highlands.",
        },
        {
          year: "2023",
          title: "Constellations Aligned",
          description: "Shared passions, midnight drives, and realizing our souls were always destined to align.",
        },
        {
          year: "2025",
          title: "The Starlit Promise",
          description: "Overlooking the crashing waves of Galle ramparts under a moonlit sky, we chose forever.",
        },
      ],
      schedules: [
        {
          time: "05:45 PM",
          title: "Sunset Welcome on the Lawn",
          description: "Twilight welcome cocktails with sound of crashing waves and acoustic violins.",
        },
        {
          time: "06:45 PM",
          title: "Starlight Vows by the Ocean",
          description: "Exchange of rings as the first evening stars appear over the Indian ocean.",
          isNekath: true,
        },
        {
          time: "08:00 PM",
          title: "Celestial Gala Dinner",
          description: "Gourmet seafood banquet under fairy lights and shimmering chandeliers.",
        },
        {
          time: "10:30 PM",
          title: "Sparkler Walkway & Farewell",
          description: "Celebration illuminated by guests' sparklers beneath the open sky.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
          caption: "Lanterns glowing by the twilight sea",
          alt: "Lantern light portrait",
        },
        {
          url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
          caption: "Under the celestial twilight sky",
          alt: "Couple against dusk sky",
        },
        {
          url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80",
          caption: "Written in the stars forever",
          alt: "Couple looking into distance",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Ethereal Moonlight Sonata & Celestial Strings",
      dressCodeTitle: "Starlight Glamour & Formal Evening",
      dressCodeDescription: "Sophisticated formal wear in celestial shades of midnight blue, sparkling silver, slate, and shimmering accents.",
      hashtag: "#AkashAndTaraWrittenInStars",
    },
  },

  // =========================================================================
  // 8. ETHEREAL BLUSH (Nisali & Tharindu)
  // =========================================================================
  "ethereal-blush": {
    id: "ethereal-blush",
    name: "Ethereal Rose & Blush",
    tagline: "Romantic Dusty Rose & Radiant Rose Gold",
    description: "An intimate, delicate fairy-tale dreamscape. Tender pastel rose hues, shimmering rose gold calligraphy accents, and romantic fluttering cherry blossom petals.",
    category: "romance",
    categoryLabel: "Modern Luxe",
    badge: "Fairy Tale",
    typography: {
      headingFont: "font-serif",
      scriptFont: "font-serif italic",
      bodyFont: "font-sans",
      auspiciousSin: "font-sans",
    },
    palette: {
      primary: "#be185d",
      secondary: "#881337",
      goldAccent: "#e0a96d",
      goldLight: "#fbcfe8",
      bgPage: "bg-[#fffafb]",
      bgCard: "bg-[#fdf2f4]",
      textPrimary: "#290916",
      textMuted: "#9f1239",
      borderGlow: "rgba(224, 169, 109, 0.4)",
      swatches: [
        { name: "Dusty Rose", hex: "#be185d" },
        { name: "Pastel Blush", hex: "#fbcfe8" },
        { name: "Rose Gold", hex: "#e0a96d" },
        { name: "Silk Ivory", hex: "#fffafb" },
      ],
    },
    motifs: {
      patternType: "blush-petals",
      cornerFlourish: "🌸",
      borderStyle: "border-[#e0a96d]",
      curtainSilkOverlay: false,
    },
    envelope: {
      style: "pearl-blush",
      waxColor: "bg-gradient-to-br from-[#f43f5e] via-[#be185d] to-[#881337]",
      waxBorder: "border-[#fbcfe8]/90",
      waxSealSymbol: "heart",
      stampLabel: "ROSE MEDALLION",
      flapColor: "from-[#41182c] via-[#2f1120] to-[#1a0812]",
      confettiColors: ["#be185d", "#f472b6", "#e0a96d", "#ffffff"],
    },
    sampleData: {
      coupleNames: "Nisali & Tharindu",
      groomName: "Tharindu Ratnayake",
      brideName: "Nisali Jayakody",
      groomParents: "Son of Mr. & Mrs. Ratnayake",
      brideParents: "Daughter of Mr. & Mrs. Jayakody",
      eventDate: "2027-02-14",
      nekathTime: "10:15 AM",
      venueName: "Mount Lavinia Hotel, Mount Lavinia",
      venueAddress: "100 Hotel Road, Mount Lavinia, Sri Lanka",
      googleMapsUrl: "https://maps.google.com/?q=Mount+Lavinia+Hotel",
      heroPhoto: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
      heroGreeting: "LOVE IN FULL BLOOM",
      heroSubtitle: "CORDIALLY INVITE YOU TO CELEBRATE OUR VALENTINE WEDDING",
      coupleSubtitle: "Daughter of Mr. & Mrs. Jayakody • Son of Mr. & Mrs. Ratnayake",
      vowQuote: "Forever began the moment our eyes met, blooming with every breath.",
      story: [
        {
          year: "2021",
          title: "A Valentine's Afternoon",
          description: "Our paths crossed at a cozy flower boutique in Colombo, exchanging a bouquet and a smile.",
        },
        {
          year: "2023",
          title: "Growing Together",
          description: "Planting gardens, adopting our beloved puppy, and building an unbreakable foundation.",
        },
        {
          year: "2026",
          title: "The Beachfront Proposal",
          description: "Under sunset waves at Mount Lavinia beach, we chose each other for all lifetimes.",
        },
      ],
      schedules: [
        {
          time: "09:30 AM",
          title: "Garden Arrival & Pink Rose Welcome",
          description: "Live acoustic harpist and rose petal mocktails by the ocean terrace.",
        },
        {
          time: "10:15 AM",
          title: "Ceremonial Vows & Ring Exchange",
          description: "Exchange of oaths surrounded by floral arches and family blessings.",
          isNekath: true,
        },
        {
          time: "12:00 PM",
          title: "Seaside Champagne Banquet",
          description: "Gourmet luncheon with ocean breeze and violin serenade.",
        },
        {
          time: "03:30 PM",
          title: "Sunset Toast & Farewell",
          description: "Evening toast as the sun dips into the Indian ocean.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80",
          caption: "Rose garden afternoon pre-shoot",
          alt: "Couple smiling amongst flowers",
        },
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          caption: "Laughter in full bloom",
          alt: "Couple laughing",
        },
        {
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
          caption: "Ocean sunset embrace",
          alt: "Couple at beach",
        },
      ],
      musicUrl: "/audio/background.mp3",
      musicTitle: "Romantic Harp & Acoustic Love Serenade",
      dressCodeTitle: "Pastel Blush & Rose Gold Elegance",
      dressCodeDescription: "Guests are warmly encouraged to wear soft shades of blush, dusty rose, champagne, or crisp light linen.",
      hashtag: "#NisaliAndTharinduForever",
    },
  },
};

// Unique main templates for the catalog list
export const WEDLINK_TEMPLATE_LIST: WedLinkTemplateTheme[] = [
  WEDLINK_TEMPLATES["golden-mandala-heritage"],
  WEDLINK_TEMPLATES["botanical-silk-sanduni"],
  WEDLINK_TEMPLATES["cathedral-palace-doors"],
  WEDLINK_TEMPLATES["embossed-ivory-envelope"],
  WEDLINK_TEMPLATES["velvet-homecoming"],
  WEDLINK_TEMPLATES["royal-heritage"],
  WEDLINK_TEMPLATES["celestial-midnight"],
  WEDLINK_TEMPLATES["ethereal-blush"],
];

export function getWedLinkTemplate(id?: string | null): WedLinkTemplateTheme {
  if (!id) return WEDLINK_TEMPLATES["golden-mandala-heritage"];

  // Direct match
  if (WEDLINK_TEMPLATES[id]) return WEDLINK_TEMPLATES[id];

  // Specific alias mappings
  if (id === "nilame-traditional" || id === "sri-suba-mangalam" || id === "traditional-poruwa") {
    return WEDLINK_TEMPLATES["golden-mandala-heritage"];
  }
  if (id === "emerald-elegance") {
    return WEDLINK_TEMPLATES["botanical-silk-sanduni"];
  }
  if (id === "modern-floral-romance" || id === "modern-ivory") {
    return WEDLINK_TEMPLATES["embossed-ivory-envelope"];
  }
  if (id === "homecoming-reception" || id === "amaya-and-dinuka") {
    return WEDLINK_TEMPLATES["velvet-homecoming"];
  }

  return WEDLINK_TEMPLATES["golden-mandala-heritage"];
}
