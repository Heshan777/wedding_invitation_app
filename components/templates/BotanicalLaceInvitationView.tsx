"use client";

import { resolvePaddedGallery } from "@/lib/gallery-resolver";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  MapPin,
  Calendar,
  Clock,
  Music,
  Volume2,
  VolumeX,
  Share2,
  Heart,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface BotanicalLaceInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
  initialOpened?: boolean;
}

export default function BotanicalLaceInvitationView({
  guest,
  settings,
  photos = [],
  initialOpened = false,
}: BotanicalLaceInvitationViewProps) {
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
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lightbox state for Black & White Gallery
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
  const { brideName, groomName, combinedNames } = useMemo(() => {
    const raw = settings?.coupleNames || "Sanduni & Ravindu";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      brideName: parts[0] || "Sanduni",
      groomName: parts[1] || "Ravindu",
      combinedNames: raw,
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2026-12-12T10:24:00.000Z");
    return isNaN(d.getTime()) ? new Date("2026-12-12T10:24:00.000Z") : d;
  }, [settings?.eventDate]);

  const formattedHeaderDate = useMemo(() => {
    const day = String(eventDateObj.getDate()).padStart(2, "0");
    const month = String(eventDateObj.getMonth() + 1).padStart(2, "0");
    const year = eventDateObj.getFullYear();
    const city = settings?.venueAddress?.split(",")?.slice(-1)[0]?.trim() || "KANDY";
    return `${day}.${month}.${year} • ${city.toUpperCase()}`;
  }, [eventDateObj, settings?.venueAddress]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 74,
    hours: 22,
    minutes: 38,
    seconds: 9,
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

  // Background audio setup
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
    const query = encodeURIComponent(`${settings?.venueName || "The Secret Garden Pavilion"}, ${settings?.venueAddress || "Kandy"}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Dynamic Timeline Events
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any, idx: number) => ({
            time: item.time || "12:00 PM",
            title: (item.title || `EVENT ${idx + 1}`).toUpperCase(),
            icon: String(idx + 1),
          }));
        }
      } catch (err) {}
    }
    return [
      { time: "09:30 AM", title: "GUEST ARRIVAL", icon: "1" },
      { time: "10:24 AM", title: "SACRED CEREMONY", icon: "2" },
      { time: "12:00 PM", title: "COCKTAIL HOUR", icon: "3" },
      { time: "01:30 PM", title: "WEDDING DINNER", icon: "4" },
      { time: "03:30 PM", title: "CAKE CUTTING", icon: "5" },
      { time: "04:30 PM", title: "DANCE & CELEBRATION", icon: "6" },
    ];
  }, [settings?.timelineJson]);

  // Black and white gallery items
  const galleryItems = useMemo(() => {
    return resolvePaddedGallery(settings, photos, 5, [
      { src: "/images/templates/botanical/bw-1.jpg", title: "A Sacred Promise" },
      { src: "/images/templates/botanical/bw-2.jpg", title: "Whispers of Forever" },
      { src: "/images/templates/botanical/bw-3.jpg", title: "Laughter in Bloom" },
      { src: "/images/templates/botanical/polaroid-1.jpg", title: "Where Love Began" },
      { src: "/images/templates/botanical/polaroid-2.jpg", title: "Two Hearts as One" },
    ]);
  }, [settings?.galleryJson, settings?.heroImageUrl, photos]);

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
          origin: { y: 0.7 },
          colors: ["#5b7891", "#395368", "#f7f4ed", "#d4af37"],
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
    const text = `🌿 You are cordially invited to celebrate the wedding of *${combinedNames}*! 💕\n\nTap to view the digital invitation:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#2c3e50] font-sans selection:bg-[#5b7891]/20 selection:text-[#1e293b] overflow-x-hidden">
      {/* Envelope Opening Experience */}
      {!envelopeOpened && (
        <EnvelopeOpening
          guestName={guest?.displayName || "Honored Guest"}
          salutation={guest?.salutation || "Mr. & Mrs."}
          coupleNames={combinedNames}
          initialLocale="en"
          templateId="botanical-silk-sanduni"
          initialOpened={envelopeOpened || initialOpened}
          onStartOpen={handleStartOpenEnvelope}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Floating Audio & Share Actions */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
          className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#395368] shadow-lg border border-[#e2dcd2] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 text-[#5b7891] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#8a9ba8]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          aria-label="Share via WhatsApp"
          className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#395368] shadow-lg border border-[#e2dcd2] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-4 h-4 text-[#5b7891]" />
        </button>
      </div>

      {/* Main Single Column Container matching mobile/desktop proportion */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#f7f4ed] overflow-hidden flex flex-col border-x border-[#ebe3d5]">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Hydrangea Garden & Scalloped Lace Frame */}
        {/* ========================================================================= */}
        <section className="relative w-full aspect-[4/5] sm:aspect-[4/5.2] min-h-[460px] overflow-hidden flex flex-col items-center justify-between p-6">
          {/* Green Hydrangea Garden Background Photo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/templates/botanical/hydrangea-garden.jpg"
              alt="Lush green hydrangea garden"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 520px"
              className="object-cover object-center scale-105 transition-transform duration-1000"
            />
            {/* Soft Ambient Vignette Scrim */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
          </div>

          {/* Spacer */}
          <div className="h-2" />

          {/* Centered Scalloped Lace Frame */}
          <div className="relative z-10 w-[290px] sm:w-[330px] aspect-square flex items-center justify-center p-6 text-center select-none group">
            {/* SVG Scalloped Lace Frame Image */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/templates/botanical/lace-frame.svg"
                alt="Intricate lace doily frame"
                fill
                priority
                className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
              />
            </div>

            {/* Inner Content inside the lace doily */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4 py-2">
              <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.25em] text-[#6b7c89] uppercase font-semibold mb-2">
                We invite you to celebrate with us
              </span>

              {/* Bride Name in Romantic Calligraphy */}
              <h1 className="font-alex text-4xl sm:text-5xl text-[#395368] font-normal leading-tight tracking-wide drop-shadow-xs">
                {brideName}
              </h1>

              {/* Calligraphy 'and' flourish */}
              <span className="font-alex text-2xl sm:text-3xl text-[#5b7891] my-0.5 select-none">
                and
              </span>

              {/* Groom Name in Romantic Calligraphy */}
              <h1 className="font-alex text-4xl sm:text-5xl text-[#395368] font-normal leading-tight tracking-wide drop-shadow-xs">
                {groomName}
              </h1>

              {/* Delicate Floral Ornament Divider */}
              <div className="flex items-center gap-2 mt-2 text-[#8b9da8] text-xs">
                <span className="h-px w-6 bg-[#cbd5de]" />
                <span>❦</span>
                <span className="h-px w-6 bg-[#cbd5de]" />
              </div>
            </div>
          </div>

          {/* Bottom Date & Venue Pill Ribbon on Hydrangea foliage */}
          <div className="relative z-10 mb-2">
            <div className="px-5 py-2 rounded-full bg-[#fbf9f4]/95 border border-[#e4dbcb] shadow-lg backdrop-blur-md text-center">
              <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] font-bold text-[#395368] uppercase">
                {formattedHeaderDate}
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN SECTION: 'until forever' & Hanging Calendar Cards */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 text-center bg-[#f7f4ed]">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#8899a6] font-semibold block mb-1">
            Countdown
          </span>

          <h2 className="font-alex text-4xl sm:text-5xl text-[#46657d] mb-8 font-normal">
            until forever
          </h2>

          {/* 4 Hanging Calendar Paper Cards */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-[380px] mx-auto">
            {[
              { val: timeLeft.days, label: "days" },
              { val: timeLeft.hours, label: "hours" },
              { val: timeLeft.minutes, label: "minutes" },
              { val: timeLeft.seconds, label: "seconds" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-[#fffdfa] rounded-b-xl rounded-t-sm pt-4 pb-3 px-1 border border-[#e8dfcf] shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex flex-col items-center transition-transform hover:-translate-y-0.5 duration-300"
              >
                {/* Tiny Brass Pin Header Dot */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c5a059] shadow-xs" />

                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#395368] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="font-alex text-sm sm:text-base text-[#718594] leading-none">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LOVE STORY: Tilted Polaroids & 'How it all began' */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#f7f4ed] text-center">
          {/* Two Overlapping Tilted Polaroid Photos */}
          <div className="relative w-[280px] sm:w-[320px] h-[220px] sm:h-[240px] mx-auto mb-8">
            {/* Left Polaroid (-6 deg) */}
            <div className="absolute top-0 left-2 w-[160px] sm:w-[180px] bg-white p-2.5 pb-8 rounded-sm shadow-xl border border-neutral-200/80 -rotate-6 transition-transform duration-500 hover:-rotate-2 hover:z-20 cursor-pointer">
              <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                <Image
                  src={galleryItems[3]?.src || galleryItems[0]?.src || "/images/templates/botanical/polaroid-1.jpg"}
                  alt="Couple first adventure"
                  fill
                  sizes="180px"
                  className="object-cover grayscale contrast-110 brightness-95"
                />
              </div>
            </div>

            {/* Right Polaroid (+4 deg) */}
            <div className="absolute top-2 right-2 w-[165px] sm:w-[185px] bg-white p-2.5 pb-8 rounded-sm shadow-2xl border border-neutral-200/80 rotate-4 transition-transform duration-500 hover:rotate-1 z-10 cursor-pointer">
              <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
                <Image
                  src={galleryItems[4]?.src || galleryItems[1]?.src || "/images/templates/botanical/polaroid-2.jpg"}
                  alt="Couple sweet moments"
                  fill
                  sizes="185px"
                  className="object-cover grayscale contrast-110 brightness-95"
                />
              </div>
            </div>
          </div>

          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#8899a6] font-semibold block mb-1">
            Our Story
          </span>

          <h2 className="font-alex text-4xl sm:text-5xl text-[#46657d] mb-4 font-normal">
            How it all began
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#5a6a77] leading-relaxed max-w-[380px] mx-auto">
            &ldquo;Every love story is beautiful, but ours is our favorite. From the moment our eyes first met across a rainy afternoon to countless adventures along starry hilltops, we knew our hearts were meant to walk this path together forever.&rdquo;
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 4. WEDDING DAY SCHEDULE: Vertical Timeline with Script Times */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#f7f4ed] text-center border-t border-[#ede4d5]">
          <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#395368] font-bold block mb-0.5">
            Wedding Day
          </span>

          <h2 className="font-alex text-3xl sm:text-4xl text-[#46657d] mb-10 font-normal">
            Schedule
          </h2>

          {/* Vertical Timeline Axis */}
          <div className="relative max-w-[320px] mx-auto">
            {/* Thin Center Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-[#c9d5df] pointer-events-none" />

            {/* Timeline Milestones */}
            <div className="space-y-10">
              {timelineEvents.map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center">
                  {/* Circular Node */}
                  <div className="relative z-10 w-7 h-7 rounded-full bg-[#f7f4ed] border-2 border-[#5b7891] flex items-center justify-center text-[10px] font-cinzel font-bold text-[#395368] shadow-xs mb-2">
                    {item.icon}
                  </div>

                  {/* Large Calligraphic Script Time */}
                  <span className="font-alex text-3xl sm:text-4xl text-[#395368] leading-none mb-1">
                    {item.time}
                  </span>

                  {/* Milestone Title */}
                  <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.22em] font-bold text-[#627788] uppercase">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Location Directions Bar */}
          <div className="mt-12 max-w-[380px] mx-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-full bg-white/90 border border-[#d8d0c2] shadow-sm hover:shadow-md hover:border-[#5b7891] transition-all duration-300 text-left group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-full bg-[#5b7891]/10 text-[#5b7891] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="font-cinzel text-[11px] font-bold text-[#395368] truncate">
                    {settings?.venueName || "The Secret Garden Pavilion"}
                  </p>
                  <p className="font-sans text-[10px] text-[#718594] truncate">
                    {settings?.venueAddress || "Heerassagala Road, Kandy"}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-cinzel font-bold text-[#5b7891] group-hover:translate-x-0.5 transition-transform shrink-0 pr-2">
                Directions →
              </span>
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BLACK & WHITE GALLERY: 3 top, 2 bottom */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#f7f4ed] text-center border-t border-[#ede4d5]">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#8899a6] font-semibold block mb-1">
            Gallery
          </span>

          <h2 className="font-alex text-3xl sm:text-4xl text-[#46657d] mb-8 font-normal">
            Moments In Black & White
          </h2>

          <div className="max-w-[420px] mx-auto space-y-2.5">
            {/* Row 1: 3 Photos Side-by-Side */}
            <div className="grid grid-cols-3 gap-2.5">
              {galleryItems.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-200 shadow-md cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 33vw, 140px"
                    className="object-cover grayscale contrast-115 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>

            {/* Row 2: 2 Centered Photos Side-by-Side */}
            <div className="grid grid-cols-2 gap-2.5 max-w-[280px] mx-auto">
              {galleryItems.slice(3, 5).map((item, idx) => (
                <div
                  key={idx + 3}
                  onClick={() => setLightboxIndex(idx + 3)}
                  className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-200 shadow-md cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 140px"
                    className="object-cover grayscale contrast-115 brightness-95 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. THE SETTING: Slate-Blue Section with Scalloped Lace Cards */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#5b7891] text-center text-[#f7f4ed]">
          <span className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e4edf5] font-bold block mb-1">
            The Setting
          </span>

          <h2 className="font-alex text-4xl sm:text-5xl text-[#ffffff] mb-10 font-normal drop-shadow-xs">
            Venues
          </h2>

          <div className="space-y-10 max-w-[360px] mx-auto">
            {/* Venue 1: Ceremony */}
            <div className="flex flex-col items-center">
              <div className="relative w-[280px] sm:w-[310px] aspect-square flex items-center justify-center p-6 text-center select-none text-[#2c3e50]">
                {/* SVG Lace Frame */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src="/images/templates/botanical/lace-frame.svg"
                    alt="Lace frame"
                    fill
                    className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                  />
                </div>

                {/* Inner Content */}
                <div className="relative z-10 px-4 py-2 flex flex-col items-center">
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#718594] uppercase font-bold mb-1">
                    The Ceremony
                  </span>
                  <h3 className="font-serif italic text-xl sm:text-2xl font-bold text-[#395368] mb-1">
                    {settings?.venueName || "The Secret Garden Pavilion"}
                  </h3>
                  <p className="font-sans text-[11px] text-[#55697a] leading-relaxed mb-1">
                    {settings?.venueAddress || "Heerassagala Road, Kandy"}
                  </p>
                  <span className="font-cinzel text-[10px] font-semibold text-[#8297a7]">
                    Saturday • 10:24 AM
                  </span>
                </div>
              </div>

              {/* View On Map Button */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-6 py-2 rounded-full bg-[#fbf9f4] hover:bg-white text-[#395368] font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase shadow-md transition-all duration-300 hover:scale-105"
              >
                View On Map
              </a>
            </div>

            {/* Separator */}
            <div className="w-12 h-px bg-white/20 mx-auto" />

            {/* Venue 2: Reception */}
            <div className="flex flex-col items-center">
              <div className="relative w-[280px] sm:w-[310px] aspect-square flex items-center justify-center p-6 text-center select-none text-[#2c3e50]">
                {/* SVG Lace Frame */}
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src="/images/templates/botanical/lace-frame.svg"
                    alt="Lace frame"
                    fill
                    className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                  />
                </div>

                {/* Inner Content */}
                <div className="relative z-10 px-4 py-2 flex flex-col items-center">
                  <span className="font-cinzel text-[9px] tracking-[0.25em] text-[#718594] uppercase font-bold mb-1">
                    The Reception
                  </span>
                  <h3 className="font-serif italic text-xl sm:text-2xl font-bold text-[#395368] mb-1">
                    Hanthana Grand Lawn & Ballroom
                  </h3>
                  <p className="font-sans text-[11px] text-[#55697a] leading-relaxed mb-1">
                    Overlooking misty Ceylon tea valleys
                  </p>
                  <span className="font-cinzel text-[10px] font-semibold text-[#8297a7]">
                    Banquet &amp; Toast • 12:00 PM
                  </span>
                </div>
              </div>

              {/* View On Map Button */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-6 py-2 rounded-full bg-[#fbf9f4] hover:bg-white text-[#395368] font-cinzel text-[10px] tracking-[0.2em] font-bold uppercase shadow-md transition-all duration-300 hover:scale-105"
              >
                View On Map
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. RSVP SECTION: Ivory Linen Background & Delicate Form */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#f7f4ed] text-center">
          <span className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-[#8899a6] font-semibold block mb-1">
            Kindly respond by December 1st
          </span>

          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#395368] font-bold mb-2">
            R.S.V.P.
          </h2>

          <p className="font-serif italic text-xs sm:text-sm text-[#627788] max-w-[340px] mx-auto mb-8">
            We look forward to celebrating with you! Please let us know if you can attend.
          </p>

          {/* RSVP Card Form */}
          <div className="max-w-[360px] mx-auto bg-[#fffdfa] rounded-2xl p-6 border border-[#e4dbcb] shadow-lg relative">
            {/* Corner Decorative Dots */}
            <div className="absolute top-2.5 left-2.5 text-[#c5a059] text-xs select-none">✦</div>
            <div className="absolute top-2.5 right-2.5 text-[#c5a059] text-xs select-none">✦</div>
            <div className="absolute bottom-2.5 left-2.5 text-[#c5a059] text-xs select-none">✦</div>
            <div className="absolute bottom-2.5 right-2.5 text-[#c5a059] text-xs select-none">✦</div>

            {rsvpDone ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#5b7891]/15 text-[#5b7891] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif italic text-xl font-bold text-[#395368]">
                  Thank You, {guestName}!
                </h4>
                <p className="font-sans text-xs text-[#627788] max-w-[260px] mx-auto">
                  {attending === "ACCEPT"
                    ? "Your reservation has been graciously received. We can't wait to celebrate with you!"
                    : "Thank you for letting us know. You will be warmly in our hearts!"}
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpDone(false)}
                  className="text-[11px] font-cinzel text-[#5b7891] underline pt-2"
                >
                  Edit Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                {/* Guest Name */}
                <div>
                  <label className="block text-[10px] font-cinzel tracking-widest text-[#718594] uppercase mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#fbf9f4] border border-[#d8d0c2] text-xs text-[#2c3e50] focus:outline-none focus:border-[#5b7891]"
                  />
                </div>

                {/* Attending Toggle */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 px-2 rounded-lg text-[10px] font-cinzel tracking-wider font-bold transition-all text-center ${
                      attending === "ACCEPT"
                        ? "bg-[#5b7891] text-white shadow-sm"
                        : "bg-[#f4efe6] text-[#627788] hover:bg-[#ede5d8]"
                    }`}
                  >
                    Accepts with Pleasure
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 px-2 rounded-lg text-[10px] font-cinzel tracking-wider font-bold transition-all text-center ${
                      attending === "DECLINE"
                        ? "bg-[#8a4f5b] text-white shadow-sm"
                        : "bg-[#f4efe6] text-[#627788] hover:bg-[#ede5d8]"
                    }`}
                  >
                    Declines with Regret
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <>
                    {/* Number of Attendees */}
                    <div>
                      <label className="block text-[10px] font-cinzel tracking-widest text-[#718594] uppercase mb-1">
                        Number of Guests
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-lg bg-[#fbf9f4] border border-[#d8d0c2] text-xs text-[#2c3e50] focus:outline-none focus:border-[#5b7891]"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Wishes & Dietary Message */}
                    <div>
                      <label className="block text-[10px] font-cinzel tracking-widest text-[#718594] uppercase mb-1">
                        Warm Wishes &amp; Dietary Note
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Can't wait to celebrate! No shellfish please."
                        className="w-full px-3.5 py-2 rounded-lg bg-[#fbf9f4] border border-[#d8d0c2] text-xs text-[#2c3e50] focus:outline-none focus:border-[#5b7891] resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="w-full py-2.5 rounded-lg bg-[#5b7891] hover:bg-[#4d6980] text-white font-cinzel text-xs tracking-[0.2em] font-bold uppercase shadow-md transition-all duration-300 disabled:opacity-50"
                >
                  {submittingRsvp ? "Sending Response..." : "Submit RSVP"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER: Slate-Blue Banner */}
        {/* ========================================================================= */}
        <footer className="relative px-6 py-12 bg-[#5b7891] text-center text-[#f7f4ed]">
          <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-[#d6e3ee] font-semibold block mb-2">
            With Love and Gratitude
          </span>

          <h3 className="font-alex text-4xl sm:text-5xl text-[#ffffff] mb-2 font-normal">
            {combinedNames}
          </h3>

          <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#d6e3ee] uppercase">
            {formattedHeaderDate}
          </p>

          <div className="mt-8 pt-6 border-t border-white/15">
            <span className="font-sans text-[10px] text-white/50 tracking-wider">
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
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
            className="relative max-w-md w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryItems[lightboxIndex]?.src || ""}
              alt={galleryItems[lightboxIndex]?.title || "Gallery"}
              fill
              className="object-contain"
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
