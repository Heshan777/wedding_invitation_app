"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";

export type Theme = "dark" | "light";

export function useRoyalTheme() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Read current theme from document class or localStorage
    const isLight =
      document.documentElement.classList.contains("light") ||
      localStorage.getItem("royal-wedding-theme") === "light";
    const initialTheme: Theme = isLight ? "light" : "dark";
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const handleThemeChange = () => {
      const current = localStorage.getItem("royal-wedding-theme") === "light" ? "light" : "dark";
      setTheme(current);
    };

    window.addEventListener("royal-theme-change", handleThemeChange);
    return () => window.removeEventListener("royal-theme-change", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem("royal-wedding-theme", nextTheme);
    window.dispatchEvent(new Event("royal-theme-change"));
  };

  const applyTheme = (t: Theme) => {
    if (t === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  };

  return { theme, toggleTheme, mounted };
}

interface RoyalThemeToggleProps {
  variant?: "floating" | "navbar" | "compact";
  className?: string;
}

/**
 * Creative Royal Theme Switcher
 * Celestial Monogram Orb switching between:
 * - "Starlight Gala" (Midnight Velvet & Gold / Dark Mode)
 * - "Daylight Palace" (Champagne Pearl & Ivory Silk / Light Mode)
 */
export default function RoyalThemeToggle({
  variant = "floating",
  className = "",
}: RoyalThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useRoyalTheme();
  const [isRotating, setIsRotating] = useState(false);

  const handleToggle = () => {
    setIsRotating(true);
    toggleTheme();
    setTimeout(() => setIsRotating(false), 500);
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full bg-[#181114]/80 border border-[#dfba73]/40 animate-pulse ${className}`}
      />
    );
  }

  const isLight = theme === "light";

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isLight ? "Switch to Starlight Gala (Dark Mode)" : "Switch to Daylight Palace (Light Mode)"}
        aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
        className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 cursor-pointer shadow-md group ${
          isLight
            ? "bg-gradient-to-tr from-[#fdfbf7] to-[#edd892] text-[#6b0f24] border border-[#c5a059] shadow-[0_2px_12px_rgba(197,160,89,0.3)] hover:scale-105"
            : "bg-gradient-to-tr from-[#2a0812] to-[#140b10] text-[#ffd700] border border-[#dfba73]/60 shadow-[0_2px_12px_rgba(0,0,0,0.6)] hover:scale-105"
        } ${className}`}
      >
        <span
          className={`transform transition-transform duration-500 ease-out ${
            isRotating ? "rotate-180 scale-125" : "rotate-0 scale-100"
          }`}
        >
          {isLight ? (
            <Sun className="w-4 h-4 text-[#8c6a2b] drop-shadow-xs" />
          ) : (
            <Moon className="w-4 h-4 text-[#ffd700] drop-shadow-xs" />
          )}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isLight ? "Switch to Starlight Gala (Dark Mode)" : "Switch to Daylight Palace (Light Mode)"}
      aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-md select-none touch-manipulation group ${
        isLight
          ? "bg-white/90 hover:bg-white text-[#2a131a] border border-[#c5a059]/70 shadow-[0_4px_16px_rgba(189,160,109,0.25)] hover:shadow-[0_4px_20px_rgba(189,160,109,0.4)] hover:scale-[1.02]"
          : "bg-[#181114]/90 hover:bg-[#20151a] text-[#fdfbf7] border border-[#dfba73]/60 shadow-[0_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(223,186,115,0.25)] hover:scale-[1.02]"
      } ${className}`}
    >
      {/* Visual Celestial Orb Icon with Rotating Rays */}
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ease-out shadow-xs ${
          isLight
            ? "bg-gradient-to-tr from-[#f3e5c8] to-[#edd892] text-[#8c6a2b] border border-[#c5a059]"
            : "bg-gradient-to-tr from-[#800020] to-[#420614] text-[#ffd700] border border-[#ffd700]/70"
        } ${isRotating ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}
      >
        {isLight ? (
          <Sun className="w-3.5 h-3.5 text-[#8c6a2b]" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-[#ffd700]" />
        )}
      </span>

      {/* Mode Title & Subtle Sparkle */}
      <span className="font-cinzel text-xs font-bold tracking-wider flex items-center gap-1.5">
        <span className={isLight ? "text-[#5e1122]" : "text-[#edd892]"}>
          {isLight ? "Daylight" : "Starlight"}
        </span>
        <Sparkles
          className={`w-3 h-3 transition-colors ${
            isLight ? "text-[#c5a059]" : "text-[#dfba73]"
          }`}
        />
      </span>
    </button>
  );
}
