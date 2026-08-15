"use client";

import { useEffect, useState } from "react";

const PETALS = ["💗", "💕", "✨","🌸", "🌺", "✨", "🌹"];

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
};

export default function FallingDecor() {
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    // Runs only in the browser, after hydration — safe to use Math.random() here
    setItems(
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
        size: 14 + Math.random() * 14,
        emoji: PETALS[i % PETALS.length],
      }))
    );
  }, []);

  if (items.length === 0) return null; // matches server output exactly (nothing) until mounted

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute top-[-5%] animate-fall opacity-80"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}