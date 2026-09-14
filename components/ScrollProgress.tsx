"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      if (barRef.current) {
        barRef.current.style.width = `${progress}%`;
      }
      if (flowerRef.current) {
        flowerRef.current.style.opacity = progress > 1 ? "1" : "0";
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 pointer-events-none h-1 bg-black/25 backdrop-blur-xs select-none"
      aria-hidden="true"
    >
      {/* Golden Burgundy Gradient Bar */}
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#800020] via-[#c5a059] to-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.8)] transition-[width] duration-75 ease-out relative will-change-[width]"
        style={{ width: "0%" }}
      >
        {/* Trailing Blooming Flower Head Icon */}
        <div
          ref={flowerRef}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center transition-opacity duration-200"
          style={{ opacity: 0 }}
        >
          <span className="text-[12px] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.9)] animate-pulse">
            🌸
          </span>
        </div>
      </div>
    </div>
  );
}
