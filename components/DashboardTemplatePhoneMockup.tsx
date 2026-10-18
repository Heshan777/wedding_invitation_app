"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, Heart, ShieldAlert, Church, Flower2, Moon, Compass } from "lucide-react";
import { InvitationTemplate } from "@/lib/templates";

interface DashboardTemplatePhoneMockupProps {
  template: InvitationTemplate;
  onPreview?: () => void;
}

export default function DashboardTemplatePhoneMockup({
  template,
  onPreview,
}: DashboardTemplatePhoneMockupProps) {
  const id = template.id;

  return (
    <div
      onClick={onPreview}
      className="relative w-32 h-52 sm:w-36 sm:h-56 rounded-[28px] p-2 bg-neutral-900 shadow-2xl border-2 border-neutral-700/80 ring-1 ring-black/40 overflow-hidden cursor-pointer group-hover/card:scale-105 group-hover/card:border-[#dfba73] transition-all duration-300 flex flex-col justify-between select-none"
    >
      {/* Phone Dynamic Island */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black rounded-full z-30 border border-white/10 pointer-events-none" />

      {/* Screen Container */}
      <div className="relative w-full h-full rounded-[20px] overflow-hidden flex flex-col justify-between items-center text-center p-2 pt-4">
        
        {/* =================================================================== */}
        {/* 1. GOLDEN MANDALA & SILK (Nethmi & Sanuja)                          */}
        {/* =================================================================== */}
        {id === "golden-mandala-heritage" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#fffbf2] via-[#f7eedf] to-[#e8d5b5] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Rotating Sacred Mandala Aura */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-28 pointer-events-none opacity-40">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-dashed border-[#c5a059] flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full border border-[#c5a059]/60" />
              </motion.div>
            </div>

            {/* Floating Gold Embers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [120, -10],
                    opacity: [0, 0.9, 0],
                    scale: [0.6, 1.2, 0.6],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: "easeInOut",
                  }}
                  className="absolute w-1 h-1 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700]"
                  style={{ left: `${20 + i * 22}%` }}
                />
              ))}
            </div>

            {/* Top Auspicious Header */}
            <div className="relative z-10 space-y-0.5 mt-0.5">
              <span className="text-[6.5px] font-bold tracking-[0.2em] text-[#8b1e2a] font-serif block">
                ශ්‍රී සුභ මංගලම්
              </span>
              <p className="text-[5.5px] uppercase tracking-[0.22em] text-[#8a5d20] font-serif">
                Auspicious Poruwa
              </p>
            </div>

            {/* Couple Names */}
            <div className="relative z-10 my-auto space-y-0.5">
              <div className="w-6 h-px bg-[#c5a059] mx-auto mb-1" />
              <h5 className="font-serif italic text-[11px] font-bold text-[#8b1e2a] leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#8a5d20] font-sans font-medium">
                {template.demoDate.split(",")[0] || "Saturday"}
              </p>
              <div className="w-6 h-px bg-[#c5a059] mx-auto mt-1" />
            </div>

            {/* Wax Seal / Open Button */}
            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-[#422c07] text-[6.5px] font-bold shadow-xs border border-[#ffd700]">
              ✉ Open Poruwa
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. BOTANICAL SILK & GOLD (Sanduni & Ravindu)                         */}
        {/* =================================================================== */}
        {id === "botanical-silk-sanduni" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#f8faf7] via-[#eef4ee] to-[#dce9da] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Animated Swaying Eucalyptus Garland */}
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 flex items-center justify-center gap-1 text-[#2d6a4f] opacity-80"
            >
              <span className="text-xs">🌿</span>
              <span className="text-[8px]">❦</span>
              <span className="text-xs">🌿</span>
            </motion.div>

            {/* Floating Soft Leaves */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, 160],
                    x: [0, (i % 2 === 0 ? 12 : -12)],
                    rotate: [0, 120],
                    opacity: [0, 0.75, 0],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut",
                  }}
                  className="absolute text-[8px] text-[#40916c]"
                  style={{ left: `${25 + i * 25}%` }}
                >
                  🍃
                </motion.div>
              ))}
            </div>

            {/* Top Botanical Accent */}
            <div className="relative z-10 mt-1">
              <p className="text-[5.5px] uppercase tracking-[0.25em] text-[#40916c] font-serif font-semibold">
                Botanical Garden
              </p>
            </div>

            {/* Couple Names */}
            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#1b4332] leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#40916c] font-sans">
                {template.demoDate.split(",")[0] || "December 2026"}
              </p>
            </div>

            {/* Button */}
            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-[#2d6a4f] text-[#ffffff] text-[6.5px] font-bold shadow-xs border border-[#e9d8a6]/40">
              ✉ View Garden Invite
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. CATHEDRAL PALACE DOORS (Shenali & Rovan)                          */}
        {/* =================================================================== */}
        {id === "cathedral-palace-doors" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#f9f7f2] via-[#efeae1] to-[#dfd7c9] flex flex-col justify-between items-center p-2 pt-4 text-center overflow-hidden">
            {/* French Arched Double Doors with Golden Seam Glow */}
            <div className="absolute inset-1.5 rounded-t-[32px] border border-[#c5a059]/50 flex overflow-hidden">
              {/* Left Door Panel */}
              <motion.div
                animate={{ rotateY: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                style={{ transformOrigin: "left center" }}
                className="w-1/2 h-full bg-[#fcfaf5] border-r border-[#c5a059]/40 flex flex-col items-center justify-center p-1 relative shadow-inner"
              >
                <div className="w-8 h-12 border border-[#c5a059]/30 rounded-t-full mb-auto mt-2" />
                {/* Antique Door Knocker */}
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-4 h-4 rounded-full border border-[#c5a059] flex items-center justify-center my-auto shadow-xs bg-[#fffaf0]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                </motion.div>
                <div className="w-8 h-10 border border-[#c5a059]/30 rounded-xs mt-auto mb-2" />
              </motion.div>

              {/* Right Door Panel */}
              <motion.div
                animate={{ rotateY: [0, 14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                style={{ transformOrigin: "right center" }}
                className="w-1/2 h-full bg-[#fcfaf5] flex flex-col items-center justify-center p-1 relative shadow-inner"
              >
                <div className="w-8 h-12 border border-[#c5a059]/30 rounded-t-full mb-auto mt-2" />
                <motion.div
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-4 h-4 rounded-full border border-[#c5a059] flex items-center justify-center my-auto shadow-xs bg-[#fffaf0]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                </motion.div>
                <div className="w-8 h-10 border border-[#c5a059]/30 rounded-xs mt-auto mb-2" />
              </motion.div>
            </div>

            {/* Inner Golden Light Beam Emerging between doors */}
            <motion.div
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-y-0 w-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent blur-[1px] pointer-events-none z-10"
            />

            {/* Floating Decree Overlay */}
            <div className="relative z-20 my-auto bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-[#c5a059]/60 shadow-md">
              <span className="text-[5.5px] uppercase tracking-[0.2em] text-[#8a6d3b] font-serif block font-semibold">
                HOLY MATRIMONY
              </span>
              <h5 className="font-serif italic text-[9.5px] font-bold text-[#2b2623] leading-tight">
                {template.coupleDemoNames}
              </h5>
            </div>

            <div className="relative z-20 mb-1 px-2.5 py-0.5 rounded-full bg-[#8a6d3b] text-white text-[6.5px] font-bold shadow-xs">
              🚪 Tap Doors to Open
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. EMBOSSED IVORY CREST (Kavindi & Dinuka)                          */}
        {/* =================================================================== */}
        {id === "embossed-ivory-envelope" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#faf8f5] to-[#ece7df] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Diagonal Sweeping Pearl Glint */}
            <motion.div
              animate={{ x: [-120, 200] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] pointer-events-none z-10"
            />

            {/* Embossed Monogram Crest */}
            <div className="relative z-10 mt-1">
              <div className="w-8 h-8 rounded-full border border-[#c5a059]/40 mx-auto flex items-center justify-center bg-white shadow-xs">
                <span className="font-serif text-[9px] font-bold text-[#c5a059]">K&amp;D</span>
              </div>
              <p className="text-[5.5px] uppercase tracking-[0.22em] text-[#8c6a2b] font-serif mt-1">
                Luxury Letterpress
              </p>
            </div>

            {/* Couple Names */}
            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#2b241c] leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#8c6a2b] font-sans">
                {template.demoDate.split(",")[0] || "Sunday"}
              </p>
            </div>

            {/* Wax Seal */}
            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-[#faf5eb] text-[#8c6a2b] text-[6.5px] font-bold shadow-xs border border-[#c5a059]/50">
              ⚜ Open Monogram
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. VELVET HOMECOMING & DAHLIA (Amaya & Dinuka)                       */}
        {/* =================================================================== */}
        {id === "velvet-homecoming" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#541221] via-[#380612] to-[#20030a] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Animated Fluttering Golden Butterflies */}
            <motion.div
              animate={{
                x: [0, 8, -6, 0],
                y: [0, -10, 5, 0],
                rotate: [0, 10, -6, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-3 text-sm pointer-events-none z-20"
            >
              🦋
            </motion.div>
            <motion.div
              animate={{
                x: [0, -6, 8, 0],
                y: [0, 10, -6, 0],
                rotate: [0, -8, 12, 0],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 right-3 text-xs pointer-events-none z-20"
            >
              🦋
            </motion.div>

            {/* Top Crest */}
            <div className="relative z-10 space-y-0.5 mt-0.5">
              <Crown className="w-3.5 h-3.5 text-[#dfba73] mx-auto" />
              <p className="text-[6px] uppercase tracking-[0.22em] text-[#dfba73] font-serif font-bold">
                Royal Homecoming
              </p>
            </div>

            {/* Couple Names in Gold */}
            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#fffdfa] leading-tight drop-shadow-xs">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#dfba73] font-sans">
                {template.demoDate.split(",")[0] || "Water's Edge"}
              </p>
            </div>

            {/* Velvet Button */}
            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#800020] to-[#b81d42] text-white text-[6.5px] font-bold shadow-xs border border-[#dfba73]/60">
              ✉ Break Wax Seal
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. MODERN IVORY & OBSIDIAN (Sarah & Daniel)                         */}
        {/* =================================================================== */}
        {id === "modern-ivory" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#000000] flex flex-col justify-between items-center p-2 pt-4 text-center border border-[#c5a059]/20">
            {/* Shimmering Gold Sweep */}
            <motion.div
              animate={{ x: [-100, 180] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent skew-x-[-25deg] pointer-events-none z-10"
            />

            <div className="relative z-10 mt-1">
              <span className="text-[6.5px] text-[#c5a059] block tracking-[0.25em] font-mono uppercase font-bold">
                BLACK TIE • MINIMAL
              </span>
            </div>

            <div className="relative z-10 my-auto px-1 py-1 border-y border-[#c5a059]/30 w-full">
              <h5 className="font-serif tracking-wider text-[9.5px] font-bold text-white uppercase leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[5.5px] text-white/60 font-mono tracking-widest mt-0.5">
                {template.demoDate.split(",")[0] || "OCTOBER 2026"}
              </p>
            </div>

            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-[#c5a059] text-black text-[6.5px] font-bold font-mono tracking-wider shadow-xs">
              ✉ OPEN DECREE
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 7. CELESTIAL MIDNIGHT (Kavindi & Dinuka)                            */}
        {/* =================================================================== */}
        {id === "celestial-midnight" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1329] via-[#0f1d3b] to-[#040812] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Twinkling Constellations & Crescent */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  className="absolute w-1 h-1 rounded-full bg-[#38bdf8] shadow-[0_0_5px_#38bdf8]"
                  style={{
                    top: `${15 + (i * 14)}%`,
                    left: `${15 + (i * 12) + (i % 2 === 0 ? 25 : -10)}%`,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-0.5 mt-0.5">
              <span className="text-[9px] block leading-none text-[#38bdf8] animate-pulse">✦</span>
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#38bdf8] font-serif font-bold">
                Celestial Union
              </p>
            </div>

            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#f8fafc] leading-tight drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#93c5fd] font-sans">
                {template.demoDate.split(",")[0] || "Under the Stars"}
              </p>
            </div>

            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white text-[6.5px] font-bold shadow-xs border border-[#60a5fa]/50">
              ✉ View Starlight
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 8. ETHEREAL BLUSH & PEONY (Tharushi & Akila)                         */}
        {/* =================================================================== */}
        {id === "ethereal-blush" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#fff0f5] via-[#fce7f3] to-[#fbcfe8] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Drifting Rose Petals */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, 150],
                    x: [0, (i % 2 === 0 ? 10 : -10)],
                    rotate: [0, 180],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Infinity,
                    delay: i * 1.2,
                  }}
                  className="absolute w-2 h-2.5 rounded-[50%_50%_50%_0%] bg-gradient-to-br from-[#f4728f] to-[#be185d]"
                  style={{ left: `${20 + i * 20}%` }}
                />
              ))}
            </div>

            <div className="relative z-10 space-y-0.5 mt-0.5">
              <span className="text-[10px] block leading-none">🌸</span>
              <p className="text-[6px] uppercase tracking-[0.2em] text-[#9f1239] font-serif font-bold">
                Ethereal Romance
              </p>
            </div>

            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#be185d] leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-[#9f1239]/80 font-sans">
                {template.demoDate.split(",")[0] || "Blush Peonies"}
              </p>
            </div>

            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-white/95 text-[#be185d] text-[6.5px] font-bold shadow-xs border border-[#fbcfe8]">
              ✉ Open Romance
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 9. ROYAL HERITAGE KANDYAN (Sachini & Kavinda)                        */}
        {/* =================================================================== */}
        {id === "royal-heritage" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a0e18] via-[#1a080f] to-[#0f0408] flex flex-col justify-between items-center p-2 pt-4 text-center">
            {/* Auspicious Oil Lamp Flame Flicker Animation */}
            <div className="relative z-10 space-y-0.5 mt-0.5">
              <motion.div
                animate={{ scale: [1, 1.2, 0.95, 1], opacity: [0.8, 1, 0.85, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-3.5 h-3.5 mx-auto text-[#ffd700]"
              >
                🪔
              </motion.div>
              <p className="text-[6px] uppercase tracking-[0.22em] text-[#ffd700] font-serif font-bold">
                Royal Kandyan
              </p>
            </div>

            <div className="relative z-10 my-auto space-y-0.5">
              <h5 className="font-serif italic text-[11px] font-bold text-[#dfba73] leading-tight">
                {template.coupleDemoNames}
              </h5>
              <p className="text-[6px] text-white/70 font-sans">
                {template.demoDate.split(",")[0] || "Heritage Poruwa"}
              </p>
            </div>

            <div className="relative z-10 mb-1 px-2.5 py-0.5 rounded-full bg-[#800020] text-[#dfba73] text-[6.5px] font-bold shadow-xs border border-[#dfba73]/70">
              ✉ View Royal Invite
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
