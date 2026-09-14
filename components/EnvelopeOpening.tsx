"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Globe } from "lucide-react";
import { translations, Locale } from "@/lib/translations";
import CoupleWalkAndKiss from "./CoupleWalkAndKiss";

interface EnvelopeOpeningProps {
  guestName: string;
  salutation: string;
  coupleNames: string;
  initialLocale?: Locale;
  onStartOpen?: () => void;
  onOpen: (locale: Locale) => void;
}

// Synthesize a romantic royal harp chime using Web Audio API (100% reliable, zero external assets required)
function playRoyalHarpChime() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Harp arpeggio notes (C5, E5, G5, B5, C6, E6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51];
    const startTime = ctx.currentTime + 0.05;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = startTime + index * 0.08;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, noteTime);

      // Add gentle bell overtone
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.3);
    });
  } catch {}
}

export default function EnvelopeOpening({
  guestName,
  salutation,
  coupleNames,
  initialLocale = "en",
  onStartOpen,
  onOpen,
}: EnvelopeOpeningProps) {
  const [selectedLocale, setSelectedLocale] = useState<Locale>(initialLocale);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const t = translations[selectedLocale];

  // Check if previously opened in this session to allow direct view on refresh if preferred
  useEffect(() => {
    const wasOpened = sessionStorage.getItem("invite_envelope_opened");
    const savedLocale = sessionStorage.getItem("invite_locale") as Locale | null;
    if (savedLocale && ["en", "si", "ta"].includes(savedLocale)) {
      setSelectedLocale(savedLocale);
    }
    if (wasOpened === "true") {
      setHasDismissed(true);
    }
  }, []);

  // 3D Parallax tilt on mouse/touch movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpening) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 12), y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const monogram = (() => {
    const parts = (coupleNames || "").split(/&|and|\+/i).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]?.toUpperCase() || "S"} & ${parts[1][0]?.toUpperCase() || "S"}`;
    }
    const words = (coupleNames || "").trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]?.toUpperCase() || "S"} & ${words[words.length - 1][0]?.toUpperCase() || "S"}`;
    }
    return (coupleNames || "").slice(0, 2).toUpperCase() || "S & S";
  })();

  const handleSelectLanguage = (e: React.MouseEvent, loc: Locale) => {
    e.stopPropagation();
    setSelectedLocale(loc);
    sessionStorage.setItem("invite_locale", loc);
  };

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Immediately trigger synchronous playback hook within user touch/click gesture
    if (onStartOpen) {
      try {
        onStartOpen();
      } catch (err) {
        console.warn("onStartOpen error:", err);
      }
    }

    // Play royal harp arpeggio
    playRoyalHarpChime();

    // Multi-stage golden wedding confetti cannon burst
    try {
      // 1. Core golden stardust burst
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#ffd700", "#dfba73", "#ffffff", "#800020", "#c5a059"],
        shapes: ["circle", "square"],
        scalar: 1.1,
      });

      // 2. Dual side celebratory cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0.1, y: 0.6 },
          colors: ["#ffd700", "#dfba73", "#ffccd5"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 0.9, y: 0.6 },
          colors: ["#ffd700", "#dfba73", "#ffccd5"],
        });
      }, 250);

      // 3. Falling glitter rain
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 100,
          origin: { y: 0.3 },
          colors: ["#dfba73", "#ffffff", "#c5a059"],
          gravity: 0.7,
        });
      }, 500);
    } catch {}

    // Trigger flap unfold and letter slide sequence
    setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("invite_envelope_opened", "true");
      sessionStorage.setItem("invite_locale", selectedLocale);
      onOpen(selectedLocale);
    }, 550);

    // Smooth cinematic dissolve
    setTimeout(() => {
      setHasDismissed(true);
    }, 1600);
  };

  if (hasDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0d090c]/96 backdrop-blur-2xl transition-all duration-1000 overflow-y-auto p-4 ${
        isOpening && isOpen
          ? "opacity-0 pointer-events-none scale-110"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Royal Ambient Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(128,0,32,0.45)_0%,rgba(20,8,14,0.85)_55%,#0a0608_100%)] pointer-events-none" />

      {/* Floating Golden Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: "15%", left: "20%", delay: "0s", duration: "3s" },
          { top: "25%", left: "75%", delay: "1s", duration: "4s" },
          { top: "60%", left: "15%", delay: "0.5s", duration: "3.5s" },
          { top: "70%", left: "85%", delay: "1.5s", duration: "4.5s" },
          { top: "40%", left: "90%", delay: "2s", duration: "3.2s" },
          { top: "80%", left: "30%", delay: "0.8s", duration: "4s" },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] animate-sparkle"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Swaying Rose Petals System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "10%", delay: "0s", dur: "8s", size: "w-5 h-6", rotate: "rotate-12" },
          { left: "25%", delay: "3s", dur: "10s", size: "w-4 h-5", rotate: "-rotate-45" },
          { left: "70%", delay: "1.5s", dur: "9s", size: "w-6 h-7", rotate: "rotate-45" },
          { left: "85%", delay: "4.5s", dur: "11s", size: "w-4 h-5", rotate: "-rotate-12" },
          { left: "50%", delay: "6s", dur: "9.5s", size: "w-5 h-6", rotate: "rotate-90" },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute top-0 opacity-70 animate-petal-float`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.dur,
            }}
          >
            <div
              className={`${p.size} ${p.rotate} rounded-full bg-gradient-to-br from-[#e63956] via-[#9e1b32] to-[#590d1e] shadow-md border border-rose-300/30 blur-[0.3px]`}
            />
          </div>
        ))}
      </div>

      {/* Main Envelope Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full max-w-lg px-2 flex flex-col items-center select-none my-auto py-6"
      >
        {/* Language Selector Top Bar */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#dfba73] text-[10px] sm:text-xs font-cinzel font-semibold shadow-lg">
            <Globe className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>{t.selectLanguage}</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 p-1 rounded-2xl bg-[#1a0f15]/90 border border-[#dfba73]/50 shadow-2xl backdrop-blur-md max-w-full overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={(e) => handleSelectLanguage(e, "en")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-cinzel font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation whitespace-nowrap ${
                selectedLocale === "en"
                  ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.5)] scale-105"
                  : "text-[#edd892]/70 hover:text-[#ffd700] hover:bg-white/5"
              }`}
            >
              <span>En</span>
              <span>English</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleSelectLanguage(e, "si")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-cinzel font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation whitespace-nowrap ${
                selectedLocale === "si"
                  ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.5)] scale-105"
                  : "text-[#edd892]/70 hover:text-[#ffd700] hover:bg-white/5"
              }`}
            >
              <span>Si</span>
              <span>සිංහල</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleSelectLanguage(e, "ta")}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-cinzel font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer touch-manipulation whitespace-nowrap ${
                selectedLocale === "ta"
                  ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.5)] scale-105"
                  : "text-[#edd892]/70 hover:text-[#ffd700] hover:bg-white/5"
              }`}
            >
              <span>Ta</span>
              <span>தமிழ்</span>
            </button>
          </div>
        </div>

        {/* Header Ribbon & Monogram */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#dfba73] to-[#c5a059]" />
          <span className="text-[#dfba73] text-xs sm:text-sm uppercase tracking-[0.3em] font-cinzel font-bold flex items-center gap-2 drop-shadow-md text-center">
            <Sparkles className="w-3.5 h-3.5 text-[#edd892] animate-spin-slow flex-shrink-0" />
            <span>{t.royalInvitation}</span>
            <Sparkles className="w-3.5 h-3.5 text-[#edd892] animate-spin-slow flex-shrink-0" />
          </span>
          <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#dfba73] to-[#c5a059]" />
        </div>

        {/* ROMANTIC STAGE: GROOM & BRIDE WALK SEPARATE SIDES & MEET TO KISS */}
        <div className="w-full mb-5">
          <CoupleWalkAndKiss
            coupleNames={coupleNames}
            isOpening={isOpening}
          />
        </div>

        {/* 3D Realistic Royal Envelope Wrapper */}
        <div
          onClick={handleOpenEnvelope}
          className="relative w-full cursor-pointer transition-transform duration-300 ease-out"
          style={{
            perspective: "1200px",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Outer Velvet Pocket Box */}
          <div className="relative w-full aspect-[16/11] rounded-3xl bg-gradient-to-b from-[#3a101b] via-[#240810] to-[#140409] p-1.5 border-2 border-[#c5a059] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(197,160,89,0.35)] overflow-hidden">
            
            {/* Subtle Velvet Fabric Sheen Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(223,186,115,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* Corner Filigrees ⚜ */}
            <div className="absolute top-3 left-3 text-[#dfba73] text-sm select-none drop-shadow">⚜</div>
            <div className="absolute top-3 right-3 text-[#dfba73] text-sm select-none drop-shadow">⚜</div>
            <div className="absolute bottom-3 left-3 text-[#dfba73] text-sm select-none drop-shadow">⚜</div>
            <div className="absolute bottom-3 right-3 text-[#dfba73] text-sm select-none drop-shadow">⚜</div>

            {/* INSIDE: Royal Parchment Letter (Slides Upward when flap opens) */}
            <div
              className={`absolute inset-x-5 top-5 bottom-5 rounded-2xl bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f5ebd7] text-[#1a1517] p-5 sm:p-6 border-2 border-[#dfba73] shadow-xl flex flex-col justify-between items-center text-center transition-all duration-700 ${
                isOpening ? "animate-card-slide-up shadow-2xl" : "translate-y-0"
              }`}
            >
              {/* Inner Parchment Gold Border Frame */}
              <div className="absolute inset-1.5 rounded-xl border border-[#c5a059]/40 pointer-events-none" />

              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-bold block">
                  {t.speciallyPreparedFor}
                </span>
                <h2 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold mt-1 tracking-wide leading-snug drop-shadow-xs">
                  {salutation} {guestName}
                </h2>
              </div>

              {/* Couple Script & Heart Accent */}
              <div className="my-1">
                <p className="font-alex text-3xl sm:text-4xl text-[#800020] leading-none drop-shadow-xs">
                  {coupleNames}
                </p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-px w-8 bg-[#c5a059]/60" />
                  <span className="text-[10px] uppercase font-cinzel text-[#8c6a2b] tracking-widest font-semibold">
                    {t.homecomingCelebration}
                  </span>
                  <div className="h-px w-8 bg-[#c5a059]/60" />
                </div>
              </div>

              <div className="text-[10px] font-cinzel font-semibold text-[#8c6a2b] pb-0.5 tracking-wider">
                {t.cordiallyInvited}
              </div>
            </div>

            {/* FRONT POCKET (Triangular Pocket folds overlapping the card) */}
            <div
              className={`absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-[#20060e] via-[#2d0914] to-[#3a0d1a] border-t border-[#dfba73]/70 rounded-b-3xl transition-opacity duration-500 shadow-inner ${
                isOpening ? "opacity-75" : "opacity-95"
              }`}
              style={{
                clipPath: "polygon(0 35%, 50% 100%, 100% 35%, 100% 100%, 0% 100%)",
              }}
            />

            {/* 3D TOP TRIANGLE FLAP (Flips open upwards on tap) */}
            <div
              className={`absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#471221] via-[#350d18] to-[#250810] border-b-2 border-[#dfba73] rounded-t-3xl transition-all ${
                isOpening ? "animate-flap-open" : ""
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transformOrigin: "top center",
              }}
            >
              {/* Flap gold rim border lining */}
              <div
                className="absolute inset-x-0 top-0 h-full border-b border-[#ffd700]/60 pointer-events-none"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 98%)" }}
              />
            </div>

            {/* 3D WAX SEAL MEDALLION (Anchored at triangle tip) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 z-30 flex flex-col items-center">
              <div
                className={`relative wax-seal w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-center cursor-pointer border-2 border-[#ffd700]/70 shadow-[0_12px_28px_rgba(0,0,0,0.7),0_0_20px_rgba(223,186,115,0.4)] transition-transform duration-300 group-hover:scale-110 active:scale-95 touch-manipulation ${
                  isOpening ? "animate-seal-break" : ""
                }`}
              >
                {/* Glossy light reflection sweep */}
                <div className="absolute top-1.5 left-3 w-7 h-4 rounded-full bg-white/25 blur-[1px] -rotate-30 pointer-events-none" />

                {/* Monogram Text */}
                <span className="font-cinzel text-lg sm:text-2xl font-bold text-[#fffdfa] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] tracking-wider">
                  {monogram}
                </span>

                {/* Gold Heart Crest */}
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] fill-[#ffd700] mt-0.5 filter drop-shadow" />

                {/* Pulsing Aura Rings */}
                {!isOpening && (
                  <div className="absolute inset-0 -m-3 rounded-full border border-[#dfba73]/60 animate-ping opacity-35 pointer-events-none" />
                )}
              </div>

              {/* Gentle Tap Hint */}
              {!isOpening && (
                <span className="mt-2.5 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-[#dfba73]/40 text-[#dfba73] text-[9px] font-cinzel tracking-widest uppercase font-semibold animate-pulse shadow text-center line-clamp-1 max-w-[160px]">
                  {t.tapToBreakSeal}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Big Action Shimmer Button */}
        <button
          onClick={handleOpenEnvelope}
          disabled={isOpening}
          className="mt-6 btn-gold-shimmer px-8 sm:px-9 py-3.5 rounded-full font-cinzel text-xs sm:text-sm tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2.5 shadow-[0_10px_25px_rgba(197,160,89,0.35)] hover:scale-105 active:scale-95 transition cursor-pointer border border-[#fff2cf]/50 min-h-[48px] touch-manipulation animate-pulse-subtle"
        >
          <Sparkles className="w-4 h-4 text-[#1a1517] flex-shrink-0" />
          <span className="text-center">{isOpening ? t.openingInvitation : t.tapToOpen}</span>
          <Sparkles className="w-4 h-4 text-[#1a1517] flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}
