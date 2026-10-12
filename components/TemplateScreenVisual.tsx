"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, Heart, ShieldAlert } from "lucide-react";
import { Template } from "@/types/template";

interface TemplateScreenVisualProps {
  template: Template;
  isModal?: boolean;
}

export default function TemplateScreenVisual({
  template,
  isModal = false,
}: TemplateScreenVisualProps) {
  const style = template.styleType;

  // --------------------------------------------------------------------------
  // 1. FLORAL PEONY ROMANCE (Sachini & Kavinda - Screenshot Match #1)
  // --------------------------------------------------------------------------
  if (style === "floral-peony") {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#fdfbf7] flex flex-col justify-between items-center p-5 text-center overflow-hidden select-none">
        {/* Soft blush radial background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffe8ec]/80 via-[#fff5f6]/50 to-[#faf6ef] -z-10" />

        {/* Floating Flower Petals Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -30,
                x: 30 + i * 40,
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                y: [0, 480],
                x: [30 + i * 40, 20 + i * 42 + (i % 2 === 0 ? 25 : -25), 30 + i * 40],
                opacity: [0, 0.75, 0.8, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6 + (i % 3) * 2,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "easeInOut",
              }}
              className="absolute w-3.5 h-4.5 rounded-[50%_50%_50%_0%] bg-gradient-to-br from-[#f8a5b5] to-[#f4728f] shadow-xs blur-[0.3px]"
            />
          ))}
        </div>

        {/* Top Watercolor Peony Bouquet Accent */}
        <div className="relative z-10 w-full pt-1 flex flex-col items-center">
          <div className="w-40 h-24 relative flex items-center justify-center">
            {/* Center large soft pink peony */}
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#fbcfe8] via-[#fda4af] to-[#f4728f] opacity-80 blur-[1px] absolute"
            />
            {/* Left rose */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-bl from-[#fed7aa] to-[#fecdd3] opacity-85 blur-[1px] absolute -left-1 top-4" />
            {/* Right white anemone */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fed7aa]/50 to-[#fecdd3] opacity-90 shadow-inner absolute -right-1 top-3 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#1e293b]" />
            </div>
            {/* Soft sage leaves */}
            <div className="w-6 h-10 rounded-[100%_0%] bg-[#84a98c] opacity-65 absolute -top-1 left-7 rotate-45" />
            <div className="w-6 h-10 rounded-[0%_100%] bg-[#84a98c] opacity-65 absolute -top-1 right-7 -rotate-45" />
          </div>

          <p className="text-[8.5px] uppercase tracking-[0.25em] text-[#9c7178] font-serif font-medium mt-1">
            TOGETHER WITH THEIR FAMILIES
          </p>
        </div>

        {/* Couple Names & Wording */}
        <div className="relative z-10 my-auto space-y-1.5 px-2">
          <h2 className="font-serif italic text-[27px] sm:text-[30px] font-normal text-[#6b353e] leading-tight drop-shadow-xs">
            {template.names}
          </h2>
          <p className="text-[9px] text-[#8c676d] font-serif max-w-[210px] mx-auto leading-relaxed italic">
            request the honour of your presence at the celebration of their marriage
          </p>

          <div className="pt-2 border-t border-[#f4c2cb]/50 mt-2">
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#9c7178] uppercase">
              SUNDAY
            </p>
            <p className="font-serif text-[13px] font-semibold text-[#6b353e] tracking-wide">
              {template.date}
            </p>
            <p className="text-[9.5px] text-[#8c676d] font-serif mt-0.5 tracking-wider">
              {template.location || "4:00 PM • HIKKADUWA BEACH RESORT"}
            </p>
          </div>
        </div>

        {/* Bottom Watercolor Border Accent */}
        <div className="relative z-10 w-full pb-1 flex justify-center">
          <div className="w-32 h-10 relative flex items-center justify-center opacity-85">
            <div className="w-10 h-10 rounded-full bg-gradient-to-t from-[#fda4af] to-[#fed7aa] blur-[1px] absolute" />
            <div className="w-8 h-8 rounded-full bg-[#84a98c] opacity-50 blur-[0.5px] absolute -left-3" />
            <div className="w-8 h-8 rounded-full bg-[#84a98c] opacity-50 blur-[0.5px] absolute -right-3" />
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. OCEAN BLUE & GOLD KINTSUGI (Anna & Yusuf - Screenshot Match #2)
  // --------------------------------------------------------------------------
  if (style === "ocean-agate") {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#0e2746] flex flex-col justify-between items-center p-5 text-center overflow-hidden select-none">
        {/* Ocean blue fluid watercolor background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] -z-10" />

        {/* Fluid Agate Veins Background (SVG Fluid Waves) */}
        <svg
          viewBox="0 0 300 600"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
        >
          {/* Deep Cyan/Blue Wash Layer */}
          <path
            d="M 0 0 C 120 80, 80 200, 20 280 C -30 350, 100 480, 40 600 L 0 600 Z"
            fill="url(#blueWash)"
            opacity="0.85"
          />
          {/* Right Fluid Layer */}
          <path
            d="M 300 0 C 200 120, 260 260, 210 380 C 160 500, 280 540, 300 600 Z"
            fill="url(#blueWash2)"
            opacity="0.75"
          />

          {/* Golden Kintsugi Veins (Animated Shimmering Gold Foil) */}
          <motion.path
            d="M 120 0 Q 70 120 110 220 T 60 380 Q 130 480 90 600"
            fill="none"
            stroke="url(#goldFoil)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 210 100 Q 250 200 190 320 T 260 520"
            fill="none"
            stroke="url(#goldFoil)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Smaller Branching Gold Veins */}
          <path d="M 110 220 L 150 260" stroke="#ffd700" strokeWidth="1.5" />
          <path d="M 60 380 L 30 420" stroke="#ffd700" strokeWidth="1.5" />
          <path d="M 190 320 L 160 350" stroke="#ffd700" strokeWidth="1.5" />

          <defs>
            <linearGradient id="blueWash" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="blueWash2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dfba73" />
              <stop offset="50%" stopColor="#fff3b0" />
              <stop offset="100%" stopColor="#c5a059" />
            </linearGradient>
          </defs>
        </svg>

        {/* Sweeping Gold Foil Glint Light Reflection Animation */}
        <motion.div
          animate={{ x: [-200, 350] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none z-10"
        />

        {/* Top Indigo Botanical Crest */}
        <div className="relative z-10 pt-3 flex flex-col items-center">
          <div className="w-16 h-10 flex items-center justify-center">
            <span className="text-xl">❦</span>
          </div>
          <p className="text-[8px] uppercase tracking-[0.25em] text-[#0369a1] font-serif font-bold">
            IN THE NAME OF ALLAH, THE MOST MERCIFUL
          </p>
        </div>

        {/* Center Calligraphy */}
        <div className="relative z-10 my-auto space-y-1 px-4 drop-shadow-md">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#0c4a6e] font-serif">
            The Wedding Of
          </p>
          <h2 className="font-serif italic text-[32px] sm:text-[36px] font-normal text-[#082f49] leading-tight">
            {template.names}
          </h2>
          <div className="w-12 h-0.5 bg-[#dfba73] mx-auto my-1 rounded-full" />
          <p className="text-[9px] text-[#075985] font-serif tracking-widest uppercase">
            SUNDAY
          </p>
          <p className="font-serif text-[13px] font-bold text-[#0c4a6e]">
            {template.date}
          </p>
          <p className="text-[10px] text-[#0369a1] font-serif">
            {template.location || "AT 9:00 AM • BERBELLE HOTEL"}
          </p>
        </div>

        {/* Bottom Salutation */}
        <div className="relative z-10 pb-2">
          <p className="text-[8px] font-serif italic text-[#075985] max-w-[220px] mx-auto leading-relaxed">
            Together with our families, we ask for your prayers and blessings as we unite.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 3. TOP SECRET DOSSIER / OPERATION BLUE WINGS (Screenshot Match #3)
  // --------------------------------------------------------------------------
  if (style === "top-secret-dossier") {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#ded2be] flex flex-col justify-between items-center p-4 text-left overflow-hidden select-none font-mono">
        {/* Manila vintage folder paper background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e8decb] via-[#e2d5c0] to-[#d6c7ae] -z-10 shadow-inner" />
        <div className="absolute inset-2 border border-[#b8a68b]/50 rounded-xl pointer-events-none" />

        {/* Red Classified Top Header Banner */}
        <div className="relative z-10 w-full">
          <div className="w-full bg-[#991b1b] text-[#fef2f2] text-center py-1 rounded-sm shadow-xs flex items-center justify-center gap-1.5 border-b border-[#7f1d1d]">
            <ShieldAlert size={11} className="text-[#fecaca]" />
            <span className="text-[9px] font-mono font-black tracking-[0.2em] uppercase">
              TOP SECRET // EYES ONLY
            </span>
          </div>

          {/* Metadata Block */}
          <div className="mt-3 px-2 text-[8px] leading-tight text-[#453c30] space-y-1">
            <div className="flex justify-between border-b border-[#c4b59f] pb-1">
              <span>CLASSIFICATION:</span>
              <span className="font-bold text-[#7f1d1d]">SLAF // MATRIMONIAL OP</span>
            </div>
            <div className="flex justify-between border-b border-[#c4b59f] pb-1">
              <span>OPERATION CODE:</span>
              <span className="font-bold tracking-wider text-[#1c1917]">BLUE WINGS</span>
            </div>
          </div>
        </div>

        {/* Center Dossier File Card & Slammed DECLASSIFIED Stamp */}
        <div className="relative z-10 w-full my-auto px-2 py-3 bg-[#f5efe6]/70 rounded-lg border border-[#c4b59f] shadow-xs">
          {/* Slammed DECLASSIFIED Red Rubber Stamp Animation */}
          <motion.div
            initial={{ scale: 2.2, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 0.92, rotate: -13 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
            className="absolute top-3 right-2 z-30 pointer-events-none border-[3px] border-[#dc2626] rounded-xs px-2 py-0.5 shadow-xs"
          >
            <span className="text-[13px] font-black text-[#dc2626] tracking-[0.18em] uppercase font-mono">
              DECLASSIFIED
            </span>
          </motion.div>

          {/* Dossier Typewriter Details */}
          <div className="space-y-1.5 text-[#292524] text-[8.5px]">
            <p className="text-[14px] font-black tracking-wider text-[#1c1917] font-serif border-b border-[#b8a68b] pb-1">
              {template.names}
            </p>
            <div className="grid grid-cols-2 gap-1 text-[8px] pt-1">
              <div>
                <span className="text-[#786b5b]">FILE NO:</span>{" "}
                <span className="font-bold">SLAF-2026-1114</span>
              </div>
              <div>
                <span className="text-[#786b5b]">CLEARANCE:</span>{" "}
                <span className="font-bold text-[#b91c1c]">LEVEL ∞</span>
              </div>
              <div>
                <span className="text-[#786b5b]">DATE:</span>{" "}
                <span className="font-bold">{template.date}</span>
              </div>
              <div>
                <span className="text-[#786b5b]">STATUS:</span>{" "}
                <span className="font-bold text-[#15803d]">INBOUND</span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-[#b8a68b]/70">
              <span className="font-bold text-[8px] text-[#7f1d1d] uppercase block">
                MISSION BRIEFING ENCLOSED:
              </span>
              <p className="text-[7.5px] text-[#574c3d] leading-normal mt-0.5">
                Contents pertain to the sacred union of two primary operatives. Guest clearance granted upon RSVP.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Briefing Bar */}
        <div className="relative z-10 w-full pb-1 text-center">
          <div className="inline-block px-3 py-1 bg-[#292524] text-[#edd892] rounded-xs text-[8px] tracking-[0.2em] font-mono uppercase shadow-xs">
            • MISSION CONFIDENTIAL •
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 4. NILAME TRADITIONAL / KANDYAN HERITAGE (Nethmi & Sanuja)
  // --------------------------------------------------------------------------
  if (style === "nilame-traditional") {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#fdfaf5] flex flex-col justify-between items-center p-5 text-center overflow-hidden select-none">
        {/* Ivory & Gold Parchment Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf4] via-[#faf4e7] to-[#ede3cd] -z-10" />

        {/* Sacred 24K Poruwa Mandala (Slow Celestial Rotation Animation) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-85">
          <motion.svg
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            viewBox="0 0 200 200"
            className="w-full h-full text-[#c5a059]"
          >
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
          </motion.svg>
        </div>

        {/* Auspicious Greeting */}
        <div className="relative z-10 pt-4 flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#8b1e2a] font-serif">
            ශ්‍රී සුභ මංගලම්
          </span>
          <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#8a5d20] font-serif font-medium mt-0.5">
            The Wedding Of
          </span>
        </div>

        {/* Couple & Date */}
        <div className="relative z-10 my-auto space-y-1 px-3">
          <h2 className="font-serif italic text-2xl sm:text-[28px] text-[#8b1e2a] font-bold leading-tight">
            {template.names}
          </h2>
          <div className="w-10 h-0.5 bg-[#c5a059] mx-auto my-1 rounded-full" />
          <p className="text-[10px] text-[#8a5d20] font-serif font-medium">
            {template.date}
          </p>
          <p className="text-[9px] text-[#8a5d20]/80 font-serif">
            {template.location || "KANDY HERITAGE PORUWA"}
          </p>
        </div>

        {/* Traditional Perahera Frieze Drummers at Bottom */}
        <div className="relative z-10 pb-2 text-[9px] text-[#8a5d20] font-serif tracking-widest uppercase">
          PORUWA CEREMONY &amp; RECEPTION
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 5. VELVET HOMECOMING (Amaya & Dinuka - Deep Burgundy + Butterflies)
  // --------------------------------------------------------------------------
  if (style === "velvet-homecoming") {
    return (
      <div className="absolute inset-0 w-full h-full bg-[#380612] flex flex-col justify-between items-center p-5 text-center overflow-hidden select-none">
        {/* Deep Velvet Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#541221] via-[#380612] to-[#25040b] -z-10" />

        {/* Fluttering Red Butterflies Animation */}
        <motion.div
          animate={{
            x: [0, 18, -12, 0],
            y: [0, -22, 10, 0],
            rotate: [0, 12, -8, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-12 left-6 text-xl pointer-events-none z-20 select-none"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{
            x: [0, -15, 10, 0],
            y: [0, 18, -15, 0],
            rotate: [0, -10, 15, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-6 text-xl pointer-events-none z-20 select-none"
        >
          🦋
        </motion.div>

        {/* Top Velvet Crest */}
        <div className="relative z-10 pt-4 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#dfba73] font-serif font-bold">
            ROYAL HOMECOMING RECEPTION
          </span>
        </div>

        {/* Couple & Date */}
        <div className="relative z-10 my-auto space-y-1 px-3">
          <h2 className="font-serif italic text-2xl sm:text-[28px] text-[#fffdfa] font-normal leading-tight">
            {template.names}
          </h2>
          <div className="w-10 h-0.5 bg-[#dfba73] mx-auto my-1 rounded-full" />
          <p className="text-[10px] text-[#dfba73] font-serif font-medium">
            {template.date}
          </p>
          <p className="text-[9px] text-[#e2d5c0] font-serif">
            {template.location || "WATER'S EDGE BATTARAMULLA"}
          </p>
        </div>

        <div className="relative z-10 pb-2 text-[9px] text-[#dfba73] font-serif tracking-widest uppercase">
          ELEGANCE &amp; GLAMOUR
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 6. CATHEDRAL PALACE DOORS (Shenali & Rovan)
  // --------------------------------------------------------------------------
  return (
    <div className="absolute inset-0 w-full h-full bg-[#f8f5ee] flex flex-col justify-between items-center p-5 text-center overflow-hidden select-none">
      {/* French Palace Arched Doors */}
      <div className="absolute inset-2 rounded-t-[70px] border-4 border-[#c5a059]/40 pointer-events-none flex -z-10">
        <div className="w-1/2 h-full border-r-2 border-[#c5a059]/40 bg-white/40 flex flex-col items-center justify-center">
          <div className="w-12 h-20 border-2 border-[#c5a059]/30 rounded-t-full mb-auto mt-6" />
          <div className="w-6 h-6 rounded-full border-2 border-[#c5a059] flex items-center justify-center my-auto mr-1 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#c5a059]" />
          </div>
          <div className="w-12 h-16 border-2 border-[#c5a059]/30 rounded-lg mt-auto mb-6" />
        </div>
        <div className="w-1/2 h-full bg-white/40 flex flex-col items-center justify-center">
          <div className="w-12 h-20 border-2 border-[#c5a059]/30 rounded-t-full mb-auto mt-6" />
          <div className="w-6 h-6 rounded-full border-2 border-[#c5a059] flex items-center justify-center my-auto ml-1 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#c5a059]" />
          </div>
          <div className="w-12 h-16 border-2 border-[#c5a059]/30 rounded-lg mt-auto mb-6" />
        </div>
      </div>

      <div className="relative z-10 pt-4">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#8a6d3b] font-serif font-medium">
          HOLY MATRIMONY
        </span>
      </div>

      <div className="relative z-10 my-auto bg-white/95 backdrop-blur-xs py-5 px-3 rounded-2xl border border-[#c5a059]/50 shadow-md mx-2 space-y-1">
        <p className="text-[9px] uppercase tracking-[0.2em] text-[#8a6d3b] font-serif">
          The Wedding Of
        </p>
        <h2 className="font-serif italic text-2xl text-[#2b2623] font-semibold leading-tight">
          {template.names}
        </h2>
        <p className="text-[10px] text-[#574d43] font-serif mt-1">
          {template.date}
        </p>
        <p className="text-[9px] text-[#8a6d3b] font-serif">
          {template.location || "ST. ANDREW'S CATHEDRAL"}
        </p>
      </div>

      <div className="relative z-10 pb-2 text-[9px] text-[#8a6d3b] font-serif tracking-widest uppercase">
        SACRED VOWS &amp; BLESSINGS
      </div>
    </div>
  );
}
