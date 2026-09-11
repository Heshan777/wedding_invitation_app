"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
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
  const t = translations[locale] || translations.en;

  useEffect(() => {
    setTime(getTimeLeft(targetDate));
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = time
    ? [
        { label: t.days, value: time.days },
        { label: t.hours, value: time.hours },
        { label: t.minutes, value: time.minutes },
        { label: t.seconds, value: time.seconds },
      ]
    : [
        { label: t.days, value: "--" },
        { label: t.hours, value: "--" },
        { label: t.minutes, value: "--" },
        { label: t.seconds, value: "--" },
      ];

  if (time?.done) {
    return (
      <div className="text-center py-4 px-6 rounded-xl bg-[#661022]/8 border border-[#bda06d]/30">
        <p className="font-cinzel text-lg sm:text-xl text-[#661022] font-semibold tracking-wide">
          {t.ceremonyBegan}
        </p>
        <p className="text-xs text-[#5a483e] font-sans mt-1">
          {t.foreverBegins}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-[#8c6a2b]" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold text-center">
          {t.auspiciousCountdown}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {units.map((u, i) => (
          <div
            key={i}
            className="relative rounded-xl bg-[#f7f2ea]/70 border border-[#bda06d]/25 py-3 px-2 text-center transition duration-200"
          >
            <div className="font-cinzel font-bold text-xl sm:text-2xl lg:text-3xl text-[#661022] tracking-tight">
              {typeof u.value === "number" ? String(u.value).padStart(2, "0") : u.value}
            </div>
            <div className="text-[9px] sm:text-[10px] font-sans uppercase tracking-[0.15em] text-[#8c6a2b] font-medium mt-0.5 truncate">
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}