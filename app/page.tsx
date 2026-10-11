"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Crown,
  CheckCircle2,
  ArrowRight,
  Play,
  Phone,
  MapPin,
  Calendar,
  Users,
  QrCode,
  Music,
  Layers,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronDown,
  Wine,
  Clock,
  HelpCircle,
  Send,
  Smartphone,
  Share2,
  FileSpreadsheet,
  Star,
  MessageCircle,
  Menu,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TEMPLATE_LIST, InvitationTemplate } from "@/lib/templates";
import RoyalThemeToggle from "@/components/RoyalThemeToggle";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Phone Mockup Simulation States
  const [sealOpened, setSealOpened] = useState(false);
  const [mockupRsvpStatus, setMockupRsvpStatus] = useState<"pending" | "attending" | "declined">("pending");
  const [soundPlaying, setSoundPlaying] = useState(false);

  // Countdown timer simulation for phone mockup
  const [timeLeft, setTimeLeft] = useState({ days: 42, hours: 14, mins: 28, secs: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: 59, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return { ...prev, days: Math.max(0, prev.days - 1), hours: 23, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerMockupConfetti = () => {
    setMockupRsvpStatus("attending");
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#dfba73", "#ffd700", "#c5a059", "#db2a5b", "#800020"],
    });
  };

  const categories = [
    { id: "all", label: "All Designs" },
    { id: "classic", label: "Traditional Poruwa / Royal" },
    { id: "modern", label: "Modern Luxe & Chic" },
    { id: "botanical", label: "Garden & Botanical" },
    { id: "celestial", label: "Evening & Starlight" },
  ];

  const filteredTemplates =
    selectedCategory === "all"
      ? TEMPLATE_LIST
      : TEMPLATE_LIST.filter((t) => t.category === selectedCategory);

  const faqs = [
    {
      q: "Is it really free to start and preview?",
      a: "Yes, 100%! You can build your full invitation, personalize the story, choose your template, and preview the live mobile site without paying anything. You only pay once (from Rs. 5,000) when you are ready to publish and send personalized WhatsApp links to your guests.",
    },
    {
      q: "Can we add each guest's name on the invitation?",
      a: "Yes! Every guest gets a dedicated personalized link. When they open it, the invitation card displays their name (e.g. 'Dear Kasun & Dinithi'), their designated table number, and customized salutation. The WhatsApp share message also greets them personally.",
    },
    {
      q: "Can I add both Poruwa Ceremony, Reception, and Homecoming?",
      a: "Absolutely. You can add as many milestones as you require: Poruwa, Church Matrimony, Kovil, Reception, and Homecoming. Each event has its own date, time, venue address, and one-tap Google Maps directions button.",
    },
    {
      q: "Do our guests need to download an app or sign up?",
      a: "Not at all. Guests simply tap the link on WhatsApp, and the invitation opens instantly in their mobile browser with smooth animations, background music, and RSVP buttons.",
    },
    {
      q: "Can you make our website match our physical printed card?",
      a: "Yes! Under our Signature Custom plan (Rs. 20,000), our design studio creates a bespoke theme replicating your printed card's exact fonts, floral motifs, monogram, and color palette.",
    },
    {
      q: "How long does our invitation stay live?",
      a: "Your digital invitation website stays active for a full six months after your wedding date—giving you plenty of time to share post-wedding photos, thank-you notes, and video links.",
    },
    {
      q: "Can we track who has opened their invitation?",
      a: "Yes. Your live admin dashboard provides real-time analytics displaying who opened their link, their RSVP status, headcount, and dietary preferences.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0e090c] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] overflow-x-hidden font-sans">
      {/* Ambient Luxury Lighting */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(107,15,36,0.32)_0%,rgba(18,16,19,0.85)_55%,#0b0709_100%)] z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(circle,rgba(223,186,115,0.14)_0%,transparent_70%)] pointer-events-none blur-3xl z-0" />

      {/* Floating Header Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#140b10]/85 border-b border-[#dfba73]/25 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#800020] via-[#5c0d1b] to-[#2e000c] border border-[#ffd700] flex items-center justify-center shadow-[0_0_15px_rgba(223,186,115,0.4)] group-hover:scale-105 transition">
              <Crown className="w-5 h-5 text-[#ffd700]" />
            </div>
            <div>
              <span className="font-cinzel font-bold text-base sm:text-lg text-[#fffdfa] tracking-wider">
                INVITATION<span className="text-[#db2a5b]">.LK</span>
              </span>
              <span className="hidden sm:block text-[9.5px] uppercase tracking-[0.2em] text-[#dfba73]">
                Royal Digital Weddings
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-cinzel font-semibold tracking-wider text-[#d8c7a2]">
            <a href="#templates" className="hover:text-[#ffd700] transition">
              Designs
            </a>
            <a href="#how-it-works" className="hover:text-[#ffd700] transition">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#ffd700] transition">
              Features
            </a>
            <a href="#tools" className="hover:text-[#ffd700] transition">
              Wedding Tools
            </a>
            <a href="#pricing" className="hover:text-[#ffd700] transition">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#ffd700] transition">
              FAQ
            </a>
          </div>

          {/* Nav Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <RoyalThemeToggle variant="floating" />
            <Link
              href="/admin/login"
              className="px-3.5 py-1.5 rounded-full text-xs font-cinzel font-medium text-[#f5ebd7] border border-[#dfba73]/30 hover:border-[#dfba73] hover:text-[#ffd700] transition"
            >
              Sign In
            </Link>
            <Link
              href="/onboard"
              className="btn-gold-shimmer px-4 py-2 rounded-full text-xs font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(197,160,89,0.35)]"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <RoyalThemeToggle variant="floating" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#240810] border border-[#dfba73]/30 text-[#dfba73]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-[#dfba73]/20 space-y-2.5 pb-2 text-sm font-cinzel text-[#d8c7a2]">
            <a
              href="#templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              Designs & Templates
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              How It Works
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              Features
            </a>
            <a
              href="#tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              Wedding Planning Tools
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              Pricing (From Rs. 5,000)
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 hover:text-[#ffd700]"
            >
              FAQ
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/admin/login"
                className="w-full text-center py-2 rounded-lg border border-[#dfba73]/30 text-[#ffd700]"
              >
                Sign In to Dashboard
              </Link>
              <Link
                href="/onboard"
                className="w-full text-center py-2 rounded-lg btn-gold-shimmer font-bold"
              >
                Start Free Preview
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Live Smartphone Simulation */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Pitch & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#240810]/80 border border-[#dfba73]/40 text-[#ffd700] text-xs font-cinzel font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-spin-slow" />
              <span>Sri Lanka&apos;s #1 Digital Wedding Invitation Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#fffdfa] font-normal leading-[1.15] tracking-tight">
              Your Wedding Invitation,{" "}
              <span className="not-italic font-cinzel font-bold text-[#db2a5b] block sm:inline">
                Sent on WhatsApp.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#d8c7a2] max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
              Create a breathtaking, personalized wedding invitation website in ten minutes.
              With live RSVP tracking, Poruwa & Reception schedules, table seating, and a
              personal link for every guest. <span className="text-[#ffd700] font-medium">Free to build and preview.</span>
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/onboard"
                className="w-full sm:w-auto btn-gold-shimmer px-8 py-3.5 rounded-full text-sm font-cinzel font-bold tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(197,160,89,0.4)] hover:scale-105 active:scale-95 transition"
              >
                <span>Start Free Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#templates"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-cinzel font-semibold text-[#f5ebd7] bg-[#210912]/80 border border-[#dfba73]/40 hover:border-[#ffd700] hover:text-[#ffd700] flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current text-[#dfba73]" />
                <span>Explore Live Demos</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#dfba73]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#ffd700] text-sm font-bold">
                  <Star className="w-4 h-4 fill-current text-[#ffd700]" />
                  <span>5.0 Stars</span>
                </div>
                <p className="text-[11px] text-[#a89578] mt-0.5">Rated by 500+ Couples</p>
              </div>

              <div>
                <p className="text-sm font-bold text-[#f5ebd7]">From Rs. 5,000</p>
                <p className="text-[11px] text-[#a89578] mt-0.5">Pay once, no recurring fees</p>
              </div>

              <div>
                <p className="text-sm font-bold text-[#f5ebd7]">Unlimited Guests</p>
                <p className="text-[11px] text-[#a89578] mt-0.5">On every paid package</p>
              </div>

              <div>
                <p className="text-sm font-bold text-[#f5ebd7]">No App Needed</p>
                <p className="text-[11px] text-[#a89578] mt-0.5">Opens in any browser</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Smartphone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[320px] sm:w-[350px] aspect-[9/19] rounded-[48px] p-3 bg-gradient-to-b from-[#3a2215] via-[#1a1215] to-[#0a0709] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_2px_rgba(223,186,115,0.4),0_0_35px_rgba(223,186,115,0.2)]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <span className="w-2 h-2 rounded-full bg-[#1c2833]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d141e] border border-white/10" />
              </div>

              {/* Screen Interior */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-b from-[#1b0810] via-[#2a0c18] to-[#12050b] flex flex-col relative text-[#fdfbf7] p-4 text-center border border-[#dfba73]/20 select-none">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-[#d8c7a2]/70 pt-2 px-3 pb-2 z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px]">5G</span>
                    <div className="w-4 h-2 border border-[#d8c7a2]/70 rounded-sm p-0.5">
                      <div className="h-full w-full bg-[#d8c7a2]" />
                    </div>
                  </div>
                </div>

                {/* Floating Guest Salutation Tag */}
                <div className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#3d0f1f]/80 border border-[#dfba73]/40 text-[#ffd700] text-[11px] font-cinzel">
                  <Heart className="w-3 h-3 fill-current text-[#db2a5b]" />
                  <span>Personal Invitation for Kasun & Dinithi</span>
                </div>

                {/* Couple Monogram & Names */}
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#dfba73] font-cinzel">
                    Royal Wedding Invitation
                  </p>
                  <h3 className="font-serif italic text-2xl text-[#fff8ea] mt-1 font-normal">
                    Sandharu &amp; Sanduni
                  </h3>
                  <p className="text-[11px] text-[#edd892]/80 mt-0.5 font-cinzel">
                    Saturday, 28th November 2026
                  </p>
                </div>

                {/* 3D Wax Seal Interactive Button */}
                <div className="my-3 flex flex-col items-center justify-center">
                  <button
                    onClick={() => setSealOpened(!sealOpened)}
                    className="wax-seal w-16 h-16 rounded-full flex flex-col items-center justify-center text-[#fffdfa] border-2 border-[#ffd700]/70 cursor-pointer transition transform active:scale-95"
                    title="Tap to unseal envelope"
                  >
                    <Crown className="w-5 h-5 text-[#ffd700]" />
                    <span className="text-[8px] font-cinzel font-bold tracking-wider text-[#ffd700]">
                      {sealOpened ? "OPENED" : "UNSEAL"}
                    </span>
                  </button>
                  <span className="text-[9px] text-[#d8c7a2]/70 mt-1 font-cinzel">
                    {sealOpened ? "Envelope Unsealed ✓" : "Tap Wax Seal to open"}
                  </span>
                </div>

                {/* Auspicious Poruwa & Reception Schedule Chips */}
                <div className="space-y-1.5 text-left text-[10px] font-sans">
                  <div className="p-2 rounded-xl bg-[#240813]/90 border border-[#dfba73]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#800020] flex items-center justify-center text-[#ffd700]">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#f5ebd7]">Poruwa Ceremony</p>
                        <p className="text-[#a89578] text-[9px]">Auspicious Nekath: 09:18 AM</p>
                      </div>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#3b1220] text-[#ffd700] font-cinzel">
                      Table 04
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#240813]/90 border border-[#dfba73]/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#800020] flex items-center justify-center text-[#ffd700]">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#f5ebd7]">Shangri-La Ballroom</p>
                        <p className="text-[#a89578] text-[9px]">Colombo 02, Sri Lanka</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#38bdf8] underline">Map</span>
                  </div>
                </div>

                {/* Live Auspicious Countdown */}
                <div className="mt-2.5 p-2 rounded-xl bg-[#17050d] border border-[#dfba73]/25">
                  <p className="text-[9px] uppercase tracking-wider text-[#dfba73] font-cinzel mb-1">
                    Auspicious Countdown
                  </p>
                  <div className="grid grid-cols-4 gap-1 text-center font-cinzel">
                    <div>
                      <span className="text-xs font-bold text-[#ffd700]">{timeLeft.days}</span>
                      <p className="text-[8px] text-[#a89578]">Days</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#ffd700]">{timeLeft.hours}</span>
                      <p className="text-[8px] text-[#a89578]">Hrs</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#ffd700]">{timeLeft.mins}</span>
                      <p className="text-[8px] text-[#a89578]">Min</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#ffd700]">{timeLeft.secs}</span>
                      <p className="text-[8px] text-[#a89578]">Sec</p>
                    </div>
                  </div>
                </div>

                {/* Interactive RSVP Action in Mockup */}
                <div className="mt-auto pt-2">
                  {mockupRsvpStatus === "attending" ? (
                    <div className="p-2 rounded-xl bg-[#064e3b]/80 border border-[#10b981]/50 text-[#ecfdf5] text-[11px] font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34d399]" />
                      <span>RSVP Confirmed (2 Attending)</span>
                    </div>
                  ) : (
                    <button
                      onClick={triggerMockupConfetti}
                      className="w-full py-2 px-3 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold text-[#140b10] flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm Attendance (RSVP)</span>
                    </button>
                  )}
                </div>

                {/* Music Toggle in Mockup */}
                <button
                  onClick={() => setSoundPlaying(!soundPlaying)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/60 border border-[#dfba73]/30 text-[#ffd700]"
                  title="Toggle background music"
                >
                  {soundPlaying ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section id="templates" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240810]/70 border border-[#dfba73]/30 text-[#ffd700] text-xs font-cinzel font-semibold mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Curated Haute Couture Collection</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal tracking-wide">
            Handcrafted Wedding Designs
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#d8c7a2] font-sans">
            Every template is crafted for Sri Lankan celebrations. Each features 3D wax seal unboxing,
            live RSVP collection, Poruwa milestone schedules, and Google Maps venue pins.
          </p>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-cinzel font-semibold transition ${
                  selectedCategory === cat.id
                    ? "bg-[#800020] text-[#ffd700] border border-[#ffd700] shadow-[0_0_12px_rgba(223,186,115,0.4)]"
                    : "bg-[#1f0a13] text-[#d8c7a2] border border-[#dfba73]/25 hover:border-[#dfba73] hover:text-[#ffd700]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/30 hover:border-[#ffd700] p-6 shadow-xl hover:shadow-[0_15px_40px_-10px_rgba(223,186,115,0.25)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header & Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] group-hover:text-[#ffd700] transition">
                      {template.name}
                    </h3>
                    <p className="text-xs text-[#dfba73] font-cinzel mt-0.5">{template.tagline}</p>
                  </div>
                  {template.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider bg-[#800020] text-[#ffd700] border border-[#ffd700]/40">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Color Swatches */}
                <div className="flex items-center gap-1.5 mb-4">
                  {template.palette.map((c, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  <span className="text-[10px] text-[#a89578] ml-2 font-cinzel">
                    {template.categoryLabel}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed mb-5">
                  {template.description}
                </p>

                {/* Features List */}
                <div className="space-y-1.5 border-t border-[#dfba73]/15 pt-4 mb-6">
                  {template.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#edd892]">
                      <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/templates/${template.id}/preview`}
                  className="flex-1 py-2.5 rounded-full text-xs font-cinzel font-semibold text-center bg-[#280c18] border border-[#dfba73]/40 hover:border-[#ffd700] hover:text-[#ffd700] text-[#f5ebd7] flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </Link>

                <Link
                  href={`/onboard?template=${template.id}`}
                  className="flex-1 py-2.5 rounded-full text-xs font-cinzel font-bold text-center btn-gold-shimmer text-[#140b10] flex items-center justify-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-cinzel font-bold text-[#dfba73] tracking-[0.2em] uppercase">
            Four Steps • Ten Minutes
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal mt-2">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-[#d8c7a2]">
            From template selection to sending hundreds of guests on WhatsApp, we have made the entire process effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/80 border border-[#dfba73]/25 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#800020] border border-[#ffd700] flex items-center justify-center font-cinzel font-bold text-[#ffd700] text-sm mb-4">
              01
            </span>
            <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-2">
              Choose Your Design
            </h3>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed">
              Select from culturally rich Sri Lankan Poruwa themes to modern contemporary designs. Preview instantly on your phone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/80 border border-[#dfba73]/25 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#800020] border border-[#ffd700] flex items-center justify-center font-cinzel font-bold text-[#ffd700] text-sm mb-4">
              02
            </span>
            <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-2">
              Add Events &amp; Details
            </h3>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed">
              Add your Poruwa, Church, Reception, and Homecoming timings. Pin your banquet hall on Google Maps and choose your background music.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/80 border border-[#dfba73]/25 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#800020] border border-[#ffd700] flex items-center justify-center font-cinzel font-bold text-[#ffd700] text-sm mb-4">
              03
            </span>
            <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-2">
              Import Your Guest List
            </h3>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed">
              Add guests manually or upload your Excel spreadsheet. Assign table numbers, guest salutations, and party sizes in bulk.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/80 border border-[#dfba73]/25 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#800020] border border-[#ffd700] flex items-center justify-center font-cinzel font-bold text-[#ffd700] text-sm mb-4">
              04
            </span>
            <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-2">
              Send on WhatsApp in 1 Tap
            </h3>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed">
              Every guest receives a personal link that greets them by name. Track when they open it and watch RSVPs roll in live!
            </p>
          </div>
        </div>
      </section>

      {/* Parity Feature Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-cinzel font-bold text-[#dfba73] tracking-[0.2em] uppercase">
            Built for Modern Sri Lankan Weddings
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal mt-2">
            Everything You Need in One Place
          </h2>
          <p className="mt-3 text-sm text-[#d8c7a2]">
            Say goodbye to lost paper cards, manual RSVP follow-up calls, and stressful headcount surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              Personalized Guest Links
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              No generic links. Every guest link opens with their name (e.g. &ldquo;Dear Kasun &amp; Dinithi&rdquo;),
              their reserved headcount, and their table seating assignment.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              Real-Time Live RSVP
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              Track attending, declined, and pending responses in real time. Collect dietary requirements
              (Vegetarian, Non-Veg, Halal, Vegan) ready to export directly for your caterer.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              Multi-Event Schedules
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              Schedule Poruwa Ceremony, Church Blessings, Reception, and Homecoming on a single unified
              invitation page, each with separate timings and dress codes.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              1-Tap Google Maps Navigation
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              Guests won&apos;t get lost. One tap opens Google Maps on their smartphone guiding them directly
              to the banquet hall or church parking entrance.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              Romantic Audio Player
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              Set the mood with an elegant soundtrack. Select from traditional flute, romantic classical piano,
              or upload your own song with a one-tap mute control.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-3xl bg-[#180a13] border border-[#dfba73]/25 hover:border-[#dfba73] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#fffdfa] mb-2">
              Digital Guestbook Wishes
            </h3>
            <p className="text-xs text-[#d8c7a2] leading-relaxed">
              Friends and family can post heartfelt blessings and congratulatory messages before, during,
              and after the wedding directly on your site.
            </p>
          </div>
        </div>
      </section>

      {/* Sri Lankan Wedding Planning Tools */}
      <section id="tools" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#240810]/70 border border-[#dfba73]/30 text-[#ffd700] text-xs font-cinzel font-bold mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Bonus Toolkit Included With Every Paid Plan</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal">
            Essential Wedding Planning Tools
          </h2>
          <p className="mt-3 text-sm text-[#d8c7a2]">
            Powerful built-in utilities tailored specifically for Sri Lankan wedding planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tool 1 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25 hover:border-[#dfba73] transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-3">
                <Wine className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-1.5">
                Liquor &amp; Drink Calculator
              </h3>
              <p className="text-xs text-[#d8c7a2] leading-relaxed">
                Estimate exact bottle counts needed for Arrack, Whisky, Wine, Beer, and Soft drinks based on confirmed adult headcount.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15 text-[11px] text-[#ffd700] font-cinzel">
              ✓ Prevents liquor overspending
            </div>
          </div>

          {/* Tool 2 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25 hover:border-[#dfba73] transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-1.5">
                Table Seating Planner
              </h3>
              <p className="text-xs text-[#d8c7a2] leading-relaxed">
                Assign tables by Bride&apos;s Side, Groom&apos;s Side, or VIP groups. Table numbers appear automatically on guests&apos; personalized invites.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15 text-[11px] text-[#ffd700] font-cinzel">
              ✓ Print seating charts in 1 click
            </div>
          </div>

          {/* Tool 3 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25 hover:border-[#dfba73] transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-1.5">
                Poruwa &amp; Task Checklist
              </h3>
              <p className="text-xs text-[#d8c7a2] leading-relaxed">
                Sri Lankan milestone planner: Ashtaka, Jayamangala Gatha, bridal dressing, registration, cake structures, and vendor reminders.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15 text-[11px] text-[#ffd700] font-cinzel">
              ✓ Sri Lankan customs guide
            </div>
          </div>

          {/* Tool 4 */}
          <div className="p-6 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25 hover:border-[#dfba73] transition flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#800020] flex items-center justify-center text-[#ffd700] mb-3">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-[#fffdfa] mb-1.5">
                Live Guest Photo Wall
              </h3>
              <p className="text-xs text-[#d8c7a2] leading-relaxed">
                Place a QR code on banquet tables. Guests scan and upload their candid smartphone photos directly to a shared couple gallery.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15 text-[11px] text-[#ffd700] font-cinzel">
              ✓ Collect memories instantly
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Parity with invitation.lk) */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-cinzel font-bold text-[#dfba73] tracking-[0.2em] uppercase">
            Transparent Sri Lankan Pricing
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal mt-2">
            Pay Once. Invite Everyone.
          </h2>
          <p className="mt-3 text-sm text-[#d8c7a2]">
            Build and preview your invitation completely free. You only pay once when you are ready to publish and share.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs text-[#ffd700] font-cinzel">
            <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
            <span>No recurring subscription • Unlimited guests on all paid plans</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Essential */}
          <div className="rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/30 p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-cinzel font-bold text-xl text-[#fffdfa]">Essential</h3>
              <p className="text-xs text-[#a89578] font-cinzel mt-1">Perfect for one wedding celebration</p>

              <div className="my-6">
                <span className="text-xs font-cinzel text-[#dfba73]">Rs. </span>
                <span className="text-4xl font-cinzel font-bold text-[#fffdfa]">5,000</span>
                <span className="text-xs text-[#a89578] ml-1.5 font-sans">one-time</span>
              </div>

              <div className="space-y-3 text-xs text-[#d8c7a2] font-sans">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>1 Digital Invitation Website</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span className="font-semibold text-[#fffdfa]">Unlimited Guest Links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Any template from our gallery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>WhatsApp personalized guest links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Live RSVP tracking &amp; dietary choices</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Table seating planner</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Google Maps navigation &amp; countdown</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>6 Months live hosting</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/onboard?plan=essential"
                className="w-full py-3 rounded-full text-xs font-cinzel font-semibold text-center bg-[#280c18] border border-[#dfba73]/40 hover:border-[#ffd700] hover:text-[#ffd700] text-[#f5ebd7] block transition"
              >
                Create Free Preview
              </Link>
            </div>
          </div>

          {/* Plan 2: Complete (Featured / Most Popular) */}
          <div className="rounded-3xl bg-gradient-to-b from-[#2e0917] via-[#200610] to-[#14040a] border-2 border-[#ffd700] p-8 flex flex-col justify-between relative shadow-[0_20px_50px_-15px_rgba(223,186,115,0.35)] scale-105">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#db2a5b] text-white font-cinzel font-bold text-[11px] uppercase tracking-wider shadow-md">
              Most Popular
            </span>

            <div>
              <h3 className="font-cinzel font-bold text-2xl text-[#ffd700]">Complete</h3>
              <p className="text-xs text-[#edd892] font-cinzel mt-1">Best for Wedding + Homecoming</p>

              <div className="my-6">
                <span className="text-xs font-cinzel text-[#dfba73]">Rs. </span>
                <span className="text-5xl font-cinzel font-bold text-[#fffdfa]">10,000</span>
                <span className="text-xs text-[#a89578] ml-1.5 font-sans">one-time</span>
              </div>

              <div className="space-y-3 text-xs text-[#f5ebd7] font-sans">
                <div className="flex items-center gap-2.5 font-semibold text-[#ffd700]">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>2 Separate Digital Invitation Websites</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Separate guest lists for Wedding &amp; Homecoming</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Different design &amp; details for each event</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span className="font-semibold text-[#fffdfa]">Unlimited Guest Links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>WhatsApp personalized guest delivery</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Live RSVP tracking, dietary &amp; headcounts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Liquor Calculator &amp; Seating Planner</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Free assistance personalizing your design</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>6 Months live hosting</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/onboard?plan=complete"
                className="w-full py-3.5 rounded-full text-xs font-cinzel font-bold text-center btn-gold-shimmer text-[#140b10] block shadow-[0_0_20px_rgba(223,186,115,0.4)] hover:scale-105 active:scale-95 transition"
              >
                Create Free Preview
              </Link>
            </div>
          </div>

          {/* Plan 3: Signature Custom */}
          <div className="rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/30 p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-cinzel font-bold text-xl text-[#fffdfa]">Signature Custom</h3>
              <p className="text-xs text-[#a89578] font-cinzel mt-1">A one-of-a-kind bespoke design</p>

              <div className="my-6">
                <span className="text-xs font-cinzel text-[#dfba73]">Rs. </span>
                <span className="text-4xl font-cinzel font-bold text-[#fffdfa]">20,000</span>
                <span className="text-xs text-[#a89578] ml-1.5 font-sans">one-time</span>
              </div>

              <div className="space-y-3 text-xs text-[#d8c7a2] font-sans">
                <div className="flex items-center gap-2.5 font-semibold text-[#ffd700]">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Custom design matching your physical card</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>2 Digital Invitation Websites (Wedding + Homecoming)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Live Guest Photo Wall (Guests upload photos live)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Unlimited Guest Links</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Priority 24/7 WhatsApp concierge support</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Custom music integration &amp; sound editing</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>Dedicated designer for adjustments</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                  <span>1 Year extended live hosting</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/onboard?plan=signature"
                className="w-full py-3 rounded-full text-xs font-cinzel font-semibold text-center bg-[#280c18] border border-[#dfba73]/40 hover:border-[#ffd700] hover:text-[#ffd700] text-[#f5ebd7] block transition"
              >
                Create Free Preview
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-cinzel font-bold text-[#dfba73] tracking-[0.2em] uppercase">
            Love Letters
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal mt-2">
            Loved by Sri Lankan Couples
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-7 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25">
            <div className="flex items-center gap-1 text-[#ffd700] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-[#ffd700]" />
              ))}
            </div>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed italic">
              &ldquo;Sending the invitation via WhatsApp was effortless. Our overseas guests from Australia and the UK were astonished by the interactive unsealing and music. Best wedding investment we made!&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15">
              <p className="font-cinzel font-bold text-sm text-[#fffdfa]">Ranil &amp; Thilini</p>
              <p className="text-[11px] text-[#a89578]">Galle Face Hotel, Colombo</p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25">
            <div className="flex items-center gap-1 text-[#ffd700] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-[#ffd700]" />
              ))}
            </div>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed italic">
              &ldquo;The separate Wedding and Homecoming links in the Complete plan saved us weeks of chaos. The live RSVP count made catering numbers so easy to calculate without calling everyone.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15">
              <p className="font-cinzel font-bold text-sm text-[#fffdfa]">Kavindu &amp; Oshadi</p>
              <p className="text-[11px] text-[#a89578]">Earl&apos;s Regency, Kandy</p>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/25">
            <div className="flex items-center gap-1 text-[#ffd700] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current text-[#ffd700]" />
              ))}
            </div>
            <p className="text-xs text-[#d8c7a2] font-sans leading-relaxed italic">
              &ldquo;Every guest praised seeing their own name and table number right as they opened the site! The traditional Poruwa theme matched our attire so perfectly.&rdquo;
            </p>
            <div className="mt-4 pt-3 border-t border-[#dfba73]/15">
              <p className="font-cinzel font-bold text-sm text-[#fffdfa]">Dilshan &amp; Nimasha</p>
              <p className="text-[11px] text-[#a89578]">Jetwing Blue, Negombo</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#dfba73]/15">
        <div className="text-center mb-16">
          <p className="text-xs font-cinzel font-bold text-[#dfba73] tracking-[0.2em] uppercase">
            Got Questions?
          </p>
          <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa] font-normal mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#170a12]/90 border border-[#dfba73]/25 overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-cinzel font-semibold text-sm sm:text-base text-[#f5ebd7] hover:text-[#ffd700] transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#dfba73] transition-transform ${
                    activeFaq === idx ? "rotate-180 text-[#ffd700]" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#d8c7a2] font-sans leading-relaxed border-t border-[#dfba73]/15 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#800020] via-[#5c0d1b] to-[#2e000c] border border-[#ffd700]/50 p-10 sm:p-16 text-center shadow-[0_20px_60px_-15px_rgba(128,0,32,0.6)] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif italic text-3xl sm:text-5xl text-[#fffdfa]">
              Start Your Wedding Invitation Today
            </h2>
            <p className="text-sm sm:text-base text-[#edd892] font-sans">
              Join hundreds of happy couples across Sri Lanka. Design your invitation in 10 minutes,
              preview it on your phone, and invite everyone with zero hassle.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/onboard"
                className="btn-gold-shimmer px-8 py-3.5 rounded-full text-sm font-cinzel font-bold text-[#140b10] flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition"
              >
                <span>Create Free Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://api.whatsapp.com/send?phone=94718881888&text=Hi!%20I%20would%20like%20to%20know%20more%20about%20invitation%20packages"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full text-sm font-cinzel font-semibold text-[#fffdfa] bg-[#25D366]/20 border border-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Talk on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Widget */}
      <aside aria-label="Support chat" className="fixed bottom-6 right-6 z-50">
        <a
          href="https://api.whatsapp.com/send?phone=94718881888&text=Hi!%20I%20would%20like%20to%20inquire%20about%20a%20digital%20wedding%20invitation"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition"
          aria-label="Chat with our wedding specialist on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline text-xs font-semibold font-sans">
            Chat on WhatsApp
          </span>
        </a>
      </aside>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#dfba73]/20 bg-[#0d070b] py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#800020] border border-[#ffd700] flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#ffd700]" />
            </div>
            <div>
              <span className="font-cinzel font-bold text-sm text-[#fffdfa]">
                INVITATION<span className="text-[#db2a5b]">.LK</span>
              </span>
              <p className="text-[10px] text-[#a89578] font-cinzel">Colombo, Sri Lanka</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#d8c7a2] font-cinzel">
            <a href="#templates" className="hover:text-[#ffd700] transition">
              Templates
            </a>
            <a href="#pricing" className="hover:text-[#ffd700] transition">
              Pricing
            </a>
            <a href="#tools" className="hover:text-[#ffd700] transition">
              Wedding Tools
            </a>
            <Link href="/admin/login" className="hover:text-[#ffd700] transition">
              Planner Portal
            </Link>
          </div>

          <p className="text-[11px] text-[#a89578] font-sans">
            &copy; {new Date().getFullYear()} INVITATION.LK. All Rights Reserved. Crafted for Sri Lankan Weddings.
          </p>
        </div>
      </footer>
    </div>
  );
}