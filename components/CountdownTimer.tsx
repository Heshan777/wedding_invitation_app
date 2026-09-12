"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, Sparkles } from "lucide-react";
import { translations, Locale } from "@/lib/translations";

function getTimeLeft(target: Date) {
  const diff = +new Date(target) - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export default function CountdownTimer({
  targetDate,
  locale = "en",
}: {
  targetDate: Date;
  locale?: Locale;
}) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [lastSecond, setLastSecond] = useState<number | null>(null);
  const t = translations[locale] || translations.en;

  useEffect(() => {
    const update = () => {
      const current = getTimeLeft(targetDate);
      setTime(current);
      if (current && !current.done) {
        setLastSecond(current.seconds);
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = time
    ? [
        { label: t.days, value: time.days, id: "days" },
        { label: t.hours, value: time.hours, id: "hours" },
        { label: t.minutes, value: time.minutes, id: "minutes" },
        { label: t.seconds, value: time.seconds, id: "seconds" },
      ]
    : [
        { label: t.days, value: "--", id: "days" },
        { label: t.hours, value: "--", id: "hours" },
        { label: t.minutes, value: "--", id: "minutes" },
        { label: t.seconds, value: "--", id: "seconds" },
      ];

  if (time?.done) {
    return (
      <div className="text-center py-5 px-6 rounded-2xl bg-gradient-to-b from-[#661022]/10 to-[#661022]/5 border border-[#bda06d]/35 shadow-sm animate-modal-in">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#661022]/10 text-[#661022] mb-1">
          <Sparkles className="w-4 h-4 text-[#8c6a2b] animate-spin-slow" />
        </div>
        <p className="font-cinzel text-lg sm:text-xl text-[#661022] font-semibold tracking-wide">
          {t.ceremonyBegan}
        </p>
        <p className="text-xs text-[#5a483e] font-sans mt-1 italic">
          {t.foreverBegins}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-[#8c6a2b] animate-pulse" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold text-center">
          {t.auspiciousCountdown}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u) => {
          const isSeconds = u.id === "seconds";
          return (
            <div
              key={u.id}
              className="group relative rounded-2xl bg-gradient-to-b from-[#fffcf8] via-[#fbf7f0] to-[#f4ebe0] border border-[#bda06d]/35 py-3 px-1.5 sm:px-2 text-center transition-all duration-300 hover:shadow-md hover:border-[#c5a059] overflow-hidden"
            >
              {/* Subtle top gold shimmer highlight */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#dfba73]/70 to-transparent" />

              <div
                key={isSeconds ? `sec-${u.value}` : undefined}
                className={`font-cinzel font-bold text-xl sm:text-3xl text-[#661022] tracking-tight transition-transform ${
                  isSeconds ? "animate-tick-pop" : ""
                }`}
              >
                {typeof u.value === "number" ? String(u.value).padStart(2, "0") : u.value}
              </div>
              <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.15em] text-[#8c6a2b] font-medium mt-0.5 truncate">
                {u.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}