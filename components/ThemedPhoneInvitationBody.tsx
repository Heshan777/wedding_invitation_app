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

      {/* ================================================================= */}
      {/* 3. CARD 2: VOW QUOTE & LIVE CEREMONY COUNTDOWN                     */}
      {/* ================================================================= */}
      <section
        className="relative rounded-[24px] border-2 bg-white/95 p-3.5 shadow-sm text-center space-y-2.5"
        style={{ borderColor: `${theme.palette.goldAccent}50` }}
      >
        <div>
          <h4
            className="font-serif italic text-lg font-bold"
            style={{ color: theme.palette.primary }}
          >
            {isVelvet
              ? "The Homecoming Celebration"
              : isBotanical
              ? "Love in Full Bloom"
              : isCathedral
              ? "Sacred Matrimony"
              : isCelestial
              ? "Our Constellation of Love"
              : "Together Forever"}
          </h4>
          <p className="text-[9.5px] italic text-gray-500 max-w-[260px] mx-auto mt-0.5 leading-relaxed">
            &ldquo;{data.vowQuote || "Two souls entwined, beginning a lifetime of love and joy."}&rdquo;
          </p>
        </div>

        {/* Live Countdown Box */}
        <div
          className="p-2.5 rounded-xl border shadow-2xs space-y-1"
          style={{
            backgroundColor: `${theme.palette.bgCard}`,
            borderColor: `${theme.palette.goldAccent}40`,
          }}
        >
          <div
            className="flex items-center justify-center gap-1 text-[10px] font-bold"
            style={{ color: theme.palette.primary }}
          >
            <Clock className="w-3 h-3" style={{ color: theme.palette.goldAccent }} />
            <span>
              {isTraditional
                ? "Poruwa Nekath Countdown"
                : isBotanical
                ? "Garden Vows Countdown"
                : isCathedral
                ? "Cathedral Nuptials Countdown"
                : isVelvet
                ? "Homecoming Reception Countdown"
                : isCelestial
                ? "Starlight Vows Countdown"
                : "Wedding Vows Countdown"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 pt-0.5">
            {[
              { val: "42", label: "Days" },
              { val: "14", label: "Hrs" },
              { val: "28", label: "Mins" },
              { val: "50", label: "Secs" },
            ].map((t, idx) => (
              <div
                key={idx}
                className="p-1 rounded-lg bg-white border"
                style={{ borderColor: `${theme.palette.goldAccent}30` }}
              >
                <div
                  className="font-bold text-xs font-mono"
                  style={{ color: theme.palette.primary }}
                >
                  {t.val}
                </div>
                <div className="text-[7px] text-gray-500 uppercase">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. LOVE STORY / TIMELINE                                          */}
      {/* ================================================================= */}
      {data.story && data.story.length > 0 && (
        <section
          className="rounded-[24px] border bg-white/95 p-3.5 shadow-sm space-y-2.5"
          style={{ borderColor: `${theme.palette.goldAccent}40` }}
        >
          <div className="text-center">
            <span
              className="text-[8px] uppercase tracking-[0.25em] font-bold block"
              style={{ color: theme.palette.goldAccent }}
            >
              OUR JOURNEY
            </span>
            <h4
              className="font-serif italic text-lg font-bold"
              style={{ color: theme.palette.primary }}
            >
              The Story of Us
            </h4>
          </div>

          <div className="space-y-2 pt-1">
            {data.story.map((item, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div
                  className="px-1.5 py-0.5 rounded-full text-[8.5px] font-bold font-mono text-white shrink-0 mt-0.5"
                  style={{ backgroundColor: theme.palette.primary }}
                >
                  {item.year}
                </div>
                <div>
                  <h5 className="font-bold text-[10px] text-gray-800 leading-tight">
                    {item.title}
                  </h5>
                  <p className="text-[9px] text-gray-500 leading-relaxed mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 5. VENUE & SAVE THE DATE CARD                                     */}
      {/* ================================================================= */}
      <section className="space-y-2 pt-1">
        <div className="text-center space-y-0.5">
          <div
            className="inline-flex items-center gap-1 text-[10px] font-bold font-serif"
            style={{ color: theme.palette.goldAccent }}
          >
            <Clock className="w-3 h-3" />
            <span>Auspicious Time: {data.nekathTime || "10:00 AM"}</span>
          </div>
          <div
            className="text-[11px] font-serif font-bold tracking-wide uppercase"
            style={{ color: theme.palette.primary }}
          >
            📍 {data.venueName}
          </div>
          <p className="text-[9px] text-gray-500">{data.venueAddress}</p>
        </div>

        {/* Save to Calendar Button */}
        <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.palette.primary }}
            >
              <Calendar className="w-3 h-3" />
            </div>
            <div className="text-left">
              <h5
                className="font-serif font-bold text-[10.5px]"
                style={{ color: theme.palette.primary }}
              >
                Save the Date
              </h5>
              <p className="text-[8.5px] text-gray-500">
                {fullDateFormatted}
              </p>
            </div>
          </div>
          <span className="text-[9px] text-gray-400">📅</span>
        </div>

        {/* Google Maps CTA */}
        <a
          href={data.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 w-full py-2 rounded-xl text-white text-[10px] font-bold shadow-2xs hover:opacity-90 transition cursor-pointer"
          style={{ backgroundColor: theme.palette.primary }}
        >
          <Compass className="w-3 h-3" />
          <span>Open in Google Maps</span>
          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
        </a>
      </section>

      {/* ================================================================= */}
      {/* 6. PRE-SHOOT GALLERY: "CAPTURED MOMENTS"                          */}
      {/* ================================================================= */}
      <section className="space-y-2 pt-2">
        <div className="text-center">
          <span
            className="text-[8px] font-serif uppercase tracking-[0.25em] font-bold block"
            style={{ color: theme.palette.goldAccent }}
          >
            CAPTURED MOMENTS
          </span>
          <h4
            className="font-serif italic text-xl font-bold"
            style={{ color: theme.palette.primary }}
          >
            Our Gallery
          </h4>
          <div className="flex items-center justify-center gap-1.5 text-[#c5a059] mt-0.5">
            <span className="w-6 h-px bg-[#c5a059]/40" />
            <span className="text-[7px]">◆</span>
            <span className="w-6 h-px bg-[#c5a059]/40" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-0.5 h-48">
          <div
            onClick={() => onOpenLightbox && onOpenLightbox(data.gallery[0]?.url)}
            className="relative h-full rounded-xl overflow-hidden shadow-xs border border-white cursor-pointer group"
          >
            <Image
              src={data.gallery[0]?.url || "/images/templates/kandyan/gallery-1.png"}
              alt="Pre-shoot photo 1"
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
              sizes="140px"
            />
          </div>
          <div className="flex flex-col gap-1.5 h-full">
            <div
              onClick={() => onOpenLightbox && onOpenLightbox(data.gallery[1]?.url)}
              className="relative flex-1 rounded-xl overflow-hidden shadow-xs border border-white cursor-pointer group"
            >
              <Image
                src={data.gallery[1]?.url || "/images/templates/kandyan/gallery-2.png"}
                alt="Pre-shoot photo 2"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="140px"
              />
            </div>
            <div
              onClick={() => onOpenLightbox && onOpenLightbox(data.gallery[2]?.url)}
              className="relative flex-1 rounded-xl overflow-hidden shadow-xs border border-white cursor-pointer group"
            >
              <Image
                src={data.gallery[2]?.url || "/images/templates/kandyan/gallery-3.png"}
                alt="Pre-shoot photo 3"
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
                sizes="140px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. DRESS CODE & ATTIRE                                            */}
      {/* ================================================================= */}
      <section
        className="p-3 rounded-2xl border bg-white/95 shadow-2xs space-y-1 text-center"
        style={{ borderColor: `${theme.palette.goldAccent}40` }}
      >
        <div
          className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider"
          style={{ color: theme.palette.goldAccent }}
        >
          <Shirt className="w-3 h-3" />
          <span>Dress Code</span>
        </div>
        <h5
          className="font-serif font-bold text-[11px]"
          style={{ color: theme.palette.primary }}
        >
          {data.dressCodeTitle}
        </h5>
        <p className="text-[8.5px] text-gray-500 max-w-[260px] mx-auto leading-relaxed">
          {data.dressCodeDescription}
        </p>
      </section>

      {/* ================================================================= */}
      {/* 8. INTERACTIVE RSVP GUEST COUNTER & ATTENDANCE TOGGLE             */}
      {/* ================================================================= */}
      <section className="pt-1">
        <div
          className="p-3.5 rounded-2xl border shadow-xs text-center space-y-2.5 bg-white"
          style={{ borderColor: `${theme.palette.goldAccent}50` }}
        >
          <div className="space-y-0.5">
            <span
              className="text-[8px] uppercase tracking-[0.2em] font-bold"
              style={{ color: theme.palette.goldAccent }}
            >
              KINDLY RESPOND
            </span>
            <h4
              className="font-serif font-bold text-sm"
              style={{ color: theme.palette.primary }}
            >
              Will You Joyfully Attend?
            </h4>
          </div>

          {rsvpDone ? (
            <div className="py-2 flex flex-col items-center justify-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>RSVP Confirmed for {guestCount} Guest{guestCount > 1 ? "s" : ""}!</span>
              <span className="text-[8.5px] text-emerald-600 font-normal">
                Thank you for celebrating with us.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Accept / Decline Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-gray-50 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setAttending("ACCEPT")}
                  className={`py-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                    attending === "ACCEPT"
                      ? "bg-white text-emerald-800 shadow-xs border border-emerald-300"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  ✓ Joyfully Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttending("DECLINE")}
                  className={`py-1.5 rounded-lg text-[9px] font-bold transition cursor-pointer ${
                    attending === "DECLINE"
                      ? "bg-white text-rose-800 shadow-xs border border-rose-300"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  ✕ Regretfully Decline
                </button>
              </div>

              {attending === "ACCEPT" && (
                <div className="space-y-1 pt-1">
                  <span className="text-[9px] font-medium text-gray-600 block">
                    Number of Guests:
                  </span>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
                    >
                      -
                    </button>
                    <span
                      className="font-serif font-bold text-xl w-6"
                      style={{ color: theme.palette.primary }}
                    >
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm flex items-center justify-center cursor-pointer transition active:scale-95"
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
                <span>CONFIRM ATTENDANCE</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 9. WEDDING HASHTAG & CELEBRATION FOOTER                           */}
      {/* ================================================================= */}
      <div className="text-center space-y-1 pt-2 pb-6 border-t border-gray-100">
        {data.hashtag && (
          <span
            className="text-[9.5px] font-serif font-bold tracking-wider block"
            style={{ color: theme.palette.goldAccent }}
          >
            {data.hashtag}
          </span>
        )}
        <p className="text-[8px] text-gray-400">
          Created with WedLink.lk • Colombo, Sri Lanka
        </p>
      </div>
    </div>
  );
}
