"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    function handleStartAudio() {
      if (audioRef.current && !playing) {
        audioRef.current
          .play()
          .then(() => setPlaying(true))
          .catch(() => {
            // Autoplay blocked by browser policy until user interacts
          });
      }
    }

    // Listen for custom trigger from envelope opening or user interaction
    window.addEventListener("start_wedding_music", handleStartAudio);
    const events: (keyof WindowEventMap)[] = ["click", "touchstart", "scroll"];
    events.forEach((evt) => window.addEventListener(evt, handleStartAudio, { once: true }));

    return () => {
      window.removeEventListener("start_wedding_music", handleStartAudio);
      events.forEach((evt) => window.removeEventListener(evt, handleStartAudio));
    };
  }, [playing]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />

      {/* Floating Luxury Music Widget */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 group">
        {/* Track / Audio Status Banner (Reveals on Hover) */}
        <div
          onClick={togglePlay}
          className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#181114]/90 border border-[#c5a059]/40 text-[#dfba73] backdrop-blur-md shadow-xl cursor-pointer hover:border-[#dfba73] transition duration-300"
        >
          {playing ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 bg-[#dfba73] h-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-0.5 bg-[#edd892] h-2/3 animate-bounce [animation-delay:0.3s]" />
              <span className="w-0.5 bg-[#dfba73] h-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-0.5 bg-[#edd892] h-1/2 animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 text-[#c5a059]" />
          )}
          <span className="text-xs font-cinzel font-medium tracking-wide">
            {playing ? "Playing Music" : "Play Wedding Song"}
          </span>
        </div>

        {/* Vinyl Disc Button */}
        <button
          onClick={togglePlay}
          className={`relative w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-2xl border-2 transition-all duration-500 cursor-pointer ${
            playing
              ? "bg-[#6b0f24] border-[#dfba73] shadow-[0_0_20px_rgba(223,186,115,0.4)] animate-spin-slow"
              : "bg-[#1f1519] border-[#c5a059]/50 hover:border-[#dfba73] hover:scale-105"
          }`}
          aria-label={playing ? "Pause background music" : "Play background music"}
        >
          {/* Inner Record Grooves */}
          <div className="absolute inset-1.5 rounded-full border border-[#dfba73]/30 pointer-events-none" />
          <div className="absolute inset-3 rounded-full border border-[#dfba73]/20 pointer-events-none" />

          {/* Center Record Label / Icon */}
          <div className="relative z-10 w-5 h-5 rounded-full bg-[#c5a059] flex items-center justify-center text-[#121013] shadow-inner">
            {playing ? (
              <span className="text-[9px] font-bold">❚❚</span>
            ) : (
              <Music className="w-2.5 h-2.5 text-[#121013]" />
            )}
          </div>
        </button>

        {/* Quick Mute Toggle */}
        {playing && (
          <button
            onClick={toggleMute}
            className="w-7 h-7 rounded-full bg-[#181114]/80 border border-[#c5a059]/40 text-[#dfba73] flex items-center justify-center hover:bg-[#800020] transition shadow-md"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </>
  );
}