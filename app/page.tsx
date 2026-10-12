"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  Heart,
  Search,
  Sparkles,
  Music,
  Pencil,
  BookOpen,
  Video,
  UserCheck,
  Send,
  ListChecks,
  Armchair,
  MapPin,
  ImageIcon,
  QrCode,
  ClipboardList,
  Users,
  HeartHandshake,
  Check,
  ArrowRight,
  Play,
  Star,
  ChevronDown,
  Volume2,
  VolumeX,
  Menu,
  X,
  Clock,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { TEMPLATE_LIST, InvitationTemplate } from "@/lib/templates";
import TemplatePhoneMockup from "@/components/TemplatePhoneMockup";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("templates");

  // Filter States (Exact Match with Screenshot 1)
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeStyle, setActiveStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFeatureToggles, setActiveFeatureToggles] = useState<string[]>([]);

  // Phone Simulator Interactive States
  const [sealOpened, setSealOpened] = useState(false);
  const [mockupRsvpStatus, setMockupRsvpStatus] = useState<"pending" | "attending" | "declined">("pending");
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [previewTemplateModal, setPreviewTemplateModal] = useState<InvitationTemplate | null>(null);

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

  // Handle Mockup RSVP Trigger with Confetti
  const handleRsvp = (status: "attending" | "declined") => {
    setMockupRsvpStatus(status);
    if (status === "attending") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#d62851", "#fcecef", "#c5a059", "#ffd700"],
        });
      } catch {}
    }
  };

  // Toggle quick feature tags
  const toggleFeature = (feat: string) => {
    setActiveFeatureToggles((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  // Filter Templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_LIST.filter((tpl) => {
      // 1. Category Filter
      if (activeCategory === "wedding" && !tpl.category.includes("classic") && !tpl.category.includes("botanical")) {
        // wedding includes classic & botanical
      }
      if (activeCategory === "homecoming" && tpl.id !== "royal-heritage") {
        return false;
      }
      if (activeCategory === "nikah" && !tpl.name.toLowerCase().includes("royal") && !tpl.name.toLowerCase().includes("emerald")) {
        return false;
      }

      // 2. Style Filter
      if (activeStyle === "traditional" && tpl.category !== "classic") return false;
      if (activeStyle === "classic" && tpl.category !== "classic") return false;
      if (activeStyle === "modern" && tpl.category !== "modern" && tpl.category !== "celestial") return false;
      if (activeStyle === "cultural" && tpl.category !== "botanical" && tpl.category !== "classic") return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesTag = tpl.tagline.toLowerCase().includes(q);
        const matchesDesc = tpl.description.toLowerCase().includes(q);
        if (!matchesName && !matchesTag && !matchesDesc) return false;
      }

      return true;
    });
  }, [activeCategory, activeStyle, searchQuery]);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I try and preview my wedding invitation for free?",
      a: "Yes, 100%! You can build your full invitation, personalize your story, choose any template, and preview the live mobile site without paying anything. You only pay once (from Rs. 5,000) when you are ready to publish and send personalized WhatsApp links to your guests.",
    },
    {
      q: "Can we add each guest's name on the invitation?",
      a: "Yes! Every guest gets a dedicated personalized link. When they open it, the invitation displays their name (e.g., 'Dear Kasun & Dinithi'), their allocated banquet table number, and customized salutation. The WhatsApp share message also greets them personally.",
    },
    {
      q: "Do our guests need to download any mobile app?",
      a: "Not at all. Guests simply tap the link on WhatsApp, and the invitation opens instantly in their mobile browser with smooth animations, background music, Google Maps directions, and RSVP buttons.",
    },
    {
      q: "Can we track who has opened their invitation?",
      a: "Yes! Your live manager dashboard tracks real-time link opens ('Opened' vs 'Unopened'). You can easily see who has viewed their invitation and follow up with unconfirmed guests.",
    },
    {
      q: "How does the Sri Lankan Liquor & Beverage calculator work?",
      a: "Our built-in planning tool automatically reads your confirmed RSVP guest count, calculates exact bottles of Ceylon Arrack, Scotch Whisky, Wine, and Beer needed, along with soft drinks/chasers and ice packets based on Sri Lankan reception standards.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111827] selection:bg-[#fcecef] selection:text-[#d62851] overflow-x-hidden font-sans">
      {/* Soft Radiant Ambient Glow at Top (Exact Match with invitation.lk) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f3] via-[#ffffff] to-[#ffffff] -z-10" />

      {/* ========================================================================= */}
      {/* 1. TOP NAVBAR (Matching Screenshot 1) */}
      {/* ========================================================================= */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative h-9 sm:h-10 w-32 sm:w-38 overflow-hidden">
              <Image
                src="/images/wedlink-logo.png"
                alt="WedLink.lk"
                fill
                priority
                sizes="(max-width: 640px) 128px, 152px"
                className="object-contain object-left group-hover:scale-105 transition"
              />
            </div>
          </Link>

          {/* Desktop Pill Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <a
              href="#templates"
              onClick={() => setActiveNav("templates")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "templates"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              Templates
            </a>
            <a
              href="#how-to-use"
              onClick={() => setActiveNav("how-to-use")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "how-to-use"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              How to use
            </a>
            <a
              href="#features"
              onClick={() => setActiveNav("features")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "features"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => setActiveNav("pricing")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "pricing"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              Pricing
            </a>
            <a
              href="#planning-tools"
              onClick={() => setActiveNav("tools")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "tools"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              Wedding Tools
            </a>
            <a
              href="#faq"
              onClick={() => setActiveNav("faq")}
              className={`px-4 py-1.5 rounded-full transition ${
                activeNav === "faq"
                  ? "bg-[#fcecef] text-[#d62851] font-semibold"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              FAQ
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="hidden sm:inline-block text-sm font-semibold text-[#111827] hover:text-[#d62851] transition"
            >
              Sign in
            </Link>

            <Link
              href="/onboard"
              className="bg-[#d62851] hover:bg-[#b81d42] text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm shadow-[#d62851]/25 hover:shadow-md transition active:scale-95"
            >
              Get started free
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 px-5 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
            <a
              href="#templates"
              onClick={() => {
                setActiveNav("templates");
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              Templates
            </a>
            <a
              href="#how-to-use"
              onClick={() => {
                setActiveNav("how-to-use");
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              How to use
            </a>
            <a
              href="#features"
              onClick={() => {
                setActiveNav("features");
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={() => {
                setActiveNav("pricing");
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              Pricing
            </a>
            <a
              href="#planning-tools"
              onClick={() => {
                setActiveNav("tools");
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-medium text-gray-700 py-1.5"
            >
              Wedding Tools
            </a>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link href="/admin/login" className="text-sm font-semibold text-gray-700">
                Sign in
              </Link>
              <Link
                href="/onboard"
                className="bg-[#d62851] text-white text-xs font-semibold px-4 py-2 rounded-full"
              >
                Get started free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ========================================================================= */}
      {/* 2. HERO / TEMPLATES HEADER (Exact Match with Screenshot 1) */}
      {/* ========================================================================= */}
      <section id="templates" className="pt-12 sm:pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Pink Uppercase Label */}
        <span className="text-xs font-bold uppercase tracking-widest text-[#d62851] block mb-2">
          TEMPLATES
        </span>

        {/* Large Crisp Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
          Find the design that feels like{" "}
          <span className="text-[#d62851]">you</span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-[#4b5563] max-w-2xl mx-auto leading-relaxed">
          30 real, working invitations to open and try on your phone. Every design is on every plan, and free to try.
        </p>

        {/* ------------------------------------------------------------- */}
        {/* Category Filter Pills (Row 1 from Screenshot 1) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "all"
                ? "bg-[#d62851] text-white font-bold shadow-md shadow-[#d62851]/30"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
            }`}
          >
            <span>All designs</span>
            <span className={`text-[11px] ${activeCategory === "all" ? "text-white/80" : "text-gray-400"}`}>
              30
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("wedding")}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "wedding"
                ? "bg-[#d62851] text-white font-bold shadow-md shadow-[#d62851]/30"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
            }`}
          >
            <span>Wedding</span>
            <span className="text-[11px] text-gray-400">29</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("homecoming")}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "homecoming"
                ? "bg-[#d62851] text-white font-bold shadow-md shadow-[#d62851]/30"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
            }`}
          >
            <span>Homecoming</span>
            <span className="text-[11px] text-gray-400">1</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("nikah")}
            className={`px-4 py-2 rounded-full text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === "nikah"
                ? "bg-[#d62851] text-white font-bold shadow-md shadow-[#d62851]/30"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
            }`}
          >
            <span>Nikah</span>
            <span className="text-[11px] text-gray-400">1</span>
          </button>

          {/* Coming Soon Pills */}
          <div className="bg-white border border-gray-200 text-gray-400 text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5 select-none">
            <span>Birthday</span>
            <span className="bg-[#fde8ed] text-[#d62851] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Coming soon
            </span>
          </div>

          <div className="bg-white border border-gray-200 text-gray-400 text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5 select-none">
            <span>Save the Date</span>
            <span className="bg-[#fde8ed] text-[#d62851] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Coming soon
            </span>
          </div>

          <div className="bg-white border border-gray-200 text-gray-400 text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5 select-none">
            <span>Parties</span>
            <span className="bg-[#fde8ed] text-[#d62851] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Coming soon
            </span>
          </div>

          <div className="bg-white border border-gray-200 text-gray-400 text-xs font-medium px-3.5 py-2 rounded-full flex items-center gap-1.5 select-none">
            <span>Corporate</span>
            <span className="bg-[#fde8ed] text-[#d62851] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Coming soon
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Search Bar + Style Pills (Row 2 from Screenshot 1) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designs or colours"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-1 focus:ring-[#d62851] transition shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Style Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: "all", label: "All styles" },
              { id: "traditional", label: "Traditional" },
              { id: "classic", label: "Classic" },
              { id: "modern", label: "Modern" },
              { id: "cultural", label: "Cultural" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setActiveStyle(st.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer ${
                  activeStyle === st.id
                    ? "bg-[#fcecef] text-[#d62851] font-bold border border-[#f5dde2]"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Strip Feature Badges (Row 3 from Screenshot 1) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-4 p-3 rounded-2xl bg-[#faf0f2] border border-[#f5dde2] max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mr-1">
              EVERY DESIGN HAS
            </span>
            <button
              type="button"
              onClick={() => toggleFeature("Music")}
              className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeFeatureToggles.includes("Music")
                  ? "bg-[#d62851] text-white shadow-xs"
                  : "bg-white border border-[#f5dde2] text-gray-700 hover:border-[#d62851]/40"
              }`}
            >
              <Music className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Music</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFeature("Edit it yourself")}
              className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeFeatureToggles.includes("Edit it yourself")
                  ? "bg-[#d62851] text-white shadow-xs"
                  : "bg-white border border-[#f5dde2] text-gray-700 hover:border-[#d62851]/40"
              }`}
            >
              <Pencil className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Edit it yourself</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mr-1">
              SHOW DESIGNS WITH
            </span>
            <button
              type="button"
              onClick={() => toggleFeature("Cover page")}
              className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeFeatureToggles.includes("Cover page")
                  ? "bg-[#d62851] text-white shadow-xs"
                  : "bg-white border border-[#f5dde2] text-gray-700 hover:border-[#d62851]/40"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Cover page 23</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFeature("Video opening")}
              className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeFeatureToggles.includes("Video opening")
                  ? "bg-[#d62851] text-white shadow-xs"
                  : "bg-white border border-[#f5dde2] text-gray-700 hover:border-[#d62851]/40"
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Video opening 9</span>
            </button>
            <button
              type="button"
              onClick={() => toggleFeature("Guest names")}
              className={`px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition cursor-pointer ${
                activeFeatureToggles.includes("Guest names")
                  ? "bg-[#d62851] text-white shadow-xs"
                  : "bg-white border border-[#f5dde2] text-gray-700 hover:border-[#d62851]/40"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Guest names 25</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SMARTPHONE LIVE DEMO & HERO HIGHLIGHT */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Story */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcecef] text-[#d62851] text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#d62851]" />
              <span>Sri Lanka&apos;s #1 Digital Wedding Platform</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.2]">
              Your Wedding Invitation,{" "}
              <span className="text-[#d62851] block sm:inline">Sent on WhatsApp.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#4b5563] leading-relaxed max-w-xl mx-auto lg:mx-0">
              Create a breathtaking, personalized wedding invitation website in ten minutes.
              With live RSVP tracking, Poruwa & Reception schedules, table seating, and a
              personal link for every guest. <strong className="text-[#111827]">Free to build and test before paying.</strong>
            </p>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                href="/onboard"
                className="w-full sm:w-auto bg-[#d62851] hover:bg-[#b81d42] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md shadow-[#d62851]/25 flex items-center justify-center gap-2 transition hover:scale-105"
              >
                <span>Start Free Preview</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features-grid"
                className="w-full sm:w-auto bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-sm font-semibold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Play className="w-4 h-4 fill-current text-[#d62851]" />
                <span>See All Features</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-[#d62851] text-sm font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>5.0 Stars</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">500+ Sri Lankan Couples</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">From Rs. 5,000</p>
                <p className="text-xs text-gray-500 mt-0.5">Pay once, no recurring fees</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Unlimited Guests</p>
                <p className="text-xs text-gray-500 mt-0.5">On every paid package</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">No App Needed</p>
                <p className="text-xs text-gray-500 mt-0.5">Opens in any browser</p>
              </div>
            </div>
          </div>

          {/* Right Smartphone Simulator */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[320px] sm:w-[340px] aspect-[9/18.5] rounded-[48px] p-3 bg-gradient-to-b from-[#2d2f33] via-[#111315] to-[#0a0a0c] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_2px_rgba(255,255,255,0.1)]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-26 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <span className="w-2 h-2 rounded-full bg-[#1c2833]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0d141e] border border-white/10" />
              </div>

              {/* Screen Interior */}
              <div className="w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-b from-[#fff5f7] via-[#ffffff] to-[#fffdfa] flex flex-col relative text-[#111827] p-4 text-center border border-rose-100 select-none">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 px-3 pb-2 z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px]">5G</span>
                    <div className="w-4 h-2 border border-gray-400 rounded-xs p-0.5">
                      <div className="h-full w-full bg-gray-800" />
                    </div>
                  </div>
                </div>

                {/* Top Audio Player Badge */}
                <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-rose-100/60 z-20">
                  <div className="flex items-center gap-1 text-[10px] text-[#d62851] font-semibold">
                    <Music className="w-3 h-3" />
                    <span className="truncate max-w-[130px]">Acoustic Romance</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundPlaying(!soundPlaying)}
                    className="p-1 rounded-full bg-[#fcecef] text-[#d62851] hover:scale-110 transition cursor-pointer"
                    title="Toggle Music Demo"
                  >
                    {soundPlaying ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  </button>
                </div>

                {/* Main Simulator Content Body */}
                <div className="flex-1 overflow-y-auto pt-3 pb-4 space-y-4 flex flex-col justify-between">
                  <div>
                    {/* Personalized Salutation Pill */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fcecef] text-[#d62851] text-[10px] font-bold">
                      Personalized for Kasun & Dinithi
                    </div>

                    <h3 className="font-serif italic text-xl font-bold text-[#111827] mt-2">
                      Sandharu & Sanduni
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">
                      Wedding & Homecoming
                    </p>
                  </div>

                  {/* 3D Wax Seal Unboxing */}
                  <div className="my-auto py-2">
                    {!sealOpened ? (
                      <div
                        onClick={() => {
                          setSealOpened(true);
                          try {
                            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
                          } catch {}
                        }}
                        className="cursor-pointer group flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d62851] to-[#9e1637] text-white flex items-center justify-center shadow-lg border-2 border-white group-hover:scale-105 active:scale-95 transition-all animate-pulse">
                          <Heart className="w-7 h-7 fill-current" />
                        </div>
                        <span className="text-[10px] font-bold text-[#d62851] mt-2 group-hover:underline">
                          Tap Wax Seal to Open
                        </span>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-2 animate-in zoom-in-95 duration-200">
                        <span className="text-[10px] uppercase font-bold text-[#d62851] tracking-wider">
                          Reserved Table #03
                        </span>
                        <p className="text-[11px] text-gray-700 leading-relaxed font-serif italic">
                          &ldquo;We cordially invite you to celebrate our holy union & Poruwa ceremony.&rdquo;
                        </p>
                        <div className="text-[10px] text-gray-500">
                          Rose Garden Banquet Hall, Kadawatha
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Countdown Ticker */}
                  <div className="grid grid-cols-4 gap-1.5 px-1">
                    {[
                      { val: timeLeft.days, label: "Days" },
                      { val: timeLeft.hours, label: "Hours" },
                      { val: timeLeft.mins, label: "Mins" },
                      { val: timeLeft.secs, label: "Secs" },
                    ].map((c, i) => (
                      <div key={i} className="p-1.5 rounded-xl bg-white border border-rose-100 shadow-2xs text-center">
                        <div className="font-bold text-xs text-[#d62851] font-mono">{c.val}</div>
                        <div className="text-[8px] text-gray-500 uppercase">{c.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Confetti RSVP Buttons */}
                  <div className="pt-1">
                    <span className="text-[10px] text-gray-600 block mb-1.5 font-medium">
                      Will you attend our celebration?
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRsvp("attending")}
                        className={`py-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                          mockupRsvpStatus === "attending"
                            ? "bg-[#d62851] text-white shadow-sm"
                            : "bg-[#fcecef] text-[#d62851] hover:bg-rose-200"
                        }`}
                      >
                        ✓ Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRsvp("declined")}
                        className={`py-2 rounded-xl text-[11px] font-medium transition cursor-pointer ${
                          mockupRsvpStatus === "declined"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 12 VALUE PROPOSITION FEATURES (Exact Replica of Screenshot 2) */}
      {/* ========================================================================= */}
      <section id="features-grid" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d62851] block mb-2">
            FEATURES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Everything you need for a stress-free wedding.
          </h2>
          <p className="text-sm text-[#4b5563] mt-2 max-w-xl mx-auto">
            Packed with smart digital tools crafted specifically for Sri Lankan weddings and modern couples.
          </p>
        </div>

        {/* Clean White Card Container Matching Screenshot 2 */}
        <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Feature 1 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Every template</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Any design in the gallery, personalised with your details.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">A link for each guest</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Their name on the WhatsApp preview, and on the invitation in most designs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <ListChecks className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Live RSVP</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Attending, not attending or maybe, with head counts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <Armchair className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Table arrangement</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Drag tables into place. Guests find their own seat.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Every event, mapped</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Times, venues, Google Maps and Add to calendar.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Photos and story</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Photo gallery, your love story and a countdown.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Background music</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Pick a song from our library, play it before you choose.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <Pencil className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Edit anytime</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Change a detail after sending. The same link updates.
              </p>
            </div>

            {/* Feature 9 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">QR code and sign</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                A printable QR sign for the entrance.
              </p>
            </div>

            {/* Feature 10 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Planning tools</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Checklist, budget, vendors and a liquor planner.
              </p>
            </div>

            {/* Feature 11 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Co-planners</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                Give family view or edit access, feature by feature.
              </p>
            </div>

            {/* Feature 12 */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#fcecef] text-[#d62851] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#111827]">Help personalising</h3>
              <p className="text-xs sm:text-[13px] text-[#4b5563] leading-relaxed">
                We help you set up your design at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TEMPLATE GALLERY GRID (Matching User's Photo with Real Phone Mockups) */}
      {/* ========================================================================= */}
      <section id="templates" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Interactive Phone Previews</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Featured Wedding Designs
            </h3>
            <p className="text-sm text-[#6b7280] mt-1 font-sans">
              Tap any invitation to test unsealing and experience the guest view live on your device.
            </p>
          </div>
          <Link
            href="/onboard"
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white text-xs font-bold tracking-wide transition shadow-sm flex items-center gap-1.5"
          >
            <span>Create Custom Design</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Templates Phone Carousel/Grid Matching Screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 justify-items-center items-start">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="w-full flex justify-center">
              <TemplatePhoneMockup
                template={tpl}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENT SRI LANKAN PRICING (Matching invitation.lk) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d62851] block mb-2">
            PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Transparent Sri Lankan Packages.
          </h2>
          <p className="text-sm text-[#4b5563] mt-2 max-w-xl mx-auto">
            Build and preview your invitation completely free. You only pay once when you are ready to publish and share.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1: Silver Royal */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                SILVER ROYAL
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#111827]">රු. 5,000</span>
                <span className="text-xs text-gray-400">/ one-time</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ideal for intimate weddings and celebrations.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> 1 Digital Invitation Website
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Up to 100 Guests
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Live RSVP & Headcounts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Google Maps Directions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Interactive Wax Seal Reveal
                </li>
              </ul>
            </div>

            <Link
              href="/onboard?plan=silver"
              className="mt-8 w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs text-center transition"
            >
              Get Started
            </Link>
          </div>

          {/* Plan 2: Gold Prestige (Most Popular) */}
          <div className="bg-white rounded-3xl border-2 border-[#d62851] p-8 shadow-xl relative flex flex-col justify-between scale-105 z-10">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d62851] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
              MOST POPULAR
            </span>

            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#d62851]">
                GOLD PRESTIGE
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#111827]">රු. 10,000</span>
                <span className="text-xs text-gray-400">/ one-time</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Everything you need for a grand Sri Lankan banquet.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> 2 Separate Invitations (Wedding &amp; Homecoming)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> Unlimited Guests
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> 1-Click WhatsApp Personalized Links
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> Table &amp; Seating Management
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> Bilingual (English &amp; Sinhala)
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-4 h-4 text-[#d62851]" /> Guest Photo Wall &amp; Wishes
                </li>
              </ul>
            </div>

            <Link
              href="/onboard?plan=gold"
              className="mt-8 w-full py-3.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white font-bold text-xs text-center shadow-md shadow-[#d62851]/30 transition"
            >
              Get Started with Gold
            </Link>
          </div>

          {/* Plan 3: Platinum Heritage */}
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
                PLATINUM HERITAGE
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#111827]">රු. 20,000</span>
                <span className="text-xs text-gray-400">/ one-time</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Full-service royal VIP concierge package.
              </p>

              <ul className="mt-6 space-y-3 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> All Gold Prestige Features
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Custom Web Domain (e.g., couple.com)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Printable Entrance QR Stand
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> Dedicated Wedding Tech Concierge
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#d62851]" /> WhatsApp Bulk Dispatch Assistant
                </li>
              </ul>
            </div>

            <Link
              href="/onboard?plan=platinum"
              className="mt-8 w-full py-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs text-center transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SRI LANKAN PLANNING TOOLS HIGHLIGHT */}
      {/* ========================================================================= */}
      <section id="planning-tools" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#fff5f7] via-[#fffdfa] to-[#faf0f2] border border-[#f5dde2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d62851] block">
                BUILT-IN WEDDING TOOLS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827]">
                Liquor Calculator &amp; Poruwa Checklist.
              </h2>
              <p className="text-sm text-[#4b5563] leading-relaxed">
                We understand the complexities of Sri Lankan weddings. From calculating exact bottles of Ceylon Arrack, Whisky, and beer needed for your banquet, to ensuring all 12 auspicious Poruwa and Nekath customs are checked off without panic.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-800 bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-2xs">
                  🥃 Ceylon Arrack &amp; Spirits Estimator
                </span>
                <span className="flex items-center gap-1.5 text-gray-800 bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-2xs">
                  🪔 Traditional Magul Pahana &amp; Nekath Tracker
                </span>
                <span className="flex items-center gap-1.5 text-gray-800 bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-2xs">
                  📋 One-Click Best Man Shopping Export
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <Link
                href="/onboard"
                className="bg-[#d62851] hover:bg-[#b81d42] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md shadow-[#d62851]/25 hover:scale-105 transition"
              >
                Try Planning Suite Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d62851] block mb-2">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm sm:text-base text-gray-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    activeFaq === idx ? "rotate-180 text-[#d62851]" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="relative h-9 sm:h-10 w-28 sm:w-36 overflow-hidden">
              <Image
                src="/images/wedlink-logo.png"
                alt="WedLink.lk"
                fill
                sizes="144px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-xs text-gray-500 border-l border-gray-300 pl-3">
              Colombo, Sri Lanka
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-600">
            <a href="#templates" className="hover:text-[#d62851] transition">
              Templates
            </a>
            <a href="#features" className="hover:text-[#d62851] transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#d62851] transition">
              Pricing
            </a>
            <a href="#planning-tools" className="hover:text-[#d62851] transition">
              Wedding Tools
            </a>
            <Link href="/admin/login" className="hover:text-[#d62851] transition">
              Planner Portal
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} WedLink.lk. All Rights Reserved. Crafted for Sri Lankan Weddings.
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. FLOATING WHATSAPP CHAT PILL WIDGET (Matching Screenshots 1 & 2) */}
      {/* ========================================================================= */}
      <aside className="fixed bottom-5 right-5 z-50">
        <a
          href="https://api.whatsapp.com/send?phone=94718881888&text=Hi!%20I%20would%20like%20to%20inquire%20about%20a%20digital%20wedding%20invitation"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white text-gray-800 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-200/80 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
          aria-label="Chat with us on WhatsApp"
        >
          <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xs">
            <MessageCircle className="w-4 h-4 fill-current" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold leading-tight text-gray-900 group-hover:text-[#25D366] transition">
              Chat with us
            </span>
            <span className="block text-[10px] text-gray-500 leading-tight">
              on WhatsApp
            </span>
          </div>
        </a>
      </aside>
    </div>
  );
}