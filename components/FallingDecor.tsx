"use client";

import { useEffect, useState } from "react";

type ParticleType =
  | "heart-gold"
  | "heart-ruby"
  | "heart-rosegold"
  | "twin-hearts"
  | "wedding-rings"
  | "sparkle";

interface ParticleDef {
  id: number;
  type: ParticleType;
  left: number; // percentage across viewport
  delay: number; // animation delay in seconds
  duration: number; // fall duration in seconds
  size: number; // size in pixels
  opacity: number;
  animation: "animate-fall-sway-left" | "animate-fall-sway-right" | "animate-fall-drift-center";
}

// Royal 24K Golden Heart with Soft Shimmer Sheen
function GoldenHeartIcon({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]"
        aria-label="Golden Heart"
      >
        <defs>
          <linearGradient id="goldHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8cf" />
            <stop offset="35%" stopColor="#ffd700" />
            <stop offset="70%" stopColor="#dfba73" />
            <stop offset="100%" stopColor="#966e1d" />
          </linearGradient>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#goldHeartGrad)"
        />
        {/* Soft highlight arc */}
        <path
          d="M7.5 5.5 C6 5.5 4.8 6.6 4.8 8.2 C4.8 9.5 5.7 10.8 7.2 11.8"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

// Royal Ruby Velvet Heart with Golden Outline & Glow
function RubyHeartIcon({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-ruby-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(200,16,46,0.55)]"
        aria-label="Ruby Heart"
      >
        <defs>
          <linearGradient id="rubyHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="30%" stopColor="#c9184a" />
            <stop offset="70%" stopColor="#800020" />
            <stop offset="100%" stopColor="#4a0012" />
          </linearGradient>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#rubyHeartGrad)"
          stroke="#ffd700"
          strokeWidth="0.8"
        />
        {/* Diamond shimmer curve */}
        <path
          d="M7 6 C5.6 6 4.6 7.1 4.6 8.6 C4.6 9.8 5.5 11 6.8 12"
          stroke="#ffccd5"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );
}

// Romantic Rose-Gold Blush Heart
function RoseGoldHeartIcon({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(244,180,160,0.5)]"
        aria-label="Rose Gold Heart"
      >
        <defs>
          <linearGradient id="rosegoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff0eb" />
            <stop offset="40%" stopColor="#f7c5b8" />
            <stop offset="75%" stopColor="#e09282" />
            <stop offset="100%" stopColor="#a35446" />
          </linearGradient>
        </defs>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="url(#rosegoldGrad)"
          stroke="#fff0eb"
          strokeWidth="0.5"
        />
        <circle cx="15.5" cy="7.5" r="1" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
}

// Intertwined Twin Hearts for the Couple
function TwinHeartsIcon({ size = 25 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.45)]"
        aria-label="Twin Hearts"
      >
        <defs>
          <linearGradient id="twinGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff5ba" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#c5a059" />
          </linearGradient>
          <linearGradient id="twinRubyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff597b" />
            <stop offset="60%" stopColor="#800020" />
            <stop offset="100%" stopColor="#500014" />
          </linearGradient>
        </defs>
        {/* Background ruby heart */}
        <path
          d="M17 19.5l-1.15-1.05C11.75 14.75 9 12.3 9 9.3 9 6.85 10.9 4.9 13.35 4.9c1.4 0 2.7.65 3.65 1.65C17.95 5.55 19.25 4.9 20.65 4.9 23.1 4.9 25 6.85 25 9.3c0 3-2.75 5.45-6.85 9.15L17 19.5z"
          fill="url(#twinRubyGrad)"
          stroke="#ffd700"
          strokeWidth="0.6"
        />
        {/* Foreground gold heart */}
        <path
          d="M9.5 17.5l-1.15-1.05C4.25 12.75 1.5 10.3 1.5 7.3 1.5 4.85 3.4 2.9 5.85 2.9c1.4 0 2.7.65 3.65 1.65C10.45 3.55 11.75 2.9 13.15 2.9 15.6 2.9 17.5 4.85 17.5 7.3c0 3-2.75 5.45-6.85 9.15L9.5 17.5z"
          fill="url(#twinGoldGrad)"
          stroke="#fff5ba"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
}

// Interlocking Golden Wedding Rings with Diamond Sparkle
function WeddingRingsIcon({ size = 23 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.45)]"
        aria-label="Wedding Rings"
      >
        <defs>
          <linearGradient id="ringGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8cf" />
            <stop offset="40%" stopColor="#ffd700" />
            <stop offset="80%" stopColor="#dfba73" />
            <stop offset="100%" stopColor="#966e1d" />
          </linearGradient>
        </defs>
        <circle cx="10" cy="14" r="7" stroke="url(#ringGoldGrad)" strokeWidth="2.2" fill="none" />
        <circle cx="18" cy="14" r="7" stroke="url(#ringGoldGrad)" strokeWidth="2.2" fill="none" />
        <path d="M18 4.5 L20.5 7 L18 8.5 L15.5 7 Z" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="0.5" />
        <circle cx="18" cy="6.5" r="1" fill="#ffffff" />
      </svg>
    </div>
  );
}

// Golden Starlight Sparkle
function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(255,215,0,0.7)]"
        aria-label="Sparkle"
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#dfba73" />
          </linearGradient>
        </defs>
        <path d="M12 1 L14 8 L21 10 L14 12 L12 19 L10 12 L3 10 L10 8 Z" fill="url(#sparkGrad)" />
      </svg>
    </div>
  );
}

function renderParticle(type: ParticleType, size: number) {
  switch (type) {
    case "heart-gold":
      return <GoldenHeartIcon size={size} />;
    case "heart-ruby":
      return <RubyHeartIcon size={size} />;
    case "heart-rosegold":
      return <RoseGoldHeartIcon size={size} />;
    case "twin-hearts":
      return <TwinHeartsIcon size={size} />;
    case "wedding-rings":
      return <WeddingRingsIcon size={size} />;
    case "sparkle":
      return <SparkleIcon size={size} />;
    default:
      return <GoldenHeartIcon size={size} />;
  }
}

// Harmonious, romantic distribution across the viewport width
const PARTICLES: ParticleDef[] = [
  { id: 1, type: "heart-gold", left: 6, delay: 0.5, duration: 14, size: 23, opacity: 0.9, animation: "animate-fall-sway-left" },
  { id: 2, type: "heart-ruby", left: 13, delay: 4.2, duration: 13, size: 21, opacity: 0.88, animation: "animate-fall-sway-right" },
  { id: 3, type: "wedding-rings", left: 20, delay: 8.5, duration: 16, size: 23, opacity: 0.88, animation: "animate-fall-drift-center" },
  { id: 4, type: "twin-hearts", left: 28, delay: 2.1, duration: 14, size: 25, opacity: 0.9, animation: "animate-fall-sway-left" },
  { id: 5, type: "heart-rosegold", left: 35, delay: 6.8, duration: 15, size: 22, opacity: 0.88, animation: "animate-fall-sway-right" },
  { id: 6, type: "heart-gold", left: 42, delay: 11.3, duration: 14, size: 21, opacity: 0.88, animation: "animate-fall-drift-center" },
  { id: 7, type: "twin-hearts", left: 49, delay: 3.4, duration: 14, size: 24, opacity: 0.9, animation: "animate-fall-sway-left" },
  { id: 8, type: "heart-ruby", left: 56, delay: 9.7, duration: 15, size: 23, opacity: 0.9, animation: "animate-fall-sway-right" },
  { id: 9, type: "sparkle", left: 63, delay: 1.2, duration: 12, size: 18, opacity: 0.85, animation: "animate-fall-drift-center" },
  { id: 10, type: "heart-gold", left: 70, delay: 7.6, duration: 14, size: 24, opacity: 0.9, animation: "animate-fall-sway-left" },
  { id: 11, type: "heart-rosegold", left: 77, delay: 12.8, duration: 15, size: 22, opacity: 0.88, animation: "animate-fall-sway-right" },
  { id: 12, type: "wedding-rings", left: 84, delay: 5.1, duration: 15, size: 23, opacity: 0.88, animation: "animate-fall-drift-center" },
  { id: 13, type: "heart-ruby", left: 91, delay: 10.4, duration: 13, size: 21, opacity: 0.9, animation: "animate-fall-sway-left" },
  { id: 14, type: "heart-gold", left: 10, delay: 13.5, duration: 15, size: 22, opacity: 0.86, animation: "animate-fall-drift-center" },
  { id: 15, type: "twin-hearts", left: 24, delay: 14.6, duration: 15, size: 25, opacity: 0.88, animation: "animate-fall-sway-right" },
  { id: 16, type: "heart-ruby", left: 59, delay: 13.1, duration: 14, size: 22, opacity: 0.88, animation: "animate-fall-sway-right" },
  { id: 17, type: "sparkle", left: 38, delay: 15.2, duration: 13, size: 18, opacity: 0.85, animation: "animate-fall-drift-center" },
  { id: 18, type: "heart-gold", left: 88, delay: 14.1, duration: 14, size: 23, opacity: 0.88, animation: "animate-fall-sway-left" },
];

export default function FallingDecor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
      style={{ contain: "strict" }}
      aria-hidden="true"
    >
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={`absolute top-0 inline-flex items-center justify-center ${p.animation}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            willChange: "transform, opacity",
          }}
        >
          {renderParticle(p.type, p.size)}
        </span>
      ))}
    </div>
  );
}