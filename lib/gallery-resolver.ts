/**
 * Unified Wedding Gallery Resolver
 * Seamlessly resolves gallery photos from:
 * 1. settings.galleryJson (the 4 custom slots in Admin Dashboard Settings tab)
 * 2. photos array (from database EventPhoto records in Photos tab)
 * 3. Graceful template aesthetic fallbacks
 */

export interface ResolvedGalleryItem {
  url: string;
  src: string; // alias for template compatibility
  caption: string;
  title: string;
  subtitle: string;
  tag?: string;
}

export function resolveWeddingGallery(
  settings: any,
  photos?: any[],
  defaultFallbacks: Array<{ url?: string; src?: string; caption?: string; title?: string; subtitle?: string; tag?: string }> = []
): ResolvedGalleryItem[] {
  const list: ResolvedGalleryItem[] = [];
  const seenUrls = new Set<string>();

  const addPhoto = (
    rawUrl: any,
    rawTitle: any,
    rawSubtitle: any,
    rawTag?: any
  ) => {
    if (!rawUrl || typeof rawUrl !== "string") return;
    const url = rawUrl.trim();
    if (!url || seenUrls.has(url)) return;

    // Filter out obvious broken/dummy placeholders if real images are available
    seenUrls.add(url);
    const title = (typeof rawTitle === "string" && rawTitle.trim() ? rawTitle.trim() : "") || "Special Moment";
    const subtitle = typeof rawSubtitle === "string" && rawSubtitle.trim() ? rawSubtitle.trim() : "";

    list.push({
      url,
      src: url,
      caption: title,
      title,
      subtitle,
      tag: rawTag || "Pre-Wedding",
    });
  };

  // 1. Priority: settings.galleryJson (configured in Admin Dashboard -> Settings -> Moments of Love: 4 slots)
  if (settings?.galleryJson) {
    try {
      const parsed = typeof settings.galleryJson === "string" 
        ? JSON.parse(settings.galleryJson) 
        : settings.galleryJson;

      if (Array.isArray(parsed)) {
        parsed.forEach((item: any) => {
          if (!item) return;
          const url = item.src || item.url || item.imageUrl;
          addPhoto(url, item.title || item.caption, item.subtitle || item.description, item.tag);
        });
      }
    } catch (err) {
      console.warn("Error parsing settings.galleryJson:", err);
    }
  }

  // 2. Priority: photos array (EventPhoto table in Database, added via Admin Dashboard Photos tab)
  if (photos && Array.isArray(photos)) {
    photos.forEach((p: any) => {
      if (!p) return;
      const url = p.url || p.imageUrl || p.src;
      addPhoto(url, p.title || p.caption, p.subtitle || p.description, p.tag);
    });
  }

  // If the couple has configured or uploaded photos, return them!
  if (list.length > 0) {
    return list;
  }

  // 3. Fallback to default aesthetic template photos if no photos are configured yet
  return defaultFallbacks.map((item, idx) => {
    const url = item.url || item.src || `/images/templates/blush-floral/polaroid-${idx + 1}.jpg`;
    const title = item.caption || item.title || `Moment ${idx + 1}`;
    return {
      url,
      src: url,
      caption: title,
      title,
      subtitle: item.subtitle || "",
    };
  });
}

/**
 * Ensures a fixed number of photos for templates with fixed grid slots (e.g. 5 polaroids or 6 grid items),
 * repeating or padding with hero images rather than reverting to stock photos.
 */
export function resolvePaddedGallery(
  settings: any,
  photos?: any[],
  requiredCount = 5,
  defaultFallbacks: Array<{ url?: string; src?: string; caption?: string; title?: string; subtitle?: string; tag?: string }> = []
): ResolvedGalleryItem[] {
  const items = resolveWeddingGallery(settings, photos, defaultFallbacks);

  if (items.length === 0) {
    return defaultFallbacks.map((f, i) => {
      const url = f.url || f.src || `/images/templates/blush-floral/polaroid-${i + 1}.jpg`;
      const title = f.caption || f.title || `Moment ${i + 1}`;
      return { url, src: url, caption: title, title, subtitle: "" };
    });
  }

  if (items.length >= requiredCount) {
    return items.slice(0, requiredCount);
  }

  // Pad by cycling through the user's photos, or using heroImageUrl
  const padded = [...items];
  const heroUrl = settings?.heroImageUrl;
  if (heroUrl && !padded.some((p) => p.url === heroUrl)) {
    padded.push({
      url: heroUrl,
      src: heroUrl,
      caption: "Our Special Day",
      title: "Our Special Day",
      subtitle: "",
    });
  }

  while (padded.length < requiredCount) {
    const source = items[padded.length % items.length];
    padded.push({ ...source });
  }

  return padded.slice(0, requiredCount);
}
