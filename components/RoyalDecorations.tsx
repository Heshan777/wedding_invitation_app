"use client";

import React from "react";

/**
 * Royal Corner Flourish - Handcrafted SVG Victorian / Baroque gold filigree corner.
 * Renders in any of the 4 corners of an invitation card using CSS transforms.
 */
export function RoyalCornerFlourish({
  position = "top-left",
  size = 64,
  className = "",
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  className?: string;
}) {
  const transformClass = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 -scale-x-100",
    "bottom-left": "bottom-0 left-0 -scale-y-100",
    "bottom-right": "bottom-0 right-0 -scale-x-100 -scale-y-100",
  }[position];

  const gradientId = `gold-grad-${position}`;

  return (
    <div
      className={`absolute ${transformClass} pointer-events-none select-none z-10 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xs"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfba73" />
            <stop offset="35%" stopColor="#fff2cf" />
            <stop offset="65%" stopColor="#c5a059" />
            <stop offset="100%" stopColor="#8c6a2b" />
          </linearGradient>
        </defs>

        {/* Outer Hairline L-Bracket */}
        <path
          d="M 6 52 L 6 12 C 6 8.7 8.7 6 12 6 L 52 6"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Inner Dotted Bracket */}
        <path
          d="M 14 44 L 14 16 C 14 14.9 14.9 14 16 14 L 44 14"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
          strokeDasharray="2 3"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* Main Swirling Acanthus Tendril */}
        <path
          d="M 6 36 C 8 30 14 26 22 26 C 28 26 34 22 36 14 C 37 10 33 6 28 6 C 22 6 18 10 18 16 C 18 20 22 22 24 20"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Counter-Swirl Towards Center */}
        <path
          d="M 24 24 C 32 32 40 28 46 36 C 50 42 46 50 38 48 C 32 46 30 38 36 34 C 40 30 46 34 44 38"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Elegant Corner Leaf Palmette */}
        <path
          d="M 12 12 Q 26 20 28 28 Q 20 26 12 12 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.35"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
        />
        <path
          d="M 10 24 Q 18 28 20 36 Q 14 34 10 24 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.25"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.8"
        />
        <path
          d="M 24 10 Q 28 18 36 20 Q 34 14 24 10 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.25"
          stroke={`url(#${gradientId})`}
          strokeWidth="0.8"
        />

        {/* Accent Beads / Jewels */}
        <circle cx="6" cy="56" r="2" fill={`url(#${gradientId})`} />
        <circle cx="56" cy="6" r="2" fill={`url(#${gradientId})`} />
        <circle cx="10" cy="10" r="2.5" fill={`url(#${gradientId})`} />
        <circle cx="28" cy="28" r="2" fill={`url(#${gradientId})`} />

        {/* Sparkling 4-point Diamond Star */}
        <path
          d="M 32 32 Q 32 36 36 36 Q 32 36 32 40 Q 32 36 28 36 Q 32 36 32 32 Z"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </div>
  );
}

/**
 * Royal Botanical Flourish Divider - Symmetrical gold vine flourish with center blossom/crown.
 */
export function RoyalFlourishDivider({
  className = "",
  variant = "lotus",
}: {
  className?: string;
  variant?: "lotus" | "crown" | "heart";
}) {
  const gradientId = `flourish-grad-${variant}`;

  return (
    <div
      className={`flex items-center justify-center my-8 sm:my-10 pointer-events-none select-none px-4 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 28"
        className="w-full max-w-xs sm:max-w-md h-7 overflow-visible drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c5a059" stopOpacity="0" />
            <stop offset="20%" stopColor="#c5a059" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#dfba73" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fff2cf" stopOpacity="1" />
            <stop offset="55%" stopColor="#dfba73" stopOpacity="0.9" />
            <stop offset="80%" stopColor="#c5a059" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Left Tapering Hairline */}
        <line
          x1="10"
          y1="14"
          x2="100"
          y2="14"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Right Tapering Hairline */}
        <line
          x1="220"
          y1="14"
          x2="310"
          y2="14"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Left Botanical Curlicues & Leaves */}
        <path
          d="M 98 14 C 110 14 116 8 126 8 C 134 8 140 14 146 14 C 142 16 136 20 128 20 C 118 20 114 14 102 14"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 112 11 Q 118 5 124 9 Q 118 13 112 11 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.6"
        />
        <path
          d="M 132 17 Q 138 23 144 19 Q 138 15 132 17 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.6"
        />
        <circle cx="106" cy="14" r="1.5" fill={`url(#${gradientId})`} />
        <circle cx="140" cy="14" r="1.5" fill={`url(#${gradientId})`} />

        {/* Right Botanical Curlicues & Leaves (Symmetrical) */}
        <path
          d="M 222 14 C 210 14 204 8 194 8 C 186 8 180 14 174 14 C 178 16 184 20 192 20 C 202 20 206 14 218 14"
          stroke={`url(#${gradientId})`}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M 208 11 Q 202 5 196 9 Q 202 13 208 11 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.6"
        />
        <path
          d="M 188 17 Q 182 23 176 19 Q 182 15 188 17 Z"
          fill={`url(#${gradientId})`}
          fillOpacity="0.6"
        />
        <circle cx="214" cy="14" r="1.5" fill={`url(#${gradientId})`} />
        <circle cx="180" cy="14" r="1.5" fill={`url(#${gradientId})`} />

        {/* Center Motif */}
        {variant === "lotus" && (
          <g transform="translate(160, 14)">
            {/* Center Lotus Petal */}
            <path
              d="M 0 -11 C -4 -4 -3 5 0 8 C 3 5 4 -4 0 -11 Z"
              fill={`url(#${gradientId})`}
            />
            {/* Left Lotus Petal */}
            <path
              d="M -2 0 C -9 -5 -11 1 -5 5 C -2 6 0 3 -2 0 Z"
              fill={`url(#${gradientId})`}
              fillOpacity="0.75"
            />
            {/* Right Lotus Petal */}
            <path
              d="M 2 0 C 9 -5 11 1 5 5 C 2 6 0 3 2 0 Z"
              fill={`url(#${gradientId})`}
              fillOpacity="0.75"
            />
            {/* Glistening Seed / Bead */}
            <circle cx="0" cy="9" r="1.8" fill="#fff2cf" />
          </g>
        )}

        {variant === "crown" && (
          <g transform="translate(160, 14)">
            <path
              d="M -10 6 L -12 -5 L -5 0 L 0 -8 L 5 0 L 12 -5 L 10 6 Z"
              fill={`url(#${gradientId})`}
            />
            <circle cx="-12" cy="-6" r="1.2" fill="#fff2cf" />
            <circle cx="0" cy="-9" r="1.5" fill="#fff2cf" />
            <circle cx="12" cy="-6" r="1.2" fill="#fff2cf" />
            <rect x="-9" y="7" width="18" height="2" rx="1" fill={`url(#${gradientId})`} />
          </g>
        )}

        {variant === "heart" && (
          <g transform="translate(160, 14)">
            <path
              d="M 0 8 C -8 2 -10 -4 -6 -7 C -2 -9 0 -5 0 -4 C 0 -5 2 -9 6 -7 C 10 -4 8 2 0 8 Z"
              fill={`url(#${gradientId})`}
            />
            <circle cx="0" cy="-6" r="1" fill="#fff2cf" />
          </g>
        )}
      </svg>
    </div>
  );
}

/**
 * Royal Crest Emblem - Embossed royal laurel medallion with crown and couple monogram.
 */
export function RoyalCrest({
  monogram = "S & S",
  className = "",
  size = 72,
}: {
  monogram?: string;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Pulsing Back-Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dfba73]/25 via-[#ffd700]/30 to-transparent blur-md animate-pulse" />

      {/* SVG Royal Crest Ring */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="crestGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfba73" />
            <stop offset="30%" stopColor="#fff2cf" />
            <stop offset="60%" stopColor="#c5a059" />
            <stop offset="100%" stopColor="#8c6a2b" />
          </linearGradient>
          <radialGradient id="sealRed" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#8a142d" />
            <stop offset="60%" stopColor="#661022" />
            <stop offset="100%" stopColor="#3d0510" />
          </radialGradient>
        </defs>

        {/* Outer Laurel Wreath Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#crestGold)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          strokeOpacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke="url(#crestGold)"
          strokeWidth="1.8"
        />

        {/* Inner Seal Medallion */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="url(#sealRed)"
          stroke="url(#crestGold)"
          strokeWidth="1.2"
        />

        {/* Laurel Leaves Surround (Left & Right arcs) */}
        {/* Left Wreath Leaves */}
        <path
          d="M 18 42 C 14 48 16 58 24 64 M 14 48 Q 20 49 20 54 M 18 56 Q 24 57 23 62"
          stroke="url(#crestGold)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* Right Wreath Leaves */}
        <path
          d="M 82 42 C 86 48 84 58 76 64 M 86 48 Q 80 49 80 54 M 82 56 Q 76 57 77 62"
          stroke="url(#crestGold)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Royal Crown Arch at Apex */}
        <g transform="translate(50, 24)">
          <path
            d="M -11 6 L -13 -3 L -6 1 L 0 -6 L 6 1 L 13 -3 L 11 6 Z"
            fill="url(#crestGold)"
          />
          <circle cx="-13" cy="-4" r="1.3" fill="#fffdfa" />
          <circle cx="0" cy="-7.5" r="1.6" fill="#fffdfa" />
          <circle cx="13" cy="-4" r="1.3" fill="#fffdfa" />
          <rect x="-10" y="7" width="20" height="2" rx="1" fill="#dfba73" />
        </g>
      </svg>

      {/* Monogram Text Overlay in Center */}
      <div className="absolute inset-0 flex items-center justify-center pt-2 pointer-events-none">
        <span className="font-cinzel font-bold text-[#fff4d6] text-xs sm:text-sm tracking-wider drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {monogram}
        </span>
      </div>
    </div>
  );
}

/**
 * Royal Card Deckle-Edge Frame - Inset gold foil decorative border with corner brackets.
 */
export function GildedCardBorder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-2 sm:inset-3 rounded-xl sm:rounded-2xl pointer-events-none select-none z-10 ${className}`}
      aria-hidden="true"
    >
      {/* Outer Fine Hairline */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-[#c5a059]/40" />

      {/* Inner Dotted Filigree Border with 4px gap */}
      <div className="absolute inset-1 sm:inset-1.5 rounded-lg sm:rounded-xl border border-dashed border-[#dfba73]/30" />

      {/* Subtle Corner Diamonds */}
      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rotate-45 bg-[#dfba73]/70" />
      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rotate-45 bg-[#dfba73]/70" />
      <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rotate-45 bg-[#dfba73]/70" />
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rotate-45 bg-[#dfba73]/70" />
    </div>
  );
}
