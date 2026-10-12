"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  Crown,
  Heart,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Camera,
  MapPin,
  Send,
  ExternalLink,
  RotateCcw,
  Maximize2,
  Check,
  Compass,
  CheckCircle2,
  Eye,
  BookOpen,
  Users,
} from "lucide-react";
import { InvitationTemplate } from "@/lib/templates";
import { getWedLinkTemplate } from "@/lib/template-engine";
import ThemedPhoneInvitationBody from "@/components/ThemedPhoneInvitationBody";

interface TemplatePhoneMockupProps {
  template: InvitationTemplate;
  onSelect?: () => void;
  className?: string;
}

export default function TemplatePhoneMockup({
  template,
  onSelect,
  className = "",
}: TemplatePhoneMockupProps) {
  const [soundMuted, setSoundMuted] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);

  // Retrieve rich preset theme & demo data for this template
  const theme = getWedLinkTemplate(template.id);
  const data = theme.sampleData;

  const handleOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: theme.envelope.confettiColors || [
          template.primaryColor,
          template.accentColor,
          "#ffd700",
          "#ffffff",
        ],
      });
    } catch {}
    setIsOpen(true);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full flex flex-col items-center group ${className}`}>
      {/* Smartphone Outer Chassis with metallic silver/slate border */}
      <div className="relative w-[280px] sm:w-[290px] max-w-full aspect-[9/18.8] rounded-[48px] p-2.5 sm:p-3 bg-gradient-to-b from-[#e5e7eb] via-[#d1d5db] to-[#9ca3af] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border-[3px] border-[#9ca3af]/40 hover:shadow-[0_30px_70px_-10px_rgba(214,40,81,0.25)] transition-all duration-300 transform group-hover:-translate-y-1.5 shrink-0">
        {/* Inner Black Bezel */}
        <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden flex flex-col">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-between px-2 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]/80 animate-pulse" />
            <span className="text-[8px] font-mono text-white/80 font-bold">9:41</span>
            <div className="w-2.5 h-1 rounded-xs border border-white/60" />
          </div>

          {/* Audio Speaker Mute Toggle (Top right) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSoundMuted(!soundMuted);
            }}
            aria-label={soundMuted ? "Unmute music preview" : "Mute music preview"}
            className="absolute top-4 right-3.5 z-30 w-7 h-7 rounded-full bg-white/70 backdrop-blur-md border border-black/10 flex items-center justify-center text-gray-700 hover:bg-white hover:text-[#d62851] shadow-xs transition"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#d62851]" />}
          </button>

          {/* =============================================================== */}
          {/* SCREEN CONTENT AREA */}
          {/* =============================================================== */}
          <div className="relative w-full h-full overflow-hidden flex flex-col select-none">
            <AnimatePresence mode="wait">
              {/* ------------------------------------------------------------- */}
              {/* STATE 1: COVER SCREEN (Before Open) */}
              {/* ------------------------------------------------------------- */}
              {!isOpen ? (
                <motion.div
                  key="cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex flex-col justify-between text-center pt-9 pb-6 px-4"
                >
                  {/* 1. HIGH-FIDELITY ACTUAL TEMPLATE PREVIEWS */}
                  {template.previewImage && template.id !== "velvet-homecoming" && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-2.5 bg-black/5">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                        <Image
                          src={template.previewImage}
                          alt={template.name}
                          fill
                          priority
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. VELVET HOMECOMING EXACT SCREEN */}
                  {template.id === "velvet-homecoming" && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-2.5 bg-[#faf5eb]">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
                        <Image
                          src="/images/templates/velvet-homecoming/actual-template-screen.png"
                          alt="Velvet Homecoming actual template preview"
                          fill
                          priority
                          className="object-cover"
                          sizes="280px"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. FALLBACK STYLE A: MANDALA (when no previewImage) */}
                  {!template.previewImage && template.coverStyle === "mandala" && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf4] via-[#faf4e7] to-[#ede3cd] -z-10" />
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

                      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#8a5d20] font-serif font-medium">
                          The Wedding Of
                        </span>
                        <h3 className="font-serif italic text-2xl sm:text-[26px] text-[#8b1e2a] mt-2 font-normal leading-tight">
                          {template.coupleDemoNames}
                        </h3>
                        <p className="text-[10px] text-[#8a5d20]/80 font-serif mt-1.5">
                          {template.demoDate}
                        </p>
                      </div>
                    </>
                  )}

                  {/* 4. FALLBACK STYLE B: FLORAL SILK (when no previewImage) */}
                  {!template.previewImage && template.coverStyle === "floral-silk" && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#fbfdfa] via-[#f4f7f2] to-[#e8efe5] -z-10" />
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-80">
                        <svg viewBox="0 0 200 200" className="w-full h-full text-[#c5a059]">
                          <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" />
                          {[...Array(12)].map((_, i) => (
                            <circle
                              key={i}
                              cx="100"
                              cy="30"
                              r="6"
                              fill="currentColor"
                              opacity="0.3"
                              transform={`rotate(${i * 30} 100 100)`}
                            />
                          ))}
                        </svg>
                      </div>

                      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#40916c] font-serif font-medium">
                          The Wedding Of
                        </span>
                        <h3 className="font-serif italic text-2xl sm:text-[26px] text-[#2d6a4f] mt-2 font-normal leading-tight">
                          {template.coupleDemoNames}
                        </h3>
                        <p className="text-[10px] text-[#52796f] font-serif mt-1.5">
                          {template.demoDate}
                        </p>
                      </div>
                    </>
                  )}

                  {/* 5. FALLBACK STYLE C: ARCH DOORS (when no previewImage) */}
                  {!template.previewImage && template.coverStyle === "arch-doors" && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#f8f5ee] via-[#efe9dc] to-[#e4dcce] -z-10" />
                      <div className="absolute inset-3 rounded-t-[70px] border-4 border-[#c5a059]/40 pointer-events-none flex">
                        <div className="w-1/2 h-full border-r-2 border-[#c5a059]/40 bg-white/40 flex flex-col items-center justify-center">
                          <div className="w-16 h-28 border-2 border-[#c5a059]/30 rounded-t-full mb-auto mt-6" />
                          <div className="w-6 h-6 rounded-full border-2 border-[#c5a059] flex items-center justify-center my-auto mr-1 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#c5a059]" />
                          </div>
                          <div className="w-16 h-20 border-2 border-[#c5a059]/30 rounded-lg mt-auto mb-6" />
                        </div>
                        <div className="w-1/2 h-full bg-white/40 flex flex-col items-center justify-center">
                          <div className="w-16 h-28 border-2 border-[#c5a059]/30 rounded-t-full mb-auto mt-6" />
                          <div className="w-6 h-6 rounded-full border-2 border-[#c5a059] flex items-center justify-center my-auto ml-1 shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#c5a059]" />
                          </div>
                          <div className="w-16 h-20 border-2 border-[#c5a059]/30 rounded-lg mt-auto mb-6" />
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-col items-center justify-center my-auto bg-white/95 backdrop-blur-xs py-5 px-3 rounded-2xl border border-[#c5a059]/50 shadow-md mx-2">
                        <span className="text-[9px] uppercase tracking-[0.25em] text-[#8a6d3b] font-serif font-medium">
                          The Wedding Of
                        </span>
                        <h3 className="font-serif italic text-xl sm:text-2xl text-[#2b2623] mt-1 font-semibold leading-tight">
                          {template.coupleDemoNames}
                        </h3>
                        <p className="text-[10px] text-[#574d43] font-serif mt-1">
                          {template.demoDate}
                        </p>
                      </div>
                    </>
                  )}

                  {/* 6. FALLBACK STYLE D: EMBOSSED WAX ENVELOPE (when no previewImage) */}
                  {!template.previewImage && template.id !== "velvet-homecoming" && (template.coverStyle === "wax-envelope" || template.coverStyle === "minimalist-modern") && (
                    <>
                      <div className="absolute inset-0 bg-[#f9f8f5] -z-10" />
                      <div className="absolute inset-2 border border-[#e5dfd5] pointer-events-none rounded-2xl" />
                      <div className="absolute inset-x-0 top-0 h-40 pointer-events-none flex justify-center">
                        <svg viewBox="0 0 300 160" className="w-full h-full text-[#ebe4d8]">
                          <polygon points="0,0 300,0 150,130" fill="currentColor" opacity="0.6" />
                          <line x1="0" y1="0" x2="150" y2="130" stroke="#d6cfc3" strokeWidth="1.5" />
                          <line x1="300" y1="0" x2="150" y2="130" stroke="#d6cfc3" strokeWidth="1.5" />
                        </svg>
                      </div>

                      <div className="relative z-10 pt-4">
                        <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#786b5d] font-sans block">
                          You Are Invited
                        </span>
                        <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#786b5d] font-sans block">
                          To The Wedding Of
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-[#3d342a] mt-2 tracking-wide font-normal">
                          {template.coupleDemoNames}
                        </h3>
                        <p className="text-[10px] text-[#786b5d] tracking-widest font-mono mt-1">
                          {template.demoDate}
                        </p>
                      </div>

                      <div className="relative z-20 my-auto flex flex-col items-center">
                        <button
                          type="button"
                          onClick={handleOpen}
                          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#edd892] via-[#d6a97a] to-[#9e754e] shadow-[0_8px_20px_rgba(158,117,78,0.4)] border-2 border-white/80 flex flex-col items-center justify-center text-[#3d342a] transform active:scale-95 transition cursor-pointer group-hover:scale-105"
                        >
                          <Crown className="w-5 h-5 text-white drop-shadow-xs" />
                          <span className="text-[7.5px] font-serif font-bold text-white tracking-widest mt-0.5">
                            UNSEAL
                          </span>
                        </button>
                        <span className="text-[8.5px] text-[#786b5d] font-serif tracking-wider mt-2">
                          TAP TO BREAK THE SEAL
                        </span>
                      </div>
                    </>
                  )}

                  {/* ========================================================= */}
                  {/* INTERACTIVE ACTIONS OVERLAY (Exact Match to Image 2) */}
                  {/* ========================================================= */}
                  <div className="absolute bottom-3.5 inset-x-3 z-30 flex flex-col gap-2">
                    {/* Live Preview Button */}
                    <Link
                      href={`/templates/${template.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 rounded-full bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md border border-black/10 cursor-pointer active:scale-95 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-700" />
                      <span>Live preview</span>
                    </Link>

                    {/* Use this Design Button */}
                    <Link
                      href={`/onboard?template=${template.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1 shadow-md shadow-[#d62851]/25 cursor-pointer active:scale-95 transition"
                    >
                      <span>Use this design</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Bottom indicator line */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full opacity-40 z-30" />
                </motion.div>
              ) : (
                /* ------------------------------------------------------------- */
                /* STATE 2: UNBOXED DIGITAL INVITATION (Scrollable Inside Phone) */
                /* ------------------------------------------------------------- */
                <motion.div
                  key="invitation"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`relative w-full h-full overflow-y-auto scroll-smooth pt-11 pb-16 px-3.5 ${theme.palette.bgPage} text-[12px] leading-relaxed select-text`}
                  style={{ scrollbarWidth: "none" }}
                >
                  {/* Top Control Bar (Close / Fullscreen) */}
                  <div className="sticky top-0 -mt-2 -mx-3.5 px-3 py-1.5 bg-white/90 backdrop-blur-md border-b border-black/5 z-20 flex items-center justify-between shadow-2xs">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 hover:text-gray-900 transition cursor-pointer"
                      title="Close and re-seal envelope"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Re-seal</span>
                    </button>

                    <Link
                      href={`/templates/${template.id}`}
                      className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-2xs hover:opacity-90 transition cursor-pointer"
                      style={{ backgroundColor: theme.palette.primary }}
                      title="Open full interactive simulator"
                    >
                      <span>Fullscreen</span>
                      <Maximize2 className="w-2.5 h-2.5" />
                    </Link>
                  </div>

                  {/* ========================================================= */}
                  {/* DYNAMIC THEMED INVITATION BODY (Smart Distinct Layout) */}
                  {/* ========================================================= */}
                  <ThemedPhoneInvitationBody
                    theme={theme}
                    data={data}
                    isCompact={true}
                  />







                  {/* Safe bottom spacer */}
                  <div className="h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Template Metadata & Feature Badges (Matching Image 2) */}
      <div className="w-[280px] sm:w-[290px] mt-3 px-1 text-left space-y-1">
        <h4 className="font-bold text-sm text-gray-900 leading-tight">
          {template.name}
        </h4>
        <p className="text-xs text-gray-500 font-medium">
          {template.categoryLabel || "Wedding • Traditional"}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center" title="Audio Soundtrack">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center" title="Pre-shoot Gallery">
            <Camera className="w-3.5 h-3.5" />
          </span>
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center" title="Live RSVP & Guest Headcounts">
            <Users className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
