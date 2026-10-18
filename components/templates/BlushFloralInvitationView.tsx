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
  Navigation,
  Heart,
  Plus,
  Minus,
} from "lucide-react";
import EnvelopeOpening from "@/components/EnvelopeOpening";

interface BlushFloralInvitationViewProps {
  guest: any;
  settings: any;
  photos?: any[];
}

export default function BlushFloralInvitationView({
  guest,
  settings,
  photos = [],
}: BlushFloralInvitationViewProps) {
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
  const { brideName, groomName } = useMemo(() => {
    const raw = settings?.coupleNames || "Sachin & Kavindi";
    const parts = raw.split(/&|and|\+/i).map((s: string) => s.trim());
    return {
      groomName: parts[0] || "Sachin",
      brideName: parts[1] || "Kavindi",
    };
  }, [settings?.coupleNames]);

  // Gallery photos
  const galleryPhotos = useMemo(() => {
    if (photos && photos.length >= 5) {
      return photos.slice(0, 5).map((p, idx) => ({
        url: p.imageUrl || p.url || `/images/templates/blush-floral/polaroid-${idx + 1}.jpg`,
        caption: p.caption || "Special Moment",
      }));
    }
    return [
      { url: "/images/templates/blush-floral/polaroid-1.jpg", caption: "Sweet Moments" },
      { url: "/images/templates/blush-floral/polaroid-2.jpg", caption: "Endless Laughter" },
      { url: "/images/templates/blush-floral/polaroid-3.jpg", caption: "Beachside Bliss" },
      { url: "/images/templates/blush-floral/polaroid-4.jpg", caption: "Under the Sun" },
      { url: "/images/templates/blush-floral/polaroid-5.jpg", caption: "Forever in Love" },
    ];
  }, [photos]);

  // Countdown timer calculation
  const targetDate = useMemo(() => {
    if (settings?.eventDate) {
      return new Date(settings.eventDate).getTime();
    }
    return new Date("2026-11-14T14:00:00").getTime();
  }, [settings?.eventDate]);

  const [timeLeft, setTimeLeft] = useState({
    days: 69,
    hours: 17,
    minutes: 26,
    seconds: 45,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Music handling
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch((e) => console.log("Audio play error:", e));
    }
  };

  const handleEnvelopeOpen = () => {
    setEnvelopeOpened(true);
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
    }
  };

  // RSVP submission
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingRsvp(true);

    try {
      const res = await fetch("/api/invite/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: guest?.inviteToken || "demo",
          status: attending === "ACCEPT" ? "attending" : "declined",
          attendeeCount: guestCount,
          dietary: dietary,
          message: rsvpMessage,
        }),
      });

      if (res.ok) {
        setRsvpDone(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#8a3b53", "#f0a8b8", "#7a927a", "#c5a059", "#ffffff"],
        });
      } else {
        setRsvpDone(true);
      }
    } catch (err) {
      console.error(err);
      setRsvpDone(true);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wedding Invitation - ${groomName} & ${brideName}`,
          text: `You are cordially invited to celebrate the wedding of ${groomName} & ${brideName}`,
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

  // Order of the Day events
  const itinerary = [
    {
      time: "02:00 PM",
      title: "Poruwa Ceremony",
      desc: "Traditional Sri Lankan blessings, exchange of rings & family unity",
    },
    {
      time: "03:30 PM",
      title: "Cocktail Hour",
      desc: "Tropical refreshments, coconut canapés & beachside acoustic music",
    },
    {
      time: "05:00 PM",
      title: "Grand Reception",
      desc: "Exquisite dinner buffet, heartfelt speeches & champagne celebration",
    },
    {
      time: "07:30 PM",
      title: "Dance & Celebration",
      desc: "First dance, live music, beachside dancing & midnight fireworks",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#fcf8f3] text-[#3e1b24] font-sans overflow-x-hidden selection:bg-[#f0a8b8]/40 selection:text-[#541221]">
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
          guestName={guest?.displayName || "Valued Guest"}
          salutation={guest?.salutation || ""}
          coupleNames={`${groomName} & ${brideName}`}
          initialLocale="en"
          templateId="velvet-homecoming"
          onOpen={handleEnvelopeOpen}
        />
      )}

      {/* Top Floating Controls */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleMusic}
          aria-label="Toggle background music"
          className="p-2.5 rounded-full bg-white/85 hover:bg-white text-[#541221] shadow-md border border-[#eddcd2] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
        </button>

        <button
          onClick={handleShare}
          aria-label="Share invitation"
          className="p-2.5 rounded-full bg-white/85 hover:bg-white text-[#541221] shadow-md border border-[#eddcd2] backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Single-Column Mobile Card Container matching Reference Design */}
      <div className="max-w-[480px] sm:max-w-[520px] mx-auto min-h-screen shadow-2xl bg-[#faf6f0] overflow-hidden flex flex-col border-x border-[#ede4d7]">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Floral Arch, Couple Names & Floral Bouquet */}
        {/* ========================================================================= */}
        <header className="relative pt-6 pb-12 px-6 text-center flex flex-col items-center">
          {/* Top Watercolor Floral Arch */}
          <div className="w-full max-w-[420px] relative h-36 sm:h-44 -mt-2 mb-2 pointer-events-none">
            <Image
              src="/images/templates/blush-floral/floral-header-arch.png"
              alt="Blush Floral Header Arch"
              fill
              className="object-contain object-top"
              priority
            />
          </div>

          {/* Together with their families */}
          <p className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-4">
            Together with their families
          </p>

          {/* Couple Names */}
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-4xl sm:text-5xl font-serif text-[#421424] font-normal tracking-wide">
              {groomName}
            </h1>
            <span className="text-xl sm:text-2xl font-serif italic text-[#9b4961] my-1 font-light">
              and
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif text-[#421424] font-normal tracking-wide">
              {brideName}
            </h1>
          </div>

          {/* Pleasure of company */}
          <p className="text-[10px] sm:text-[11px] tracking-[0.2em] text-[#7a4855] uppercase max-w-[320px] leading-relaxed mb-3">
            Request the pleasure of your company
            <br />
            at their wedding celebration
          </p>

          {/* Wedding Date */}
          <div className="inline-block px-5 py-1.5 rounded-full bg-[#f4ece3] border border-[#e8d5c4] mb-3">
            <p className="text-xs sm:text-sm font-serif tracking-[0.18em] text-[#541221] font-medium">
              NOVEMBER 14, 2026
            </p>
          </div>

          {/* Bottom Watercolor Floral Bouquet Framing the Names */}
          <div className="w-full max-w-[360px] relative h-36 sm:h-40 pointer-events-none">
            <Image
              src="/images/templates/blush-floral/floral-bouquet.png"
              alt="Watercolor Floral Bouquet"
              fill
              className="object-contain"
            />
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. COUNTDOWN: Until we say 'I Do' */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#faf6f0] text-center border-t border-[#f0e6da]">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Countdown to the big day
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-3 font-normal">
            Until we say &apos;I Do&apos;
          </h2>

          {/* Floral Sprig Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* 4 Soft Bevelled Countdown Cards */}
          <div className="grid grid-cols-4 gap-2.5 max-w-[360px] mx-auto">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-[#fffdfa] rounded-xl py-3 px-1 border border-[#eddcd2] shadow-[0_4px_16px_rgba(138,59,83,0.08)] flex flex-col items-center"
              >
                <span className="text-2xl sm:text-3xl font-serif text-[#541221] font-medium tracking-tight">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="text-[9px] font-sans tracking-[0.18em] text-[#8a5763] uppercase mt-1 font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. LOVE STORY: How We Got Here */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#faf6f0] text-center border-t border-[#f0e6da]">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Our Journey of Love
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-3 font-normal">
            How We Got Here
          </h2>

          {/* Floral Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* Timeline Milestones with Center Golden Axis Line */}
          <div className="relative max-w-[380px] mx-auto py-6">
            {/* Center Vertical Axis Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-[#e8cfc4] via-[#c5a059] to-[#e8cfc4] -translate-x-1/2" />

            {/* Milestone 1: 2019 (Left Heading, Right Text) */}
            <div className="relative grid grid-cols-2 gap-6 items-center mb-12">
              <div className="text-right pr-4">
                <span className="text-3xl sm:text-4xl font-serif text-[#8a3b53] font-normal tracking-tight block">
                  2019
                </span>
                <span className="text-[10px] tracking-[0.15em] text-[#7a4855] uppercase font-semibold">
                  First Meeting
                </span>
              </div>

              {/* Diamond Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#faf6f0] border-2 border-[#8a3b53] z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#8a3b53]" />
              </div>

              <div className="text-left pl-4">
                <p className="text-xs text-[#522933] leading-relaxed italic">
                  &ldquo;A chance encounter over coffee that turned into hours of endless conversation and laughter.&rdquo;
                </p>
              </div>
            </div>

            {/* Milestone 2: 2021 (Left Text, Right Heading) */}
            <div className="relative grid grid-cols-2 gap-6 items-center">
              <div className="text-right pr-4">
                <p className="text-xs text-[#522933] leading-relaxed italic">
                  &ldquo;Under the starlit sky at the beach, he got down on one knee and she happily said yes.&rdquo;
                </p>
              </div>

              {/* Diamond Center Node */}
              <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-[#faf6f0] border-2 border-[#8a3b53] z-10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#8a3b53]" />
              </div>

              <div className="text-left pl-4">
                <span className="text-3xl sm:text-4xl font-serif text-[#8a3b53] font-normal tracking-tight block">
                  2021
                </span>
                <span className="text-[10px] tracking-[0.15em] text-[#7a4855] uppercase font-semibold">
                  The Proposal
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ORDER OF THE DAY: Schedule Cards */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#faf6f0] text-center border-t border-[#f0e6da]">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Wedding Schedule
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-3 font-normal">
            Order of the Day
          </h2>

          {/* Floral Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* 4 Soft Rounded Schedule Cards */}
          <div className="space-y-3.5 max-w-[380px] mx-auto text-left">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-[#fff9f6] to-[#fffdfa] rounded-2xl p-4 border border-[#eddcd2] shadow-[0_2px_8px_rgba(138,59,83,0.04)] flex items-start gap-4 transition-all hover:shadow-md"
              >
                {/* Time Badge */}
                <div className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#f5e6dd] border border-[#e8d2c4] text-center">
                  <span className="text-xs font-serif font-bold text-[#8a3b53] block">
                    {item.time}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-sm font-serif font-semibold text-[#421424] mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#73434e] leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. CAPTURED MOMENTS: 5 Polaroid Photo Gallery with Lightbox */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#faf6f0] text-center border-t border-[#f0e6da]">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Sweet Memories
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-3 font-normal">
            Captured Moments
          </h2>

          {/* Floral Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* 5 Polaroid Photos matching the layout */}
          <div className="max-w-[380px] mx-auto space-y-6">
            {/* Row 1: 2 Polaroids side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Photo 1 (Tilted Left) */}
              <div
                onClick={() => setLightboxIndex(0)}
                className="cursor-pointer bg-white p-2.5 pb-5 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform -rotate-2 hover:rotate-0 hover:scale-105 border border-[#ece4d8]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={galleryPhotos[0].url}
                    alt={galleryPhotos[0].caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] font-serif text-[#8a5763] text-center mt-2 italic">
                  {galleryPhotos[0].caption}
                </p>
              </div>

              {/* Photo 2 (Tilted Right) */}
              <div
                onClick={() => setLightboxIndex(1)}
                className="cursor-pointer bg-white p-2.5 pb-5 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform rotate-2 hover:rotate-0 hover:scale-105 border border-[#ece4d8]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={galleryPhotos[1].url}
                    alt={galleryPhotos[1].caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] font-serif text-[#8a5763] text-center mt-2 italic">
                  {galleryPhotos[1].caption}
                </p>
              </div>
            </div>

            {/* Row 2: 2 Polaroids side by side */}
            <div className="grid grid-cols-2 gap-4">
              {/* Photo 3 (Tilted Right) */}
              <div
                onClick={() => setLightboxIndex(2)}
                className="cursor-pointer bg-white p-2.5 pb-5 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform rotate-1.5 hover:rotate-0 hover:scale-105 border border-[#ece4d8]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={galleryPhotos[2].url}
                    alt={galleryPhotos[2].caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] font-serif text-[#8a5763] text-center mt-2 italic">
                  {galleryPhotos[2].caption}
                </p>
              </div>

              {/* Photo 4 (Tilted Left) */}
              <div
                onClick={() => setLightboxIndex(3)}
                className="cursor-pointer bg-white p-2.5 pb-5 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform -rotate-1.5 hover:rotate-0 hover:scale-105 border border-[#ece4d8]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={galleryPhotos[3].url}
                    alt={galleryPhotos[3].caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] font-serif text-[#8a5763] text-center mt-2 italic">
                  {galleryPhotos[3].caption}
                </p>
              </div>
            </div>

            {/* Row 3: Centered 5th Polaroid */}
            <div className="flex justify-center">
              <div
                onClick={() => setLightboxIndex(4)}
                className="cursor-pointer bg-white p-2.5 pb-5 rounded-sm shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-[#ece4d8] w-[55%]"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={galleryPhotos[4].url}
                    alt={galleryPhotos[4].caption}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-[10px] font-serif text-[#8a5763] text-center mt-2 italic">
                  {galleryPhotos[4].caption}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. CELEBRATION VENUE: Hikkaduwa Beach Resort & Map */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-12 bg-[#faf6f0] text-center border-t border-[#f0e6da]">
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Celebration Venue
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-1 font-normal">
            Hikkaduwa Beach Resort
          </h2>

          <p className="text-xs text-[#7a4855] tracking-wide mb-3">
            Galle Road, Hikkaduwa, Southern Province, Sri Lanka
          </p>

          {/* Floral Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* Map Preview Box */}
          <div className="max-w-[380px] mx-auto mb-5 rounded-2xl overflow-hidden border border-[#eddcd2] shadow-sm bg-[#f5ede4] relative aspect-[16/10]">
            <iframe
              title="Venue Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.652156857186!2d80.0988582!3d6.1362846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae178351bb23455%3A0xb304cfdd8cb78619!2sHikkaduwa%20Beach!5e0!3m2!1sen!2slk!4v1700000000000"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Get Directions Button */}
          <a
            href="https://maps.google.com/?q=Hikkaduwa+Beach+Resort+Sri+Lanka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#eddcd2] shadow-xs hover:shadow-md transition-all text-[#541221] text-xs font-serif tracking-wider font-semibold hover:bg-[#fff9f6]"
          >
            <Navigation className="w-3.5 h-3.5 text-[#8a3b53]" />
            GET DIRECTIONS
          </a>
        </section>

        {/* ========================================================================= */}
        {/* 7. RSVP: Kindly Reply */}
        {/* ========================================================================= */}
        <section className="relative px-6 py-14 bg-[#faf6f0] text-center border-t border-[#f0e6da] overflow-hidden">
          {/* Subtle Watercolor Corner Leaves */}
          <div className="absolute top-2 left-2 w-16 h-16 opacity-30 pointer-events-none">
            <Image
              src="/images/templates/blush-floral/floral-header-arch.png"
              alt="Corner Flower"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-2 right-2 w-16 h-16 opacity-30 pointer-events-none">
            <Image
              src="/images/templates/blush-floral/floral-header-arch.png"
              alt="Corner Flower"
              fill
              className="object-contain"
            />
          </div>

          <p className="text-[10px] font-sans font-medium tracking-[0.25em] text-[#8a3b53] uppercase mb-2">
            Please Respond
          </p>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#421424] mb-1 font-normal">
            Kindly Reply
          </h2>

          <p className="text-xs text-[#7a4855] tracking-wide mb-3">
            Kindly respond by October 15, 2026
          </p>

          {/* Floral Divider */}
          <div className="flex justify-center mb-8">
            <Image
              src="/images/templates/blush-floral/floral-divider.svg"
              alt="Floral Divider"
              width={160}
              height={24}
              className="opacity-90"
            />
          </div>

          {/* Floating Luxury Card */}
          <div className="max-w-[360px] mx-auto bg-white rounded-2xl p-6 sm:p-7 shadow-[0_8px_30px_rgba(138,59,83,0.08)] border border-[#eddcd2] relative text-left">
            {rsvpDone ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#8a3b53] mx-auto" />
                <h3 className="text-xl font-serif text-[#421424]">
                  Thank You, {guestName}!
                </h3>
                <p className="text-xs text-[#7a4855]">
                  Your RSVP response has been received with warmth and joy.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                {/* Name field */}
                <div>
                  <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#7a4855] uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f3] border border-[#eddcd2] text-xs text-[#421424] focus:outline-none focus:border-[#8a3b53]"
                  />
                </div>

                {/* Joyfully Accept / Regretfully Decline */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAttending("ACCEPT")}
                    className={`py-2 px-3 rounded-xl text-xs font-serif tracking-wider font-semibold transition-all border ${
                      attending === "ACCEPT"
                        ? "bg-[#8a3b53] text-white border-[#8a3b53] shadow-xs"
                        : "bg-[#fcf8f3] text-[#7a4855] border-[#eddcd2]"
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("DECLINE")}
                    className={`py-2 px-3 rounded-xl text-xs font-serif tracking-wider font-semibold transition-all border ${
                      attending === "DECLINE"
                        ? "bg-[#8a3b53] text-white border-[#8a3b53] shadow-xs"
                        : "bg-[#fcf8f3] text-[#7a4855] border-[#eddcd2]"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>

                {/* Guest counter */}
                {attending === "ACCEPT" && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#7a4855] uppercase mb-1.5">
                      Number of Guests
                    </label>
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#fcf8f3] border border-[#eddcd2]">
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                        className="w-7 h-7 rounded-full bg-white border border-[#eddcd2] flex items-center justify-center text-[#8a3b53] hover:bg-[#fbf4ee]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-serif font-bold text-[#421424]">
                        {guestCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
                        className="w-7 h-7 rounded-full bg-white border border-[#eddcd2] flex items-center justify-center text-[#8a3b53] hover:bg-[#fbf4ee]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Dietary or message */}
                <div className="pt-1">
                  <label className="block text-[11px] font-sans font-semibold tracking-wider text-[#7a4855] uppercase mb-1.5">
                    Warm Wishes or Dietary Notes
                  </label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Send a note to the couple..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f3] border border-[#eddcd2] text-xs text-[#421424] focus:outline-none focus:border-[#8a3b53] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submittingRsvp}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#73172c] via-[#8a3b53] to-[#73172c] hover:brightness-105 text-white font-serif tracking-widest text-xs uppercase shadow-md transition-all duration-300 disabled:opacity-60"
                >
                  {submittingRsvp ? "SUBMITTING..." : "SUBMIT RSVP"}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER: Deep Rich Burgundy Footer */}
        {/* ========================================================================= */}
        <footer className="relative px-6 py-12 bg-[#421424] text-center text-white">
          <div className="flex flex-col items-center max-w-[360px] mx-auto">
            {/* Monogram */}
            <div className="w-10 h-10 rounded-full border border-[#d6a57c]/60 flex items-center justify-center mb-3">
              <span className="font-serif text-sm text-[#e8cfc4] tracking-widest">
                S &amp; K
              </span>
            </div>

            {/* Names */}
            <h3 className="text-2xl font-serif font-normal text-[#fff9f6] tracking-wide mb-1">
              {groomName} &amp; {brideName}
            </h3>

            <p className="text-[10px] font-sans tracking-[0.25em] text-[#d6a57c] uppercase mb-4">
              With Love &amp; Gratitude
            </p>

            <p className="text-xs text-[#ecd9d1] font-light max-w-[280px] leading-relaxed">
              Thank you for being part of our special day and celebrating our love story.
            </p>
          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex(
                (lightboxIndex - 1 + galleryPhotos.length) % galleryPhotos.length
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-[440px] w-full max-h-[80vh] flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
              <Image
                src={galleryPhotos[lightboxIndex].url}
                alt={galleryPhotos[lightboxIndex].caption}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white text-xs font-serif mt-3 tracking-wider italic">
              {galleryPhotos[lightboxIndex].caption}
            </p>
          </div>

          <button
            onClick={() =>
              setLightboxIndex((lightboxIndex + 1) % galleryPhotos.length)
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
