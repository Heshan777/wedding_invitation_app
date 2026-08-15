"use client";

import { useRef, useState } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-20 w-12 h-12 rounded-full bg-[#800020] border border-[#D4AF37] text-[#FFC107] flex items-center justify-center shadow-lg hover:scale-105 transition"
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? "⏸" : "♪"}
      </button>
    </>
  );
}