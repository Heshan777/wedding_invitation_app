"use client";

import { useEffect, useState } from "react";

type ParticleType =
  | "wedding-rings"
  | "sparkle"
  | "golden-petal"
  | "ruby-star";

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

// Royal 24K Golden Rose Petal
function GoldenPetalIcon({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-heart-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.55)]"
        aria-label="Golden Petal"
      >
        <defs>
          <linearGradient id="goldPetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8cf" />
            <stop offset="35%" stopColor="#ffd700" />
            <stop offset="70%" stopColor="#dfba73" />
            <stop offset="100%" stopColor="#966e1d" />
          </linearGradient>
        </defs>
        <path
          d="M12 2 C7 6 3 11 4 16 C5 21 11 22 14 21 C18 20 20 15 19 10 C18 6 15 3 12 2 Z"
          fill="url(#goldPetalGrad)"
        />
        <path
          d="M12 4 Q13 11 15 18"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

// Royal Ruby Starlight Gem
function RubyStarIcon({ size = 22 }: { size?: number }) {
  return (
    <div className="animate-ruby-pulse inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_10px_rgba(200,16,46,0.6)]"
        aria-label="Ruby Star"
      >
        <defs>
          <linearGradient id="rubyStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff758f" />
            <stop offset="30%" stopColor="#c9184a" />
            <stop offset="70%" stopColor="#800020" />
            <stop offset="100%" stopColor="#4a0012" />
          </linearGradient>
        </defs>
        <path
          d="M12 2 L13.8 8.2 L20 10 L13.8 11.8 L12 18 L10.2 11.8 L4 10 L10.2 8.2 Z"
          fill="url(#rubyStarGrad)"
          stroke="#ffd700"
          strokeWidth="0.8"
        />
        <circle cx="12" cy="10" r="1.5" fill="#ffffff" opacity="0.9" />
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
        className="drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]"
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
    case "golden-petal":
      return <GoldenPetalIcon size={size} />;
    case "ruby-star":
      return <RubyStarIcon size={size} />;
    case "wedding-rings":
      return <WeddingRingsIcon size={size} />;
    case "sparkle":
      return <SparkleIcon size={size} />;
    default:
      return <SparkleIcon size={size} />;
  }
}

// Subtle, quiet atmospheric ambient particles - gentle warmth without obscuring content
const PARTICLES: ParticleDef[] = [
  { id: 1, type: "golden-petal", left: 5, delay: 1, duration: 22, size: 16, opacity: 0.35, animation: "animate-fall-sway-left" },
  { id: 2, type: "sparkle", left: 14, delay: 5, duration: 20, size: 12, opacity: 0.25, animation: "animate-fall-sway-right" },
  { id: 3, type: "golden-petal", left: 88, delay: 3, duration: 24, size: 15, opacity: 0.3, animation: "animate-fall-drift-center" },
  { id: 4, type: "sparkle", left: 93, delay: 8, duration: 22, size: 13, opacity: 0.25, animation: "animate-fall-sway-left" },
  { id: 5, type: "golden-petal", left: 3, delay: 12, duration: 25, size: 14, opacity: 0.25, animation: "animate-fall-sway-right" },
  { id: 6, type: "sparkle", left: 96, delay: 15, duration: 23, size: 12, opacity: 0.2, animation: "animate-fall-drift-center" },
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