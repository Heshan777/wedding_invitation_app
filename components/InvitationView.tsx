"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  Calendar,
  MapPin,
  Clock,
  Send,
  Share2,
  Copy,
  Check,
  Navigation,
  Sparkles,
  Heart,
  QrCode,
  Users,
  Compass,
  MessageSquareHeart,
  Music,
} from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import VenueMap from "./VenueMap";
import FallingDecor from "./FallingDecor";
import MusicPlayer from "./MusicPlayer";
import EnvelopeOpening from "./EnvelopeOpening";
import { formatEventDate } from "@/lib/date";
import { generateICS } from "@/lib/calendar";

type Guest = {
  token: string;
  displayName: string;
  salutation: string;
  inviteType: string;
  tableNumber: number;
  notes?: string | null;
};


type Settings = {
  coupleNames: string;
  hostIntro: string;
  invitationBody: string;
  eventDate: Date;
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  heroImageUrl: string | null;
  musicUrl: string | null;
};

const timelineEvents = [
  { time: "06:30 PM", title: "Guest Arrival & Welcome", desc: "Welcome drinks & traditional Sri Lankan treats" },
  { time: "07:00 PM", title: "Sacred Poruwa Ceremony", desc: "Auspicious blessings & cultural rituals" },
  { time: "07:30 PM", title: "Grand Couple Entrance", desc: "Welcoming the newly wedded couple with fireworks" },
  { time: "08:00 PM", title: "Cake Cutting & Champagne Toast", desc: "Celebratory words & raising glasses to love" },
  { time: "08:30 PM", title: "Dinner Buffet Banquet", desc: "Lavish multi-cuisine dining experience" },
  { time: "09:30 PM", title: "Music, DJ & Dancing", desc: "Let the celebrations and dance floor begin!" },
];

function formatInviteLine(guest: Guest) {
  if (guest.inviteType === "FAMILY") {
    return `${guest.salutation} ${guest.displayName} and Family`;
  }
  return `${guest.salutation} ${guest.displayName}`;
}

export default function InvitationView({
  guest,
  settings,
}: {
  guest: Guest;
  settings: Settings;
}) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  // RSVP Form state
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "declined" | "">("");
  const [rsvpCount, setRsvpCount] = useState<number>(guest.inviteType === "COUPLE" ? 2 : 1);
  const [rsvpWish, setRsvpWish] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  const date = formatEventDate(settings.eventDate);
  const eventDateObj = new Date(settings.eventDate);

  // Map URLs
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.venueLat},${settings.venueLng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${settings.venueLat},${settings.venueLng}&q=${encodeURIComponent(
    settings.venueName
  )}`;
  const wazeUrl = `https://waze.com/ul?ll=${settings.venueLat},${settings.venueLng}&navigate=yes`;

  // Google Calendar direct web URL
  const gCalStart = eventDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const gCalEnd = new Date(eventDateObj.getTime() + 5 * 60 * 60 * 1000)
    .toISOString()
    .replace(/-|:|\.\d\d\d/g, "");
  const googleCalendarWebUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `${settings.coupleNames} — Wedding & Homecoming`
  )}&dates=${gCalStart}/${gCalEnd}&details=${encodeURIComponent(
    `Homecoming celebration for ${settings.coupleNames}`
  )}&location=${encodeURIComponent(
    `${settings.venueName}, ${settings.venueAddress}`
  )}`;

  // Generate dynamic QR Code for guest VIP pass
  useEffect(() => {
    const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
    QRCode.toDataURL(
      inviteUrl,
      {
        width: 180,
        margin: 1,
        color: {
          dark: "#6b0f24",
          light: "#ffffff",
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [guest.token]);

  const handleOpenEnvelope = () => {
    setEnvelopeOpened(true);
    // Broadcast event to start music player
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("start_wedding_music"));
    }
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(
      `${settings.venueName}, ${settings.venueAddress}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `✨ You are warmly invited to celebrate the Homecoming ceremony of *${settings.coupleNames}*! 🥂🍾\n\nView the personalized invitation here:\n${
      typeof window !== "undefined" ? window.location.href : ""
    }`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleDownloadICS = () => {
    generateICS({
      title: `${settings.coupleNames} — Homecoming Celebration`,
      description: `Homecoming celebration for ${settings.coupleNames}. We look forward to celebrating with you!`,
      location: `${settings.venueName}, ${settings.venueAddress}`,
      startDate: settings.eventDate,
      durationHours: 5,
    });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpStatus) return;
    setSubmittingRsvp(true);

    try {
      await fetch("/api/invite/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: guest.token,
          status: rsvpStatus,
          guestCount: rsvpStatus === "attending" ? rsvpCount : 0,
          message: rsvpWish,
        }),
      });

      setRsvpSubmitted(true);
      // Confetti for RSVP
      if (rsvpStatus === "attending") {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#c5a059", "#dfba73", "#800020", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] overflow-x-hidden">
      {/* 3D Wax Seal Envelope Entrance Overlay */}
      <EnvelopeOpening
        guestName={guest.displayName}
        salutation={guest.salutation}
        coupleNames={settings.coupleNames}
        onOpen={handleOpenEnvelope}
      />

      {/* Floating Animated Rose Petals & Gold Sparkles */}
      <FallingDecor />

      {/* Luxury Vinyl Disc Background Music Player */}
      <MusicPlayer src={settings.musicUrl || "/audio/background.mp3"} />

      {/* Main Luxury Invitation Container */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Parchment Invitation Card Frame */}
        <div className="parchment-card rounded-3xl p-6 sm:p-10 text-[#1a1517] relative overflow-hidden">
          {/* Ornate Gold Border Lining */}
          <div className="absolute inset-2 sm:inset-3 rounded-2xl border-2 border-[#c5a059]/40 pointer-events-none" />
          <div className="absolute inset-3 sm:inset-4 rounded-2xl border border-[#c5a059]/20 pointer-events-none" />

          {/* Corner Vintage Filigree Accents */}
          <div className="absolute top-4 left-4 text-[#c5a059] text-base select-none">⚜</div>
          <div className="absolute top-4 right-4 text-[#c5a059] text-base select-none">⚜</div>
          <div className="absolute bottom-4 left-4 text-[#c5a059] text-base select-none">⚜</div>
          <div className="absolute bottom-4 right-4 text-[#c5a059] text-base select-none">⚜</div>

          {/* Header Crown / Monogram */}
          <div className="text-center pt-2 mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#800020]/10 border border-[#c5a059]/50 shadow-inner mb-3">
              <span className="font-cinzel text-xl font-bold text-[#800020]">
                S & S
              </span>
            </div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-[#8c6a2b] font-cinzel font-semibold">
              The Royal Homecoming Celebration
            </p>
            <h1 className="font-serif italic text-4xl sm:text-5xl text-[#6b0f24] font-bold mt-1 tracking-tight">
              Invitation
            </h1>
          </div>

          {/* Intro Ribbon */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c5a059]" />
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c5a059]" />
          </div>

          <p className="text-center text-sm sm:text-base text-[#3d3238] font-sans leading-relaxed mb-6">
            Together with our families, we cordially invite you to celebrate the joyous union & homecoming of
          </p>

          {/* Couple Hero Section */}
          <div className="relative left-1/2 -translate-x-1/2 w-full max-w-lg my-6">
            <div className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#800020]/5 to-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center">
              {/* Couple Backdrop image with gentle opacity */}
              <Image
                src="/images/couple-hero.png"
                alt="Couple Silhouette"
                width={480}
                height={520}
                className="absolute inset-0 w-full h-full object-contain opacity-25 -z-10"
                priority
              />

              {/* Groom illustration */}
              <div className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 filter drop-shadow-md">
                <Image
                  src="/images/groom-small.png"
                  alt="Groom"
                  width={75}
                  height={120}
                  className="w-16 sm:w-20 h-auto"
                />
              </div>

              {/* Bride illustration */}
              <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 filter drop-shadow-md">
                <Image
                  src="/images/bride-small.png"
                  alt="Bride"
                  width={75}
                  height={120}
                  className="w-16 sm:w-20 h-auto"
                />
              </div>

              {/* Couple Names Calligraphy Typography */}
              <div className="text-center px-4 relative z-10">
                <h2 className="font-serif italic text-4xl sm:text-5xl text-[#6b0f24] font-bold leading-none tracking-tight">
                  {settings.coupleNames.split("&")[0]?.trim() || "Sandharu"}
                </h2>
                <div className="my-1.5 flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-[#c5a059]" />
                  <span className="font-alex text-3xl sm:text-4xl text-[#996515]">&</span>
                  <div className="h-px w-8 bg-[#c5a059]" />
                </div>
                <h2 className="font-serif italic text-4xl sm:text-5xl text-[#6b0f24] font-bold leading-none tracking-tight">
                  {settings.coupleNames.split("&")[1]?.trim() || "Sanduni"}
                </h2>
              </div>
            </div>
          </div>

          {/* Host Intro */}
          <p className="text-center text-sm sm:text-base text-[#3d3238] font-sans leading-relaxed my-6 px-2">
            {settings.hostIntro}
          </p>

          {/* Personalized Guest Salutation Card */}
          <div className="relative my-6 rounded-2xl bg-gradient-to-r from-[#800020] via-[#6b0f24] to-[#420614] p-5 text-center text-[#fdfbf7] shadow-xl border border-[#dfba73]/40">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#edd892] font-cinzel font-semibold mb-1">
              Honoured Guest
            </div>
            <div className="font-serif italic text-2xl sm:text-3xl font-bold tracking-wide">
              {formatInviteLine(guest)}
            </div>
          </div>

          <p className="text-center text-sm sm:text-base text-[#3d3238] font-sans leading-relaxed my-6 px-2">
            {settings.invitationBody}
          </p>

          {/* Golden Date & Time Badge */}
          <div className="my-8 text-center bg-gradient-to-b from-[#fdf6e7] to-[#faedd0] rounded-2xl p-6 border border-[#c5a059]/50 shadow-md">
            <div className="w-16 h-px bg-[#c5a059] mx-auto mb-2" />
            <p className="font-cinzel text-xl sm:text-2xl text-[#800020] font-bold uppercase tracking-wider">
              {date.weekday}
            </p>
            <p className="font-serif italic text-base text-[#8c6a2b]">{date.month}</p>
            <p className="font-cinzel text-6xl sm:text-7xl text-[#1a1517] font-black my-1">
              {String(date.day).padStart(2, "0")}
              <sup className="text-2xl sm:text-3xl text-[#800020] font-serif italic ml-1">
                {date.ordinal}
              </sup>
            </p>
            <p className="font-cinzel text-xl text-[#800020] font-semibold tracking-widest">
              {date.year}
            </p>
            <div className="w-16 h-px bg-[#c5a059] mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-[#4a3b32] font-sans font-medium mt-3">
              Ceremony & Reception from <span className="font-bold text-[#800020]">{date.time}</span> onwards
            </p>
          </div>

          {/* VIP Guest Pass & Seating Access Card */}
          <div className="my-8 rounded-2xl border-2 border-dashed border-[#c5a059] bg-[#fffdfa] p-5 shadow-lg relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-cinzel font-semibold mb-2">
                  <QrCode className="w-3.5 h-3.5" /> VIP Check-in Pass
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#1a1517]">
                  {guest.displayName}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#5a483e]">
                  <Users className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Category: <strong>{guest.inviteType}</strong></span>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-[#5a483e]">Reserved Table:</span>
                  <div className="inline-block ml-2 px-4 py-1.5 rounded-xl bg-[#800020] text-[#fdfbf7] font-cinzel font-bold text-lg shadow-md">
                    Table #{String(guest.tableNumber).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* QR Code Scannable Check-in */}
              {qrDataUrl && (
                <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-[#c5a059]/40 shadow-sm">
                  <Image
                    src={qrDataUrl}
                    alt="Guest Check-in QR Code"
                    width={110}
                    height={110}
                    className="w-24 h-24 sm:w-28 sm:h-28"
                  />
                  <span className="text-[9px] uppercase tracking-wider text-[#800020] font-cinzel font-semibold mt-1">
                    Scan for Reception
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Live Countdown Section */}
          <div className="my-8">
            <CountdownTimer targetDate={settings.eventDate} />
          </div>

          {/* Programme / Event Itinerary Timeline */}
          <div className="my-10">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold">
                Order of Events
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                Programme of the Day
              </h3>
            </div>

            <div className="space-y-3">
              {timelineEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-[#fbf7ee] border border-[#c5a059]/25 hover:border-[#c5a059] transition duration-200"
                >
                  <div className="min-w-[76px] px-2 py-1 rounded-lg bg-[#800020]/10 text-[#800020] font-cinzel text-xs font-bold text-center">
                    {evt.time}
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1a1517]">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#5a483e] font-sans mt-0.5">
                      {evt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Location Suite */}
          <div className="my-10">
            <div className="text-center mb-4">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold">
                Celebration Location
              </span>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                {settings.venueName}
              </h3>
              <p className="text-xs sm:text-sm text-[#5a483e] mt-1 max-w-sm mx-auto">
                {settings.venueAddress}
              </p>
            </div>

            {/* Interactive Leaflet Venue Map */}
            <VenueMap
              lat={settings.venueLat}
              lng={settings.venueLng}
              venueName={settings.venueName}
            />

            {/* Quick Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-shimmer py-3 px-4 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
              >
                <Compass className="w-4 h-4" /> Google Maps
              </a>
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a1517] text-[#fdfbf7] hover:bg-black py-3 px-4 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
              >
                <Navigation className="w-4 h-4 text-[#dfba73]" /> Apple Maps
              </a>
              <a
                href={wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2a1a20] text-[#edd892] hover:bg-[#800020] py-3 px-4 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition"
              >
                <MapPin className="w-4 h-4" /> Waze Nav
              </a>
            </div>

            {/* Copy Address Button */}
            <button
              onClick={handleCopyAddress}
              className="mt-2.5 w-full py-2.5 px-4 rounded-xl bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] text-xs font-cinzel font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-[#c5a059]/30"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Address Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Venue Address
                </>
              )}
            </button>
          </div>

          {/* Calendar Integration Hub */}
          <div className="my-8 p-5 rounded-2xl bg-[#fbf7ee] border border-[#c5a059]/40 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-[#800020]">
              <Calendar className="w-4 h-4" />
              <span className="font-cinzel text-xs uppercase tracking-widest font-semibold">
                Mark Your Calendar
              </span>
            </div>
            <p className="text-xs text-[#5a483e] mb-4">
              Add this special day to your digital calendar with automatic reminders.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={googleCalendarWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-[#800020] text-[#fdfbf7] hover:bg-[#5c0017] text-xs font-cinzel font-semibold flex items-center justify-center gap-2 shadow transition"
              >
                <Calendar className="w-4 h-4 text-[#edd892]" /> Google Calendar
              </a>
              <button
                onClick={handleDownloadICS}
                className="py-2.5 px-4 rounded-xl bg-[#1a1517] text-[#fdfbf7] hover:bg-black text-xs font-cinzel font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#dfba73]" /> Apple / Outlook iCal
              </button>
            </div>
          </div>

          {/* Interactive RSVP & Blessing Guestbook Form */}
          <div className="my-10 p-6 rounded-2xl bg-gradient-to-b from-[#fffdfa] to-[#f7f2e7] border-2 border-[#c5a059]/50 shadow-xl">
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 text-[#800020] text-xs font-cinzel font-semibold mb-1">
                <MessageSquareHeart className="w-4 h-4 text-[#c5a059]" /> RSVP & Heartfelt Wishes
              </div>
              <h3 className="font-serif italic text-2xl text-[#6b0f24] font-bold">
                Will You Be Joining Us?
              </h3>
              <p className="text-xs text-[#5a483e] mt-1">
                Please confirm your attendance and leave a blessing message for the couple.
              </p>
            </div>

            {rsvpSubmitted ? (
              <div className="text-center py-6 px-4 bg-[#800020]/10 rounded-xl border border-[#c5a059]/40">
                <Heart className="w-8 h-8 text-[#800020] mx-auto mb-2 fill-[#800020] animate-pulse" />
                <h4 className="font-cinzel text-lg font-bold text-[#800020]">
                  Thank You for Responding!
                </h4>
                <p className="text-xs text-[#3d3238] mt-1">
                  Your response and warm blessings have been recorded with gratitude.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                {/* Attending / Decline Options */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus("attending")}
                    className={`py-3 px-3 rounded-xl font-cinzel text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                      rsvpStatus === "attending"
                        ? "bg-[#800020] text-[#fdfbf7] border-[#800020] shadow-md scale-[1.02]"
                        : "bg-white text-[#1a1517] border-[#c5a059]/40 hover:bg-[#800020]/5"
                    }`}
                  >
                    <span>🍾 Joyfully Accept</span>
                    <span className="text-[10px] font-sans font-normal opacity-80">I will be there</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus("declined")}
                    className={`py-3 px-3 rounded-xl font-cinzel text-xs font-bold border transition cursor-pointer flex flex-col items-center gap-1 ${
                      rsvpStatus === "declined"
                        ? "bg-[#4a3b32] text-[#fdfbf7] border-[#4a3b32] shadow-md scale-[1.02]"
                        : "bg-white text-[#1a1517] border-[#c5a059]/40 hover:bg-[#800020]/5"
                    }`}
                  >
                    <span>🕊 Regretfully Decline</span>
                    <span className="text-[10px] font-sans font-normal opacity-80">Celebrating in spirit</span>
                  </button>
                </div>

                {/* Headcount if attending */}
                {rsvpStatus === "attending" && (
                  <div>
                    <label className="block text-xs font-cinzel font-semibold text-[#1a1517] mb-1">
                      Attending Guest Count
                    </label>
                    <select
                      value={rsvpCount}
                      onChange={(e) => setRsvpCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#c5a059]/60 text-xs text-[#1a1517] focus:outline-none focus:ring-2 focus:ring-[#800020]"
                    >
                      <option value={1}>1 Guest (Myself)</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests (Family)</option>
                      <option value={4}>4 Guests (Family)</option>
                      <option value={5}>5+ Guests</option>
                    </select>
                  </div>
                )}

                {/* Blessing Message */}
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#1a1517] mb-1">
                    Your Blessing / Congratulatory Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a sweet message to Sandharu & Sanduni..."
                    value={rsvpWish}
                    onChange={(e) => setRsvpWish(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#c5a059]/60 text-xs text-[#1a1517] focus:outline-none focus:ring-2 focus:ring-[#800020] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!rsvpStatus || submittingRsvp}
                  className="w-full py-3 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submittingRsvp ? "Submitting..." : "Send RSVP & Blessings"}
                </button>
              </form>
            )}
          </div>

          {/* Blessing Illustration */}
          <div className="my-8 text-center">
            <Image
              src="/images/couple-kneeling.png"
              alt="Blessings from Couple"
              width={260}
              height={300}
              className="mx-auto filter drop-shadow-md"
            />
            <p className="font-serif italic text-base sm:text-lg text-[#6b0f24] font-medium mt-4">
              &ldquo;Your presence and blessings are sincerely appreciated.&rdquo;
            </p>
          </div>

          {/* Social Share & Link Actions */}
          <div className="pt-6 border-t border-[#c5a059]/30 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1a1517] text-[#edd892] hover:bg-black text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer border border-[#c5a059]/40"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? "Link Copied!" : "Copy Invitation Link"}
            </button>
          </div>

          {/* Footer Branding */}
          <div className="text-center pt-8">
            <p className="text-[10px] text-[#1a1517]/50 font-sans tracking-wider uppercase">
              Developed by Sachintha Heshan • Royal Digital Wedding Suite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
