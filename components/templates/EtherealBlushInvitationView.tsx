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
  Navigation,
  Heart,
  Sparkles,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface EtherealBlushInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
}

export default function EtherealBlushInvitationView({
  guest,
  settings,
  photos = [],
}: EtherealBlushInvitationViewProps) {
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
    const raw = settings?.coupleNames || "Nisali & Tharindu";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      groomName: parts[0] || "Nisali",
      brideName: parts[1] || "Tharindu",
      coupleHeadline: raw,
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2027-02-14T15:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2027-02-14T15:00:00.000Z") : d;
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
        colors: ["#f472b6", "#be185d", "#e0a96d", "#fbcfe8", "#ffffff"],
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
      `${settings?.venueName || "The Rose Garden Pavilion"}, ${settings?.venueAddress || "Nuwara Eliya, Sri Lanka"}`
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
            title: evt.title || `ROSE MOMENT ${idx + 1}`,
            time: evt.time || "03:00 PM",
            desc: evt.desc || evt.description || "",
          }));
        }
      } catch (e) {}
    }
    return [
      {
        num: "1",
        title: "ROSE GARDEN ARRIVAL",
        time: "02:30 PM",
        desc: "Pink champagne, macaroons, and classical violin accompaniments.",
      },
      {
        num: "2",
        title: "SACRED WEDDING VOWS",
        time: "03:30 PM",
        desc: "Exchange of rings beneath lush cascading English roses.",
      },
      {
        num: "3",
        title: "BLUSH BANQUET DINNER",
        time: "05:30 PM",
        desc: "Delicate multi-course feast, toasts & fairy-tale celebration.",
      },
      {
        num: "4",
        title: "LANTERN DANCE & SPARKLERS",
        time: "07:30 PM",
        desc: "First dance under fairy-lit cherry blossoms and celebratory sparklers.",
      },
    ];
  }, [settings?.timelineJson]);

  // Gallery items
  const galleryItems = useMemo(() => {
    if (photos && photos.length >= 4) {
      return photos.slice(0, 6).map((p, idx) => ({
        src: p.imageUrl || p.url || `/images/templates/blush-floral/polaroid-${idx + 1}.jpg`,
        caption: p.caption || "Sweet Rose Moment",
      }));
    }
    return [
      { src: "/images/couple-kiss.jpg", caption: "Sweet Whispers" },
      { src: "/images/wedding-portrait.jpg", caption: "Blooming in Love" },
      { src: "/images/templates/blush-floral/polaroid-1.jpg", caption: "Floral Embrace" },
      { src: "/images/templates/blush-floral/polaroid-2.jpg", caption: "Forever Ours" },
    ];
  }, [photos]);

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
          colors: ["#f472b6", "#be185d", "#e0a96d"],
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
    <div className="relative min-h-screen bg-[#140810] text-[#fff1f2] font-sans overflow-x-hidden selection:bg-[#f472b6]/40 selection:text-white">
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
          templateId="ethereal-blush"
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Floating Action Controls */}
      <div className="fixed top-5 right-5 z-40 flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute music" : "Play music"}
          className="p-2.5 rounded-full bg-[#240a1b]/85 hover:bg-[#340d27] text-[#f472b6] shadow-lg border border-[#f472b6]/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share invitation"
          className="p-2.5 rounded-full bg-[#240a1b]/85 hover:bg-[#340d27] text-[#f472b6] shadow-lg border border-[#f472b6]/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Single Column Container */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#140810] overflow-hidden flex flex-col border-x border-[#f472b6]/20">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Dusty Rose & English Cherry Blossom Arch */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-14 px-6 text-center flex flex-col items-center bg-gradient-to-b from-[#2b0c20] via-[#140810] to-[#140810] border-b border-[#f472b6]/20 overflow-hidden">
          {/* Ambient Soft Rose Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#be185d]/15 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Heart & Floral Blossom Icon */}
          <div className="relative w-14 h-14 rounded-full bg-[#2b0c20] border border-[#f472b6]/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            <Heart className="w-7 h-7 text-[#f472b6] fill-[#f472b6]/30" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#fbcfe8] font-sans font-medium mb-3">
            Together With Our Families
          </span>

          <div className="flex flex-col items-center my-2">
            <h1 className="text-4xl sm:text-5xl font-serif text-[#fff1f2] font-normal tracking-wide drop-shadow-sm">
              {groomName}
            </h1>
            <span className="text-xl sm:text-2xl font-serif italic text-[#f472b6] my-1 font-light">
              &amp;
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-[#fff1f2] font-normal tracking-wide drop-shadow-sm">
              {brideName}
            </h1>
          </div>

          <p className="text-[10.5px] uppercase tracking-[0.2em] text-[#fda4af] max-w-[320px] mt-2 mb-4 leading-relaxed font-sans">
            Invite you to celebrate their sacred love and wedding union
          </p>

          <div className="inline-block px-6 py-2 rounded-full bg-[#2b0c20]/90 border border-[#f472b6]/40 shadow-sm backdrop-blur-xs mb-8">
            <span className="text-xs sm:text-sm font-sans tracking-[0.2em] text-[#fbcfe8] font-bold uppercase">
              {formattedHeaderDate}
            </span>
          </div>

          {/* Hero Portrait */}
          <div className="w-full max-w-[380px] relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#f472b6]/40 shadow-2xl bg-[#240a1b]">
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
        {/* 2. COUNTDOWN */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#1c0b17] text-center border-b border-[#f472b6]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#fbcfe8] font-semibold block mb-1">
            Until Forever Begins
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#fff1f2] tracking-widest uppercase mb-6 font-normal">
            Countdown to Vows
          </h2>

          <div className="grid grid-cols-4 gap-2.5 max-w-[340px] mx-auto">
            {[
              { val: timeLeft.days, label: "DAYS" },
              { val: timeLeft.hours, label: "HOURS" },
              { val: timeLeft.minutes, label: "MINS" },
              { val: timeLeft.seconds, label: "SECS" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#280c20] border border-[#f472b6]/30 shadow-md"
              >
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#f472b6] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[8px] font-sans tracking-widest text-[#fbcfe8] font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ORDER OF THE DAY */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#140810] text-center border-b border-[#f472b6]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#fbcfe8] font-semibold block mb-1">
            Schedule
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff1f2] tracking-[0.18em] uppercase mb-10 font-normal">
            Order of Events
          </h2>

          <div className="space-y-5 max-w-[360px] mx-auto text-left">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#1c0b17] border border-[#f472b6]/20 shadow-xs hover:border-[#f472b6]/50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f472b6] to-[#be185d] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-sm mt-0.5">
                  {evt.num}
                </div>
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-serif text-xs font-bold text-[#fff1f2] tracking-wider uppercase">
                      {evt.title}
                    </h4>
                    <span className="font-serif italic text-xs text-[#f472b6]">
                      {evt.time}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#fda4af] mt-1 leading-relaxed">
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
        <section className="relative px-6 py-12 bg-[#1c0b17] text-center border-b border-[#f472b6]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#fbcfe8] font-semibold block mb-1">
            Photo Gallery
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff1f2] tracking-[0.18em] uppercase mb-8 font-normal">
            Moments in Bloom
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#280c20] border border-[#f472b6]/30 cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
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
        <section className="relative px-6 py-12 bg-[#140810] text-center border-b border-[#f472b6]/20">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#fbcfe8] font-semibold block mb-1">
            The Venue
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff1f2] tracking-[0.18em] uppercase mb-1 font-normal">
            {settings?.venueName || "The Rose Garden Pavilion"}
          </h2>

          <p className="font-sans text-xs text-[#fda4af] mb-6 max-w-[320px] mx-auto">
            {settings?.venueAddress || "Nuwara Eliya, Sri Lanka"}
          </p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#f472b6] to-[#be185d] hover:from-[#fb7185] hover:to-[#9d174d] text-white font-sans text-xs tracking-[0.18em] font-bold uppercase shadow-lg transition-all hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View Map</span>
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 6. RSVP */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#1c0b17] text-center overflow-hidden">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#fbcfe8] font-semibold block mb-1">
            RSVP
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fff1f2] tracking-[0.18em] uppercase mb-1 font-normal">
            Kindly Reply
          </h2>

          <p className="font-serif italic text-xs text-[#f472b6] mb-8">
            Please respond on or before January 20, 2027
          </p>

          {rsvpDone ? (
            <div className="p-8 rounded-2xl bg-[#280c20] border border-[#f472b6]/40 max-w-[360px] mx-auto text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#f472b6] mx-auto" />
              <h3 className="font-serif text-xl text-[#fff1f2]">
                RSVP Received
              </h3>
              <p className="text-xs text-[#fda4af] leading-relaxed">
                Thank you for your response, {guestName}! We are overjoyed to celebrate with you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-[360px] mx-auto text-left">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#fbcfe8] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#140810] border border-[#f472b6]/30 text-xs text-white focus:outline-none focus:border-[#f472b6]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#fbcfe8] mb-1.5">
                  Attendance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "ACCEPT"
                        ? "bg-[#f472b6] text-[#2b0c20] shadow-md"
                        : "bg-[#140810] text-[#fbcfe8] border border-[#f472b6]/20"
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 rounded-lg text-xs font-serif font-bold tracking-wider transition ${
                      attending === "DECLINE"
                        ? "bg-[#881337] text-white shadow-md border border-white/20"
                        : "bg-[#140810] text-[#fbcfe8] border border-[#f472b6]/20"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {attending === "ACCEPT" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#fbcfe8] mb-1">
                    Guests Count
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#140810] border border-[#f472b6]/30 text-xs text-white focus:outline-none focus:border-[#f472b6]"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-[#140810] text-white">
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#fbcfe8] mb-1">
                  Message for the Couple
                </label>
                <textarea
                  rows={2}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Share your warm wishes..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#140810] border border-[#f472b6]/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f472b6]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRsvp}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#f472b6] to-[#be185d] hover:from-[#fb7185] hover:to-[#9d174d] text-white font-sans text-xs tracking-[0.2em] font-bold uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingRsvp ? "Submitting..." : "Send RSVP"}
              </button>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-[#f472b6]/20 max-w-[340px] mx-auto text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#f472b6] font-semibold block">
              Dress Code
            </span>
            <p className="text-xs font-serif text-[#fff1f2]">
              {settings?.dressCodeTitle || "Pastel Chic & Floral Elegance"}
            </p>
          </div>
        </section>

        <footer className="py-6 text-center text-[10px] text-[#9f1239] font-sans border-t border-[#f472b6]/20 bg-[#140810]">
          <p>© 2026 WedLink.lk • Romantic Digital Invitations</p>
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
            className="relative max-w-lg w-full aspect-[3/4] rounded-xl overflow-hidden border border-[#f472b6]/30"
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
