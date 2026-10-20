"use client";

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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Heart,
  Navigation,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface NoirCathedralInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
}

export default function NoirCathedralInvitationView({
  guest,
  settings,
  photos = [],
}: NoirCathedralInvitationViewProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
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
    const raw = settings?.coupleNames || "Kavindi & Shenal";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      brideName: parts[0] || "Kavindi",
      groomName: parts[1] || "Shenal",
      coupleHeadline: (parts[0] && parts[1]) ? `${parts[0].toUpperCase()} & ${parts[1].toUpperCase()}` : raw.toUpperCase(),
    };
  }, [settings?.coupleNames]);

  // Event Date & Roman Numeral Display (e.g. 27 • XII • 2026)
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2026-12-27T17:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2026-12-27T17:00:00.000Z") : d;
  }, [settings?.eventDate]);

  const romanDateString = useMemo(() => {
    const day = eventDateObj.getDate();
    const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const month = romanMonths[eventDateObj.getMonth()] || "XII";
    const year = eventDateObj.getFullYear();
    return `${day} • ${month} • ${year}`;
  }, [eventDateObj]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 20,
    minutes: 54,
    seconds: 34,
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
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDateObj]);

  // Audio player setup
  useEffect(() => {
    const musicUrl = settings?.musicUrl || "/audio/background.mp3";
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    const handleStartMusic = () => {
      audio.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    };

    window.addEventListener("start_wedding_music", handleStartMusic);

    return () => {
      window.removeEventListener("start_wedding_music", handleStartMusic);
      audio.pause();
      audioRef.current = null;
    };
  }, [settings?.musicUrl]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleStartOpenEnvelope = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  };

  // Google Maps Venue Navigation URL
  const googleMapsUrl = useMemo(() => {
    if (settings?.googleMapsUrl) return settings.googleMapsUrl;
    const query = encodeURIComponent(`${settings?.venueName || "The Cathedral Palace"}, ${settings?.venueAddress || "Colombo, Sri Lanka"}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Editorial photo gallery items
  const galleryItems = useMemo(() => {
    if (photos && photos.length >= 4) {
      return photos.slice(0, 4).map((p, idx) => ({
        src: p.imageUrl || p.url || `/images/templates/noir/noir-gallery-${idx + 1}.jpg`,
        caption: p.caption || "Special Moment",
      }));
    }
    return [
      { src: "/images/templates/noir/noir-gallery-1.jpg", caption: "Eternal Embrace in the Woodlands" },
      { src: "/images/templates/noir/noir-gallery-2.jpg", caption: "A Whisper of Forever" },
      { src: "/images/templates/noir/noir-gallery-3.jpg", caption: "Under the Midnight Light" },
      { src: "/images/templates/noir/noir-gallery-4.jpg", caption: "Laughter and Golden Promises" },
    ];
  }, [photos]);

  // Dynamic Timeline Events
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            time: item.time || "12:00 PM",
            title: (item.title || "Wedding Milestone").toUpperCase(),
            desc: item.desc || item.description || "",
          }));
        }
      } catch (err) {}
    }
    return [
      { time: "04:00 PM", title: "GUEST ARRIVAL & RED CARPET", desc: "Welcome cocktail & classical violin accompaniments" },
      { time: "05:00 PM", title: "SOLEMN MATRIMONY & VOWS", desc: "Exchange of eternal wedding rings & ceremony blessing" },
      { time: "06:30 PM", title: "CHAMPAGNE COCKTAIL HOUR", desc: "Hors d'oeuvres & bridal party photo moments" },
      { time: "07:30 PM", title: "GRAND BANQUET DINNER", desc: "Curated fine dining, toasts & royal wedding cake cutting" },
      { time: "09:30 PM", title: "FIRST DANCE & SOIREE", desc: "Live jazz band, midnight dancing & sparkler farewell" },
    ];
  }, [settings?.timelineJson]);

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);
    try {
      if (guest?.token && guest.token !== "demo") {
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
      if (attending === "ACCEPT") {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 },
          colors: ["#c5a059", "#dfba73", "#800020", "#ffffff"],
        });
      }
    } catch (err) {
      console.warn("RSVP submission error:", err);
      setRsvpDone(true);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `✨ You are cordially invited to celebrate the marriage of *${settings?.coupleNames || "Kavindi & Shenal"}*! 🥂\n\nTap to view the digital invitation:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#09080b] text-[#f4eee6] font-sans selection:bg-[#c5a059]/30 selection:text-[#ffd700] overflow-x-hidden">
      {/* 3D Wax Seal Envelope Entrance Overlay */}
      <EnvelopeOpening
        guestName={guest?.displayName || "Honored Guest"}
        salutation={guest?.salutation || "Mr. & Mrs."}
        coupleNames={settings?.coupleNames || "Kavindi & Shenal"}
        initialLocale="en"
        templateId="cathedral-palace-doors"
        onStartOpen={handleStartOpenEnvelope}
        onOpen={handleOpenEnvelope}
      />

      {/* Floating Action Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-[#dfba73] shadow-xl border border-[#c5a059]/40 backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 text-[#ffd700] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#9e8f7a]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          aria-label="Share via WhatsApp"
          className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-[#dfba73] shadow-xl border border-[#c5a059]/40 backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-4 h-4 text-[#dfba73]" />
        </button>
      </div>

      {/* Main Single Column Container matching mobile/desktop proportion */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#08070a] overflow-hidden flex flex-col border-x border-neutral-900">

        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Full-bleed Portrait with Gradient Fade */}
        {/* ========================================================================= */}
        <section className="relative w-full aspect-[4/5] min-h-[480px] overflow-hidden flex flex-col justify-end p-6 text-center">
          {/* Moody Couple Portrait Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/templates/noir/noir-hero.jpg"
              alt="Editorial wedding couple"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 520px"
              className="object-cover object-top scale-100 transition-transform duration-1000"
            />
            {/* Dramatic Top and Bottom Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08070a] via-[#08070a]/40 to-black/30 pointer-events-none" />
          </div>

          {/* Overlaid Typography at the base of photo */}
          <div className="relative z-10 space-y-1.5 pb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-[#dfba73]/30 backdrop-blur-md mb-2">
              <span className="text-[10px] text-[#ffd700]">✦</span>
              <span className="font-cinzel text-[9px] tracking-[0.35em] text-[#edd892] uppercase font-semibold">
                Wedding Invitation
              </span>
              <span className="text-[10px] text-[#ffd700]">✦</span>
            </div>

            {/* Couple Names in All-Caps Classic Roman Serif */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#fff8ee] tracking-[0.18em] font-medium uppercase drop-shadow-md">
              {coupleHeadline}
            </h1>

            <p className="font-sans text-[11px] sm:text-xs text-[#b8a994] tracking-wider uppercase">
              Together with our families, we invite you to celebrate our union
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. ROMAN NUMERAL DATE & CHIC COUNTDOWN SECTION */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#08070a] text-center border-t border-neutral-900/60">
          {/* Roman Numeral Date Display: 27 • XII • 2026 */}
          <div className="mb-6">
            <div className="font-serif text-3xl sm:text-4xl text-[#fff8ee] tracking-[0.25em] font-light">
              {romanDateString}
            </div>
            <p className="text-[10px] font-cinzel text-[#dfba73] tracking-[0.3em] uppercase mt-1">
              Sunday Evening • Solemn Matrimony
            </p>
          </div>

          {/* Minimalist Countdown Timer Boxes */}
          <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto mb-8">
            {[
              { val: timeLeft.days, label: "DAYS" },
              { val: timeLeft.hours, label: "HOURS" },
              { val: timeLeft.minutes, label: "MINUTES" },
              { val: timeLeft.seconds, label: "SECONDS" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#111015]/80 rounded-lg p-2.5 border border-white/10 shadow-lg flex flex-col items-center"
              >
                <span className="font-mono text-2xl sm:text-3xl font-light text-[#f7e4be] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="font-mono text-[9px] text-[#8e8579] tracking-wider">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Horizontal Accent Line with Diamond */}
          <div className="flex items-center justify-center gap-3 text-[#dfba73]/40 max-w-[280px] mx-auto">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c5a059]/40" />
            <span className="text-xs text-[#dfba73]">❖</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c5a059]/40" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EDITORIAL NARRATIVE & LOVE STORY */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#08070a] text-center">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#dfba73] font-semibold block mb-2">
            The Vow
          </span>

          <blockquote className="font-serif italic text-base sm:text-lg text-[#e6ded1] leading-relaxed max-w-[380px] mx-auto">
            &ldquo;In the quiet depths of two souls finding their sanctuary, we promise our lifetimes to each other under the cathedral starlight.&rdquo;
          </blockquote>

          <div className="w-8 h-px bg-[#dfba73]/30 mx-auto mt-6" />
        </section>

        {/* ========================================================================= */}
        {/* 4. THE DAY'S SCHEDULE / TIMELINE */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#0d0c11] text-center border-y border-white/5">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#dfba73] font-semibold block mb-1">
            Order of Events
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff8ee] tracking-widest uppercase mb-10 font-normal">
            The Schedule
          </h2>

          <div className="relative max-w-[340px] mx-auto space-y-6">
            {timelineEvents.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#131218] border border-white/5 shadow-md text-left flex items-start gap-4 transition-transform hover:scale-[1.01]"
              >
                <div className="px-2.5 py-1.5 rounded-lg bg-[#1f1d26] text-[#dfba73] font-cinzel text-xs font-bold border border-[#c5a059]/20 shrink-0 text-center">
                  {item.time}
                </div>
                <div>
                  <h4 className="font-cinzel text-xs font-bold text-[#f7e4be] tracking-wider uppercase">
                    {item.title}
                  </h4>
                  <p className="font-sans text-[11px] text-[#9e8f7a] mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. EDITORIAL PHOTO GALLERY: Stacked Cinematic Photos */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#08070a] text-center">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#dfba73] font-semibold block mb-1">
            Moments in Noir
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff8ee] tracking-widest uppercase mb-8 font-normal">
            Photo Gallery
          </h2>

          <div className="space-y-4 max-w-[420px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shadow-xl cursor-pointer group hover:border-[#dfba73]/40 transition-all duration-300"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 420px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-3 left-4 right-4 text-left pointer-events-none">
                  <span className="font-cinzel text-[10px] text-[#edd892] tracking-wider uppercase drop-shadow">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. DRESS CODE & VENUE LOCATION */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#0d0c11] text-center border-t border-white/5">
          {/* Dress Code Section */}
          <div className="max-w-[360px] mx-auto mb-12">
            <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#dfba73] font-semibold block mb-1">
              Dress Code
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#fff8ee] tracking-wider uppercase mb-2 font-normal">
              Black Tie Optional
            </h3>
            <p className="font-sans text-xs text-[#a39480] leading-relaxed mb-4">
              We warmly invite our guests to wear formal evening attire in shades of midnight black, deep charcoal, dark navy, or gilded champagne.
            </p>

            {/* Color Swatch Dots */}
            <div className="flex items-center justify-center gap-3">
              {[
                { name: "Noir", bg: "#0d0c10", border: "#3f3f46" },
                { name: "Charcoal", bg: "#27272a", border: "#52525b" },
                { name: "Champagne", bg: "#dfba73", border: "#fef08a" },
                { name: "Ivory", bg: "#f4eee6", border: "#ffffff" },
              ].map((swatch, sIdx) => (
                <div key={sIdx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-7 h-7 rounded-full shadow-md border"
                    style={{ backgroundColor: swatch.bg, borderColor: swatch.border }}
                  />
                  <span className="text-[9px] font-mono text-[#8e8579]">{swatch.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Directions */}
          <div className="max-w-[380px] mx-auto p-6 rounded-2xl bg-[#131218] border border-white/10 shadow-lg text-center">
            <div className="w-10 h-10 rounded-full bg-[#dfba73]/15 text-[#dfba73] flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-5 h-5" />
            </div>

            <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#dfba73] font-semibold block mb-1">
              The Venue
            </span>

            <h3 className="font-serif text-xl font-medium text-[#fff8ee] tracking-wide mb-1">
              {settings?.venueName || "The Grand Ballroom, Galle Face Hotel"}
            </h3>

            <p className="font-sans text-xs text-[#a39480] leading-relaxed mb-4">
              {settings?.venueAddress || "2 Galle Road, Colombo 03, Sri Lanka"}
            </p>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#c5a059] to-[#dfba73] text-[#1c1917] font-cinzel text-xs tracking-widest font-bold uppercase shadow-lg transition-transform hover:scale-105"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Maps</span>
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. WAX-SEALED PARCHMENT RSVP CARD */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-16 bg-[#08070a] text-center border-t border-neutral-900">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#dfba73] font-semibold block mb-1">
            Your Presence
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff8ee] tracking-widest uppercase mb-8 font-normal">
            RSVP
          </h2>

          {/* Authentic Deckled Parchment Card with Red Wax Seal Stamp */}
          <div className="relative max-w-[360px] mx-auto bg-[#faf6ee] text-[#26211d] rounded-xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#e2d8c3]">
            {/* 3D Red Wax Seal Stamp at Top Center */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-[#a31d2e] via-[#7d1220] to-[#45070f] border-2 border-[#e63946]/50 shadow-[0_6px_16px_rgba(0,0,0,0.6)] flex items-center justify-center">
              <span className="font-serif text-white font-bold text-sm select-none drop-shadow">❦</span>
            </div>

            {/* Inner Parchment Content */}
            <div className="pt-4">
              <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#8c6a2b] font-bold uppercase block mb-1">
                Kindly Respond by December 10th
              </span>

              {rsvpDone ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#7d1220]/15 text-[#7d1220] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#26211d]">
                    Thank You, {guestName}!
                  </h4>
                  <p className="font-sans text-xs text-[#5c534c] max-w-[260px] mx-auto leading-relaxed">
                    {attending === "ACCEPT"
                      ? "Your RSVP has been graciously confirmed. We look forward to celebrating this royal evening with you!"
                      : "Thank you for letting us know. You will be warmly remembered in our thoughts!"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRsvpDone(false)}
                    className="text-[11px] font-cinzel text-[#7d1220] underline pt-2 font-bold"
                  >
                    Edit Response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left mt-3">
                  {/* Guest Name */}
                  <div>
                    <label className="block text-[10px] font-cinzel tracking-wider text-[#6b5f54] uppercase font-bold mb-1">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#d6cbba] text-xs text-[#26211d] focus:outline-none focus:border-[#7d1220]"
                    />
                  </div>

                  {/* Attendance Selector */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAttending("ACCEPT")}
                      className={`py-2 px-2 rounded-lg text-[10px] font-cinzel tracking-wider font-bold transition-all text-center ${
                        attending === "ACCEPT"
                          ? "bg-[#7d1220] text-white shadow-sm"
                          : "bg-[#eee6d8] text-[#5c534c] hover:bg-[#e4dac9]"
                      }`}
                    >
                      Accept with Pleasure
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttending("DECLINE")}
                      className={`py-2 px-2 rounded-lg text-[10px] font-cinzel tracking-wider font-bold transition-all text-center ${
                        attending === "DECLINE"
                          ? "bg-[#26211d] text-white shadow-sm"
                          : "bg-[#eee6d8] text-[#5c534c] hover:bg-[#e4dac9]"
                      }`}
                    >
                      Decline with Regret
                    </button>
                  </div>

                  {attending === "ACCEPT" && (
                    <>
                      {/* Number of Attendees */}
                      <div>
                        <label className="block text-[10px] font-cinzel tracking-wider text-[#6b5f54] uppercase font-bold mb-1">
                          Number of Guests
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#d6cbba] text-xs text-[#26211d] focus:outline-none focus:border-[#7d1220]"
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Dietary / Wishes */}
                      <div>
                        <label className="block text-[10px] font-cinzel tracking-wider text-[#6b5f54] uppercase font-bold mb-1">
                          Wishes &amp; Dietary Requirements
                        </label>
                        <textarea
                          rows={2}
                          value={rsvpMessage}
                          onChange={(e) => setRsvpMessage(e.target.value)}
                          placeholder="Warm wishes for the happy couple!"
                          className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#d6cbba] text-xs text-[#26211d] focus:outline-none focus:border-[#7d1220] resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Red Wax Signature Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingRsvp}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#9b1c2e] via-[#7d1220] to-[#5a0b16] hover:from-[#aa2234] hover:to-[#680e1a] text-[#fffdfa] font-cinzel text-xs tracking-[0.25em] font-bold uppercase shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  >
                    {submittingRsvp ? "Confirming..." : "Confirm RSVP"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER SECTION */}
        {/* ========================================================================= */}
        <footer className="relative px-6 py-12 bg-[#050406] text-center border-t border-white/5">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#dfba73] block mb-2 font-medium">
            With Eternal Gratitude
          </span>

          <h3 className="font-serif text-2xl text-[#fff8ee] tracking-[0.2em] uppercase font-light mb-1">
            {coupleHeadline}
          </h3>

          <p className="font-mono text-[10px] text-[#8e8579] tracking-widest mt-1">
            {romanDateString} • COLOMBO
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">
              WEDLINK.LK DIGITAL WEDDING INVITATIONS
            </span>
          </div>
        </footer>

      </div>

      {/* Lightbox Modal for Gallery Photos */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev === 0 ? galleryItems.length - 1 : (prev || 0) - 1));
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-lg w-full aspect-[16/10] rounded-xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryItems[lightboxIndex]?.src || ""}
              alt={galleryItems[lightboxIndex]?.caption || "Gallery photo"}
              fill
              className="object-cover"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev === galleryItems.length - 1 ? 0 : (prev || 0) + 1));
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
