"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Heart,
  Crown,
  Calendar,
  MapPin,
  Home,
  Mail,
} from "lucide-react";
import { WedLinkTemplateTheme, WeddingDataPayload } from "@/lib/template-engine";
import ThemedPhoneInvitationBody from "@/components/ThemedPhoneInvitationBody";

interface LivePhoneSimulatorProps {
  theme: WedLinkTemplateTheme;
  customData?: Partial<WeddingDataPayload>;
  onRsvpSubmit?: (formData: any) => Promise<boolean>;
}

export default function LivePhoneSimulator({
  theme,
  customData,
  onRsvpSubmit,
}: LivePhoneSimulatorProps) {
  const data = { ...theme.sampleData, ...customData };

  // States
  const [unboxed, setUnboxed] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "together" | "calendar" | "venue" | "rsvp">("home");

  // Lightbox Modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio playback handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  // Unboxing action (Triggering 3D Wax Seal break, confetti & music)
  const handleUnbox = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: theme.envelope.confettiColors || ["#c5a059", "#ffd700", "#7a1827", "#ffffff"],
      });
    } catch {}

    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }

    setUnboxed(true);
  };

  // Scroll to section inside mobile mockup
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Deterministic date formatting independent of client timezone / locale
  const dateParts = (() => {
    const raw = data.eventDate || "2026-12-12";
    const parts = raw.split("-");
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (parts.length === 3) {
      const y = parts[0];
      const mIdx = Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1));
      const d = parseInt(parts[2], 10) || 12;
      const dObj = new Date(Date.UTC(parseInt(y, 10), mIdx, d, 12, 0, 0));
      const dayName = daysOfWeek[dObj.getUTCDay()];
      const mName = months[mIdx];
      const mCap = mName.charAt(0) + mName.slice(1).toLowerCase();
      return {
        monthName: mName,
        dayNumber: d,
        yearNumber: y,
        formattedFull: `${dayName}, ${mCap} ${d}, ${y}`,
      };
    }
    return {
      monthName: "DECEMBER",
      dayNumber: 12,
      yearNumber: "2026",
      formattedFull: "Saturday, December 12, 2026",
    };
  })();

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-6 w-full max-w-lg mx-auto select-none">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={data.musicUrl || "/audio/background.mp3"}
        loop
        preload="auto"
      />

      {/* Realistic Smartphone Outer Chassis */}
      <div className="relative w-[320px] sm:w-[350px] max-w-full aspect-[9/18.8] rounded-[52px] p-3 sm:p-3.5 bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[4px] border-[#64748b]/30 shrink-0">
        {/* Inner Black Bezel */}
        <div className="relative w-full h-full rounded-[42px] bg-black overflow-hidden flex flex-col">
          {/* Dynamic Island / iPhone Speaker Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-white/90">9:41</span>
            <div className="w-3 h-1.5 rounded-xs border border-white/70" />
          </div>

          {/* Floating Maroon Round Audio Toggle (Matching Screenshot Exactly) */}
          <button
            type="button"
            onClick={toggleAudio}
            className="absolute top-10 right-4 z-40 w-7 h-7 rounded-full bg-[#7a1827] text-[#edd892] border border-[#c5a059]/40 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition cursor-pointer"
            title={isPlayingMusic ? "Pause background music" : "Play music"}
          >
            {isPlayingMusic ? (
              <span className="text-xs font-bold animate-pulse text-[#edd892]">♪</span>
            ) : (
              <span className="text-xs font-medium text-white/80">♪</span>
            )}
          </button>

          {/* ========================================================================= */}
          {/* SCREEN BODY CONTAINER */}
          {/* ========================================================================= */}
          <div
            ref={containerRef}
            className={`relative w-full h-full overflow-y-auto scroll-smooth pt-14 pb-20 px-3 font-sans ${theme.palette.bgPage} text-[13px] leading-relaxed`}
            style={{ scrollbarWidth: "none" }}
          >
            {/* ------------------------------------------------------------- */}
            {/* STAGE 1: UNBOXING & 3D WAX SEAL REVEAL (Interactive Cover) */}
            {/* ------------------------------------------------------------- */}
            <AnimatePresence>
              {!unboxed && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-30 flex flex-col justify-between items-center text-center p-5 bg-gradient-to-b from-[#fffdfa] via-[#faf4e8] to-[#eeddc5] overflow-hidden"
                >
                  {/* Ornate Gold Mandala Top Ring Graphic */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-85">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-[#c5a059]">
                      <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="2.5" />
                      <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                      {[...Array(16)].map((_, i) => (
                        <path
                          key={i}
                          d="M 100 100 L 100 25 Q 107 40 100 55"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          transform={`rotate(${i * 22.5} 100 100)`}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Header Titles */}
                  <div className="relative z-10 w-full pt-8">
                    <span
                      className="text-[10px] uppercase font-bold tracking-[0.25em] block"
                      style={{ color: theme.palette.goldAccent }}
                    >
                      The Wedding Of
                    </span>
                    <h2
                      className="font-serif italic text-2xl sm:text-3xl font-bold mt-2 leading-tight"
                      style={{ color: theme.palette.primary }}
                    >
                      {data.coupleNames}
                    </h2>
                    <p
                      className="text-xs mt-1.5 font-serif font-medium tracking-wide"
                      style={{ color: theme.palette.textMuted }}
                    >
                      {dateParts.formattedFull}
                    </p>
                  </div>

                  {/* Center 3D Wax Seal & Open Button */}
                  <div className="relative z-10 my-auto flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={handleUnbox}
                      className={`relative w-22 h-22 rounded-full flex flex-col items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.35)] border-4 cursor-pointer ${theme.envelope.waxColor} ${theme.envelope.waxBorder}`}
                      title="Click to break wax seal & open invitation"
                    >
                      {theme.envelope.waxSealSymbol === "mandala" && <Crown className="w-7 h-7 text-[#ffd700] drop-shadow" />}
                      {theme.envelope.waxSealSymbol === "crown" && <Crown className="w-7 h-7 text-white drop-shadow" />}
                      {theme.envelope.waxSealSymbol === "heart" && <Heart className="w-7 h-7 text-white fill-white drop-shadow" />}
                      {theme.envelope.waxSealSymbol === "butterfly" && <span className="text-2xl drop-shadow select-none">🦋</span>}

                      <span className="text-[7.5px] font-bold tracking-widest text-[#ffd700] mt-1 uppercase">
                        {theme.envelope.stampLabel}
                      </span>
                    </motion.button>

                    {/* Prominent OPEN INVITATION Pill Button */}
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={handleUnbox}
                      className="mt-5 px-5 py-2 rounded-full border bg-[#fffdfa]/95 hover:bg-white text-xs font-serif tracking-widest flex items-center gap-2 shadow-sm transition-all duration-300 cursor-pointer"
                      style={{
                        borderColor: theme.palette.goldAccent,
                        color: theme.palette.primary,
                      }}
                    >
                      <span>✉ OPEN INVITATION</span>
                    </motion.button>

                    <p
                      className="text-[10px] font-semibold mt-3 tracking-wider animate-pulse"
                      style={{ color: theme.palette.goldAccent }}
                    >
                      ✨ Tap to Unbox &amp; Play Soundtrack
                    </p>
                  </div>

                  {/* Kandyan Perahera frieze drummers at bottom of cover (Image 3 exact match) */}
                  {(theme.id === "golden-mandala-heritage" || theme.id === "nilame-traditional") && (
                    <div className="relative z-10 w-full h-8 opacity-90 my-1">
                      <Image
                        src="/images/templates/kandyan/perahera-frieze.png"
                        alt="Perahera drummers"
                        fill
                        className="object-contain object-bottom"
                      />
                    </div>
                  )}

                  <div className="relative z-10 pb-1 text-[9px] text-gray-400">
                    Handcrafted with WedLink.lk • Sri Lanka
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ------------------------------------------------------------- */}
            {/* STAGE 2: INVITATION SCROLL SECTIONS (When Unboxed) */}
            {/* ------------------------------------------------------------- */}
            <div className="space-y-6 pt-1">
              {/* Quick Re-seal bar */}
              <div className="flex items-center justify-between pb-1 border-b border-black/5">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-gray-400">
                  {theme.categoryLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setUnboxed(false)}
                  className="text-[10px] font-medium text-gray-500 hover:text-gray-800 transition cursor-pointer"
                >
                  ↺ Re-seal
                </button>
              </div>

              {/* ========================================================= */}
              {/* DYNAMIC THEMED INVITATION BODY (Smart Distinct Layout) */}
              {/* ========================================================= */}
              <ThemedPhoneInvitationBody
                theme={theme}
                data={data}
                onOpenLightbox={(url) => setSelectedPhoto(url)}
                isCompact={false}
              />








            </div>
          </div>

          {/* ========================================================================= */}
          {/* FLOATING BOTTOM 5-ICON MINI NAV BAR (Exact Image Match) */}
          {/* ========================================================================= */}
          {unboxed && (
            <div
              className="absolute bottom-2 inset-x-4 z-40 flex items-center justify-around py-2.5 rounded-full backdrop-blur-md border shadow-lg"
              style={{
                backgroundColor: "rgba(255, 253, 250, 0.95)",
                borderColor: `${theme.palette.goldAccent}40`,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab("home");
                  scrollToSection("section-hero");
                }}
                className="p-1.5 transition cursor-pointer"
                style={{
                  color: activeTab === "home" ? theme.palette.primary : theme.palette.goldAccent,
                  transform: activeTab === "home" ? "scale(1.15)" : "scale(1)",
                }}
                title="Home"
              >
                <Home className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("together");
                  scrollToSection("section-together");
                }}
                className="p-1.5 transition cursor-pointer"
                style={{
                  color: activeTab === "together" ? theme.palette.primary : theme.palette.goldAccent,
                  transform: activeTab === "together" ? "scale(1.15)" : "scale(1)",
                }}
                title="Love Story"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("calendar");
                  scrollToSection("section-calendar");
                }}
                className="p-1.5 transition cursor-pointer"
                style={{
                  color: activeTab === "calendar" ? theme.palette.primary : theme.palette.goldAccent,
                  transform: activeTab === "calendar" ? "scale(1.15)" : "scale(1)",
                }}
                title="Calendar / Save the Date"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("venue");
                  scrollToSection("section-venue");
                }}
                className="p-1.5 transition cursor-pointer"
                style={{
                  color: activeTab === "venue" ? theme.palette.primary : theme.palette.goldAccent,
                  transform: activeTab === "venue" ? "scale(1.15)" : "scale(1)",
                }}
                title="Location & Maps"
              >
                <MapPin className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("rsvp");
                  scrollToSection("section-rsvp");
                }}
                className="p-1.5 transition cursor-pointer"
                style={{
                  color: activeTab === "rsvp" ? theme.palette.primary : theme.palette.goldAccent,
                  transform: activeTab === "rsvp" ? "scale(1.15)" : "scale(1)",
                }}
                title="RSVP"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-lg w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={selectedPhoto}
              alt="Lightbox preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
