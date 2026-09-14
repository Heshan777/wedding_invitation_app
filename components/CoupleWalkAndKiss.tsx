"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Heart, Sparkles, RotateCcw } from "lucide-react";

interface CoupleWalkAndKissProps {
  coupleNames: string;
  isOpening?: boolean;
  onKiss?: () => void;
  className?: string;
}

export default function CoupleWalkAndKiss({
  coupleNames,
  isOpening = false,
  onKiss,
  className = "",
}: CoupleWalkAndKissProps) {
  // State: "walking" | "kissing"
  const [phase, setPhase] = useState<"walking" | "kissing">("walking");
  const [isWalkingToMiddle, setIsWalkingToMiddle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: string; size: number }[]>([]);

  const triggerKiss = () => {
    setPhase("kissing");

    // Floating hearts bloom
    setHearts([
      { id: 1, left: 35, delay: "0s", size: 16 },
      { id: 2, left: 48, delay: "0.4s", size: 22 },
      { id: 3, left: 58, delay: "0.2s", size: 18 },
      { id: 4, left: 42, delay: "0.8s", size: 20 },
      { id: 5, left: 54, delay: "1.1s", size: 15 },
      { id: 6, left: 63, delay: "0.6s", size: 19 },
    ]);

    if (onKiss) {
      onKiss();
    }
  };

  // Start smooth GPU-accelerated CSS walk transition on mount
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsWalkingToMiddle(true);
    }, 60);

    const kissTimer = setTimeout(() => {
      triggerKiss();
    }, 2460);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(kissTimer);
    };
  }, []);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhase("walking");
    setIsWalkingToMiddle(false);
    setHearts([]);

    setTimeout(() => {
      setIsWalkingToMiddle(true);
    }, 60);

    setTimeout(() => {
      triggerKiss();
    }, 2460);
  };

  // Split couple names for romantic typography
  const [groomFirst, brideFirst] = React.useMemo(() => {
    const nameParts = (coupleNames || "").split(/&|and|\+/i).map((s) => s.trim()).filter(Boolean);
    return [nameParts[0] || "Groom", nameParts[1] || "Bride"];
  }, [coupleNames]);

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-center overflow-hidden border border-[#dfba73]/40 bg-gradient-to-b from-[#240810]/95 via-[#1a050c]/95 to-[#120308]/98 shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(223,186,115,0.2)] transition-all select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Starlight Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(223,186,115,0.18)_0%,rgba(102,16,34,0.15)_50%,transparent_75%)] pointer-events-none" />

      {/* Decorative Gold Filigree Corner Accents */}
      <div className="absolute top-2 left-2 text-[#dfba73] text-xs select-none drop-shadow opacity-70">⚜</div>
      <div className="absolute top-2 right-2 text-[#dfba73] text-xs select-none drop-shadow opacity-70">⚜</div>
      <div className="absolute bottom-2 left-2 text-[#dfba73] text-xs select-none drop-shadow opacity-70">⚜</div>
      <div className="absolute bottom-2 right-2 text-[#dfba73] text-xs select-none drop-shadow opacity-70">⚜</div>

      {/* Header Romantic Subtitle */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-3">
        <div className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent via-[#dfba73] to-transparent" />
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-cinzel font-bold text-[#ffd700] drop-shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#ffd700] animate-spin-slow" />
          <span>
            {phase === "walking" ? "Two Paths Guided By Love" : "Two Hearts Unite In Sacred Love"}
          </span>
          <Sparkles className="w-3 h-3 text-[#ffd700] animate-spin-slow" />
        </span>
        <div className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent via-[#dfba73] to-transparent" />
      </div>

      {/* THE ROMANTIC STAGE: WALKING & KISSING DISPLAY */}
      <div className="relative w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border border-[#c5a059]/30 bg-black/40 shadow-inner">
        
        {/* Glowing Starlight Walkway Carpet */}
        <div className="absolute bottom-4 inset-x-8 h-1 bg-gradient-to-r from-transparent via-[#ffd700]/70 to-transparent blur-[0.5px] pointer-events-none" />
        <div className="absolute bottom-4 inset-x-12 h-2.5 bg-gradient-to-r from-transparent via-[#dfba73]/30 to-transparent blur-xs pointer-events-none" />

        {/* Center Heart Meeting Beacon (visible during walking) */}
        {phase === "walking" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-0">
            <div className="w-8 h-8 rounded-full bg-[#800020]/80 border border-[#ffd700]/60 flex items-center justify-center shadow-[0_0_15px_rgba(223,186,115,0.7)] animate-pulse">
              <Heart className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
            </div>
            <span className="text-[9px] font-cinzel tracking-widest text-[#dfba73]/80 mt-1 uppercase font-semibold">
              Meet in the Middle
            </span>
          </div>
        )}

        {/* Floating Hearts Bloom (active when kissing) */}
        {phase === "kissing" &&
          hearts.map((h) => (
            <div
              key={h.id}
              className="absolute bottom-10 animate-float-heart pointer-events-none z-20"
              style={{
                left: `${h.left}%`,
                animationDelay: h.delay,
              }}
            >
              <Heart
                style={{ width: h.size, height: h.size }}
                className="text-[#ff758f] fill-[#e63956] filter drop-shadow-[0_0_6px_rgba(255,117,143,0.8)]"
              />
            </div>
          ))}

        {/* PHASE 1: GROOM & BRIDE WALKING TOWARDS EACH OTHER */}
        <div
          className={`absolute inset-0 flex items-center justify-between px-3 sm:px-6 transition-all duration-700 ${
            phase === "kissing" ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
          }`}
        >
          {/* GROOM (Left side -> walks right) */}
          <div
            className="flex flex-col items-center transition-transform duration-[2400ms] ease-in-out will-change-transform z-10"
            style={{
              transform: isWalkingToMiddle ? "translateX(135px)" : "translateX(0px)",
            }}
          >
            <div className="relative w-20 h-28 sm:w-24 sm:h-34 rounded-2xl overflow-hidden border-2 border-[#dfba73] shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(223,186,115,0.4)] bg-[#1a0810]">
              <Image
                src="/images/groom-walk.jpg"
                alt="Groom walking"
                fill
                sizes="(max-width: 640px) 96px, 120px"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1 inset-x-0 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase font-cinzel font-bold text-[#ffd700] tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 border border-[#dfba73]/40">
                  {groomFirst}
                </span>
              </div>
            </div>
            {/* Footstep Stardust */}
            <div className="w-10 h-1 mt-1 rounded-full bg-[#dfba73]/40 blur-xs" />
          </div>

          {/* BRIDE (Right side -> walks left) */}
          <div
            className="flex flex-col items-center transition-transform duration-[2400ms] ease-in-out will-change-transform z-10"
            style={{
              transform: isWalkingToMiddle ? "translateX(-135px)" : "translateX(0px)",
            }}
          >
            <div className="relative w-20 h-28 sm:w-24 sm:h-34 rounded-2xl overflow-hidden border-2 border-[#dfba73] shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(223,186,115,0.4)] bg-[#1a0810]">
              <Image
                src="/images/bride-walk.jpg"
                alt="Bride walking"
                fill
                sizes="(max-width: 640px) 96px, 120px"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1 inset-x-0 text-center">
                <span className="text-[9px] sm:text-[10px] uppercase font-cinzel font-bold text-[#ffd700] tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 border border-[#dfba73]/40">
                  {brideFirst}
                </span>
              </div>
            </div>
            {/* Footstep Stardust */}
            <div className="w-10 h-1 mt-1 rounded-full bg-[#dfba73]/40 blur-xs" />
          </div>
        </div>

        {/* PHASE 2: THE ROMANTIC KISS CENTERPIECE */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
            phase === "kissing" ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-90"
          }`}
        >
          {/* Radiant Gold Halo Glow behind Kiss Portrait */}
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-[#dfba73]/40 via-[#ffd700]/50 to-[#ff758f]/30 blur-lg animate-pulse pointer-events-none" />

          {/* Master Kiss Portrait Card */}
          <div className="relative w-28 h-36 sm:w-34 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#ffd700] shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_30px_rgba(223,186,115,0.6)] group/kiss cursor-pointer">
            <Image
              src="/images/couple-kiss.jpg"
              alt="Groom and Bride Kissing"
              fill
              sizes="(max-width: 640px) 140px, 170px"
              className="object-cover object-center transition-transform duration-700 group-hover/kiss:scale-105"
              priority
            />
            {/* Subtle Scrim Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 pointer-events-none" />

            {/* Glowing Floral Kiss Badge */}
            <div className="absolute bottom-1.5 inset-x-1.5 text-center">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#661022]/90 border border-[#ffd700]/70 text-[#ffd700] text-[9px] sm:text-[10px] font-cinzel font-bold shadow-md">
                <Heart className="w-2.5 h-2.5 fill-[#ffd700] text-[#ffd700]" />
                <span>Eternal Vows</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS & CONTROLS */}
      <div className="relative z-10 flex items-center justify-between mt-2.5 px-1">
        {/* Couple Calligraphy Names */}
        <p className="font-alex text-xl sm:text-2xl text-[#fff8ea] font-normal tracking-wide drop-shadow text-left">
          {coupleNames}
        </p>

        {/* Replay Walk & Kiss Button */}
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#661022] border border-[#dfba73]/40 text-[#dfba73] text-[10px] font-cinzel font-semibold transition cursor-pointer active:scale-95 shadow-xs"
          title="Watch the walk and kiss again"
        >
          <RotateCcw className="w-3 h-3 text-[#ffd700]" />
          <span>Replay Love Story</span>
        </button>
      </div>
    </div>
  );
}
