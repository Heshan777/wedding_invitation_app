"use client";

import { useMemo } from "react";

const PETALS = ["💗", "💕", "✨","🌸", "🌺", "✨", "🌹"];

export default function FallingDecor() {
  const items = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 10,
        size: 14 + Math.random() * 14,
        emoji: PETALS[i % PETALS.length],
      })),
    []
  );

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