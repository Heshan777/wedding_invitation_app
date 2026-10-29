"use client";

import { resolvePaddedGallery } from "@/lib/gallery-resolver";
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
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface TuscanVillaInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
  initialOpened?: boolean;
}

export default function TuscanVillaInvitationView({
  guest,
  settings,
  photos = [],
  initialOpened = false,
}: TuscanVillaInvitationViewProps) {
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
    const raw = settings?.coupleNames || "Sophia & Marcus";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      brideName: parts[0] || "Sophia",
      groomName: parts[1] || "Marcus",
      coupleHeadline: (parts[0] && parts[1]) ? `${parts[0].toUpperCase()} & ${parts[1].toUpperCase()}` : raw.toUpperCase(),
    };
  }, [settings?.coupleNames]);

  // Event Date Formatting
  const eventDateObj = useMemo(() => {
    const d = new Date(settings?.eventDate || "2026-10-24T15:00:00.000Z");
    return isNaN(d.getTime()) ? new Date("2026-10-24T15:00:00.000Z") : d;
  }, [settings?.eventDate]);

  const formattedHeaderDate = useMemo(() => {
    const months = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    const month = months[eventDateObj.getMonth()];
    const day = eventDateObj.getDate();
    const year = eventDateObj.getFullYear();
    const location = settings?.venueAddress?.split(",")?.slice(-2)?.join(",")?.trim() || "LAKE COMO, ITALY";
    return `${month} ${day}, ${year} • ${location.toUpperCase()}`;
  }, [eventDateObj, settings?.venueAddress]);

  // Countdown timer state (target: 69 days, 19 hours, 45 minutes)
  const [timeLeft, setTimeLeft] = useState({
    days: 69,
    hours: 19,
    minutes: 45,
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
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [eventDateObj]);

  // Audio setup
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

  // Google Maps URL
  const googleMapsUrl = useMemo(() => {
    if (settings?.googleMapsUrl) return settings.googleMapsUrl;
    const query = encodeURIComponent(`${settings?.venueName || "The Grand Pavilion"}, ${settings?.venueAddress || "Lake Como, Italy"}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [settings?.googleMapsUrl, settings?.venueName, settings?.venueAddress]);

  // Gallery items for "CAPTURED MOMENTS" (2 rows x 3 columns)
  const galleryItems = useMemo(() => {
    return resolvePaddedGallery(settings, photos, 6, [
      { url: "/images/templates/tuscan/moment-1.jpg", caption: "Sun-drenched romance" },
      { url: "/images/templates/tuscan/moment-2.jpg", caption: "Villa gardens" },
      { url: "/images/templates/tuscan/moment-3.jpg", caption: "Sweet laughter" },
      { url: "/images/templates/tuscan/moment-4.jpg", caption: "Lakeside promenade" },
      { url: "/images/templates/tuscan/moment-5.jpg", caption: "Golden hour vows" },
      { url: "/images/templates/tuscan/moment-6.jpg", caption: "Together forever" },
    ]);
  }, [settings?.galleryJson, settings?.heroImageUrl, photos]);

  // Dynamic Timeline events parsed from settings or fallback
  const timelineEvents = useMemo(() => {
    if (settings?.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((evt: any, idx: number) => ({
            num: String(idx + 1),
            title: evt.title || `EVENT ${idx + 1}`,
            time: evt.time || "12:00 PM",
            desc: evt.desc || evt.description || "",
          }));
        }
      } catch (e) {
        // Fall back to default order of the day
      }
    }
    return [
      { num: "1", title: "CEREMONY", time: "03:00 PM", desc: "Exchange of eternal vows & cathedral rings" },
      { num: "2", title: "COCKTAIL HOUR", time: "04:30 PM", desc: "Aperol spritz, prosecco & string quartet melodies" },
      { num: "3", title: "RECEPTION", time: "06:30 PM", desc: "Fine dining, heartfelt toasts, dancing & celebrations" },
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
          colors: ["#9b4356", "#c5a059", "#dfba73", "#fbf8f2"],
        });
      }
    } catch (err) {
      console.warn("RSVP error:", err);
      setRsvpDone(true);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `✨ You are warmly invited to the wedding celebration of *${brideName} & ${groomName}*! 🥂\n\nTap to view the digital invitation:\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3d2b24] font-sans selection:bg-[#9b4356]/20 selection:text-[#3d2b24] overflow-x-hidden">
      {/* 3D Wax Seal Envelope Entrance Overlay */}
      {!envelopeOpened && (
        <EnvelopeOpening
          guestName={guest?.displayName || "Honored Guest"}
          salutation={guest?.salutation || "Mr. & Mrs."}
          coupleNames={`${brideName} & ${groomName}`}
          initialLocale="en"
          templateId="embossed-ivory-envelope"
          initialOpened={envelopeOpened || initialOpened}
          onStartOpen={handleStartOpenEnvelope}
          onOpen={handleOpenEnvelope}
        />
      )}

      {/* Floating Action Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlayingMusic ? "Mute soundtrack" : "Play soundtrack"}
          className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#4a352d] shadow-lg border border-[#e8dfd3] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4 text-[#9b4356] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#99867c]" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShareWhatsApp}
          aria-label="Share via WhatsApp"
          className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#4a352d] shadow-lg border border-[#e8dfd3] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-4 h-4 text-[#9b4356]" />
        </button>
      </div>

      {/* Main Single Column Container matching mobile/desktop proportion */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#fbf8f2] overflow-hidden flex flex-col border-x border-[#ebe2d5]">

        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Italian Villa Fresco & Editorial Title */}
        {/* ========================================================================= */}
        <section className="relative w-full aspect-[4/5] min-h-[490px] overflow-hidden flex flex-col justify-end p-6 text-center">
          {/* Villa Fresco / Italian Riviera Landscape Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={settings?.heroImageUrl || "/images/templates/tuscan/villa-hero.jpg"}
              alt="Italian villa landscape"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 520px"
              className="object-cover object-top scale-100 transition-transform duration-1000"
            />
            {/* Soft Ambient Vignette Scrim fading to ivory background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#fbf8f2] pointer-events-none" />
          </div>

          {/* Typography Overlaid at Base of Villa Fresco */}
          <div className="relative z-10 space-y-1 pb-4">
            <p className="font-alex text-2xl sm:text-3xl text-[#523b32] italic font-normal">
              the wedding of
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl text-[#2c201a] tracking-[0.2em] font-normal uppercase leading-tight drop-shadow-xs">
              {brideName}
            </h1>

            <span className="font-alex text-2xl sm:text-3xl text-[#9b4356] block -my-1">
              &amp;
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl text-[#2c201a] tracking-[0.2em] font-normal uppercase leading-tight drop-shadow-xs">
              {groomName}
            </h1>

            {/* Framed Date & Location Banner */}
            <div className="pt-3">
              <div className="inline-block px-5 py-1.5 rounded-sm bg-white/80 border border-[#dfba73]/60 shadow-xs backdrop-blur-xs">
                <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.28em] font-bold text-[#423129] uppercase">
                  {formattedHeaderDate}
                </span>
              </div>
            </div>

            {/* Delicate Diamond Divider */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[#dfba73] text-xs">
              <span className="h-px w-8 bg-[#dfba73]/40" />
              <span>✦</span>
              <span className="h-px w-8 bg-[#dfba73]/40" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN SECTION: 'until we say I do' & Bevelled Cards */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 text-center bg-[#fbf8f2]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            Countdown
          </span>

          <h2 className="font-alex text-4xl sm:text-5xl text-[#523b32] mb-8 font-normal">
            until we say I do
          </h2>

          {/* 4 Bevelled Ivory Calendar Cards */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-[380px] mx-auto mb-4">
            {[
              { val: timeLeft.days, label: "days" },
              { val: timeLeft.hours, label: "hours" },
              { val: timeLeft.minutes, label: "minutes" },
              { val: timeLeft.seconds, label: "seconds" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-[#fffdfa] rounded-sm py-3 px-1 border border-[#e8dfcf] shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col items-center"
              >
                {/* Gold Corner Accents */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-[#c5a059]" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-[#c5a059]" />

                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#3d2b24] leading-none mb-1">
                  {String(item.val).padStart(2, "0")}
                </span>
                <span className="font-alex text-sm sm:text-base text-[#917d74] leading-none">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="font-alex text-base sm:text-lg text-[#9b4356] italic">
            counting every second...
          </p>
        </section>

        {/* ========================================================================= */}
        {/* 3. LOVE STORY: Zigzag Alternating Year Timeline ('How we met') */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#fbf8f2] text-center border-t border-[#ede4d7]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            Our Story
          </span>

          <h2 className="font-alex text-4xl sm:text-5xl text-[#523b32] mb-12 font-normal">
            How we met
          </h2>

          <div className="space-y-10 max-w-[400px] mx-auto">
            {/* Milestone 1: 2019 (Left Year, Right Story) */}
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 items-center text-left">
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#9b4356] tracking-tight">
                2019
              </div>
              <div>
                <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#9e887d] block font-bold">
                  October 2019
                </span>
                <h4 className="font-cinzel text-xs font-bold text-[#3d2b24] tracking-wider uppercase mb-1">
                  The First Look
                </h4>
                <p className="font-serif italic text-xs text-[#6e594f] leading-relaxed">
                  A chance meeting at a cozy bookstore cafe in Milan. One shared conversation turned into hours that felt like minutes.
                </p>
              </div>
            </div>

            {/* Milestone 2: 2021 (Left Story, Right Year) */}
            <div className="grid grid-cols-[1fr_80px] sm:grid-cols-[1fr_100px] gap-4 items-center text-left">
              <div>
                <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#9e887d] block font-bold">
                  August 2021
                </span>
                <h4 className="font-cinzel text-xs font-bold text-[#3d2b24] tracking-wider uppercase mb-1">
                  Becoming Us
                </h4>
                <p className="font-serif italic text-xs text-[#6e594f] leading-relaxed">
                  Exploring winding cobblestone alleys, cooking pasta under starry nights, and realizing we were home in each other.
                </p>
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#9b4356] tracking-tight text-right">
                2021
              </div>
            </div>

            {/* Milestone 3: 2024 (Left Year, Right Story) */}
            <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 items-center text-left">
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#9b4356] tracking-tight">
                2024
              </div>
              <div>
                <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#9e887d] block font-bold">
                  May 2024
                </span>
                <h4 className="font-cinzel text-xs font-bold text-[#3d2b24] tracking-wider uppercase mb-1">
                  The Yes
                </h4>
                <p className="font-serif italic text-xs text-[#6e594f] leading-relaxed">
                  At sunset overlooking Lake Como, amidst private acoustic strings, Marcus got down on one knee and asked the easiest question.
                </p>
              </div>
            </div>

            {/* Milestone 4: 2026 (Left Story, Right Year) */}
            <div className="grid grid-cols-[1fr_80px] sm:grid-cols-[1fr_100px] gap-4 items-center text-left">
              <div>
                <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase text-[#9e887d] block font-bold">
                  October 2026
                </span>
                <h4 className="font-cinzel text-xs font-bold text-[#3d2b24] tracking-wider uppercase mb-1">
                  The Love Gate
                </h4>
                <p className="font-serif italic text-xs text-[#6e594f] leading-relaxed">
                  Surrounded by our dearest friends and family, we exchange our eternal vows and begin our greatest adventure yet.
                </p>
              </div>
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#9b4356] tracking-tight text-right">
                2026
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ORDER OF THE DAY: Schedule with Circular Badges */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#fbf8f2] text-center border-t border-[#ede4d7]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            Celebration
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#3d2b24] tracking-[0.2em] uppercase mb-10 font-normal">
            Order of the Day
          </h2>

          <div className="space-y-6 max-w-[360px] mx-auto text-left">
            {timelineEvents.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-4">
                {/* Circular Rose-Burgundy Icon Badge */}
                <div className="w-9 h-9 rounded-full bg-[#9b4356] text-white flex items-center justify-center font-cinzel text-xs font-bold shrink-0 shadow-sm mt-0.5">
                  {evt.num}
                </div>

                <div>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-cinzel text-xs font-bold text-[#3d2b24] tracking-wider uppercase">
                      {evt.title}
                    </h4>
                    <span className="font-serif italic text-xs text-[#9b4356]">
                      {evt.time}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs text-[#6e594f] mt-0.5 leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Venue Pill Link */}
          <div className="mt-10 max-w-[360px] mx-auto">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#dfba73]/60 shadow-xs hover:shadow-md transition-all text-[#3d2b24] text-[11px] font-cinzel tracking-wider font-bold"
            >
              <MapPin className="w-3.5 h-3.5 text-[#9b4356]" />
              <span>{settings?.venueName || "The Grand Pavilion, Lake Como"} • Get Directions →</span>
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CAPTURED MOMENTS: 2 rows x 3 columns Gallery */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#fbf8f2] text-center border-t border-[#ede4d7]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            Photo Gallery
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#3d2b24] tracking-[0.2em] uppercase mb-8 font-normal">
            Captured Moments
          </h2>

          <div className="grid grid-cols-3 gap-2.5 max-w-[420px] mx-auto">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="relative aspect-[3/4] rounded-sm overflow-hidden bg-[#eee5d8] shadow-sm cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  sizes="(max-width: 640px) 33vw, 140px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 sepia-[0.15]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. THE SETTING: Venue Section */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#fbf8f2] text-center border-t border-[#ede4d7]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            The Location
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#3d2b24] tracking-[0.2em] uppercase mb-1 font-normal">
            {settings?.venueName || "The Grand Pavilion"}
          </h2>

          <p className="font-serif italic text-xs text-[#9b4356] mb-6">
            {settings?.venueAddress || "Lake Como, Italy"}
          </p>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-2.5 rounded-sm bg-[#5c1c2e] hover:bg-[#78233c] text-white font-cinzel text-xs tracking-[0.2em] font-bold uppercase shadow-md transition-all hover:scale-105"
          >
            View On Map
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 7. KINDLY REPLY: Elegant Framed Card with Burgundy Accent */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#fbf8f2] text-center border-t border-[#ede4d7]">
          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#9e887d] font-semibold block mb-1">
            RSVP
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl text-[#3d2b24] tracking-[0.2em] uppercase mb-1 font-normal">
            Kindly Reply
          </h2>

          <p className="font-serif italic text-xs text-[#9b4356] mb-8">
            Kindly reply by September 15th
          </p>

          {/* Framed Luxury RSVP Card */}
          <div className="max-w-[360px] mx-auto bg-white rounded-sm p-6 sm:p-7 shadow-lg border-t-4 border-t-[#5c1c2e] border-x border-b border-[#e8dfcf] relative">
            <h3 className="font-alex text-3xl sm:text-4xl text-[#523b32] mb-1 font-normal">
              {brideName} &amp; {groomName}
            </h3>

            <p className="font-cinzel text-[9px] tracking-widest text-[#9e887d] uppercase mb-6">
              Lake Como, Italy
            </p>

            {rsvpDone ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#9b4356]/15 text-[#9b4356] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-xl font-bold text-[#3d2b24]">
                  Thank You, {guestName}!
                </h4>
                <p className="font-serif italic text-xs text-[#6e594f] max-w-[260px] mx-auto leading-relaxed">
                  {attending === "ACCEPT"
                    ? "Your reservation has been received with joy. We cannot wait to celebrate together!"
                    : "Thank you for letting us know. You will be warmly in our hearts!"}
                </p>
                <button
                  type="button"
                  onClick={() => setRsvpDone(false)}
                  className="text-[11px] font-cinzel text-[#9b4356] underline pt-2 font-bold"
                >
                  Edit Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
                {/* Guest Name */}
                <div>
                  <label className="block text-[9px] font-cinzel tracking-widest text-[#7a675e] uppercase font-bold mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xs bg-[#fbf9f5] border border-[#d8cdbf] text-xs text-[#3d2b24] focus:outline-none focus:border-[#5c1c2e]"
                  />
                </div>

                {/* Attendance Toggle */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 px-2 text-[9px] font-cinzel tracking-wider font-bold transition-all text-center rounded-xs ${
                      attending === "ACCEPT"
                        ? "bg-[#5c1c2e] text-white shadow-xs"
                        : "bg-[#f4eee5] text-[#6e594f] hover:bg-[#eae2d6]"
                    }`}
                  >
                    Attending with Joy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 px-2 text-[9px] font-cinzel tracking-wider font-bold transition-all text-center rounded-xs ${
                      attending === "DECLINE"
                        ? "bg-[#3d2b24] text-white shadow-xs"
                        : "bg-[#f4eee5] text-[#6e594f] hover:bg-[#eae2d6]"
                    }`}
                  >
                    Declining with Regret
                  </button>
                </div>

                {attending === "ACCEPT" && (
                  <>
                    {/* Number of Attendees */}
                    <div>
                      <label className="block text-[9px] font-cinzel tracking-widest text-[#7a675e] uppercase font-bold mb-1">
                        Number of Guests
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xs bg-[#fbf9f5] border border-[#d8cdbf] text-xs text-[#3d2b24] focus:outline-none focus:border-[#5c1c2e]"
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
                      <label className="block text-[9px] font-cinzel tracking-widest text-[#7a675e] uppercase font-bold mb-1">
                        Warm Wishes &amp; Dietary Notes
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Can't wait to toast with you!"
                        className="w-full px-3 py-2 rounded-xs bg-[#fbf9f5] border border-[#d8cdbf] text-xs text-[#3d2b24] focus:outline-none focus:border-[#5c1c2e] resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="w-full py-2.5 rounded-xs bg-[#4a1525] hover:bg-[#601c30] text-white font-cinzel text-xs tracking-[0.2em] font-bold uppercase shadow-sm transition-all duration-300 disabled:opacity-50"
                >
                  {submittingRsvp ? "Sending..." : "Send RSVP"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER SECTION: Warm Sand Background */}
        {/* ========================================================================= */}
        <footer className="relative px-6 py-12 bg-[#f4ebe1] text-center border-t border-[#e2d5c4]">
          <div className="flex items-center justify-center gap-2 mb-3 text-[#dfba73]">
            <span className="h-px w-6 bg-[#dfba73]/40" />
            <span>❦</span>
            <span className="h-px w-6 bg-[#dfba73]/40" />
          </div>

          <h3 className="font-alex text-4xl sm:text-5xl text-[#523b32] mb-1 font-normal">
            {brideName} &amp; {groomName}
          </h3>

          <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase text-[#7a675e] block mb-2 font-semibold">
            With All Our Love and Gratitude
          </span>

          <p className="font-cinzel text-[10px] tracking-[0.25em] text-[#9b4356] uppercase">
            {formattedHeaderDate}
          </p>

          <div className="mt-8 pt-6 border-t border-[#dfd3c2]">
            <span className="font-sans text-[10px] text-[#7a675e]/60 tracking-wider">
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
            className="relative max-w-md w-full aspect-[3/4] rounded-sm overflow-hidden shadow-2xl"
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
