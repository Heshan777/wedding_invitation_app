"use client";

import { resolveWeddingGallery } from "@/lib/gallery-resolver";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  MapPin,
  Calendar,
  Clock,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  X,
  Navigation,
  Sparkles,
  Moon,
  Stars,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface CelestialMidnightInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
  initialOpened?: boolean;
}

export default function CelestialMidnightInvitationView({
  guest,
  settings,
  photos = [],
  initialOpened = false,
}: CelestialMidnightInvitationViewProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(initialOpened);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("opened") === "true") {
        setEnvelopeOpened(true);
      }
    }
  }, []);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox modal state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // RSVP Form State
  const [guestName, setGuestName] = useState(guest?.displayName || "Honored Guest");
  const [attending, setAttending] = useState<"ACCEPT" | "DECLINE">("ACCEPT");
  const [guestCount, setGuestCount] = useState<number>(guest?.attendeeCount || 2);
  const [dietary, setDietary] = useState<string>(guest?.dietary || "NONE");
  const [rsvpMessage, setRsvpMessage] = useState(guest?.rsvpMessage || "");
  const [rsvpDone, setRsvpDone] = useState(Boolean(guest?.rsvpSubmittedAt || guest?.rsvpStatus === "attending"));
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  // Couple names parsing
  const { brideName, groomName, coupleHeadline } = useMemo(() => {
    const raw = settings?.coupleNames || "Akash & Tara";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      groomName: parts[0] || "Akash",
      brideName: parts[1] || "Tara",
      coupleHeadline: raw,
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2026-12-18T18:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2026-12-18T18:00:00.000Z") : d;
  }, [settings?.eventDate]);

  const formattedHeaderDate = useMemo(() => {
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const dayName = days[eventDateObj.getDay()];
    const month = months[eventDateObj.getMonth()];
    const dateNum = eventDateObj.getDate();
    const year = eventDateObj.getFullYear();
    return `${dayName}, ${month} ${dateNum}, ${year}`;
  }, [eventDateObj]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = eventDateObj.getTime() - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [eventDateObj]);

  // Audio Playback Toggle
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#818cf8", "#e2e8f0", "#ffffff"],
      });
    } catch {}
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Google Maps URL
  const googleMapsUrl = useMemo(() => {
    if (settings?.googleMapsUrl) return settings.googleMapsUrl;
    const query = encodeURIComponent(
      `${settings?.venueName || "The Starlight Pavilion"}, ${settings?.venueAddress || "Colombo, Sri Lanka"}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Dynamic Timeline events
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((evt: any, idx: number) => ({
            num: String(idx + 1),
            title: evt.title || `CELESTIAL MOMENT ${idx + 1}`,
            time: evt.time || "06:00 PM",
            desc: evt.desc || evt.description || "",
          }));
        }
      } catch (e) {}
    }
    return [
      {
        num: "1",
        title: "TWILIGHT ARRIVAL & COCKTAILS",
        time: "05:30 PM",
        desc: "Starlit welcome drinks with live harp & cello melodies.",
      },
      {
        num: "2",
        title: "VOWS UNDER THE STARS",
        time: "06:30 PM",
        desc: "Sacred matrimony blessing under the twilight sky.",
      },
      {
        num: "3",
        title: "MIDNIGHT BANQUET DINNER",
        time: "08:00 PM",
        desc: "Candlelit multi-course dining with heartfelt champagne toasts.",
      },
      {
        num: "4",
        title: "STARLIGHT FIRST DANCE",
        time: "09:45 PM",
        desc: "Sparkler celebration, first couple dance & midnight music.",
      },
    ];
  }, [settings?.timelineJson]);

  // Gallery items
  const galleryItems = useMemo(() => {
    return resolveWeddingGallery(settings, photos, [
      { src: "/images/couple-kiss.jpg", caption: "Under the Midnight Sky" },
      { src: "/images/wedding-portrait.jpg", caption: "Eternal Constellation" },
      { src: "/images/groom-walk.jpg", caption: "Guided by the Stars" },
      { src: "/images/templates/noir/noir-hero.jpg", caption: "Celestial Serenade" },
    ]);
  }, [settings?.galleryJson, settings?.heroImageUrl, photos]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);
    try {
      if (guest?.token && guest.token !== "demo" && guest.token !== "preview") {
        await fetch("/api/invite/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: guest.token,
            status: attending === "ACCEPT" ? "attending" : "declined",
            attendeeCount: attending === "ACCEPT" ? guestCount : 0,
            dietary,
            message: rsvpMessage,
          }),
        });
      }
      setRsvpDone(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#38bdf8", "#818cf8", "#e2e8f0"],
        });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Invitation - ${coupleHeadline}`,
          text: `You are cordially invited to celebrate the wedding of ${coupleHeadline}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied to clipboard!");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060a17] text-[#f8fafc] font-sans overflow-x-hidden selection:bg-[#38bdf8]/40 selection:text-white">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src={settings?.musicUrl || "/audio/background.mp3"}
        loop
        preload="auto"
      />

      {/* 3D Wax Seal Envelope Entrance Overlay */}
      {!envelopeOpened && (
        <EnvelopeOpening
          guestName={guest?.displayName || "Honored Guest"}
          salutation={guest?.salutation || "Dear"}
          coupleNames={coupleHeadline}
          initialLocale="en"
          templateId="celestial-midnight"
          initialOpened={envelopeOpened || initialOpened}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Floating Action Controls */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute music" : "Play music"}
          className="p-2.5 rounded-full bg-[#0e172a]/85 hover:bg-[#1e293b] text-[#38bdf8] shadow-lg border border-[#38bdf8]/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share invitation"
          className="p-2.5 rounded-full bg-[#0e172a]/85 hover:bg-[#1e293b] text-[#38bdf8] shadow-lg border border-[#38bdf8]/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Single Column Container */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#060a17] overflow-hidden flex flex-col border-x border-[#38bdf8]/20">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Starlight Constellation & Celestial Title */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-14 px-6 text-center flex flex-col items-center bg-gradient-to-b from-[#0e172a] via-[#060a17] to-[#060a17] border-b border-[#38bdf8]/20 overflow-hidden">
          {/* Ambient Blue Nebula Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#1e40af]/20 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Crescent Moon & Constellation Icon Motif */}
          <div className="relative w-16 h-16 rounded-full bg-[#0f1d3b] border border-[#38bdf8]/50 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Moon className="w-8 h-8 text-[#38bdf8]" />
            <Stars className="w-4 h-4 text-[#e2e8f0] absolute -top-1 -right-1 animate-pulse" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#94a3b8] font-sans font-medium mb-3">
            Under The Starry Skies
          </span>

          <div className="flex flex-col items-center my-2">
            <h1 className="text-4xl sm:text-5xl font-serif text-[#f8fafc] font-normal tracking-wide drop-shadow-sm">
              {groomName}
            </h1>
            <span className="text-xl sm:text-2xl font-serif italic text-[#38bdf8] my-1 font-light">
              &amp;
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-[#f8fafc] font-normal tracking-wide drop-shadow-sm">
              {brideName}
            </h1>
          </div>

          <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#cbd5e1] max-w-[320px] mt-2 mb-4 leading-relaxed font-sans">
            Request the honor of your presence as they unite in holy matrimony
          </p>

          <div className="inline-block px-6 py-2 rounded-full bg-[#0f1d3b]/90 border border-[#38bdf8]/40 shadow-sm backdrop-blur-xs mb-8">
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#38bdf8] font-bold uppercase">
              {formattedHeaderDate}
            </span>
          </div>

          {/* Hero Portrait */}
          <div className="w-full max-w-[380px] relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#38bdf8]/40 shadow-2xl bg-[#091124]">
            <Image
              src={settings?.heroImageUrl || "/images/couple-kiss.jpg"}
              alt={coupleHeadline}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 380px"
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN: Starlight Timer */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#091124] text-center border-b border-[#38bdf8]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#94a3b8] font-semibold block mb-1">
            Count Down To The Evening
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#f8fafc] tracking-widest uppercase mb-6 font-normal">
            Starlight Moments
          </h2>

          <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto">
            {[
              { val: timeLeft.days, label: "DAYS" },
              { val: timeLeft.hours, label: "HOURS" },
              { val: timeLeft.minutes, label: "MINUTES" },
              { val: timeLeft.seconds, label: "SECONDS" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0d1b38] border border-[#38bdf8]/30 shadow-md"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#38bdf8] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-sans tracking-widest text-[#94a3b8] font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ORDER OF THE DAY: Celestial Schedule */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#060a17] text-center border-b border-[#38bdf8]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#94a3b8] font-semibold block mb-1">
            Celebration
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f8fafc] tracking-[0.18em] uppercase mb-10 font-normal">
            Evening Schedule
          </h2>

          <div className="space-y-5 max-w-[360px] mx-auto text-left">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#091124] border border-[#38bdf8]/20 shadow-xs hover:border-[#38bdf8]/50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38bdf8] to-[#1e40af] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-sm mt-0.5">
                  {evt.num}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-serif text-xs font-bold text-[#f8fafc] tracking-wider uppercase">
                      {evt.title}
                    </h4>
                    <span className="font-serif italic text-xs text-[#38bdf8]">
                      {evt.time}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#94a3b8] mt-1 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. GALLERY */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#091124] text-center border-b border-[#38bdf8]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#94a3b8] font-semibold block mb-1">
            Photo Gallery
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f8fafc] tracking-[0.18em] uppercase mb-8 font-normal">
            Twilight Memories
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0d1b38] border border-[#38bdf8]/30 cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. LOCATION */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#060a17] text-center border-b border-[#38bdf8]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#94a3b8] font-semibold block mb-1">
            Venue
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f8fafc] tracking-[0.18em] uppercase mb-1 font-normal">
            {settings?.venueName || "The Starlight Pavilion"}
          </h2>

          <p className="font-sans text-xs text-[#94a3b8] mb-6 max-w-[320px] mx-auto">
            {settings?.venueAddress || "Colombo, Sri Lanka"}
          </p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#38bdf8] to-[#1e40af] hover:from-[#60a5fa] hover:to-[#2563eb] text-white font-sans text-xs tracking-[0.18em] font-bold uppercase shadow-lg transition-all hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View Map Location</span>
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 6. RSVP */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#091124] text-center overflow-hidden">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#94a3b8] font-semibold block mb-1">
            RSVP
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f8fafc] tracking-[0.18em] uppercase mb-1 font-normal">
            Kindly Reply
          </h2>

          <p className="font-serif italic text-xs text-[#38bdf8] mb-8">
            Please respond on or before November 25, 2026
          </p>

          {rsvpDone ? (
            <div className="p-8 rounded-2xl bg-[#0d1b38] border border-[#38bdf8]/40 max-w-[360px] mx-auto text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#38bdf8] mx-auto" />
              <h3 className="font-serif text-xl text-[#f8fafc]">
                RSVP Confirmed
              </h3>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                Thank you for letting us know, {guestName}. We look forward to celebrating under the stars with you!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-[360px] mx-auto text-left">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#060a17] border border-[#38bdf8]/30 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1.5">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "ACCEPT"
                        ? "bg-[#38bdf8] text-[#060a17] shadow-md"
                        : "bg-[#060a17] text-[#94a3b8] border border-[#38bdf8]/20"
                    }`}
                  >
                    Gladly Attend
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "DECLINE"
                        ? "bg-[#1e293b] text-white shadow-md border border-white/20"
                        : "bg-[#060a17] text-[#94a3b8] border border-[#38bdf8]/20"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {attending === "ACCEPT" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1">
                    Attendees Count
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#060a17] border border-[#38bdf8]/30 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-[#060a17] text-white">
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#94a3b8] mb-1">
                  Wishes &amp; Note
                </label>
                <textarea
                  rows={2}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Share a wish for the couple..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#060a17] border border-[#38bdf8]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRsvp}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#38bdf8] to-[#1e40af] hover:from-[#60a5fa] hover:to-[#2563eb] text-white font-sans text-xs tracking-[0.2em] font-bold uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingRsvp ? "Submitting..." : "Send RSVP"}
              </button>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-[#38bdf8]/20 max-w-[340px] mx-auto text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#38bdf8] font-semibold block">
              Dress Code
            </span>
            <p className="text-xs font-serif text-[#f8fafc]">
              {settings?.dressCodeTitle || "Midnight Blue & Formal Evening Elegance"}
            </p>
          </div>
        </section>

        <footer className="py-6 text-center text-[10px] text-[#64748b] font-sans border-t border-[#38bdf8]/20 bg-[#060a17]">
          <p>© 2026 WedLink.lk • Celestial Wedding Invitations</p>
        </footer>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-lg w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#38bdf8]/30"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryItems[lightboxIndex].src}
              alt={galleryItems[lightboxIndex].caption}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
