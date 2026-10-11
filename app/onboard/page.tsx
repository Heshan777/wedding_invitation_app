"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Crown,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Music,
  Share2,
  Smartphone,
  Eye,
  Check,
  AlertCircle,
  Loader2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TEMPLATE_LIST, getTemplate, InvitationTemplate } from "@/lib/templates";
import RoyalThemeToggle from "@/components/RoyalThemeToggle";

export default function OnboardWizardPage() {
  const router = useRouter();

  // Wizard Step State (1: Template, 2: Couple, 3: Events, 4: Customization, 5: Preview & Finish)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields State
  const [formData, setFormData] = useState({
    // Step 1: Template
    templateId: "royal-heritage",

    // Step 2: Couple
    groomName: "Sandharu Perera",
    brideName: "Sanduni Silva",
    celebrationType: "both", // "wedding" | "both" | "homecoming"
    slug: "sandharu-and-sanduni",
    phone: "+94 77 123 4567",
    email: "",
    password: "",

    // Step 3: Events & Venue
    eventDate: "2026-11-28",
    primaryEventTime: "09:18 AM",
    primaryEventTitle: "Poruwa Ceremony & Sacred Nekath",
    venueName: "Shangri-La Ballroom",
    venueAddress: "1 Galle Face, Colombo 02, Sri Lanka",
    hasSecondaryEvent: true,
    secondaryEventTitle: "Homecoming & Evening Reception",
    secondaryEventTime: "06:30 PM",
    secondaryEventVenue: "Grand Crystal Pavilion, Colombo",

    // Step 4: Story, Music, Dress Code
    dressCodeTitle: "Royal Splendor & Black Tie",
    dressCodeDescription: "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
    musicTitle: "Traditional Sri Lankan Auspicious Flute & Magul Bera",
    musicUrl: "/audio/background.mp3",
    hostIntro: "With joyful hearts and the blessings of our parents, we cordially invite",
    invitationBody: "to join us as we celebrate our holy union, auspicious customs, and homecoming...",
    showWaxSeal: true,
    showCountdown: true,
    showSeating: true,
  });

  // Slug check status
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("available");
  const [slugMessage, setSlugMessage] = useState<string>("This link is ready for your wedding!");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get("template");
      const p = sp.get("plan");
      if (t) {
        setFormData((prev) => ({ ...prev, templateId: t }));
        setCurrentStep(2);
      }
      if (p === "complete") {
        setFormData((prev) => ({ ...prev, celebrationType: "both", hasSecondaryEvent: true }));
      } else if (p === "essential") {
        setFormData((prev) => ({ ...prev, celebrationType: "wedding", hasSecondaryEvent: false }));
      }
    }
  }, []);

  // Preview Simulation states
  const [sealOpened, setSealOpened] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Resolved template styling
  const activeTemplate = useMemo(() => getTemplate(formData.templateId), [formData.templateId]);

  // Combined couple names
  const combinedCoupleNames = useMemo(() => {
    const g = formData.groomName.trim();
    const b = formData.brideName.trim();
    if (g && b) return `${g} & ${b}`;
    return g || b || "The Couple";
  }, [formData.groomName, formData.brideName]);

  // Auto-generate slug when names change if user hasn't explicitly edited it
  const handleNameChange = (field: "groomName" | "brideName", value: string) => {
    const updated = { ...formData, [field]: value };
    const g = field === "groomName" ? value : formData.groomName;
    const b = field === "brideName" ? value : formData.brideName;
    const autoSlug = `${g.split(" ")[0] || "groom"}-and-${b.split(" ")[0] || "bride"}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    updated.slug = autoSlug;
    setFormData(updated);
    checkSlugAvailability(autoSlug);
  };

  // Debounced slug check
  const checkSlugAvailability = async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck.trim().length < 3) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    try {
      const res = await fetch(`/api/onboard/check-slug?slug=${encodeURIComponent(slugToCheck.trim())}`);
      const data = await res.json();
      if (data.available) {
        setSlugStatus("available");
        setSlugMessage("This link is available!");
      } else {
        setSlugStatus("taken");
        setSlugMessage("This link is already reserved. Try adding year or location.");
      }
    } catch {
      setSlugStatus("idle");
    }
  };

  // Handle final submission to create EventManager & WeddingEvent
  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: formData.templateId,
          groomName: formData.groomName,
          brideName: formData.brideName,
          coupleNames: combinedCoupleNames,
          slug: formData.slug,
          eventDate: formData.eventDate,
          venueName: formData.venueName,
          venueAddress: formData.venueAddress,
          primaryEventTime: formData.primaryEventTime,
          secondaryEventTitle: formData.hasSecondaryEvent ? formData.secondaryEventTitle : null,
          secondaryEventTime: formData.hasSecondaryEvent ? formData.secondaryEventTime : null,
          secondaryEventVenue: formData.hasSecondaryEvent ? formData.secondaryEventVenue : null,
          dressCodeTitle: formData.dressCodeTitle,
          dressCodeDescription: formData.dressCodeDescription,
          musicTitle: formData.musicTitle,
          musicUrl: formData.musicUrl,
          hostIntro: formData.hostIntro,
          invitationBody: formData.invitationBody,
          phone: formData.phone,
          email: formData.email,
          password: formData.password || "wedding2026",
          accountName: combinedCoupleNames,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create your invitation.");
      }

      // Successfully created! Redirect directly into the management dashboard
      router.push(data.redirectUrl || "/admin/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setSubmitting(false);
    }
  };

  const stepsList = [
    { number: 1, label: "Template Design" },
    { number: 2, label: "Couple & URL" },
    { number: 3, label: "Event Schedules" },
    { number: 4, label: "Story & Music" },
    { number: 5, label: "Preview & Launch" },
  ];

  return (
    <div className="min-h-screen bg-[#0d090c] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] overflow-x-hidden font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(128,0,32,0.3)_0%,rgba(18,16,19,0.85)_55%,#0a0709_100%)] z-0" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#140b10]/90 border-b border-[#dfba73]/25 px-4 sm:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#800020] to-[#3a0612] border border-[#ffd700] flex items-center justify-center">
            <Crown className="w-4 h-4 text-[#ffd700]" />
          </div>
          <div>
            <span className="font-cinzel font-bold text-base text-[#fffdfa]">
              INVITATION<span className="text-[#db2a5b]">.LK</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-[#dfba73] font-cinzel">
              Self-Serve Wedding Builder
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <RoyalThemeToggle variant="floating" />
          <Link
            href="/admin/login"
            className="text-xs font-cinzel text-[#d8c7a2] hover:text-[#ffd700] transition"
          >
            Already have an account? <span className="font-bold underline">Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {stepsList.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => s.number < currentStep && setCurrentStep(s.number)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-cinzel font-bold text-xs transition ${
                    currentStep === s.number
                      ? "bg-[#800020] text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_12px_rgba(223,186,115,0.4)]"
                      : currentStep > s.number
                      ? "bg-[#2e0915] text-[#34d399] border border-[#34d399]/60 cursor-pointer"
                      : "bg-[#1f0a13] text-[#a89578] border border-[#dfba73]/20"
                  }`}
                  aria-label={`Go to step ${s.number}: ${s.label}`}
                >
                  {currentStep > s.number ? <Check className="w-4 h-4" /> : s.number}
                </button>
                <span
                  className={`mt-1.5 text-[10px] font-cinzel hidden sm:block ${
                    currentStep === s.number ? "text-[#ffd700] font-bold" : "text-[#a89578]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-[#240810] h-1.5 rounded-full mt-4 max-w-2xl mx-auto overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#800020] via-[#c5a059] to-[#ffd700] h-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="rounded-3xl bg-[#160a11]/90 border border-[#dfba73]/30 p-6 sm:p-10 shadow-2xl">
          {/* STEP 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 1 of 5</span>
                </div>
                <h2 className="font-serif italic text-2xl sm:text-4xl text-[#fffdfa]">
                  Choose Your Invitation Style
                </h2>
                <p className="text-xs text-[#d8c7a2] mt-1 font-sans">
                  Select a handcrafted aesthetic. You can tweak photos, schedule, and colors anytime later.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TEMPLATE_LIST.map((template) => {
                  const isSelected = formData.templateId === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => setFormData({ ...formData, templateId: template.id })}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#290c19] border-[#ffd700] shadow-[0_0_20px_rgba(223,186,115,0.35)] scale-[1.02]"
                          : "bg-[#180a13] border-[#dfba73]/25 hover:border-[#dfba73]/60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-cinzel font-bold text-base text-[#fffdfa]">
                            {template.name}
                          </h3>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#10b981] flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#dfba73] font-cinzel">
                              {template.categoryLabel}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#dfba73] font-cinzel mb-3">
                          {template.tagline}
                        </p>

                        <div className="flex items-center gap-1.5 mb-3">
                          {template.palette.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-[#d8c7a2] font-sans line-clamp-3 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#dfba73]/15 flex items-center justify-between text-[11px] font-cinzel text-[#ffd700]">
                        <span>✓ Wax seal &amp; RSVP</span>
                        <span className="underline text-[#edd892]">Selected</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Couple Names & Custom Link */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 2 of 5</span>
                </div>
                <h2 className="font-serif italic text-2xl sm:text-4xl text-[#fffdfa]">
                  Couple Names &amp; Custom Link
                </h2>
                <p className="text-xs text-[#d8c7a2] mt-1 font-sans">
                  Enter your names and pick your unique WhatsApp invitation web address.
                </p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    Groom&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => handleNameChange("groomName", e.target.value)}
                    placeholder="E.g. Sandharu Perera"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-sm text-[#fffdfa] focus:border-[#ffd700] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    Bride&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleNameChange("brideName", e.target.value)}
                    placeholder="E.g. Sanduni Silva"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-sm text-[#fffdfa] focus:border-[#ffd700] focus:outline-none"
                  />
                </div>
              </div>

              {/* Celebration Type */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Type of Celebration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "both", label: "Wedding + Homecoming" },
                    { id: "wedding", label: "Wedding Only" },
                    { id: "homecoming", label: "Homecoming Only" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, celebrationType: t.id })}
                      className={`p-3 rounded-xl border text-xs font-cinzel font-semibold transition ${
                        formData.celebrationType === t.id
                          ? "bg-[#800020] text-[#ffd700] border-[#ffd700]"
                          : "bg-[#1b0811] text-[#d8c7a2] border-[#dfba73]/25 hover:border-[#dfba73]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Web Link / Slug */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Your Custom Web Address
                </label>
                <div className="flex items-center rounded-xl bg-[#1b0811] border border-[#dfba73]/30 overflow-hidden focus-within:border-[#ffd700]">
                  <span className="px-3.5 py-2.5 bg-[#250915] text-xs font-mono text-[#a89578] border-r border-[#dfba73]/20">
                    invitation.lk/e/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
                      setFormData({ ...formData, slug: clean });
                      checkSlugAvailability(clean);
                    }}
                    placeholder="sandharu-and-sanduni"
                    className="flex-1 px-3.5 py-2.5 bg-transparent text-sm text-[#ffd700] font-mono focus:outline-none"
                  />
                </div>

                {/* Slug feedback indicator */}
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-sans">
                  {slugStatus === "checking" && (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#dfba73]" />
                      <span className="text-[#dfba73]">Checking availability...</span>
                    </>
                  )}
                  {slugStatus === "available" && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[#10b981] font-semibold">{slugMessage}</span>
                    </>
                  )}
                  {slugStatus === "taken" && (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-[#ef4444]" />
                      <span className="text-[#ef4444] font-semibold">{slugMessage}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-sm text-[#fffdfa] focus:border-[#ffd700] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#a89578] mt-1 font-sans">
                    Used to sign in to your dashboard to view RSVPs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="couple@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-sm text-[#fffdfa] focus:border-[#ffd700] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#a89578] mt-1 font-sans">
                    For backup RSVP notifications.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Events & Venue Locations */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 3 of 5</span>
                </div>
                <h2 className="font-serif italic text-2xl sm:text-4xl text-[#fffdfa]">
                  Event Schedule &amp; Venues
                </h2>
                <p className="text-xs text-[#d8c7a2] mt-1 font-sans">
                  Configure Poruwa timings, banquet hall, and evening celebrations.
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Wedding Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-sm text-[#fffdfa] focus:border-[#ffd700] focus:outline-none"
                  />
                </div>
              </div>

              {/* Primary Ceremony (Poruwa / Church) */}
              <div className="p-4 rounded-2xl bg-[#1f0913] border border-[#dfba73]/25 space-y-3">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#ffd700]">
                  <Crown className="w-4 h-4" />
                  <span>Primary Ceremony (Poruwa / Church / Kovil)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#dfba73] mb-1">Ceremony Title</label>
                    <input
                      type="text"
                      value={formData.primaryEventTitle}
                      onChange={(e) => setFormData({ ...formData, primaryEventTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#dfba73] mb-1">Auspicious Time (Nekath)</label>
                    <input
                      type="text"
                      value={formData.primaryEventTime}
                      onChange={(e) => setFormData({ ...formData, primaryEventTime: e.target.value })}
                      placeholder="09:18 AM"
                      className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#dfba73] mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="Shangri-La Ballroom, Colombo"
                    className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#dfba73] mb-1">Venue Address (For Google Maps)</label>
                  <input
                    type="text"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    placeholder="1 Galle Face, Colombo 02, Sri Lanka"
                    className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                  />
                </div>
              </div>

              {/* Secondary Celebration (Reception / Homecoming) */}
              <div className="p-4 rounded-2xl bg-[#1f0913] border border-[#dfba73]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#ffd700]">
                    <Clock className="w-4 h-4" />
                    <span>Secondary Event (Reception or Homecoming)</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-xs text-[#d8c7a2] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasSecondaryEvent}
                      onChange={(e) => setFormData({ ...formData, hasSecondaryEvent: e.target.checked })}
                      className="rounded accent-[#800020]"
                    />
                    <span>Include this event</span>
                  </label>
                </div>

                {formData.hasSecondaryEvent && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#dfba73] mb-1">Event Title</label>
                        <input
                          type="text"
                          value={formData.secondaryEventTitle}
                          onChange={(e) => setFormData({ ...formData, secondaryEventTitle: e.target.value })}
                          placeholder="Homecoming Reception"
                          className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#dfba73] mb-1">Starting Time</label>
                        <input
                          type="text"
                          value={formData.secondaryEventTime}
                          onChange={(e) => setFormData({ ...formData, secondaryEventTime: e.target.value })}
                          placeholder="06:30 PM"
                          className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#dfba73] mb-1">Reception Venue</label>
                      <input
                        type="text"
                        value={formData.secondaryEventVenue}
                        onChange={(e) => setFormData({ ...formData, secondaryEventVenue: e.target.value })}
                        placeholder="Grand Crystal Pavilion, Colombo"
                        className="w-full px-3 py-2 rounded-lg bg-[#14060d] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Story, Music & Customization */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 4 of 5</span>
                </div>
                <h2 className="font-serif italic text-2xl sm:text-4xl text-[#fffdfa]">
                  Story, Dress Code &amp; Music
                </h2>
                <p className="text-xs text-[#d8c7a2] mt-1 font-sans">
                  Personalize the wording, soundtrack, and guest features.
                </p>
              </div>

              {/* Host Intro & Invitation Body */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Host Greeting
                </label>
                <input
                  type="text"
                  value={formData.hostIntro}
                  onChange={(e) => setFormData({ ...formData, hostIntro: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Invitation Body Message
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationBody}
                  onChange={(e) => setFormData({ ...formData, invitationBody: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Dress Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    Dress Code Title
                  </label>
                  <input
                    type="text"
                    value={formData.dressCodeTitle}
                    onChange={(e) => setFormData({ ...formData, dressCodeTitle: e.target.value })}
                    placeholder="Royal Splendor & Black Tie"
                    className="w-full px-4 py-2 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                    Dress Code Note
                  </label>
                  <input
                    type="text"
                    value={formData.dressCodeDescription}
                    onChange={(e) => setFormData({ ...formData, dressCodeDescription: e.target.value })}
                    placeholder="Warm tones of gold, burgundy, and ivory"
                    className="w-full px-4 py-2 rounded-xl bg-[#1b0811] border border-[#dfba73]/30 text-xs text-[#fffdfa] focus:outline-none"
                  />
                </div>
              </div>

              {/* Music Selection */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#ffd700] mb-1.5">
                  Background Music Soundtrack
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: "Traditional Sri Lankan Flute & Magul Bera", url: "/audio/background.mp3" },
                    { title: "Romantic Acoustic Piano Serenade", url: "/audio/background.mp3" },
                    { title: "Enchanted Garden Guitar Romance", url: "/audio/background.mp3" },
                    { title: "Muted / No Music", url: "" },
                  ].map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, musicTitle: m.title, musicUrl: m.url })}
                      className={`p-3 rounded-xl border text-left text-xs font-sans transition flex items-center gap-2.5 ${
                        formData.musicTitle === m.title
                          ? "bg-[#800020] text-[#ffd700] border-[#ffd700]"
                          : "bg-[#1b0811] text-[#d8c7a2] border-[#dfba73]/25 hover:border-[#dfba73]"
                      }`}
                    >
                      <Music className="w-4 h-4 shrink-0 text-[#ffd700]" />
                      <span className="truncate">{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Toggles */}
              <div className="pt-2 border-t border-[#dfba73]/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showWaxSeal}
                    onChange={(e) => setFormData({ ...formData, showWaxSeal: e.target.checked })}
                    className="accent-[#800020]"
                  />
                  <span>3D Wax Seal Unboxing</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showCountdown}
                    onChange={(e) => setFormData({ ...formData, showCountdown: e.target.checked })}
                    className="accent-[#800020]"
                  />
                  <span>Auspicious Countdown</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1b0811] border border-[#dfba73]/20 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSeating}
                    onChange={(e) => setFormData({ ...formData, showSeating: e.target.checked })}
                    className="accent-[#800020]"
                  />
                  <span>Table Seating Cards</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Live Interactive Simulator & Launch */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 5 of 5</span>
                </div>
                <h2 className="font-serif italic text-2xl sm:text-4xl text-[#fffdfa]">
                  Preview &amp; Save Your Invitation
                </h2>
                <p className="text-xs text-[#d8c7a2] mt-1 font-sans">
                  Here is how your invitation looks right now! Tap the wax seal to test unsealing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Summary Checklist */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-6 rounded-2xl bg-[#1f0a13] border border-[#dfba73]/30 space-y-3">
                    <h3 className="font-cinzel font-bold text-base text-[#ffd700]">
                      Your Wedding Website Summary
                    </h3>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between py-1 border-b border-[#dfba73]/15">
                        <span className="text-[#a89578]">Couple Names:</span>
                        <span className="font-semibold text-[#fffdfa]">{combinedCoupleNames}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#dfba73]/15">
                        <span className="text-[#a89578]">Selected Design:</span>
                        <span className="font-semibold text-[#ffd700]">{activeTemplate.name}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#dfba73]/15">
                        <span className="text-[#a89578]">Web Address:</span>
                        <span className="font-mono text-[#38bdf8]">
                          invitation.lk/e/{formData.slug}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#dfba73]/15">
                        <span className="text-[#a89578]">Celebration Date:</span>
                        <span className="font-semibold text-[#fffdfa]">
                          {new Date(formData.eventDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-[#dfba73]/15">
                        <span className="text-[#a89578]">Main Banquet Hall:</span>
                        <span className="font-semibold text-[#fffdfa]">{formData.venueName}</span>
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-[#a89578]">WhatsApp Delivery:</span>
                        <span className="text-[#10b981] font-semibold">Enabled (Unlimited Guests)</span>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-[#450a0a] border border-[#ef4444] text-xs text-[#fecaca] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#ef4444]" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-full btn-gold-shimmer text-sm font-cinzel font-bold text-[#140b10] flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(223,186,115,0.45)] hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Your Invitation...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Save &amp; Open My Dashboard (Free)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-[#a89578] font-sans">
                    ✓ Free to preview. No credit card required to start.
                  </p>
                </div>

                {/* Right: Interactive Smartphone Simulator */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className="relative w-[300px] sm:w-[320px] aspect-[9/18.5] rounded-[44px] p-3 bg-gradient-to-b from-[#3a2215] via-[#1a1215] to-[#0a0709] shadow-2xl border-2 border-[#dfba73]/40">
                    {/* Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30" />

                    {/* Inside Screen */}
                    <div
                      className="w-full h-full rounded-[34px] overflow-hidden flex flex-col relative text-[#fdfbf7] p-3 text-center border border-[#dfba73]/20 select-none"
                      style={{ backgroundColor: activeTemplate.styles.pageBg.replace("bg-[", "").replace("]", "") || "#121013" }}
                    >
                      {/* Top Bar */}
                      <div className="flex justify-between items-center text-[9px] text-[#d8c7a2]/70 pt-2 px-2 pb-1">
                        <span>9:41</span>
                        <span>5G 100%</span>
                      </div>

                      {/* Monogram & Title */}
                      <div className="mt-3">
                        <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#dfba73] font-cinzel">
                          Wedding Invitation
                        </span>
                        <h4 className="font-serif italic text-xl text-[#fff8ea] mt-0.5">
                          {combinedCoupleNames}
                        </h4>
                        <p className="text-[9.5px] text-[#edd892]/80 font-cinzel">
                          {new Date(formData.eventDate).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Interactive Wax Seal */}
                      {formData.showWaxSeal && (
                        <div className="my-3 flex flex-col items-center">
                          <button
                            onClick={() => setSealOpened(!sealOpened)}
                            className="wax-seal w-14 h-14 rounded-full flex flex-col items-center justify-center text-[#fffdfa] border-2 border-[#ffd700]/70 cursor-pointer transition transform active:scale-95"
                          >
                            <Crown className="w-4 h-4 text-[#ffd700]" />
                            <span className="text-[7px] font-cinzel font-bold text-[#ffd700]">
                              {sealOpened ? "OPEN" : "UNSEAL"}
                            </span>
                          </button>
                          <span className="text-[8px] text-[#d8c7a2]/70 mt-1 font-cinzel">
                            {sealOpened ? "Envelope Unsealed ✓" : "Tap Seal to open"}
                          </span>
                        </div>
                      )}

                      {/* Event Cards */}
                      <div className="space-y-1.5 text-left text-[9px] font-sans">
                        <div className="p-2 rounded-xl bg-[#240813]/90 border border-[#dfba73]/30 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-[#f5ebd7]">{formData.primaryEventTitle}</p>
                            <p className="text-[#a89578]">{formData.primaryEventTime} • {formData.venueName}</p>
                          </div>
                          {formData.showSeating && (
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#3b1220] text-[#ffd700] font-cinzel">
                              Table 01
                            </span>
                          )}
                        </div>

                        {formData.hasSecondaryEvent && (
                          <div className="p-2 rounded-xl bg-[#240813]/90 border border-[#dfba73]/30">
                            <p className="font-semibold text-[#f5ebd7]">{formData.secondaryEventTitle}</p>
                            <p className="text-[#a89578]">{formData.secondaryEventTime} • {formData.secondaryEventVenue}</p>
                          </div>
                        )}
                      </div>

                      {/* Simulated RSVP button */}
                      <div className="mt-auto pt-2">
                        <div className="py-2 px-3 rounded-xl btn-gold-shimmer text-[10px] font-cinzel font-bold text-[#140b10]">
                          Confirm Attendance (RSVP)
                        </div>
                      </div>

                      {/* Audio Icon */}
                      <button
                        onClick={() => setSoundPlaying(!soundPlaying)}
                        className="absolute bottom-2 right-2 p-1 rounded-full bg-black/60 border border-[#dfba73]/30 text-[#ffd700]"
                      >
                        {soundPlaying ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="mt-8 pt-6 border-t border-[#dfba73]/20 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-full text-xs font-cinzel font-semibold text-[#d8c7a2] bg-[#240810] border border-[#dfba73]/30 hover:border-[#dfba73] hover:text-[#ffd700] flex items-center gap-1.5 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 2 && slugStatus === "taken") {
                    setErrorMessage("Please choose an available web address slug before continuing.");
                    return;
                  }
                  setErrorMessage("");
                  setCurrentStep(currentStep + 1);
                }}
                className="px-6 py-2.5 rounded-full btn-gold-shimmer text-xs font-cinzel font-bold text-[#140b10] flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
