"use client";

import React, { useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  Clock,
  Calendar,
  Compass,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Heart,
  Share2,
  MapPin,
  Sparkles,
  Camera,
  Shirt,
  Volume2,
  Utensils,
  Music,
  Wine,
  Gift,
  Download,
  BookOpen,
  Users,
  Award,
  Send,
  Star,
} from "lucide-react";
import { WedLinkTemplateTheme, WeddingDataPayload } from "@/lib/template-engine";

interface ThemedPhoneInvitationBodyProps {
  theme: WedLinkTemplateTheme;
  data: WeddingDataPayload;
  onOpenLightbox?: (photoUrl: string) => void;
  isCompact?: boolean;
}

export default function ThemedPhoneInvitationBody({
  theme,
  data,
  onOpenLightbox,
  isCompact = false,
}: ThemedPhoneInvitationBodyProps) {
  const [guestCount, setGuestCount] = useState(1);
  const [attending, setAttending] = useState<"ACCEPT" | "DECLINE">("ACCEPT");
  const [rsvpDone, setRsvpDone] = useState(false);

  // Deterministic date parsing to prevent SSR / Client hydration mismatches
  const rawDate = data.eventDate || "2026-12-12";
  const dateParts = rawDate.split("-");
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const yearNumber = parseInt(dateParts[0] || "2026", 10);
  const monthIdx = Math.max(0, Math.min(11, parseInt(dateParts[1] || "12", 10) - 1));
  const dayNumber = parseInt(dateParts[2] || "12", 10);
  const monthName = months[monthIdx];
  const monthCap = monthName.charAt(0) + monthName.slice(1).toLowerCase();
  const dObj = new Date(Date.UTC(yearNumber, monthIdx, dayNumber, 12, 0, 0));
  const dayOfWeekName = daysOfWeek[dObj.getUTCDay()];
  const fullDateFormatted = `${dayOfWeekName}, ${monthCap} ${dayNumber}, ${yearNumber}`;

  const handleRsvpSubmit = () => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.7 },
        colors: theme.envelope.confettiColors || [
          theme.palette.goldAccent,
          theme.palette.primary,
          "#ffffff",
        ],
      });
    } catch {}
    setRsvpDone(true);
  };

  const isTraditional =
    theme.id === "golden-mandala-heritage" ||
    theme.id === "nilame-traditional" ||
    theme.category === "traditional";

  const isBotanical =
    theme.id === "botanical-silk-sanduni" ||
    theme.id === "emerald-elegance" ||
    theme.category === "botanical";

  const isCathedral =
    theme.id === "cathedral-palace-doors" ||
    theme.category === "classic" && theme.id.includes("cathedral");

  const isEmbossed =
    theme.id === "embossed-ivory-envelope" ||
    theme.id === "modern-floral-romance" ||
    theme.category === "luxury" && theme.id.includes("embossed");

  const isVelvet = theme.id === "velvet-homecoming";

  const isRoyal =
    theme.id === "royal-heritage" ||
    (theme.category === "classic" && theme.id.includes("royal"));

  const isCelestial =
    theme.id === "celestial-midnight" ||
    theme.category === "celestial";

  const isEthereal =
    theme.id === "ethereal-blush" ||
    theme.category === "romance";

  const isModern =
    theme.id === "modern-ivory" ||
    (theme.category as string) === "modern" ||
    (theme.category as string) === "minimalist";

  // Additional template-specific interactive states
  const [songRequest, setSongRequest] = useState("");
  const [guestbookWish, setGuestbookWish] = useState("");
  const [wineChoice, setWineChoice] = useState<"Red" | "White" | "Non-Alcoholic">("Red");
  const [wishSent, setWishSent] = useState(false);

  // Clean parents text
  const cleanBrideParents =
    data.brideParents?.replace(/^(Daughter of\s*|Bride's Parents:\s*)/i, "") ||
    "Mr. & Mrs. Rajapaksha";
  const cleanGroomParents =
    data.groomParents?.replace(/^(Son of\s*|Groom's Parents:\s*)/i, "") ||
    "Mr. & Mrs. Fernando";

  return (
    <div className="space-y-4 text-left font-sans">
      {/* ================================================================= */}
      {/* 1. HERO INVITATION CARD (Authentically Styled for Each Template)  */}
      {/* ================================================================= */}
      {isVelvet ? (
        /* VELVET HOMECOMING (Amaya & Dinuka) */
        <section className="relative rounded-[24px] overflow-hidden shadow-md mt-1 border border-[#c5a059]/70 aspect-[200/395] w-full">
          <Image
            src="/images/templates/velvet-homecoming/card-front.png"
            alt="Amaya & Dinuka Homecoming Invitation"
            fill
            priority
            className="object-cover"
            sizes={isCompact ? "280px" : "360px"}
          />
        </section>
      ) : isTraditional ? (
        /* TRADITIONAL PORUWA & KANDYAN (Nethmi & Sanuja) */
        <section
          className="relative rounded-[28px] border-2 bg-[#faf6ee]/95 p-4 shadow-sm text-center space-y-3 mt-1 overflow-hidden"
          style={{ borderColor: `${theme.palette.goldAccent}70` }}
        >
          {/* Top Auspicious Sinhala & English Header */}
          <div className="space-y-1 pt-1">
            <h2 className="font-serif font-bold text-xl sm:text-2xl tracking-wide text-[#6b0f24]">
              {data.heroGreeting || "ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM!"}
            </h2>
            <p className="text-[8.5px] uppercase tracking-[0.22em] text-[#8a6a2a] font-serif font-semibold">
              {data.heroSubtitle || "YOU ARE INVITED TO THE AUSPICIOUS WEDDING OF"}
            </p>
          </div>

          {/* Ornate Gold Diamond Divider */}
          <div className="flex items-center justify-center gap-2 text-[#c5a059]">
            <span className="w-12 h-px bg-[#c5a059]/50" />
            <span className="text-[9px]">◆</span>
            <span className="w-12 h-px bg-[#c5a059]/50" />
          </div>

          {/* Couple Names */}
          <div className="py-0.5">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold leading-tight">
              {data.coupleNames}
            </h3>
          </div>

          {/* Parents Salutation */}
          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#574438] font-serif border-t border-b border-[#c5a059]/20 py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a6a2a] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a6a2a] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          {/* Auspicious Date Block with Big Day Number */}
          <div className="py-1">
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 text-right">
                <span className="text-[10px] font-serif tracking-widest text-[#6b0f24] font-semibold border-t border-b border-[#6b0f24]/30 py-0.5 inline-block">
                  {monthName}
                </span>
              </div>
              <div className="text-3xl font-serif font-extrabold text-[#6b0f24] px-1">
                {dayNumber}
              </div>
              <div className="flex-1 text-left">
                <span className="text-[10px] font-serif tracking-widest text-[#6b0f24] font-semibold border-t border-b border-[#6b0f24]/30 py-0.5 inline-block">
                  {yearNumber}
                </span>
              </div>
            </div>

            <p className="text-[10.5px] font-serif font-semibold text-[#3b2d22] mt-1.5">
              {fullDateFormatted}
            </p>
          </div>

          {/* Traditional Kandyan Bride & Groom Cartoon Artwork */}
          <div className="relative w-40 h-52 mx-auto pt-2">
            <Image
              src="/images/templates/kandyan/couple-art.png"
              alt="Traditional Kandyan Couple"
              fill
              className="object-contain"
              sizes={isCompact ? "160px" : "180px"}
              priority
            />
          </div>
        </section>
      ) : isBotanical ? (
        /* BOTANICAL SILK & GOLD (Sanduni & Ravindu) */
        <section
          className="relative rounded-[28px] border-2 bg-gradient-to-b from-white via-[#f7faf6] to-[#edf4ed] p-4 shadow-sm text-center space-y-3 mt-1 overflow-hidden"
          style={{ borderColor: `${theme.palette.primary}40` }}
        >
          {/* Botanical Eucalyptus Header Accent */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-center gap-1.5 text-[#2d6a4f] mb-1">
              <span className="text-sm">❦</span>
              <span className="text-xs">🌿</span>
              <span className="text-sm">❦</span>
            </div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-widest text-[#14422e]">
              {data.heroGreeting || "THE WEDDING CELEBRATION OF"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#40916c] font-serif font-semibold">
              {data.heroSubtitle || "TOGETHER IN NATURE'S EMBRACE"}
            </p>
          </div>

          {/* Couple Names in Italic Forest Green */}
          <div className="py-0.5">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#14422e] font-bold leading-tight">
              {data.coupleNames}
            </h3>
          </div>

          {/* Parents in Earth Tone Fonts */}
          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#2d4a3b] font-serif border-t border-b border-[#2d6a4f]/20 py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#40916c] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#40916c] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          {/* Date Badge */}
          <div className="py-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f1e7] border border-[#2d6a4f]/30">
              <span className="text-[10px] font-serif font-bold text-[#14422e]">
                {fullDateFormatted}
              </span>
            </div>
          </div>

          {/* Romantic Garden Pre-shoot Portrait with Botanical Oval Arch Frame */}
          <div className="relative w-44 h-56 mx-auto rounded-t-full rounded-b-2xl overflow-hidden shadow-md border-2 border-[#2d6a4f]/40">
            <Image
              src={data.heroPhoto || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"}
              alt={data.coupleNames}
              fill
              className="object-cover"
              sizes={isCompact ? "180px" : "220px"}
              priority
            />
          </div>
        </section>
      ) : isCathedral ? (
        /* CATHEDRAL PALACE DOORS (Shenali & Rovan) */
        <section
          className="relative rounded-[28px] border-2 bg-gradient-to-b from-white via-[#fbf8f4] to-[#f4eee6] p-4 shadow-sm text-center space-y-3 mt-1 overflow-hidden"
          style={{ borderColor: `${theme.palette.goldAccent}70` }}
        >
          {/* Cathedral Arched Header */}
          <div className="space-y-1 pt-1">
            <div className="text-sm text-[#c5a059]">⚜</div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wider text-[#2b2623] uppercase">
              {data.heroGreeting || "HOLY MATRIMONY"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a6d3b] font-serif font-semibold">
              {data.heroSubtitle || "IN THE PRESENCE OF GOD & OUR FAMILIES"}
            </p>
          </div>

          {/* Gold Filigree Line */}
          <div className="flex items-center justify-center gap-2 text-[#c5a059]">
            <span className="w-10 h-px bg-[#c5a059]/50" />
            <span className="text-[8px]">✦</span>
            <span className="w-10 h-px bg-[#c5a059]/50" />
          </div>

          {/* Couple Names */}
          <div className="py-0.5">
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2b2623] font-bold tracking-wide">
              {data.coupleNames}
            </h3>
          </div>

          {/* Parents */}
          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#4a3b32] font-serif border-t border-b border-[#c5a059]/25 py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a6d3b] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a6d3b] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          {/* Date with Roman Cathedral Style */}
          <div className="py-1">
            <span className="text-[10px] font-serif tracking-widest text-[#2b2623] font-semibold uppercase block">
              {fullDateFormatted}
            </span>
          </div>

          {/* Cathedral Arch Portrait */}
          <div className="relative w-44 h-56 mx-auto rounded-t-full overflow-hidden shadow-md border-2 border-[#c5a059]/50">
            <Image
              src={data.heroPhoto || "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80"}
              alt={data.coupleNames}
              fill
              className="object-cover"
              sizes={isCompact ? "180px" : "220px"}
              priority
            />
          </div>
        </section>
      ) : isEmbossed ? (
        /* EMBOSSED PEARL & WAX SEAL / MODERN ROMANCE (Hiruni & Kavindu) */
        <section
          className="relative rounded-[28px] border bg-gradient-to-b from-white via-[#faf8f5] to-[#f3efe8] p-4 shadow-sm text-center space-y-3 mt-1 overflow-hidden"
          style={{ borderColor: "#e0d7c7" }}
        >
          {/* Blind Deboss Blossom Emblem */}
          <div className="space-y-1 pt-1">
            <div className="text-base text-[#d6a97a]">❀</div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-widest text-[#403426]">
              {data.heroGreeting || "TWO HEARTS • ONE JOURNEY"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a7560] font-sans font-semibold">
              {data.heroSubtitle || "CORDIALLY INVITE YOU TO CELEBRATE"}
            </p>
          </div>

          {/* Couple Names */}
          <div className="py-0.5">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#403426] font-bold leading-tight">
              {data.coupleNames}
            </h3>
          </div>

          {/* Parents */}
          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#574d43] font-serif border-t border-b border-[#e0d7c7] py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a7560] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8a7560] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          {/* Date Spaced Out */}
          <div className="py-1">
            <span className="text-[11px] font-serif tracking-[0.3em] text-[#403426] font-bold block">
              {data.eventDate.replace(/-/g, " . ")}
            </span>
          </div>

          {/* Modern Editorial Portrait with Soft Shadow */}
          <div className="relative w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <Image
              src={data.heroPhoto || "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=80"}
              alt={data.coupleNames}
              fill
              className="object-cover"
              sizes={isCompact ? "180px" : "220px"}
              priority
            />
          </div>
        </section>
      ) : isCelestial ? (
        /* CELESTIAL MIDNIGHT (Akash & Tara) */
        <section
          className="relative rounded-[28px] border-2 bg-gradient-to-b from-[#0b1329] via-[#0f1d3b] to-[#162952] p-4 shadow-lg text-center space-y-3 mt-1 overflow-hidden text-white"
          style={{ borderColor: "#38bdf880" }}
        >
          {/* Starlight Constellation Header */}
          <div className="space-y-1 pt-1">
            <div className="text-sm text-[#38bdf8] animate-pulse">✨ ✦ ✨</div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-widest text-[#f0f9ff]">
              {data.heroGreeting || "WRITTEN IN THE STARS"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#93c5fd] font-serif font-semibold">
              {data.heroSubtitle || "UNDER A CANOPY OF STARS"}
            </p>
          </div>

          {/* Couple Names with Starlight Glow */}
          <div className="py-0.5">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#f0f9ff] font-bold leading-tight drop-shadow-[0_2px_8px_rgba(56,189,248,0.5)]">
              {data.coupleNames}
            </h3>
          </div>

          {/* Parents */}
          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#cbd5e1] font-serif border-t border-b border-[#38bdf8]/30 py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#93c5fd] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#93c5fd] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          {/* Date with Stardust Badge */}
          <div className="py-1">
            <span className="text-[10.5px] font-serif tracking-wider text-[#38bdf8] font-bold block">
              {fullDateFormatted}
            </span>
          </div>

          {/* Starlight Portrait */}
          <div className="relative w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-[#38bdf8]/60">
            <Image
              src={data.heroPhoto || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=80"}
              alt={data.coupleNames}
              fill
              className="object-cover"
              sizes={isCompact ? "180px" : "220px"}
              priority
            />
          </div>
        </section>
      ) : (
        /* ROYAL HERITAGE / ETHEREAL BLUSH / DEFAULT LUXE */
        <section
          className="relative rounded-[28px] border-2 bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f5ebd7] p-4 shadow-sm text-center space-y-3 mt-1 overflow-hidden"
          style={{ borderColor: `${theme.palette.goldAccent}70` }}
        >
          <div className="space-y-1 pt-1">
            <div className="text-sm text-[#c5a059]">👑</div>
            <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wider text-[#800020] uppercase">
              {data.heroGreeting || "ROYAL WEDDING DECREE"}
            </h2>
            <p className="text-[8px] uppercase tracking-[0.25em] text-[#8c6a2b] font-serif font-semibold">
              {data.heroSubtitle || "CORDIALLY INVITE YOU TO CELEBRATE"}
            </p>
          </div>

          <div className="py-0.5">
            <h3 className="font-serif italic text-2xl sm:text-3xl text-[#800020] font-bold leading-tight">
              {data.coupleNames}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[9px] text-[#422c07] font-serif border-t border-b border-[#dfba73]/30 py-2">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8c6a2b] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">{cleanBrideParents}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#8c6a2b] font-semibold">
                Son of
              </span>
              <span className="font-medium">{cleanGroomParents}</span>
            </div>
          </div>

          <div className="py-1">
            <span className="text-[10.5px] font-serif font-bold text-[#800020] block">
              {fullDateFormatted}
            </span>
          </div>

          <div className="relative w-44 h-56 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-[#dfba73]">
            <Image
              src={data.heroPhoto || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=900&q=80"}
              alt={data.coupleNames}
              fill
              className="object-cover"
              sizes={isCompact ? "180px" : "220px"}
              priority
            />
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 2. THEMED MOTIF DIVIDER & SCROLL INDICATOR                        */}
      {/* ================================================================= */}
      {isTraditional ? (
        <section className="w-full py-1 flex flex-col items-center">
          <div className="relative w-full h-12">
            <Image
              src="/images/templates/kandyan/perahera-frieze.png"
              alt="Kandyan Perahera"
              fill
              className="object-contain"
              sizes={isCompact ? "260px" : "320px"}
            />
          </div>
          <div className="flex flex-col items-center mt-1">
            <span className="text-[8px] font-serif uppercase tracking-[0.25em] text-[#8a6a2a] font-bold">
              SCROLL DOWN
            </span>
            <div className="w-4 h-4 rounded-full border border-[#8a6a2a]/40 flex items-center justify-center mt-0.5 text-[#8a6a2a] animate-bounce">
              <span className="text-[9px]">↓</span>
            </div>
          </div>
        </section>
      ) : isBotanical ? (
        <section className="w-full py-1.5 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-[#2d6a4f]/60 text-xs">
            <span>❦</span>
            <span className="w-16 h-px bg-[#2d6a4f]/30" />
            <span>🌿</span>
            <span className="w-16 h-px bg-[#2d6a4f]/30" />
            <span>❦</span>
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#40916c] font-serif font-bold mt-1">
            EXPLORE INVITATION
          </span>
        </section>
      ) : isCathedral ? (
        <section className="w-full py-1.5 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-[#c5a059] text-xs">
            <span>✦</span>
            <span className="w-16 h-px bg-[#c5a059]/40" />
            <span>⚜</span>
            <span className="w-16 h-px bg-[#c5a059]/40" />
            <span>✦</span>
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#8a6d3b] font-serif font-bold mt-1">
            ROYAL MATRIMONY DETAILS
          </span>
        </section>
      ) : isCelestial ? (
        <section className="w-full py-1.5 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-[#38bdf8] text-xs">
            <span>✧</span>
            <span className="w-16 h-px bg-[#38bdf8]/40" />
            <span>✨</span>
            <span className="w-16 h-px bg-[#38bdf8]/40" />
            <span>✧</span>
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#93c5fd] font-serif font-bold mt-1">
            STARLIT VOWS
          </span>
        </section>
      ) : (
        <section className="w-full py-1.5 flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-2 text-[#c5a059] text-xs">
            <span>◆</span>
            <span className="w-16 h-px bg-[#c5a059]/40" />
            <span>❀</span>
            <span className="w-16 h-px bg-[#c5a059]/40" />
            <span>◆</span>
          </div>
          <span className="text-[8px] uppercase tracking-[0.25em] text-[#8a7560] font-serif font-bold mt-1">
            SCROLL DOWN
          </span>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. BESPOKE WEDDING COMBINATION (Tailored UI/UX For Each Template)        */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* COMBINATION 1: TRADITIONAL SRI LANKAN PORUWA & KANDYAN HERITAGE           */}
      {/* ------------------------------------------------------------------------- */}
      {isTraditional ? (
        <div className="space-y-4">
          {/* Sacred Astrological Poruwa Nekath Timings (නැකත් චාරිත්‍ර) */}
          <section
            className="rounded-[24px] border-2 bg-gradient-to-b from-[#faf6ee] to-[#f5ede0] p-4 shadow-sm space-y-3"
            style={{ borderColor: `${theme.palette.goldAccent}70` }}
          >
            <div className="text-center space-y-1">
              <span className="text-[8.5px] uppercase tracking-[0.25em] font-serif font-bold text-[#8a6a2a] block">
                නැකත් චාරිත්‍ර • AUSPICIOUS TIMES
              </span>
              <h4 className="font-serif font-bold text-base text-[#6b0f24]">
                Sacred Poruwa Ceremonies
              </h4>
              <p className="text-[9px] text-[#5c4a3b] font-serif">
                According to the traditional Sri Lankan astrological horoscope
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { time: "09:18 AM", sinhala: "පෝරුවට නැගීම", english: "Ascent to the Sacred Poruwa" },
                { time: "09:24 AM", sinhala: "තැලි පිළි පැළඳවීම", english: "Nuptial Knot & Ring Exchange" },
                { time: "09:32 AM", sinhala: "ජයමංගල ගාථා", english: "Jayamangala Gatha Blessings" },
                { time: "09:45 AM", sinhala: "පහන් දැල්වීම", english: "Lighting the Brass Oil Lamp" },
                { time: "10:15 AM", sinhala: "කිරිබත් කැවීම", english: "Sharing of Milk Rice & Sweets" },
                { time: "12:30 PM", sinhala: "මංගල භෝජන සංග්‍රහය", english: "Traditional Wedding Banquet" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/90 border border-[#c5a059]/30 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#fcecef] text-[#6b0f24] font-serif font-bold text-[9px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-serif font-bold text-[10px] text-[#6b0f24] leading-tight">
                        {item.sinhala}
                      </div>
                      <div className="text-[8.5px] text-[#6b5a4b] leading-tight">
                        {item.english}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-[#8a6a2a] bg-[#faf6ee] px-2 py-0.5 rounded-full border border-[#c5a059]/40 shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Traditional Kandyan Perahera Cultural Frieze */}
          <section className="relative w-full rounded-2xl overflow-hidden shadow-xs border border-[#c5a059]/50 bg-[#161214] py-2">
            <div className="relative w-full h-10">
              <Image
                src="/images/templates/kandyan/perahera-frieze.png"
                alt="Kandyan Drummer Frieze"
                fill
                className="object-contain"
                sizes={isCompact ? "260px" : "320px"}
              />
            </div>
            <p className="text-[7.5px] text-center font-serif text-[#e6c98a] tracking-widest uppercase mt-1">
              Accompanied by traditional Magul Bera &amp; Kandyan Dancers
            </p>
          </section>

          {/* Auspicious Venue & Poruwa Location */}
          <section className="rounded-[24px] border bg-white p-4 shadow-sm space-y-2 text-center" style={{ borderColor: `${theme.palette.goldAccent}50` }}>
            <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#8a6a2a] block">
              AUSPICIOUS VENUE
            </span>
            <h4 className="font-serif font-bold text-sm text-[#6b0f24]">
              {data.venueName}
            </h4>
            <p className="text-[9px] text-[#5c4a3b]">{data.venueAddress}</p>
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-white text-[10px] font-bold shadow-2xs hover:opacity-90 transition cursor-pointer mt-1"
              style={{ backgroundColor: theme.palette.primary }}
            >
              <Compass className="w-3 h-3" />
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
          </section>

          {/* Traditional Poruwa Blessings & Family RSVP */}
          <section className="rounded-[24px] border shadow-xs text-center space-y-2.5 bg-[#faf6ee] p-4" style={{ borderColor: `${theme.palette.goldAccent}60` }}>
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#8a6a2a]">
                ආරාධනා පත්‍රය • KINDLY RESPOND
              </span>
              <h4 className="font-serif font-bold text-sm text-[#6b0f24]">
                Honoring Your Presence at Our Poruwa
              </h4>
              <p className="text-[8.5px] text-[#6b5a4b] italic">
                Please confirm your attendance to help us prepare the auspicious feast
              </p>
            </div>

            {rsvpDone ? (
              <div className="py-2.5 flex flex-col items-center justify-center gap-1 text-emerald-800 text-xs font-bold bg-emerald-50 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ආයුබෝවන්! RSVP Confirmed for {guestCount} Guest{guestCount > 1 ? "s" : ""}</span>
                <span className="text-[8.5px] text-emerald-700 font-normal">
                  May you be blessed with happiness and good health.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white border border-[#c5a059]/40">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#6b0f24] text-white shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    ✓ සහභාගී වෙමි (Accept)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-gray-800 text-white shadow-xs" : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    ✕ සහභාගී විය නොහැක
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[9px] font-medium text-gray-700 block">Number of Attendees:</span>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-800 font-bold text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
                      >
                        -
                      </button>
                      <span className="font-serif font-bold text-xl text-[#6b0f24] w-6">{guestCount}</span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-800 font-bold text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full text-white text-[10px] font-serif font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  <span>CONFIRM BLESSING &amp; RSVP</span>
                </button>
              </div>
            )}
          </section>
        </div>
      ) : isCathedral ? (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 2: CATHEDRAL PALACE DOORS (High-Society Black-Tie Matrimony)  */
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* Solemn Two-Part Order of Matrimony */}
          <section className="rounded-[24px] border-2 bg-gradient-to-b from-white via-[#fcfaf7] to-[#f5f0e6] p-4 shadow-sm space-y-3" style={{ borderColor: `${theme.palette.goldAccent}70` }}>
            <div className="text-center space-y-1">
              <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#8a6d3b] block">
                ORDER OF SOLEMN MATRIMONY
              </span>
              <h4 className="font-serif font-bold text-base text-[#2b2623] tracking-wide">
                Two-Part Celebration
              </h4>
              <div className="flex items-center justify-center gap-2 text-[#c5a059] text-xs">
                <span>✦</span>
                <span className="w-12 h-px bg-[#c5a059]/40" />
                <span>⚜</span>
                <span className="w-12 h-px bg-[#c5a059]/40" />
                <span>✦</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Part 1: Holy Church Nuptials */}
              <div className="p-3 rounded-xl bg-white border border-[#c5a059]/30 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-serif font-bold text-[#8a6d3b] uppercase tracking-wider">
                    PART I • CHURCH CEREMONY
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#2b2623] bg-[#fbf8f4] px-2 py-0.5 rounded-full border border-[#c5a059]/40">
                    3:00 PM
                  </span>
                </div>
                <h5 className="font-serif font-bold text-xs text-[#2b2623]">
                  Solemn High Nuptial Mass &amp; Vows
                </h5>
                <p className="text-[8.5px] text-gray-500">
                  St. Anthony&apos;s Cathedral • Choral Hymns &amp; Sacred Blessing
                </p>
              </div>

              {/* Part 2: Royal Palace Ballroom Banquet */}
              <div className="p-3 rounded-xl bg-white border border-[#c5a059]/30 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-serif font-bold text-[#8a6d3b] uppercase tracking-wider">
                    PART II • PALACE RECEPTION
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#2b2623] bg-[#fbf8f4] px-2 py-0.5 rounded-full border border-[#c5a059]/40">
                    6:30 PM
                  </span>
                </div>
                <h5 className="font-serif font-bold text-xs text-[#2b2623]">
                  Grand Ballroom Gala &amp; Champagne Toast
                </h5>
                <p className="text-[8.5px] text-gray-500">
                  The Grand Ballroom • Galle Face Hotel • Dinner &amp; Waltz
                </p>
              </div>
            </div>
          </section>

          {/* Black Tie Dress Code Etiquette Card */}
          <section className="rounded-[24px] border bg-[#141215] text-[#fbf8f4] p-4 shadow-md space-y-2 text-center border-[#c5a059]/50">
            <div className="flex items-center justify-center gap-1.5 text-[#dfba73]">
              <Shirt className="w-3.5 h-3.5" />
              <span className="text-[8.5px] uppercase tracking-[0.25em] font-serif font-bold">
                DRESS CODE ETIQUETTE
              </span>
            </div>
            <h5 className="font-serif text-sm font-bold text-[#dfba73]">
              Black Tie &amp; Formal Evening Wear
            </h5>
            <div className="grid grid-cols-2 gap-2 text-[8.5px] pt-1 border-t border-white/10">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="font-bold text-[#dfba73] block mb-0.5">Gentlemen</span>
                <span>Tuxedo or Dark Suit with Bowtie</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="font-bold text-[#dfba73] block mb-0.5">Ladies</span>
                <span>Floor-Length Evening Gown</span>
              </div>
            </div>
          </section>

          {/* Curated 4-Course Fine Dining Menu Preview */}
          <section className="rounded-[24px] border bg-white p-4 shadow-sm space-y-2 border-[#c5a059]/40">
            <div className="text-center space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-[#8a6d3b] text-xs">
                <Utensils className="w-3 h-3" />
                <span className="text-[8px] uppercase tracking-[0.25em] font-bold">
                  CHEF&apos;S CURATED MENU PREVIEW
                </span>
              </div>
              <h5 className="font-serif font-bold text-xs text-[#2b2623]">
                4-Course Palace Banquet
              </h5>
            </div>
            <div className="space-y-1.5 text-[8.5px] text-gray-600 divide-y divide-gray-100">
              <div className="pt-1 flex justify-between">
                <span className="font-serif font-bold text-gray-800">First Course:</span>
                <span className="italic">Truffle Lobster Bisque</span>
              </div>
              <div className="pt-1 flex justify-between">
                <span className="font-serif font-bold text-gray-800">Main Entrée:</span>
                <span className="italic">Prime Tenderloin &amp; Herb Seabass</span>
              </div>
              <div className="pt-1 flex justify-between">
                <span className="font-serif font-bold text-gray-800">Dessert:</span>
                <span className="italic">Grand Cru Chocolate Dome &amp; Gold Leaf</span>
              </div>
            </div>
          </section>

          {/* Formal Regalia RSVP with Wine Pairing */}
          <section className="rounded-[24px] border shadow-xs text-center space-y-2.5 bg-white p-4" style={{ borderColor: `${theme.palette.goldAccent}50` }}>
            <div className="space-y-0.5">
              <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#8a6d3b]">
                R.S.V.P.
              </span>
              <h4 className="font-serif font-bold text-sm text-[#2b2623]">
                The Honor of Your Presence
              </h4>
            </div>

            {rsvpDone ? (
              <div className="py-2.5 flex flex-col items-center justify-center gap-1 text-emerald-800 text-xs font-bold bg-emerald-50 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Attendance Confirmed with Pleasure ({guestCount} Guest{guestCount > 1 ? "s" : ""})</span>
                <span className="text-[8.5px] text-emerald-700 font-normal">
                  Wine choice: {wineChoice} • We await the pleasure of celebrating with you.
                </span>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-50 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#2b2623] text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Accepts with Pleasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-rose-800 text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Declines with Regret
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <div className="space-y-2 pt-1 text-[9px]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Attending Guests:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-6 h-6 rounded-full bg-gray-100 border text-gray-800 font-bold flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(4, guestCount + 1))}
                          className="w-6 h-6 rounded-full bg-gray-100 border text-gray-800 font-bold flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700 block mb-1">Wine Selection:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {(["Red", "White", "Non-Alcoholic"] as const).map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setWineChoice(w)}
                            className={`py-1 rounded-lg text-[8px] font-bold border text-center transition cursor-pointer ${
                              wineChoice === w ? "bg-[#2b2623] text-white border-[#2b2623]" : "bg-white text-gray-700 border-gray-200"
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full text-white text-[10px] font-serif font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95 mt-1"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  <span>SUBMIT FORMAL RESPONSE</span>
                </button>
              </div>
            )}
          </section>
        </div>
      ) : isEmbossed ? (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 3: TUSCAN VILLA & DECKLE ENVELOPE (Destination Wedding)      */
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* 3-Day Wedding Weekend Destination Itinerary */}
          <section className="rounded-[24px] border bg-[#fffdfa] p-4 shadow-sm space-y-3 border-[#e0d7c7]">
            <div className="text-center space-y-0.5">
              <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#8a7560] block">
                DESTINATION WEDDING WEEKEND
              </span>
              <h4 className="font-serif font-bold text-base text-[#403426]">
                3-Day Celebration Itinerary
              </h4>
              <p className="text-[9px] text-[#8a7560]">Lake Como &amp; Historic Villa</p>
            </div>

            <div className="space-y-2 pt-1">
              {[
                { day: "FRIDAY", title: "Sunset Welcome Aperitivo", desc: "Wood-fired Pizza & Prosecco by the olive grove", time: "6:00 PM" },
                { day: "SATURDAY", title: "The Villa Vows & Reception", desc: "Garden Ceremony, Candlelit Dinner & Dancing", time: "3:30 PM" },
                { day: "SUNDAY", title: "Farewell Recovery Brunch", desc: "Pastries, Gelato & Poolside Relaxation", time: "11:00 AM" },
              ].map((ev, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#e0d7c7] shadow-2xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-serif font-bold text-[#a87e2e] uppercase tracking-wider">
                      {ev.day} • {ev.time}
                    </span>
                  </div>
                  <h5 className="font-serif font-bold text-xs text-[#403426]">{ev.title}</h5>
                  <p className="text-[8.5px] text-gray-500">{ev.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Guest Travel, Transfers & Villa Stay Guide */}
          <section className="rounded-[24px] border bg-white p-3.5 shadow-2xs space-y-2 border-[#e0d7c7]">
            <div className="flex items-center gap-1.5 text-[#403426]">
              <Compass className="w-3.5 h-3.5 text-[#8a7560]" />
              <span className="text-[9px] font-serif font-bold uppercase tracking-wider">
                Travel &amp; Villa Accommodation Guide
              </span>
            </div>
            <p className="text-[8.5px] text-gray-600 leading-relaxed">
              We have reserved a block of villas nearby. Private boat transfers from the dock will run every 30 minutes on Saturday.
            </p>
            <div className="text-[8px] bg-[#faf8f5] p-2 rounded-lg border border-[#e0d7c7] text-[#8a7560] font-mono">
              Airport: Milan Malpensa (MXP) • Scenic train to Como San Giovanni
            </div>
          </section>

          {/* Unplugged Ceremony Note */}
          <section className="rounded-[20px] bg-[#faf8f5] p-3 text-center border border-[#e0d7c7] space-y-1">
            <span className="text-[8.5px] font-serif font-bold text-[#403426] block">
              📷 Unplugged Ceremony
            </span>
            <p className="text-[8px] text-gray-500 max-w-[240px] mx-auto leading-relaxed">
              We kindly invite you to be fully present with us. Please keep phones &amp; cameras put away during the vows.
            </p>
          </section>

          {/* Destination RSVP with Song Request */}
          <section className="rounded-[24px] border shadow-xs text-center space-y-2.5 bg-white p-4 border-[#e0d7c7]">
            <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#8a7560] block">
              PLEASE RSVP BY OCTOBER 1ST
            </span>
            <h4 className="font-serif font-bold text-sm text-[#403426]">
              Will You Join Us in Italy?
            </h4>

            {rsvpDone ? (
              <div className="py-2.5 flex flex-col items-center justify-center gap-1 text-emerald-800 text-xs font-bold bg-emerald-50 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>See you in Tuscany! RSVP Confirmed</span>
                {songRequest && <span className="text-[8.5px] text-emerald-700">Song request added: &ldquo;{songRequest}&rdquo;</span>}
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-50 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#403426] text-white" : "text-gray-500"
                    }`}
                  >
                    Yes, Packing My Bags!
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-gray-700 text-white" : "text-gray-500"
                    }`}
                  >
                    Sending Love from Afar
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <div className="space-y-2 pt-1 text-[9px]">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">
                        Song that gets you on the dance floor:
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Earth, Wind & Fire - September"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-[9px] bg-white text-gray-800"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full text-white text-[10px] font-serif font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  <span>CONFIRM VILLA RSVP</span>
                </button>
              </div>
            )}
          </section>
        </div>
      ) : isVelvet ? (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 4: VELVET HOMECOMING (Sri Lankan Second Day Celebration)      */
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* Homecoming (දෙවැනි ගමන) Celebration Decree */}
          <section className="rounded-[24px] border-2 bg-gradient-to-b from-[#1c080d] to-[#2e0e16] text-[#f7e4be] p-4 shadow-md space-y-2 text-center border-[#c5a059]/60">
            <span className="text-[8.5px] uppercase tracking-[0.25em] font-serif font-bold text-[#e6c98a] block">
              දෙවැනි ගමන • HOMECOMING RECEPTION
            </span>
            <h4 className="font-serif font-bold text-lg text-[#ffd700] tracking-wide">
              Welcoming the Newlyweds
            </h4>
            <p className="text-[9px] text-[#fcecef]/80 max-w-[260px] mx-auto leading-relaxed">
              Together with our families, we joyfully invite you to celebrate the homecoming evening of Amaya &amp; Dinuka.
            </p>
          </section>

          {/* Evening Grand Reception & Dance Schedule */}
          <section className="rounded-[24px] border bg-white p-4 shadow-sm space-y-2.5 border-[#c5a059]/40">
            <div className="text-center">
              <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#8b1e2a] block">
                HOMECOMING ITINERARY
              </span>
              <h5 className="font-serif font-bold text-sm text-[#3b1219]">Evening Schedule</h5>
            </div>
            <div className="space-y-2 text-[9px]">
              {[
                { time: "06:30 PM", title: "Red Carpet Arrival of the Couple", icon: "✨" },
                { time: "07:15 PM", title: "First Dance & Champagne Toast", icon: "🥂" },
                { time: "08:00 PM", title: "Grand Dinner Buffet & Live Band", icon: "🍽" },
                { time: "10:00 PM", title: "Sri Lankan Baila & Dance Floor", icon: "💃" },
              ].map((ev, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#faf6ee] border border-[#c5a059]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{ev.icon}</span>
                    <span className="font-serif font-bold text-[#3b1219]">{ev.title}</span>
                  </div>
                  <span className="font-mono font-bold text-[#8b1e2a] text-[8.5px]">{ev.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Family Tribute & Parents Blessing */}
          <section className="rounded-[20px] bg-[#faf6ee] p-3 text-center border border-[#c5a059]/30 space-y-1">
            <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#8b1e2a] block">
              FAMILY BLESSING
            </span>
            <p className="text-[8.5px] text-[#574438] italic leading-relaxed">
              &ldquo;With hearts full of joy and love, we thank our beloved family and friends for standing by us as we embark on this sacred journey.&rdquo;
            </p>
          </section>

          {/* Digital Guestbook Wishes & Homecoming RSVP */}
          <section className="rounded-[24px] border shadow-xs text-center space-y-2.5 bg-white p-4 border-[#c5a059]/50">
            <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#8b1e2a] block">
              HOMECOMING RSVP
            </span>
            <h4 className="font-serif font-bold text-sm text-[#3b1219]">
              Confirm Your Attendance
            </h4>

            {rsvpDone ? (
              <div className="py-2.5 flex flex-col items-center justify-center gap-1 text-emerald-800 text-xs font-bold bg-emerald-50 rounded-xl border border-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Homecoming RSVP Confirmed!</span>
                <span className="text-[8.5px] text-emerald-700">Looking forward to celebrating with you!</span>
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-50 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#8b1e2a] text-white" : "text-gray-500"
                    }`}
                  >
                    Joyfully Attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-gray-700 text-white" : "text-gray-500"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <div className="space-y-2 pt-1 text-[9px]">
                    <div>
                      <span className="font-medium text-gray-700 block mb-1">
                        Leave a well-wishing message for the couple:
                      </span>
                      <textarea
                        rows={2}
                        placeholder="May your life together be filled with joy and happiness!"
                        value={guestbookWish}
                        onChange={(e) => setGuestbookWish(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-[9px] bg-white text-gray-800 resize-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full text-white text-[10px] font-serif font-bold tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  <span>CONFIRM HOMECOMING RSVP</span>
                </button>
              </div>
            )}
          </section>
        </div>
      ) : isModern ? (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 5: MODERN OBSIDIAN & IVORY (Minimalist Editorial Vogue)       */
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* One-Click Calendar Sync */}
          <section className="rounded-2xl border bg-black text-white p-3.5 shadow-md flex items-center justify-between">
            <div>
              <span className="text-[8px] uppercase tracking-[0.25em] font-mono text-gray-400 block">
                DIGITAL PASS
              </span>
              <h5 className="font-sans font-bold text-xs tracking-wider">Add to Calendar</h5>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => alert("Added to Apple / Google Calendar!")}
                className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[9px] font-mono font-bold flex items-center gap-1 transition"
              >
                <Download className="w-2.5 h-2.5" />
                <span>.ICS</span>
              </button>
            </div>
          </section>

          {/* Architectural Minimalist Itinerary */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-3">
            <span className="text-[8px] uppercase tracking-[0.3em] font-mono font-bold text-gray-400 block text-center">
              ITINERARY // SCHEDULE
            </span>
            <div className="space-y-2 border-l-2 border-black pl-3 ml-2 text-[9px]">
              {[
                { time: "15:00", title: "Ceremony & Exchange of Vows" },
                { time: "16:30", title: "Sunset Cocktails & Canapés" },
                { time: "19:00", title: "Seated Dinner & Speeches" },
                { time: "22:00", title: "Late Night Beats & After-Party" },
              ].map((ev, idx) => (
                <div key={idx} className="relative">
                  <span className="font-mono font-bold text-black text-[10px] block">{ev.time}</span>
                  <span className="text-gray-600">{ev.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Minimalist Instant RSVP */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs space-y-2.5 text-center">
            <span className="text-[8px] uppercase tracking-[0.3em] font-mono font-bold text-gray-400">
              RSVP // CONFIRM
            </span>
            <h4 className="font-sans font-bold text-sm text-black">Instant Attendance</h4>

            {rsvpDone ? (
              <div className="py-2 bg-black text-white text-xs font-mono rounded-xl">
                ✓ RSVP CONFIRMED FOR {guestCount}
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-100">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-black text-white" : "text-gray-500"
                    }`}
                  >
                    ATTENDING
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-gray-400 text-white" : "text-gray-500"
                    }`}
                  >
                    CANNOT ATTEND
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-xl bg-black text-white text-[10px] font-mono font-bold tracking-widest transition cursor-pointer active:scale-95"
                >
                  CONFIRM NOW
                </button>
              </div>
            )}
          </section>
        </div>
      ) : isCelestial ? (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 6: CELESTIAL MIDNIGHT & STARDUST (Night Sky Cosmic Romance)  */
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* Cosmic Vows & Starlight Countdown */}
          <section className="rounded-[24px] border-2 bg-gradient-to-b from-[#0a1128] via-[#0f1d3b] to-[#162952] text-[#e0f2fe] p-4 shadow-lg text-center space-y-2 border-[#38bdf8]/60">
            <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#38bdf8] block">
              WRITTEN IN THE STARS
            </span>
            <p className="text-[10px] italic text-[#bfdbfe] max-w-[260px] mx-auto leading-relaxed">
              &ldquo;Under a canopy of stars, two souls become one.&rdquo;
            </p>
          </section>

          {/* Twilight & Midnight Starlight Timeline */}
          <section className="rounded-[24px] border bg-[#0b1329] text-white p-4 shadow-md space-y-2.5 border-[#38bdf8]/40">
            <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#38bdf8] block text-center">
              STARLIT EVENING SCHEDULE
            </span>
            <div className="space-y-2 text-[9px]">
              {[
                { time: "05:45 PM", title: "Twilight Sunset Vows", desc: "Golden hour vows under the open sky" },
                { time: "06:30 PM", title: "Starlight Champagne & Canapés", desc: "Acoustic music & constellations" },
                { time: "08:00 PM", title: "Candlelit Open-Air Banquet", desc: "Dinner under a sea of fairy lights" },
                { time: "10:00 PM", title: "Midnight Sparkler Send-off", desc: "Light up the night with sparklers" },
              ].map((ev, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
                  <div className="flex justify-between items-center text-[#38bdf8] font-bold text-[8.5px]">
                    <span>{ev.title}</span>
                    <span className="font-mono">{ev.time}</span>
                  </div>
                  <p className="text-[8px] text-gray-300">{ev.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sparkler Send-off Guide */}
          <section className="rounded-[20px] bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white p-3 text-center border border-[#38bdf8]/40 space-y-1">
            <span className="text-[9px] font-bold text-[#38bdf8] block">
              ✨ Midnight Sparkler Exit
            </span>
            <p className="text-[8px] text-gray-300">
              Sparklers will be provided to all guests at 10:00 PM to illuminate our send-off!
            </p>
          </section>

          {/* Starry Constellation RSVP */}
          <section className="rounded-[24px] border shadow-md text-center space-y-2.5 bg-[#0b1329] text-white p-4 border-[#38bdf8]/50">
            <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#38bdf8] block">
              STARLIGHT RSVP
            </span>
            <h4 className="font-serif font-bold text-sm text-[#f0f9ff]">
              Will You Share Our Starlit Night?
            </h4>

            {rsvpDone ? (
              <div className="py-2.5 bg-[#0f274a] text-[#7dd3fc] text-xs font-serif rounded-xl border border-[#38bdf8]">
                ✦ Starry Presence Confirmed! ✦
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#38bdf8] text-black font-bold" : "text-gray-300"
                    }`}
                  >
                    Under the Stars (Yes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-rose-900 text-white" : "text-gray-400"
                    }`}
                  >
                    Sending Starlight Wishes
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-black font-bold text-[10px] tracking-widest shadow-md transition cursor-pointer active:scale-95"
                >
                  CONFIRM STARLIGHT ATTENDANCE
                </button>
              </div>
            )}
          </section>
        </div>
      ) : (
        /* ------------------------------------------------------------------------- */
        /* COMBINATION 7: BOTANICAL SILK & GARDEN ROMANCE (Floral Wreath & Polaroids)*/
        /* ------------------------------------------------------------------------- */
        <div className="space-y-4">
          {/* Illustrated Love Story Timeline */}
          {data.story && data.story.length > 0 && (
            <section className="rounded-[24px] border bg-gradient-to-b from-white to-[#f4f8f4] p-4 shadow-sm space-y-2.5 border-[#2d6a4f]/30">
              <div className="text-center space-y-0.5">
                <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#40916c] block">
                  OUR BLOSSOMING JOURNEY
                </span>
                <h4 className="font-serif italic text-base font-bold text-[#14422e]">
                  The Story of Us
                </h4>
              </div>

              <div className="space-y-2 pt-1">
                {data.story.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold font-mono text-white bg-[#2d6a4f] shrink-0 mt-0.5">
                      {item.year}
                    </span>
                    <div>
                      <h5 className="font-bold text-[10px] text-[#14422e] leading-tight">{item.title}</h5>
                      <p className="text-[8.5px] text-gray-500 leading-relaxed mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Garden Celebration Schedule */}
          <section className="rounded-[24px] border bg-white p-4 shadow-sm space-y-2 border-[#2d6a4f]/30">
            <span className="text-[8px] uppercase tracking-[0.25em] font-serif font-bold text-[#40916c] block text-center">
              GARDEN CEREMONY &amp; RECEPTION
            </span>
            <div className="space-y-1.5 text-[9px]">
              {[
                { time: "03:30 PM", title: "Rose Petal Welcome Drinks & Seating" },
                { time: "04:00 PM", title: "Vows under the Eucalyptus Floral Arch" },
                { time: "05:30 PM", title: "Sunset Cocktails & Acoustic Lawn Jazz" },
                { time: "07:00 PM", title: "Fairy-lit Lawn Banquet & First Dance" },
              ].map((ev, idx) => (
                <div key={idx} className="flex justify-between p-2 rounded-xl bg-[#f7faf6] border border-[#2d6a4f]/15">
                  <span className="font-medium text-[#14422e]">{ev.title}</span>
                  <span className="font-mono font-bold text-[#2d6a4f] text-[8.5px]">{ev.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Pre-shoot Polaroid Moments Gallery */}
          <section className="space-y-2 pt-1">
            <div className="text-center">
              <span className="text-[8px] font-serif uppercase tracking-[0.25em] font-bold text-[#40916c] block">
                CAPTURED MOMENTS
              </span>
              <h4 className="font-serif italic text-lg font-bold text-[#14422e]">Pre-Shoot Polaroids</h4>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div
                onClick={() => onOpenLightbox && onOpenLightbox(data.gallery[0]?.url)}
                className="bg-white p-2 pb-5 rounded-lg shadow-sm border border-gray-200 cursor-pointer transform -rotate-1 hover:rotate-0 transition duration-300"
              >
                <div className="relative h-28 w-full rounded overflow-hidden">
                  <Image
                    src={data.gallery[0]?.url || "/images/templates/kandyan/gallery-1.png"}
                    alt="Pre-shoot photo 1"
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
                <p className="text-[8px] font-serif italic text-gray-500 text-center mt-1.5">Where it all began</p>
              </div>

              <div
                onClick={() => onOpenLightbox && onOpenLightbox(data.gallery[1]?.url)}
                className="bg-white p-2 pb-5 rounded-lg shadow-sm border border-gray-200 cursor-pointer transform rotate-1 hover:rotate-0 transition duration-300"
              >
                <div className="relative h-28 w-full rounded overflow-hidden">
                  <Image
                    src={data.gallery[1]?.url || "/images/templates/kandyan/gallery-2.png"}
                    alt="Pre-shoot photo 2"
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
                <p className="text-[8px] font-serif italic text-gray-500 text-center mt-1.5">Forever &amp; Always</p>
              </div>
            </div>
          </section>

          {/* Pastel Garden Dress Code */}
          <section className="p-3 rounded-2xl border bg-white shadow-2xs space-y-1.5 text-center border-[#2d6a4f]/30">
            <span className="text-[8.5px] uppercase tracking-wider font-bold text-[#40916c] block">
              🌿 GARDEN DRESS CODE
            </span>
            <h5 className="font-serif font-bold text-[11px] text-[#14422e]">
              Garden Formal • Soft Pastels &amp; Florals
            </h5>
            <div className="flex justify-center gap-1.5 pt-0.5">
              {["#e8f5e9", "#fce4ec", "#f3e5f5", "#fff9c4"].map((c, i) => (
                <span key={i} className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs" style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>

          {/* Garden Wishing Well & RSVP */}
          <section className="rounded-[24px] border shadow-xs text-center space-y-2.5 bg-white p-4 border-[#2d6a4f]/40">
            <span className="text-[8px] uppercase tracking-[0.2em] font-serif font-bold text-[#40916c] block">
              GARDEN RSVP
            </span>
            <h4 className="font-serif font-bold text-sm text-[#14422e]">
              Celebrate With Us
            </h4>

            {rsvpDone ? (
              <div className="py-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300">
                ✓ Garden RSVP Confirmed for {guestCount}!
              </div>
            ) : (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-50 border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "ACCEPT" ? "bg-[#2d6a4f] text-white" : "text-gray-500"
                    }`}
                  >
                    Joyfully Attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition cursor-pointer ${
                      attending === "DECLINE" ? "bg-rose-800 text-white" : "text-gray-500"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleRsvpSubmit}
                  className="w-full py-2.5 rounded-full text-white text-[10px] font-serif font-bold tracking-widest shadow-sm transition cursor-pointer active:scale-95"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  <span>CONFIRM GARDEN RSVP</span>
                </button>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WEDDING FOOTER                                                         */}
      {/* ========================================================================= */}
      <div className="text-center space-y-1 pt-3 pb-6 border-t border-gray-200/60">
        {data.hashtag && (
          <span
            className="text-[9.5px] font-serif font-bold tracking-wider block"
            style={{ color: theme.palette.goldAccent }}
          >
            {data.hashtag}
          </span>
        )}
        <p className="text-[8px] text-gray-400">
          Handcrafted with WedLink.lk • Sri Lanka
        </p>
      </div>
    </div>
  );
}
