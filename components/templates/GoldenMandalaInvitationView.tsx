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
  ChevronLeft,
  ChevronRight,
  Navigation,
  Sparkles,
  Heart,
  Crown,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";
import AuspiciousWeddingCrest from "@/components/AuspiciousWeddingCrest";

interface GoldenMandalaInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
  initialOpened?: boolean;
}

export default function GoldenMandalaInvitationView({
  guest,
  settings,
  photos = [],
  initialOpened = false,
}: GoldenMandalaInvitationViewProps) {
  const [envelopeOpened, setEnvelopeOpened] = useState(Boolean(initialOpened));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("opened") === "true" || sessionStorage.getItem("invite_envelope_opened") === "true") {
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
    const raw = settings?.coupleNames || "Nethmi & Sanuja";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      groomName: parts[0] || "Nethmi",
      brideName: parts[1] || "Sanuja",
      coupleHeadline: raw,
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2026-11-28T10:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2026-11-28T10:00:00.000Z") : d;
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
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#c5a059", "#dfba73", "#8b1e2a", "#ffd700", "#fcf8f0"],
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
      `${settings?.venueName || "Shangri-La Ballroom"}, ${settings?.venueAddress || "Colombo, Sri Lanka"}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Dynamic Timeline events parsed from settings or Poruwa defaults
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((evt: any, idx: number) => ({
            num: String(idx + 1),
            title: evt.title || `CEREMONY MOMENT ${idx + 1}`,
            time: evt.time || "10:00 AM",
            desc: evt.desc || evt.description || "",
          }));
        }
      } catch (e) {
        // Fall back
      }
    }
    return [
      {
        num: "1",
        title: "GUEST ARRIVAL & WELCOME",
        time: "09:00 AM",
        desc: "Traditional welcome with auspicious jasmine garlands and live Magul Bera drums.",
      },
      {
        num: "2",
        title: "SACRED PORUWA CEREMONY",
        time: "10:24 AM",
        desc: "Auspicious Nekath blessings, exchange of betel leaves, wedding rings & sacred Pirith nool tying.",
      },
      {
        num: "3",
        title: "JAYAMANGALA GATHA",
        time: "11:15 AM",
        desc: "Traditional chanting of auspicious blessings by the choir & lighting of the traditional brass oil lamp.",
      },
      {
        num: "4",
        title: "ROYAL WEDDING BANQUET",
        time: "12:30 PM",
        desc: "Grand celebratory multi-cuisine banquet lunch, champagne toasts, and heartfelt family speeches.",
      },
      {
        num: "5",
        title: "CAKE CUTTING & TRADITIONAL DANCE",
        time: "02:30 PM",
        desc: "First couple dance, traditional Kandyan Ves dance showcase & joyous afternoon festivities.",
      },
    ];
  }, [settings?.timelineJson]);

  // Gallery items for Pre-Shoot
  const galleryItems = useMemo(() => {
    return resolveWeddingGallery(settings, photos, [
      { src: "/images/couple-kiss.jpg", caption: "Eternal Devotion" },
      { src: "/images/groom-walk.jpg", caption: "Sacred Journey" },
      { src: "/images/templates/kandyan/couple-art.png", caption: "Traditional Splendor" },
      { src: "/images/wedding-portrait.jpg", caption: "Joyous Union" },
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
          colors: ["#c5a059", "#dfba73", "#8b1e2a"],
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
    <div className="relative min-h-screen bg-[#0d0c10] text-[#f7e4be] font-sans overflow-x-hidden selection:bg-[#c5a059]/40 selection:text-white">
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
          templateId="golden-mandala-heritage"
          initialOpened={envelopeOpened || initialOpened}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Floating Action Controls (Audio Toggle & WhatsApp Share) */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute traditional wedding music" : "Play traditional wedding music"}
          className="p-2.5 rounded-full bg-[#1b1722]/85 hover:bg-[#252030] text-[#dfba73] shadow-lg border border-[#c5a059]/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share invitation"
          className="p-2.5 rounded-full bg-[#1b1722]/85 hover:bg-[#252030] text-[#dfba73] shadow-lg border border-[#c5a059]/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Single Column Container matching mobile/desktop proportion */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#0d0c10] overflow-hidden flex flex-col border-x border-[#c5a059]/25">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Sacred Golden Mandala & Auspicious Poruwa Crest */}
        {/* ========================================================================= */}
        <section className="relative pt-12 pb-14 px-6 text-center flex flex-col items-center bg-gradient-to-b from-[#140f12] via-[#0d0c10] to-[#0d0c10] border-b border-[#c5a059]/20 overflow-hidden">
          {/* Subtle Ambient Radial Gold Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Sacred Auspicious Poruwa Wedding Crest with Interlocking Rings, Lotus Halo & Diamond Sparkle Animation */}
          <div className="mb-5 sm:mb-6">
            <AuspiciousWeddingCrest
              groomName={groomName}
              brideName={brideName}
              className="w-48 h-48 sm:w-56 sm:h-56"
              showMonogram={true}
            />
          </div>

          {/* Auspicious Sinhala & English Blessing */}
          <div className="space-y-1.5 mb-3 max-w-[400px]">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#e6b962] block leading-snug drop-shadow-sm">
              {settings?.hostIntro || "ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM!"}
            </span>
            {(!settings?.hostIntro || !settings.hostIntro.toLowerCase().includes("invited")) && (
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-[#a89078] font-serif font-medium block">
                You are cordially invited to the auspicious Poruwa ceremony of
              </span>
            )}
          </div>

          {/* Couple Names */}
          <div className="flex flex-col items-center my-3">
            <h1 className="text-3xl sm:text-4xl font-serif text-[#fcf5e5] font-normal tracking-wide drop-shadow-sm">
              {groomName}
            </h1>
            <span className="text-xl sm:text-2xl font-serif italic text-[#dfba73] my-1 font-light">
              &amp;
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#fcf5e5] font-normal tracking-wide drop-shadow-sm">
              {brideName}
            </h1>
          </div>

          {/* Parents Salutation Honor */}
          <div className="w-full max-w-[340px] grid grid-cols-2 gap-2 text-[9px] text-[#c9b7a4] font-serif border-y border-[#c5a059]/25 py-2.5 my-3">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#dfba73] font-semibold">
                Daughter of
              </span>
              <span className="font-medium">Mr. &amp; Mrs. Rajapaksha</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-[#dfba73] font-semibold">
                Son of
              </span>
              <span className="font-medium">Mr. &amp; Mrs. Fernando</span>
            </div>
          </div>

          {/* Framed Date & Nekath Pill */}
          <div className="mt-2 inline-flex flex-col items-center gap-1 px-6 py-2 rounded-xl bg-[#1b1722]/80 border border-[#dfba73]/40 shadow-sm backdrop-blur-xs">
            <p className="text-xs sm:text-sm font-serif tracking-[0.2em] text-[#dfba73] font-bold uppercase">
              {formattedHeaderDate}
            </p>
            <span className="text-[9.5px] font-serif italic text-[#b8a082] tracking-wider">
              Auspicious Nekath: 10:24 AM
            </span>
          </div>

          {/* Hero Portrait / Couple Traditional Art Card */}
          <div className="mt-8 w-full max-w-[360px] relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#dfba73]/40 shadow-2xl bg-[#1a141c]">
            <Image
              src={settings?.heroImageUrl || "/images/templates/kandyan/couple-art.png"}
              alt={coupleHeadline}
              fill
              priority
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, 360px"
            />
            <div className="absolute inset-0 border border-[#dfba73]/20 rounded-2xl pointer-events-none" />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN: Auspicious Nekath Countdown */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#120f17] text-center border-b border-[#c5a059]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a89078] font-semibold block mb-1">
            Count Down To The Sacred Moment
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#f7e4be] tracking-widest uppercase mb-6 font-normal">
            Auspicious Nekath
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
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1d1825] border border-[#c5a059]/30 shadow-md"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#dfba73] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-sans tracking-widest text-[#a89078] font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ORDER OF THE DAY: Sacred Poruwa Milestones */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#0d0c10] text-center border-b border-[#c5a059]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a89078] font-semibold block mb-1">
            Customs &amp; Celebrations
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f7e4be] tracking-[0.18em] uppercase mb-10 font-normal">
            Order of the Day
          </h2>

          <div className="space-y-6 max-w-[360px] mx-auto text-left">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-3.5 rounded-xl bg-[#141019] border border-[#c5a059]/20 shadow-xs hover:border-[#c5a059]/40 transition"
              >
                {/* Gold Circular Badge */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b6528] text-[#120f17] flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-sm mt-0.5">
                  {evt.num}
                </div>

                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-serif text-xs font-bold text-[#f7e4be] tracking-wider uppercase">
                      {evt.title}
                    </h4>
                    <span className="font-serif italic text-xs text-[#dfba73]">
                      {evt.time}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#a89886] mt-1 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PRE-SHOOT MOMENTS: Curated Photo Gallery */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#120f17] text-center border-b border-[#c5a059]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a89078] font-semibold block mb-1">
            Photo Gallery
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f7e4be] tracking-[0.18em] uppercase mb-8 font-normal">
            Captured Moments
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1d1825] border border-[#c5a059]/30 shadow-md cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] font-serif text-[#dfba73] italic">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. THE SETTING: Celebration Banquet Hall & Map */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#0d0c10] text-center border-b border-[#c5a059]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a89078] font-semibold block mb-1">
            The Location
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f7e4be] tracking-[0.18em] uppercase mb-1 font-normal">
            {settings?.venueName || "Shangri-La Ballroom"}
          </h2>

          <p className="font-sans text-xs text-[#b8a082] mb-6 max-w-[320px] mx-auto">
            {settings?.venueAddress || "1 Galle Face, Colombo 02, Sri Lanka"}
          </p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#c5a059] to-[#8b6528] hover:from-[#dfba73] hover:to-[#a67b34] text-[#120f17] font-serif text-xs tracking-[0.18em] font-bold uppercase shadow-lg transition-all hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View On Map</span>
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 6. KINDLY REPLY: Live RSVP Form */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#120f17] text-center overflow-hidden">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a89078] font-semibold block mb-1">
            RSVP
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#f7e4be] tracking-[0.18em] uppercase mb-1 font-normal">
            Kindly Reply
          </h2>

          <p className="font-serif italic text-xs text-[#dfba73] mb-8">
            Please respond on or before November 10, 2026
          </p>

          {rsvpDone ? (
            <div className="p-8 rounded-2xl bg-[#1d1825] border border-[#c5a059]/40 max-w-[360px] mx-auto text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#dfba73] mx-auto" />
              <h3 className="font-serif text-xl text-[#fcf5e5]">
                {attending === "ACCEPT" ? "Thank You for Responding!" : "Response Recorded"}
              </h3>
              <p className="text-xs text-[#a89886] leading-relaxed">
                {attending === "ACCEPT"
                  ? `We are delighted to celebrate this sacred day with you, ${guestName}! Your presence is truly our blessing.`
                  : `Thank you for letting us know, ${guestName}. You will be warmly missed in our thoughts and prayers.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-[360px] mx-auto text-left">
              {/* Guest Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#a89078] mb-1">
                  Honored Guest Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1522] border border-[#c5a059]/30 text-xs text-[#fcf5e5] focus:outline-none focus:border-[#dfba73]"
                  required
                />
              </div>

              {/* Attendance Toggle */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#a89078] mb-1.5">
                  Will you attend?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "ACCEPT"
                        ? "bg-[#c5a059] text-[#120f17] shadow-md"
                        : "bg-[#1a1522] text-[#a89078] border border-[#c5a059]/20 hover:border-[#c5a059]/50"
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "DECLINE"
                        ? "bg-[#8b1e2a] text-white shadow-md"
                        : "bg-[#1a1522] text-[#a89078] border border-[#c5a059]/20 hover:border-[#c5a059]/50"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Guest Headcount */}
              {attending === "ACCEPT" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#a89078] mb-1">
                    Number of Attendees
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1522] border border-[#c5a059]/30 text-xs text-[#fcf5e5] focus:outline-none focus:border-[#dfba73]"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-[#1a1522] text-[#fcf5e5]">
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dietary Preferences */}
              {attending === "ACCEPT" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#a89078] mb-1">
                    Dietary Requirements
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#1a1522] border border-[#c5a059]/30 text-xs text-[#fcf5e5] focus:outline-none focus:border-[#dfba73]"
                  >
                    <option value="NONE" className="bg-[#1a1522] text-[#fcf5e5]">Standard Feast Menu</option>
                    <option value="VEGETARIAN" className="bg-[#1a1522] text-[#fcf5e5]">Pure Vegetarian</option>
                    <option value="HALAL" className="bg-[#1a1522] text-[#fcf5e5]">Halal Option</option>
                    <option value="JAIN" className="bg-[#1a1522] text-[#fcf5e5]">Jain / Vegan</option>
                  </select>
                </div>
              )}

              {/* Message to Couple */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#a89078] mb-1">
                  Blessings &amp; Wishes
                </label>
                <textarea
                  rows={2}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Share your heartfelt blessings for the newly weds..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1a1522] border border-[#c5a059]/30 text-xs text-[#fcf5e5] placeholder-[#7d6f61] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submittingRsvp}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#8b6528] hover:from-[#dfba73] hover:to-[#a67b34] text-[#120f17] font-serif text-xs tracking-[0.2em] font-bold uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingRsvp ? "Submitting..." : "Send RSVP Confirmation"}
              </button>
            </form>
          )}

          {/* Dress Code Footer Note */}
          <div className="mt-12 pt-6 border-t border-[#c5a059]/20 max-w-[340px] mx-auto text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#dfba73] font-semibold block">
              Dress Code
            </span>
            <p className="text-xs font-serif text-[#c9b7a4]">
              {settings?.dressCodeTitle || "Traditional Kandyan Splendor or Formal Evening Attire"}
            </p>
            <p className="text-[10.5px] text-[#8c7d6e] leading-relaxed">
              {settings?.dressCodeDescription || "Warm shades of gold, champagne, and imperial maroon are warmly welcomed."}
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 text-center text-[10px] text-[#7d6f61] font-sans border-t border-[#c5a059]/20 bg-[#0d0c10]">
          <p>© 2026 WedLink.lk • Digital Wedding Invitations for Sri Lankan Weddings</p>
        </footer>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative max-w-lg w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#c5a059]/40"
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
