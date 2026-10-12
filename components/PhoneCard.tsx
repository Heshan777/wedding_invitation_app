"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Eye, Volume2, VolumeX } from "lucide-react";
import { Template } from "@/types/template";
import TemplateScreenVisual from "@/components/TemplateScreenVisual";

interface PhoneCardProps {
  template: Template;
  onPreview: (template: Template) => void;
}

export default function PhoneCard({ template, onPreview }: PhoneCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex flex-col items-center group w-full max-w-[290px]">
      {/* Mobile Outer Frame */}
      <div className="relative w-[280px] h-[580px] rounded-[50px] p-3.5 bg-neutral-900 shadow-2xl border-[4px] border-neutral-700/60 ring-1 ring-black/30 overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 shrink-0">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 pointer-events-none" />

        {/* Screen Content */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden flex flex-col justify-between items-center p-6 text-center select-none">
          {/* Distinct Thematic Visual & Custom Animations */}
          <TemplateScreenVisual template={template} />

          {/* Sound Toggle Button (Top Right) */}
          <button
            onClick={toggleSound}
            type="button"
            className="self-end z-20 mt-4 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 hover:bg-black/60 transition cursor-pointer active:scale-90"
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#ffd700]" />}
          </button>

          {/* Open Invitation CTA Inside Phone */}
          <button
            type="button"
            onClick={() => onPreview(template)}
            className="mb-1 z-30 px-5 py-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-md text-stone-900 text-xs font-serif font-bold shadow-lg border border-white/60 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            ✉ Open Invitation
          </button>
        </div>
      </div>

      {/* Action Buttons Below Phone Chassis (Matching Image) */}
      <div className="mt-4 flex items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={() => onPreview(template)}
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 shadow-sm transition text-neutral-800 cursor-pointer active:scale-95"
        >
          <Eye size={14} /> Live preview
        </button>

        <Link
          href={`/onboard?template=${template.slug}`}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
        >
          <span>Use this design</span>
        </Link>
      </div>
    </div>
  );
}
