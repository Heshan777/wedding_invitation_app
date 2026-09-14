export type GuestSide = "GROOM" | "BRIDE" | "BOTH";

export interface ContactInfo {
  groomPhone?: string;
  bridePhone?: string;
  generalPhone?: string;
}

/**
 * Extracts which side (Groom, Bride, or Both) invited this guest from the guest notes.
 */
export function extractGuestSide(notes?: string | null): GuestSide {
  if (!notes) return "BOTH";
  if (notes.includes("[Side: Groom]") || notes.includes("[Side:GROOM]")) return "GROOM";
  if (notes.includes("[Side: Bride]") || notes.includes("[Side:BRIDE]")) return "BRIDE";
  if (notes.includes("[Side: Both]") || notes.includes("[Side:BOTH]")) return "BOTH";
  return "BOTH";
}

/**
 * Strips out the [Side: ...] tag so the user sees clean custom notes in textareas.
 */
export function cleanGuestNotes(notes?: string | null): string {
  if (!notes) return "";
  return notes.replace(/\[Side:\s*(Groom|Bride|Both)\]\s*/gi, "").trim();
}

/**
 * Embeds the [Side: ...] tag into the notes string for seamless zero-migration persistence.
 */
export function formatGuestNotes(notes?: string | null, side: GuestSide = "BOTH"): string {
  const clean = cleanGuestNotes(notes);
  if (side === "GROOM") {
    return clean ? `[Side: Groom] ${clean}` : "[Side: Groom]";
  }
  if (side === "BRIDE") {
    return clean ? `[Side: Bride] ${clean}` : "[Side: Bride]";
  }
  return clean ? `[Side: Both] ${clean}` : clean;
}

/**
 * Parses dual Groom & Bride contact numbers from JSON or structured string.
 */
export function parseContactPhones(raw?: string | null): ContactInfo {
  if (!raw) return {};
  const trimmed = raw.trim();

  // 1. JSON format: {"groom": "...", "bride": "..."}
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        groomPhone: parsed.groom || parsed.groomPhone || "",
        bridePhone: parsed.bride || parsed.bridePhone || "",
        generalPhone: parsed.general || parsed.generalPhone || "",
      };
    } catch {}
  }

  // 2. Structured string: "Groom: +9477... | Bride: +9471..."
  const groomMatch = trimmed.match(/Groom:\s*([^|,\n]+)/i);
  const brideMatch = trimmed.match(/Bride:\s*([^|,\n]+)/i);
  if (groomMatch || brideMatch) {
    return {
      groomPhone: groomMatch ? groomMatch[1].trim() : "",
      bridePhone: brideMatch ? brideMatch[1].trim() : "",
    };
  }

  // 3. Fallback: single number applies to groom/general
  return {
    groomPhone: trimmed,
    generalPhone: trimmed,
  };
}

/**
 * Serializes dual Groom & Bride contact numbers for database storage.
 */
export function serializeContactPhones(info: ContactInfo): string {
  const groom = info.groomPhone?.trim() || "";
  const bride = info.bridePhone?.trim() || "";

  if (groom && bride) {
    return JSON.stringify({ groom, bride });
  }
  if (groom) return groom;
  if (bride) return bride;
  return info.generalPhone?.trim() || "";
}

/**
 * Cleans a phone number for international WhatsApp and tel: links
 */
export function cleanPhoneForUrl(phone?: string | null): string {
  if (!phone) return "";
  const hasPlus = phone.trim().startsWith("+");
  const digits = phone.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export function cleanPhoneForWhatsApp(phone?: string | null): string {
  if (!phone) return "";
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    digits = `94${digits.slice(1)}`;
  }
  return digits;
}
