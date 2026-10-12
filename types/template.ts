export type TemplateStyle =
  | "floral-peony"        // Sachini & Kavinda (Watercolor Peonies & Floating Petals)
  | "ocean-agate"         // Anna & Yusuf (Blue Agate Marble + Gold Kintsugi Shimmer)
  | "top-secret-dossier"  // Operation Blue Wings (Classified Manila Folder + Rubber Stamp)
  | "nilame-traditional"  // Nethmi & Sanuja (Poruwa Sacred Mandala + Magul Bera)
  | "velvet-homecoming"   // Amaya & Dinuka (Burgundy Velvet + Fluttering Butterflies)
  | "cathedral-doors";    // Shenali & Rovan (French Palace Arched Double Doors)

export interface Template {
  id: string;
  slug: string;
  title: string;
  names: string;
  subtitle?: string;
  location?: string;
  date: string;
  category: "all" | "wedding" | "homecoming" | "nikah" | "birthday";
  styleType: TemplateStyle;
  videoUrl?: string;
  posterUrl?: string;
}
