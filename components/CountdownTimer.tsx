"use client";

import { useEffect, useState } from "react";

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

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    setTime(getTimeLeft(targetDate));
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Placeholder shown on server AND on client's first render — identical, so no mismatch
  if (!time) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div key={label} className="bg-[#FFF8F0]/5 border border-[#D4AF37]/30 rounded-xl py-3 text-center">
            <div className="font-serif text-2xl sm:text-3xl text-[#FFC107]">--</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[#D4AF37] mt-1">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (time.done) {
    return <p className="text-center font-serif text-xl text-[#FFC107]">The celebration has begun! 🎉</p>;
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {units.map((u) => (
        <div key={u.label} className="bg-[#FFF8F0]/5 border border-[#D4AF37]/30 rounded-xl py-3 text-center">
          <div className="font-serif text-2xl sm:text-3xl text-[#FFC107]">{String(u.value).padStart(2, "0")}</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wide text-[#D4AF37] mt-1">{u.label}</div>
        </div>
      ))}
    </div>
  );
}