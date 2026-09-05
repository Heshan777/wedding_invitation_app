"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  symbol: string;
  swayDistance: number;
  swayDuration: number;
  rotateDirection: number;
  depthBlur: number;
}

const LUXURY_FLORAL_PARTICLES = [
  "🌸", // Cherry blossom
  "🌹", // Crimson Rose
  "🥀", // Deep rose petal
  "🌺", // Tropical floral / marigold
  "🏵️", // Golden rosette
  "💮", // White/pink blossom
  "✨", // Golden sparkle
  "✦",  // Gold four-point star
  "💫", // Shimmering star
  "🌸", // Double blossom frequency
  "🌹", // Double rose frequency
];

export default function FallingDecor() {
  const [items, setItems] = useState<Particle[]>([]);
  const [scrollSpeedOffset, setScrollSpeedOffset] = useState(0);

  useEffect(() => {
    // Generate an elegant, evenly-distributed floral rainfall
    const count = 30;
    const generated: Particle[] = Array.from({ length: count }).map((_, i) => {
      // Ensure good spread across the entire width (including center white card 20%-80%)
      const left = ((i * (96 / count)) + (Math.random() * 4)) % 98 + 1;
      const size = 14 + Math.random() * 16; // 14px to 30px
      const isForeground = size > 22;

      return {
        id: i,
        left,
        delay: Math.random() * 12,
        duration: 8 + Math.random() * 8, // 8s to 16s fall
        size,
        opacity: isForeground ? 0.7 + Math.random() * 0.25 : 0.5 + Math.random() * 0.3,
        symbol: LUXURY_FLORAL_PARTICLES[i % LUXURY_FLORAL_PARTICLES.length],
        swayDistance: 15 + Math.random() * 25, // px sway left and right
        swayDuration: 3 + Math.random() * 3, // seconds per sway
        rotateDirection: Math.random() > 0.5 ? 1 : -1,
        depthBlur: isForeground ? 0 : Math.random() > 0.6 ? 0.6 : 0,
      };
    });

    setItems(generated);

    // Subtle scroll velocity effect to make petals flutter on scroll
    let lastScrollY = window.scrollY;
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      if (delta > 3) {
        setScrollSpeedOffset(Math.min(12, delta * 0.4));
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setScrollSpeedOffset(0);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-8%] animate-petal-flutter inline-block transition-transform duration-300"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${Math.max(4, p.duration - scrollSpeedOffset)}s`,
            filter: `drop-shadow(0 3px 6px rgba(107, 15, 36, 0.28)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2)) blur(${p.depthBlur}px)`,
            transform: `translateX(${p.swayDistance * Math.sin(p.id)}px)`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}