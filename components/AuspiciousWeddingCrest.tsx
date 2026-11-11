"use client";

import React, { useId } from "react";

interface AuspiciousWeddingCrestProps {
  groomName?: string;
  brideName?: string;
  className?: string;
  showMonogram?: boolean;
}

export default function AuspiciousWeddingCrest({
  groomName = "Groom",
  brideName = "Bride",
  className = "w-48 h-48 sm:w-56 sm:h-56",
  showMonogram = true,
}: AuspiciousWeddingCrestProps) {
  const id = useId().replace(/:/g, "");

  const groomInitial = groomName ? groomName.trim()[0]?.toUpperCase() || "G" : "G";
  const brideInitial = brideName ? brideName.trim()[0]?.toUpperCase() || "B" : "B";

  const goldGradId = `goldGrad_${id}`;
  const ringGradId = `ringGrad_${id}`;
  const ringGrad2Id = `ringGrad2_${id}`;
  const diamondGradId = `diamondGrad_${id}`;
  const auraGradId = `auraGrad_${id}`;
  const filterGlowId = `glowFilter_${id}`;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient Pulsing Warm Golden Glow Behind Crest */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#dfba73]/15 via-[#ffd700]/25 to-[#c5a059]/15 blur-2xl animate-pulse pointer-events-none" />

      {/* Main Wedding Crest SVG */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-[0_4px_20px_rgba(223,186,115,0.45)] relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Radial Aura */}
          <radialGradient id={auraGradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#dfba73" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#dfba73" stopOpacity="0" />
          </radialGradient>

          {/* 24K Royal Gold Gradient */}
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8e1" />
            <stop offset="25%" stopColor="#f3cf7a" />
            <stop offset="50%" stopColor="#dfba73" />
            <stop offset="75%" stopColor="#b8860b" />
            <stop offset="100%" stopColor="#f7e4be" />
          </linearGradient>

          {/* Groom Ring Metallic Shimmer */}
          <linearGradient id={ringGradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" />
            <stop offset="20%" stopColor="#dfba73" />
            <stop offset="50%" stopColor="#966e1d" />
            <stop offset="70%" stopColor="#f3cf7a" />
            <stop offset="100%" stopColor="#6e4a05" />
          </linearGradient>

          {/* Bride Ring Rose/Champagne Gold Tone */}
          <linearGradient id={ringGrad2Id} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff5dc" />
            <stop offset="25%" stopColor="#ffd700" />
            <stop offset="55%" stopColor="#c5a059" />
            <stop offset="80%" stopColor="#875f1a" />
            <stop offset="100%" stopColor="#ffe699" />
          </linearGradient>

          {/* Faceted Brilliant Solitaire Diamond Gradient */}
          <linearGradient id={diamondGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e0f7fa" />
            <stop offset="60%" stopColor="#b2ebf2" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id={filterGlowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <style>{`
            @keyframes crest-spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes crest-counter-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(-360deg); }
            }
            @keyframes diamond-flare {
              0%, 100% {
                transform: scale(0.6) rotate(0deg);
                opacity: 0.35;
              }
              50% {
                transform: scale(1.35) rotate(90deg);
                opacity: 1;
              }
            }
            @keyframes diamond-sheen {
              0%, 100% { opacity: 0.8; }
              50% { opacity: 1; filter: drop-shadow(0 0 6px #ffffff); }
            }
            @keyframes gentle-breathe {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.025); }
            }
            @keyframes float-stardust-1 {
              0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
              40% { opacity: 0.9; }
              100% { transform: translate(-10px, -24px) scale(1.2); opacity: 0; }
            }
            @keyframes float-stardust-2 {
              0% { transform: translate(0, 0) scale(0.7); opacity: 0; }
              40% { opacity: 1; }
              100% { transform: translate(12px, -28px) scale(1.1); opacity: 0; }
            }
            @keyframes float-stardust-3 {
              0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
              50% { opacity: 0.85; }
              100% { transform: translate(-8px, -20px) scale(1.3); opacity: 0; }
            }

            .anim-spin-halo {
              transform-origin: 120px 120px;
              animation: crest-spin-slow 70s linear infinite;
            }
            .anim-lotus-sway {
              transform-origin: 120px 120px;
              animation: crest-counter-spin 110s linear infinite;
            }
            .anim-breathe {
              transform-origin: 120px 120px;
              animation: gentle-breathe 4s ease-in-out infinite;
            }
            .anim-sparkle {
              transform-origin: 135px 82px;
              animation: diamond-flare 2.6s ease-in-out infinite;
            }
            .anim-diamond {
              animation: diamond-sheen 2.6s ease-in-out infinite;
            }
            .anim-dust-1 { animation: float-stardust-1 3.8s ease-in-out infinite; }
            .anim-dust-2 { animation: float-stardust-2 4.4s ease-in-out infinite 1.2s; }
            .anim-dust-3 { animation: float-stardust-3 3.5s ease-in-out infinite 2.1s; }
          `}</style>
        </defs>

        {/* 1. Ambient Background Halo */}
        <circle cx="120" cy="120" r="105" fill={`url(#${auraGradId})`} />

        {/* 2. Outer Rotating Sacred Poruwa Halo (Traditional Auspicious Beaded & Petal Wreath) */}
        <g className="anim-spin-halo">
          {/* Outermost Beaded Aura Ring */}
          <circle
            cx="120"
            cy="120"
            r="104"
            fill="none"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.2"
            strokeDasharray="2 6"
            opacity="0.65"
          />
          {/* Secondary Delicate Ring */}
          <circle
            cx="120"
            cy="120"
            r="97"
            fill="none"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* 16 Auspicious Rays (Mangala Kirana) */}
          {[...Array(16)].map((_, i) => (
            <g key={`ray-${i}`} transform={`rotate(${i * 22.5} 120 120)`}>
              <line
                x1="120"
                y1="22"
                x2="120"
                y2="27"
                stroke={`url(#${goldGradId})`}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
              <circle cx="120" cy="20" r="1.8" fill={`url(#${goldGradId})`} />
            </g>
          ))}
        </g>

        {/* 3. Sacred Blooming Lotus Petals (නෙළුම් මල් පෙති - Sri Lankan Auspicious Floral Halo) */}
        <g className="anim-lotus-sway">
          {/* Inner Golden Ring Anchor */}
          <circle
            cx="120"
            cy="120"
            r="82"
            fill="none"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.6"
            opacity="0.75"
          />

          {/* 12 Auspicious Sacred Lotus Petals */}
          {[...Array(12)].map((_, i) => (
            <g key={`lotus-${i}`} transform={`rotate(${i * 30} 120 120)`}>
              {/* Petal Outer Contour */}
              <path
                d="M 120 120 C 110 88 106 65 120 48 C 134 65 130 88 120 120 Z"
                fill="none"
                stroke={`url(#${goldGradId})`}
                strokeWidth="1.4"
                opacity="0.7"
              />
              {/* Petal Inner Spine Vein */}
              <path
                d="M 120 100 L 120 54"
                stroke={`url(#${goldGradId})`}
                strokeWidth="1"
                strokeDasharray="1 2"
                opacity="0.45"
              />
              {/* Auspicious Tip Pearl */}
              <circle
                cx="120"
                cy="46"
                r="2.2"
                fill="#fff5dc"
                stroke={`url(#${goldGradId})`}
                strokeWidth="0.8"
                opacity="0.9"
              />
            </g>
          ))}
        </g>

        {/* 4. Center Medallion Plate & Sacred Inner Ring */}
        <g className="anim-breathe">
          <circle
            cx="120"
            cy="120"
            r="64"
            fill="#120e14"
            stroke={`url(#${goldGradId})`}
            strokeWidth="2"
            opacity="0.95"
          />
          <circle
            cx="120"
            cy="120"
            r="60"
            fill="none"
            stroke={`url(#${goldGradId})`}
            strokeWidth="0.8"
            strokeDasharray="3 3"
            opacity="0.6"
          />

          {/* ============================================================== */}
          {/* 5. TWIN INTERTWINED ROYAL WEDDING RINGS (මංගල මුදු යුගලය) */}
          {/* ============================================================== */}
          <g>
            {/* GROOM'S WEDDING BAND (Left Ring - Bold Polished Gold) */}
            <g transform="translate(104, 122) rotate(-16)">
              {/* Outer Shadow for 3D realism */}
              <ellipse
                cx="0"
                cy="0"
                rx="27"
                ry="24"
                fill="none"
                stroke="#4a3006"
                strokeWidth="6.5"
                opacity="0.4"
              />
              {/* Gold Ring Body */}
              <ellipse
                cx="0"
                cy="0"
                rx="27"
                ry="24"
                fill="none"
                stroke={`url(#${ringGradId})`}
                strokeWidth="5.5"
              />
              {/* Beveled Top Highlight */}
              <ellipse
                cx="-1"
                cy="-1"
                rx="25.5"
                ry="22.5"
                fill="none"
                stroke="#fff7db"
                strokeWidth="1.2"
                opacity="0.85"
              />
            </g>

            {/* BRIDE'S WEDDING BAND (Right Ring - Intertwined, Crowned with Solitaire Diamond) */}
            <g transform="translate(136, 122) rotate(16)">
              {/* Outer Shadow for 3D realism */}
              <ellipse
                cx="0"
                cy="0"
                rx="27"
                ry="24"
                fill="none"
                stroke="#4a3006"
                strokeWidth="6.5"
                opacity="0.4"
              />
              {/* Gold Ring Body */}
              <ellipse
                cx="0"
                cy="0"
                rx="27"
                ry="24"
                fill="none"
                stroke={`url(#${ringGrad2Id})`}
                strokeWidth="5.5"
              />
              {/* Beveled Top Highlight */}
              <ellipse
                cx="1"
                cy="-1"
                rx="25.5"
                ry="22.5"
                fill="none"
                stroke="#fff7db"
                strokeWidth="1.2"
                opacity="0.85"
              />
            </g>

            {/* INTERLOCKING OVERLAP MASKING EFFECT */}
            {/* Redraw part of Groom's ring segment so it authentically interweaves over the bride's ring */}
            <path
              d="M 98 100 A 27 24 0 0 1 120 106"
              fill="none"
              stroke={`url(#${ringGradId})`}
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M 99 99 A 25.5 22.5 0 0 1 119 105"
              fill="none"
              stroke="#fff7db"
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* ========================================================== */}
            {/* 6. SOLITAIRE DIAMOND & 4-PRONG ROYAL CROWN SETTING */}
            {/* ========================================================== */}
            <g transform="translate(136, 88)" className="anim-diamond">
              {/* 4 Gold Prongs holding diamond */}
              <circle cx="-6" cy="4" r="1.6" fill={`url(#${goldGradId})`} />
              <circle cx="6" cy="4" r="1.6" fill={`url(#${goldGradId})`} />
              <circle cx="-3" cy="9" r="1.4" fill={`url(#${goldGradId})`} />
              <circle cx="3" cy="9" r="1.4" fill={`url(#${goldGradId})`} />

              {/* Brilliant Multi-faceted Diamond Body */}
              <polygon
                points="0,-8 9,0 6,7 -6,7 -9,0"
                fill={`url(#${diamondGradId})`}
                stroke={`url(#${goldGradId})`}
                strokeWidth="0.8"
                filter={`url(#${filterGlowId})`}
              />
              {/* Diamond Facet Lines */}
              <line x1="-9" y1="0" x2="9" y2="0" stroke="#ffffff" strokeWidth="0.7" opacity="0.9" />
              <line x1="-6" y1="7" x2="0" y2="-8" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
              <line x1="6" y1="7" x2="0" y2="-8" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
              <polygon points="0,-8 5,0 -5,0" fill="#ffffff" opacity="0.65" />
            </g>

            {/* 7. ANIMATED 4-POINT DIAMOND STAR BURST / LENS FLARE */}
            <g className="anim-sparkle">
              {/* Star flare horizontal & vertical rays */}
              <path
                d="M 136 70 Q 136 82 148 82 Q 136 82 136 94 Q 136 82 124 82 Q 136 82 136 70 Z"
                fill="#ffffff"
              />
              {/* Diagonal softer flare */}
              <path
                d="M 130 76 Q 136 82 142 88 Q 136 82 130 88 Q 136 82 142 76 Z"
                fill="#ffeaa7"
                opacity="0.85"
              />
              {/* Core Star Sparkle Dot */}
              <circle cx="136" cy="82" r="2.2" fill="#ffffff" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* 8. AUSPICIOUS COUPLE MONOGRAM & SACRED HEART / KNOT */}
          {/* ============================================================== */}
          {showMonogram && (
            <g transform="translate(120, 148)">
              {/* Sacred Golden Lotus Leaf Pedestal */}
              <path
                d="M -18 3 Q 0 -4 18 3 Q 0 8 -18 3 Z"
                fill={`url(#${goldGradId})`}
                opacity="0.85"
              />

              {/* Couple Initials Monogram Badge */}
              <text
                x="0"
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff9e6"
                className="font-serif font-bold tracking-widest text-[9px]"
                style={{
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.8))",
                  letterSpacing: "0.22em",
                }}
              >
                {groomInitial} ✦ {brideInitial}
              </text>
            </g>
          )}

          {/* Auspicious Sacred Crown / Poruwa Flame Finial at very top */}
          <g transform="translate(120, 42)">
            <path
              d="M 0 -8 C -4 -3 -3 2 0 6 C 3 2 4 -3 0 -8 Z"
              fill={`url(#${goldGradId})`}
              filter={`url(#${filterGlowId})`}
            />
            <circle cx="0" cy="-9" r="1.8" fill="#ffffff" />
          </g>
        </g>

        {/* 9. Floating Golden Stardust Specks (Wedding Celebration Sparkles) */}
        <g>
          <circle cx="56" cy="110" r="1.6" fill="#ffd700" className="anim-dust-1" />
          <circle cx="184" cy="98" r="1.8" fill="#fff5dc" className="anim-dust-2" />
          <circle cx="78" cy="172" r="1.4" fill="#ffd700" className="anim-dust-3" />
          <circle cx="168" cy="164" r="1.5" fill="#fce4b8" className="anim-dust-1" />
          <circle cx="112" cy="38" r="1.3" fill="#ffffff" className="anim-dust-2" />
        </g>
      </svg>
    </div>
  );
}
