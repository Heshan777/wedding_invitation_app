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
  Camera,
  RotateCcw,
  Maximize2,
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

  // Retrieve rich preset theme & demo data for this template
  const theme = getWedLinkTemplate(template.id);
  const data = theme.sampleData;

  const handleOpen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      confetti({
        particleCount: 60,
        spread: 75,
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
            className="absolute top-4 right-3.5 z-30 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#d62851] shadow-xs transition"
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
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full flex flex-col justify-between text-center overflow-hidden cursor-pointer"
                  onClick={handleOpen}
                >
                  {/* High-Resolution Luxury Photorealistic Card Artwork */}
                  {template.previewImage ? (
                    <div className="absolute inset-0 z-10">
                      <Image
                        src={template.previewImage}
                        alt={template.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 280px, 290px"
                      />
                    </div>
                  ) : (
                    /* Fallback artistic background */
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#fdfbf7] via-[#faf4e7] to-[#ede3cd] p-4 flex flex-col items-center justify-center">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-[#8a5d20] font-serif font-medium">
                        The Wedding Of
                      </span>
                      <h3 className="font-serif italic text-2xl text-[#8b1e2a] mt-2 font-normal leading-tight">
                        {template.coupleDemoNames}
                      </h3>
                      <p className="text-[10px] text-[#8a5d20]/80 font-serif mt-1.5">
                        {template.demoDate}
                      </p>
                    </div>
                  )}

                  {/* Interactive Floating Center Wax Seal Medallion */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none pb-14">
                    <button
                      type="button"
                      onClick={handleOpen}
                      className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-br from-[#edd892] via-[#dfba73] to-[#9e7834] shadow-[0_10px_25px_rgba(0,0,0,0.6)] border-2 border-white/95 flex flex-col items-center justify-center text-[#422c07] transform hover:scale-110 active:scale-95 transition cursor-pointer group/seal"
                      title="Tap to unseal invitation"
                    >
                      <Crown className="w-5 h-5 text-[#422c07] group-hover/seal:scale-110 transition drop-shadow-xs" />
                      <span className="text-[7px] font-serif font-black tracking-widest mt-0.5">UNSEAL</span>
                    </button>
                    <span
                      onClick={handleOpen}
                      className="mt-2 text-[8px] font-bold text-white tracking-widest font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/55 backdrop-blur-xs px-2.5 py-0.5 rounded-full pointer-events-auto cursor-pointer hover:bg-black/75 transition"
                    >
                      TAP TO OPEN
                    </span>
                  </div>

                  {/* ========================================================= */}
                  {/* FROSTED ACTIONS OVERLAY (Bottom of Phone Screen) */}
                  {/* ========================================================= */}
                  <div className="absolute bottom-0 inset-x-0 z-30 pt-10 pb-3 px-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2 pointer-events-auto">
                    {/* Live Preview Button */}
                    <Link
                      href={`/templates/${template.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 rounded-full bg-white/95 hover:bg-white text-gray-900 text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 shadow-md border border-white/40 cursor-pointer active:scale-95 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-gray-700" />
                      <span>Live preview</span>
                    </Link>

                    {/* Use this Design Button */}
                    <Link
                      href={`/onboard?template=${template.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full py-2.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-1 shadow-md shadow-[#d62851]/30 cursor-pointer active:scale-95 transition"
                    >
                      <span>Use this design</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Bottom indicator line */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/60 rounded-full z-30 pointer-events-none" />
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
                  transition={{ duration: 0.45, ease: "easeOut" }}
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
                  {/* DYNAMIC THEMED INVITATION BODY */}
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

      {/* Template Metadata & Feature Badges (Matching invitation.lk) */}
      <div className="w-[280px] sm:w-[290px] mt-3 px-1 text-left space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-gray-900 leading-tight">
            {template.name}
          </h4>
          <span className="text-[10px] font-bold text-[#d62851] bg-[#fcecef] px-2 py-0.5 rounded-full">
            {template.badge || "Signature"}
          </span>
        </div>
        <p className="text-xs text-gray-500 font-medium">
          {template.categoryLabel || "Wedding • Traditional"}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center text-xs" title="Curated Music">
            <BookOpen className="w-3.5 h-3.5" />
          </span>
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center text-xs" title="Pre-shoot Gallery">
            <Camera className="w-3.5 h-3.5" />
          </span>
          <span className="w-6 h-6 rounded-md bg-[#fcecef] text-[#d62851] flex items-center justify-center text-xs" title="Live RSVP & Guest Headcounts">
            <Users className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
