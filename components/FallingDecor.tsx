"use client";

import { useEffect, useState } from "react";

const LUXURY_PARTICLES = ["✨", "🌸", "🌹", "✦", "💫", "✨", "🌺", "💛"];

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  symbol: string;
};

export default function FallingDecor() {
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: Math.random() * 96 + 2,
        delay: Math.random() * 10,
        duration: 9 + Math.random() * 9,
        size: 13 + Math.random() * 15,
        opacity: 0.5 + Math.random() * 0.45,
        symbol: LUXURY_PARTICLES[i % LUXURY_PARTICLES.length],
      }))
    );
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-5%] animate-fall filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}