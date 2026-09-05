"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrolled = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setProgress(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 pointer-events-none h-1 bg-black/25 backdrop-blur-xs select-none"
      aria-hidden="true"
    >
      {/* Golden Burgundy Gradient Bar */}
      <div
        className="h-full bg-gradient-to-r from-[#800020] via-[#c5a059] to-[#ffd700] shadow-[0_0_12px_rgba(255,215,0,0.8)] transition-[width] duration-150 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Trailing Blooming Flower Head Icon */}
        {progress > 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center">
            <span className="text-[12px] filter drop-shadow-[0_0_6px_rgba(255,215,0,0.9)] animate-pulse">
              🌸
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
