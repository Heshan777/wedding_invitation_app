"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { Template } from "@/types/template";
import TemplateScreenVisual from "@/components/TemplateScreenVisual";

interface PreviewModalProps {
  template: Template | null;
  onClose: () => void;
}

export default function PreviewModal({ template, onClose }: PreviewModalProps) {
  const [isUnboxed, setIsUnboxed] = useState(false);

  // Close on Escape key & reset unbox state
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

  const handleUnbox = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#d62851", "#ffd700", "#c5a059", "#ffffff"],
      });
    } catch {}
    setIsUnboxed(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      {/* Top Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/40 transition z-50 cursor-pointer"
        aria-label="Close Preview"
      >
        <X size={20} />
      </button>

      {/* Centered Phone Viewport */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[340px] h-[680px] max-h-[92vh] bg-neutral-900 rounded-[55px] p-4 shadow-2xl border-4 border-neutral-700 overflow-hidden shrink-0 flex flex-col justify-between"
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 pointer-events-none" />

        {/* Screen Content */}
        <div className="relative w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between items-center p-6 text-center select-none bg-white">
          {!isUnboxed ? (
            <>
              {/* Dynamic Theme Screen with Custom Animations */}
              <TemplateScreenVisual template={template} isModal={true} />

              <div className="relative z-30 mt-auto w-full flex flex-col items-center gap-2 pb-2">
                <button
                  type="button"
                  onClick={handleUnbox}
                  className="w-full py-3 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white font-serif font-bold text-xs shadow-xl transition cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>✉ Open &amp; Unbox Invitation</span>
                  <Sparkles size={14} />
                </button>

                <p className="text-[10px] text-gray-500 font-medium">
                  Tap to experience full animation &amp; soundtrack
                </p>
              </div>
            </>
          ) : (
            <div className="relative w-full h-full overflow-y-auto pt-10 pb-8 px-2 flex flex-col items-center text-center space-y-5">
              <button
                type="button"
                onClick={() => setIsUnboxed(false)}
                className="self-end text-[10px] text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Re-seal
              </button>

              <div className="space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-serif text-[#d62851] font-bold">
                  {template.title}
                </span>
                <h3 className="font-serif italic text-2xl font-bold text-gray-900">
                  {template.names}
                </h3>
                <p className="text-xs text-gray-500 font-serif">{template.date}</p>
                <p className="text-[10px] text-gray-400">{template.location}</p>
              </div>

              {/* Ceremony Milestones */}
              <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 text-left space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Wedding Events
                </p>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#fcecef] text-[#d62851] flex items-center justify-center text-xs font-bold font-mono">
                    01
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-gray-800">Poruwa Ceremony / Vows</h5>
                    <p className="text-[10px] text-gray-500">Auspicious Nekath at 09:18 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#fcecef] text-[#d62851] flex items-center justify-center text-xs font-bold font-mono">
                    02
                  </span>
                  <div>
                    <h5 className="font-bold text-xs text-gray-800">Grand Reception &amp; Dinner</h5>
                    <p className="text-[10px] text-gray-500">Commencing at 06:30 PM</p>
                  </div>
                </div>
              </div>

              {/* Make It Yours CTA */}
              <Link
                href={`/onboard?template=${template.slug}`}
                className="w-full py-3 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Make it yours</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
