"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";

interface EnvelopeOpeningProps {
  guestName: string;
  salutation: string;
  coupleNames: string;
  onOpen: () => void;
}

export default function EnvelopeOpening({
  guestName,
  salutation,
  coupleNames,
  onOpen,
}: EnvelopeOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Check if previously opened in this session to allow direct view on refresh if preferred
  useEffect(() => {
    const wasOpened = sessionStorage.getItem("invite_envelope_opened");
    if (wasOpened === "true") {
      setHasDismissed(true);
    }
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    // Trigger golden celebratory confetti burst
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#dfba73", "#c5a059", "#ffffff", "#800020", "#ffd700"],
      });
      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#dfba73", "#c5a059", "#ffffff"],
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#dfba73", "#c5a059", "#ffffff"],
        });
      }, 250);
    } catch {
      // Confetti fallback safely ignored
    }

    // Flap opening sequence
    setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem("invite_envelope_opened", "true");
      onOpen();
    }, 400);

    // Smooth exit transition
    setTimeout(() => {
      setHasDismissed(true);
    }, 1100);
  };

  if (hasDismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0d0b0e]/95 backdrop-blur-xl transition-all duration-700 ${
        isOpening && isOpen ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(128,0,32,0.35)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        {/* Monogram Top Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c5a059]" />
          <span className="text-[#dfba73] text-xs uppercase tracking-[0.35em] font-cinzel font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#edd892]" /> Royal Invitation <Sparkles className="w-3.5 h-3.5 text-[#edd892]" />
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c5a059]" />
        </div>

        {/* 3D Envelope Container */}
        <div
          onClick={handleOpenEnvelope}
          className="group relative w-full cursor-pointer transition-all duration-500 hover:-translate-y-1"
          style={{ perspective: "1000px" }}
        >
          {/* Envelope Body */}
          <div className="relative w-full aspect-[16/11] rounded-2xl bg-gradient-to-b from-[#2a1a1f] to-[#181114] p-1 border border-[#c5a059]/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(197,160,89,0.2)]">
            {/* Inner Gold Foil Border */}
            <div className="relative w-full h-full rounded-xl border border-[#c5a059]/30 p-6 flex flex-col items-center justify-between overflow-hidden bg-gradient-to-br from-[#331b23]/80 via-[#231319]/90 to-[#150a0f]">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-[#c5a059]/40 text-xs select-none">✦</div>
              <div className="absolute top-2 right-2 text-[#c5a059]/40 text-xs select-none">✦</div>
              <div className="absolute bottom-2 left-2 text-[#c5a059]/40 text-xs select-none">✦</div>
              <div className="absolute bottom-2 right-2 text-[#c5a059]/40 text-xs select-none">✦</div>

              {/* Recipient Label */}
              <div className="text-center pt-2">
                <p className="text-[#edd892]/80 text-[11px] uppercase tracking-[0.25em] font-sans">
                  Specially Prepared For
                </p>
                <h2 className="font-serif italic text-2xl sm:text-3xl text-[#fdfbf7] font-semibold mt-1">
                  {salutation} {guestName}
                </h2>
              </div>

              {/* Center Seal Prompt */}
              <div className="relative my-2 flex flex-col items-center">
                {/* Wax Seal Button */}
                <div className="wax-seal w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center text-center cursor-pointer border-2 border-[#f3e5ab]/30 relative z-20">
                  <span className="font-cinzel text-lg sm:text-xl font-bold text-[#fdfbf7] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wider">
                    S & S
                  </span>
                  <Heart className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700] mt-0.5" />
                </div>

                {/* Pulse Ring */}
                <div className="absolute inset-0 -m-2 rounded-full border border-[#dfba73]/40 animate-ping opacity-30 pointer-events-none" />
              </div>

              {/* Bottom Couple Text */}
              <div className="text-center pb-1">
                <p className="font-alex text-2xl sm:text-3xl text-[#dfba73]">
                  {coupleNames}
                </p>
              </div>
            </div>

            {/* Envelope Triangle Flap visual hint */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#c5a059]/15 to-transparent pointer-events-none rounded-t-2xl" />
          </div>
        </div>

        {/* Action instruction */}
        <button
          onClick={handleOpenEnvelope}
          disabled={isOpening}
          className="mt-8 btn-gold-shimmer px-8 py-3.5 rounded-full font-cinzel text-sm tracking-[0.15em] uppercase font-bold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          {isOpening ? "Opening Your Invitation..." : "Tap to Open Invitation"}
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
