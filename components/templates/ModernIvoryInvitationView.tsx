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
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface ModernIvoryInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
  initialOpened?: boolean;
}

export default function ModernIvoryInvitationView({
  guest,
  settings,
  photos = [],
  initialOpened = false,
}: ModernIvoryInvitationViewProps) {
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
    const raw = settings?.coupleNames || "Malik & Sara";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      groomName: parts[0] || "Malik",
      brideName: parts[1] || "Sara",
      coupleHeadline: raw,
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2027-06-05T17:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2027-06-05T17:00:00.000Z") : d;
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
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f8fafc", "#ffffff", "#c5a059"],
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
      `${settings?.venueName || "The Glasshouse Ballroom"}, ${settings?.venueAddress || "Colombo, Sri Lanka"}`
    );
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Dynamic Timeline events parsed from settings or Minimalist defaults
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((evt: any, idx: number) => ({
            num: String(idx + 1).padStart(2, "0"),
            title: evt.title || `MOMENT ${idx + 1}`,
            time: evt.time || "05:00 PM",
            desc: evt.desc || evt.description || "",
          }));
        }
      } catch (e) {}
    }
    return [
      {
        num: "01",
        title: "GUEST ARRIVAL & COCKTAILS",
        time: "05:00 PM",
        desc: "Champagne welcome and ambient live contemporary acoustics.",
      },
      {
        num: "02",
        title: "SOLEMN WEDDING VOWS",
        time: "06:00 PM",
        desc: "Exchange of rings & eternal vows under architectural floral arches.",
      },
      {
        num: "03",
        title: "BLACK TIE BANQUET DINNER",
        time: "07:30 PM",
        desc: "Curated contemporary culinary course, toasts & celebration speeches.",
      },
      {
        num: "04",
        title: "AFTERPARTY & DANCING",
        time: "09:30 PM",
        desc: "First dance, lounge music, midnight cocktails and celebrations.",
      },
    ];
  }, [settings?.timelineJson]);

  // Gallery items
  const galleryItems = useMemo(() => {
    if (photos && photos.length >= 4) {
      return photos.slice(0, 6).map((p, idx) => ({
        src: p.imageUrl || p.url || `/images/templates/noir/noir-gallery-${idx + 1}.jpg`,
        caption: p.caption || "Editorial Moment",
      }));
    }
    return [
      { src: "/images/wedding-portrait.jpg", caption: "Timeless Devotion" },
      { src: "/images/couple-kiss.jpg", caption: "Pure Romance" },
      { src: "/images/groom-walk.jpg", caption: "Step Into Forever" },
      { src: "/images/templates/tuscan/moment-1.jpg", caption: "Contemporary Chic" },
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
          colors: ["#d4af37", "#f8fafc", "#ffffff"],
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
    <div className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans overflow-x-hidden selection:bg-[#d4af37]/40 selection:text-white">
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
          templateId="modern-ivory"
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
          className="p-2.5 rounded-full bg-[#18181b]/85 hover:bg-[#27272a] text-[#d4af37] shadow-lg border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
        </button>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Share invitation"
          className="p-2.5 rounded-full bg-[#18181b]/85 hover:bg-[#27272a] text-[#d4af37] shadow-lg border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Single Column Container */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#09090b] overflow-hidden flex flex-col border-x border-white/10">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: High-Fashion Minimalist Typography & Geometry */}
        {/* ========================================================================= */}
        <section className="relative pt-16 pb-14 px-6 text-center flex flex-col items-center bg-gradient-to-b from-[#18181b] via-[#09090b] to-[#09090b] border-b border-white/10">
          {/* Subtle Geometric Framing */}
          <div className="w-full max-w-[360px] p-6 rounded-2xl border border-white/10 bg-[#121215]/60 backdrop-blur-xs relative mb-6">
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#d4af37]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#d4af37]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#d4af37]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#d4af37]" />

            <span className="text-[9.5px] uppercase tracking-[0.35em] text-[#a1a1aa] font-mono block mb-3">
              The Wedding Celebration Of
            </span>

            <h1 className="text-4xl sm:text-5xl font-serif text-[#fafafa] font-normal tracking-wide leading-tight">
              {groomName}
            </h1>
            <span className="text-lg font-serif italic text-[#d4af37] my-1 block">
              and
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-[#fafafa] font-normal tracking-wide leading-tight">
              {brideName}
            </h1>

            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#d4af37] uppercase">
                {formattedHeaderDate}
              </span>
            </div>
          </div>

          {/* Hero Portrait */}
          <div className="w-full max-w-[380px] relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-[#141417]">
            <Image
              src={settings?.heroImageUrl || "/images/wedding-portrait.jpg"}
              alt={coupleHeadline}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 380px"
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN: Minimalist Architectural Timer */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-10 bg-[#0e0e11] text-center border-b border-white/10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a1a1aa] font-mono block mb-1">
            Count Down To The Celebration
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#fafafa] tracking-widest uppercase mb-6 font-normal">
            Until We Say I Do
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
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#18181b] border border-white/10"
              >
                <span className="font-mono text-2xl sm:text-3xl font-light text-[#d4af37] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="text-[7.5px] font-mono tracking-widest text-[#a1a1aa]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. ORDER OF EVENTS: Minimalist Timeline */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#09090b] text-center border-b border-white/10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a1a1aa] font-mono block mb-1">
            Itinerary
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fafafa] tracking-[0.18em] uppercase mb-10 font-normal">
            Order of Events
          </h2>

          <div className="space-y-4 max-w-[360px] mx-auto text-left">
            {timelineEvents.map((evt, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#121215] border border-white/10 hover:border-[#d4af37]/40 transition"
              >
                <span className="font-mono text-xs font-bold text-[#d4af37] shrink-0 mt-0.5">
                  {evt.num}
                </span>
                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-serif text-xs font-bold text-[#fafafa] tracking-wider uppercase">
                      {evt.title}
                    </h4>
                    <span className="font-mono text-xs text-[#a1a1aa]">
                      {evt.time}
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-[#71717a] mt-1 leading-relaxed">
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
        <section className="relative px-6 py-12 bg-[#0e0e11] text-center border-b border-white/10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a1a1aa] font-mono block mb-1">
            Visual Story
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fafafa] tracking-[0.18em] uppercase mb-8 font-normal">
            Moments
          </h2>

          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#18181b] border border-white/10 cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
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
        <section className="relative px-6 py-12 bg-[#09090b] text-center border-b border-white/10">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a1a1aa] font-mono block mb-1">
            The Setting
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fafafa] tracking-[0.18em] uppercase mb-1 font-normal">
            {settings?.venueName || "The Glasshouse Ballroom"}
          </h2>

          <p className="font-sans text-xs text-[#a1a1aa] mb-6 max-w-[320px] mx-auto">
            {settings?.venueAddress || "Colombo, Sri Lanka"}
          </p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#fafafa] hover:bg-white text-[#09090b] font-mono text-xs tracking-[0.18em] font-bold uppercase shadow-lg transition-all hover:scale-105"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View Map</span>
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 6. RSVP */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#0e0e11] text-center overflow-hidden">
          <span className="text-[9px] tracking-[0.3em] uppercase text-[#a1a1aa] font-mono block mb-1">
            RSVP
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#fafafa] tracking-[0.18em] uppercase mb-1 font-normal">
            Kindly Respond
          </h2>

          <p className="font-mono text-xs text-[#d4af37] mb-8">
            Please reply at your earliest convenience
          </p>

          {rsvpDone ? (
            <div className="p-8 rounded-2xl bg-[#18181b] border border-white/10 max-w-[360px] mx-auto text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto" />
              <h3 className="font-serif text-xl text-[#fafafa]">
                Response Recorded
              </h3>
              <p className="text-xs text-[#a1a1aa] leading-relaxed">
                Thank you for confirming your attendance, {guestName}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-4 max-w-[360px] mx-auto text-left">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-[#a1a1aa] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-[#a1a1aa] mb-1.5">
                  Attendance
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition ${
                      attending === "ACCEPT"
                        ? "bg-[#fafafa] text-[#09090b]"
                        : "bg-[#18181b] text-[#a1a1aa] border border-white/10"
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition ${
                      attending === "DECLINE"
                        ? "bg-[#27272a] text-white border border-white/20"
                        : "bg-[#18181b] text-[#a1a1aa] border border-white/10"
                    }`}
                  >
                    Decline
                  </button>
                </div>
              </div>

              {attending === "ACCEPT" && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-mono text-[#a1a1aa] mb-1">
                    Guests Count
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#18181b] border border-white/15 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num} className="bg-[#18181b] text-white">
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-mono text-[#a1a1aa] mb-1">
                  Message
                </label>
                <textarea
                  rows={2}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Optional message for the couple..."
                  className="w-full px-3.5 py-2 rounded-lg bg-[#18181b] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingRsvp}
                className="w-full py-3 rounded-lg bg-[#fafafa] hover:bg-white text-[#09090b] font-mono text-xs tracking-[0.2em] font-bold uppercase shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {submittingRsvp ? "Submitting..." : "Confirm RSVP"}
              </button>
            </form>
          )}

          <div className="mt-12 pt-6 border-t border-white/10 max-w-[340px] mx-auto text-center space-y-1">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-mono block">
              Dress Code
            </span>
            <p className="text-xs font-serif text-[#fafafa]">
              {settings?.dressCodeTitle || "Black Tie & Contemporary Formal"}
            </p>
          </div>
        </section>

        <footer className="py-6 text-center text-[10px] text-[#71717a] font-mono border-t border-white/10 bg-[#09090b]">
          <p>© 2026 WedLink.lk • Modern Digital Invitations</p>
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
            className="relative max-w-lg w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/20"
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
