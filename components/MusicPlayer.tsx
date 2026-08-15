"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const hasTriedAutoplay = useRef(false);

  useEffect(() => {
    function tryPlayOnFirstInteraction() {
      if (hasTriedAutoplay.current) return;
      hasTriedAutoplay.current = true;

      audioRef.current?.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay still blocked for some reason — user can use the button instead
        });
    }

    // Listen for the very first interaction anywhere on the page
    const events: (keyof WindowEventMap)[] = ["click", "touchstart", "scroll", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, tryPlayOnFirstInteraction, { once: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, tryPlayOnFirstInteraction));
    };
  }, []);

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
      <audio ref={audioRef} src={src} loop preload="auto" />
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