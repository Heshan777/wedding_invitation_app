"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  RotateCcw,
  Check,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Volume2,
  VolumeX,
  Heart,
  ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { InvitationTemplate, TEMPLATE_TO_ENDPOINT_NUMBER } from "@/lib/templates";
import { getWedLinkTemplate } from "@/lib/template-engine";
import ThemedPhoneInvitationBody from "./ThemedPhoneInvitationBody";

interface DashboardTemplatePreviewModalProps {
  template: InvitationTemplate | null;
  onClose: () => void;
  onApply: (templateId: string) => Promise<void> | void;
  isActive: boolean;
  isApplying: boolean;
  sampleToken?: string;
}

export default function DashboardTemplatePreviewModal({
  template,
  onClose,
  onApply,
  isActive,
  isApplying,
  sampleToken = "demo-preview",
}: DashboardTemplatePreviewModalProps) {
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (template) {
      setIsUnboxed(false);
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [template, onClose]);

  if (!template) return null;

  const endpointNum = TEMPLATE_TO_ENDPOINT_NUMBER[template.id] || 1;
  const wedlinkTheme = getWedLinkTemplate(template.id);

  const handleUnbox = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { y: 0.65 },
        colors: [template.primaryColor, template.accentColor, "#ffd700", "#ffffff"],
      });
    } catch {}
    setIsUnboxed(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* Top Controls Toolbar */}
      <div className="fixed top-4 right-4 sm:right-6 z-50 flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition cursor-pointer shadow-lg"
          aria-label="Close Preview"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Modal Box Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 my-auto py-4"
      >
        {/* Left Side: Phone Mockup Frame */}
        <div className="relative w-[310px] sm:w-[335px] h-[640px] max-h-[88vh] bg-neutral-900 rounded-[50px] p-3.5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-4 border-neutral-700 overflow-hidden shrink-0 flex flex-col justify-between ring-1 ring-white/10">
          
          {/* Dynamic Island Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 border border-white/10 pointer-events-none" />

          {/* Screen Content Wrapper */}
          <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col justify-between items-center select-none bg-[#fffdfa] border border-neutral-800/30">
            
            {/* Top Status Bar */}
            <div className="w-full flex justify-between items-center text-[9px] text-gray-500 pt-2 px-3 pb-1 z-30 bg-transparent shrink-0">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono px-1 rounded bg-black/10">
                  /invite{endpointNum}
                </span>
                <span>5G 100%</span>
              </div>
            </div>

            {/* If Not Unboxed Yet: Render The Gorgeous Themed Unboxing Cover Screen */}
            <AnimatePresence mode="wait">
              {!isUnboxed ? (
                <motion.div
                  key="cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full flex-1 flex flex-col justify-between items-center p-4 text-center overflow-hidden"
                  style={{
                    background: `linear-gradient(180deg, ${template.primaryColor} 0%, #160a12 100%)`,
                  }}
                >
                  {/* Subtle Background Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      background: `radial-gradient(circle at center, ${template.accentColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Header Badge */}
                  <div className="relative z-10 mt-3 space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-serif font-bold uppercase tracking-widest bg-black/50 text-[#dfba73] border border-[#dfba73]/40 backdrop-blur-sm">
                      {template.categoryLabel}
                    </span>
                    <p className="text-[8px] text-[#fdfbf7]/70 font-serif tracking-[0.2em] uppercase mt-1">
                      {template.tagline}
                    </p>
                  </div>

                  {/* Center Couple Typography */}
                  <div className="relative z-10 my-auto space-y-1.5 px-3">
                    <p className="text-[9px] font-serif uppercase tracking-[0.25em] text-[#dfba73]">
                      The Wedding Of
                    </p>
                    <h3 className="font-serif italic text-2xl sm:text-[26px] font-bold text-[#fdfbf7] leading-tight drop-shadow-md">
                      {template.coupleDemoNames}
                    </h3>
                    <div className="w-10 h-0.5 bg-[#dfba73] mx-auto my-1 rounded-full" />
                    <p className="text-[9px] text-[#fdfbf7]/80 font-sans">
                      {template.demoDate}
                    </p>
                  </div>

                  {/* Interactive Open Button */}
                  <div className="relative z-10 w-full mb-3 space-y-2">
                    <button
                      type="button"
                      onClick={handleUnbox}
                      className="w-full py-3 rounded-full font-serif font-bold text-xs shadow-xl transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 border border-white/30"
                      style={{
                        background: `linear-gradient(135deg, ${template.accentColor} 0%, ${template.primaryColor} 100%)`,
                        color: "#ffffff",
                      }}
                    >
                      <span>✉ Open &amp; Experience Invitation</span>
                      <Sparkles size={13} className="text-[#ffd700]" />
                    </button>
                    <p className="text-[9.5px] text-[#fdfbf7]/70 font-sans">
                      Tap to open full invitation &amp; RSVP
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Unboxed: Interactive Scrollable Invitation Body */
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full flex-1 overflow-y-auto scrollbar-none p-3 pb-8 text-left"
                >
                  {/* Re-seal button */}
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      onClick={() => setIsUnboxed(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/5 hover:bg-black/10 text-[9.5px] text-gray-500 font-sans transition cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      <span>Re-seal cover</span>
                    </button>
                  </div>

                  {/* Render Fully Themed Rich Invitation Body */}
                  <ThemedPhoneInvitationBody
                    theme={wedlinkTheme}
                    data={wedlinkTheme.sampleData}
                    isCompact={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Template Details & Quick Actions */}
        <div className="max-w-md w-full bg-[#1c1519] border border-[#dfba73]/40 rounded-3xl p-6 shadow-2xl text-[#fdfbf7] flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-[#800020]/60 text-[#dfba73] border border-[#dfba73]/40">
                {template.categoryLabel}
              </span>
              {template.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-[#dfba73]/20 text-[#dfba73] border border-[#dfba73]/30">
                  {template.badge}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#dfba73]">
                {template.name}
              </h3>
              <p className="text-xs text-[#fdfbf7]/70 font-sans mt-1 leading-relaxed">
                {template.description}
              </p>
            </div>

            {/* Color Palette Display */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] text-[#dfba73] font-mono">Curated Color Harmony:</span>
              <div className="flex items-center gap-2">
                {template.palette.map((swatch, idx) => (
                  <div key={idx} className="flex items-center gap-1 text-[10px] text-white/70">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <span className="hidden sm:inline font-mono">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] text-[#dfba73] font-mono">Specialized Animations &amp; Features:</span>
              <ul className="space-y-1 text-xs text-[#fdfbf7]/80">
                {template.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#dfba73] shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-4 border-t border-white/10">
            {isActive ? (
              <div className="w-full py-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-serif font-bold flex items-center justify-center gap-2 shadow-inner">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Currently Active on Your Wedding</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await onApply(template.id);
                  onClose();
                }}
                disabled={isApplying}
                className="w-full py-3.5 rounded-2xl bg-[#800020] hover:bg-[#990028] text-white border border-[#dfba73] font-serif font-bold text-xs tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#dfba73]" />
                <span>{isApplying ? "Applying Template..." : "Apply This Design to My Wedding"}</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`/invite${endpointNum}/${sampleToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-black/60 hover:bg-black/90 text-[#dfba73] hover:text-white border border-[#dfba73]/40 text-[11px] font-mono font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Live Route /invite{endpointNum}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`/templates/${template.id}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#2a1c24] hover:bg-[#3d2734] text-[#fdfbf7] border border-white/10 text-[11px] font-mono font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Full Screen View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
