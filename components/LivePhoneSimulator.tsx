"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Sparkles, Mail, FileText, RotateCcw, Loader2 } from "lucide-react";
import { WedLinkTemplateTheme, WeddingDataPayload } from "@/lib/template-engine";

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
  // viewMode: "card" (unboxed authentic invitation design) or "envelope" (3D wax seal unboxing experience)
  const [viewMode, setViewMode] = useState<"card" | "envelope">("card");
  const [isLoading, setIsLoading] = useState(true);

  // When theme or viewMode changes, show quick subtle loading shimmer
  useEffect(() => {
    setIsLoading(true);
  }, [theme.id, viewMode]);

  const iframeSrc = `/templates/${theme.id}/preview?embed=true${
    viewMode === "card" ? "&opened=true" : ""
  }`;

  return (
    <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 w-full max-w-lg mx-auto select-none">
      {/* ------------------------------------------------------------- */}
      {/* TOP VIEWPORT CONTROLLER: CARD VIEW vs ENVELOPE UNBOXING */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between w-full max-w-[360px] mb-3 px-2">
        {/* Toggle Pills */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-[#c5a059]/40 rounded-full p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("card")}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "card"
                ? "bg-[#6b0f24] text-[#ffd700] shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Invitation Card</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("envelope")}
            className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "envelope"
                ? "bg-[#6b0f24] text-[#ffd700] shadow-sm font-bold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Mail className="w-3 h-3" />
            <span>Wax Seal</span>
          </button>
        </div>

        {/* Fullscreen external view link */}
        <Link
          href={`/templates/${theme.id}/preview`}
          target="_blank"
          className="text-xs font-semibold text-[#8a6a2a] hover:text-[#6b0f24] flex items-center gap-1 bg-white/90 hover:bg-white px-2.5 py-1 rounded-full border border-gray-200/80 shadow-xs transition backdrop-blur-md"
          title="Open full-page interactive preview in new tab"
        >
          <span>Full Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* REALISTIC SMARTPHONE CHASSIS & BEZEL */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-[320px] sm:w-[360px] max-w-full aspect-[9/18.8] rounded-[52px] p-3 sm:p-3.5 bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] border-[4px] border-[#64748b]/30 shrink-0">
        {/* Inner Black Bezel Frame */}
        <div className="relative w-full h-full rounded-[42px] bg-black overflow-hidden flex flex-col">
          {/* Dynamic Island / iPhone Speaker Notch Header */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 shadow-sm pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span className="text-[9px] font-mono font-bold text-white/90">9:41</span>
            <div className="w-3 h-1.5 rounded-xs border border-white/70" />
          </div>

          {/* Quick Reseal / Re-open floating badge at top right */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "card" ? "envelope" : "card")}
            className="absolute top-10 right-3.5 z-40 px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 text-[10px] font-medium border border-white/20 backdrop-blur-md flex items-center gap-1 transition cursor-pointer"
            title={viewMode === "card" ? "Switch to envelope unboxing" : "Switch to invitation card"}
          >
            <RotateCcw className="w-2.5 h-2.5 text-[#ffd700]" />
            <span>{viewMode === "card" ? "Seal" : "Card"}</span>
          </button>

          {/* Screen Container */}
          <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-neutral-900">
            {/* Loading Shimmer Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/95 text-gray-700 backdrop-blur-sm gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#d62851]" />
                <span className="text-xs font-serif font-semibold text-gray-600">
                  Loading {theme.name}...
                </span>
              </div>
            )}

            {/* Embedded Authentic Live Invitation Preview */}
            <iframe
              key={`${theme.id}-${viewMode}`}
              src={iframeSrc}
              onLoad={() => setIsLoading(false)}
              className="w-full h-full border-0 select-auto bg-transparent"
              title={`${theme.name} Authentic Invitation Demo`}
            />
          </div>
        </div>
      </div>

      {/* Footnote reassurance */}
      <p className="mt-3 text-[11px] font-serif text-gray-500 tracking-wide text-center">
        ✨ 100% identical design to your created wedding invitation card
      </p>
    </div>
  );
}
