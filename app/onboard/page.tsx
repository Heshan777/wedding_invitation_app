"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { TEMPLATE_LIST, getTemplate, InvitationTemplate, resolveTemplateIdFromParam } from "@/lib/templates";
import { getWedLinkTemplate } from "@/lib/template-engine";
import ThemedPhoneInvitationBody from "@/components/ThemedPhoneInvitationBody";
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
  const [suggestedSlug, setSuggestedSlug] = useState<string>("");

  const applyTemplateSelection = (rawTemplateId: string) => {
    const resolvedId = resolveTemplateIdFromParam(rawTemplateId) || rawTemplateId || "golden-mandala-heritage";
    const wedlinkTheme = getWedLinkTemplate(resolvedId);
    const tmplMeta = getTemplate(resolvedId);
    const data = wedlinkTheme.sampleData;

    setFormData((prev) => {
      const demoNames = (tmplMeta.coupleDemoNames || data.coupleNames || "").split(/&|and|\+/i).map((s: string) => s.trim());
      const groom = demoNames[0] || "Groom";
      const bride = demoNames[1] || "Bride";
      const autoSlug = `${groom.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-and-${bride.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-2026`;

      return {
        ...prev,
        templateId: resolvedId,
        groomName: groom,
        brideName: bride,
        slug: autoSlug,
        eventDate: data.eventDate || "2026-11-28",
        venueName: data.venueName || "Grand Ballroom",
        venueAddress: data.venueAddress || "Colombo, Sri Lanka",
        hostIntro: data.heroGreeting
          ? `${data.heroGreeting} • ${data.heroSubtitle || "You are cordially invited"}`
          : prev.hostIntro,
        invitationBody: data.vowQuote || prev.invitationBody,
        musicUrl: data.musicUrl || "/audio/background.mp3",
        dressCodeTitle: data.dressCodeTitle || tmplMeta.defaultDressCode?.title || prev.dressCodeTitle,
        dressCodeDescription: data.dressCodeDescription || tmplMeta.defaultDressCode?.description || prev.dressCodeDescription,
      };
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get("template") || sp.get("t") || sp.get("style");
      const p = sp.get("plan");
      if (t) {
        applyTemplateSelection(t);
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
  const wedlinkTheme = useMemo(() => getWedLinkTemplate(formData.templateId), [formData.templateId]);

  // Combined couple names
  const combinedCoupleNames = useMemo(() => {
    const g = formData.groomName.trim();
    const b = formData.brideName.trim();
    if (g && b) return `${g} & ${b}`;
    return g || b || "The Couple";
  }, [formData.groomName, formData.brideName]);

  // Payload for the themed phone invitation body preview
  const themedPhoneData = useMemo(() => {
    return {
      ...wedlinkTheme.sampleData,
      coupleNames: combinedCoupleNames,
      groomName: formData.groomName || "Groom",
      brideName: formData.brideName || "Bride",
      eventDate: formData.eventDate,
      nekathTime: formData.primaryEventTime || "09:18 AM",
      venueName: formData.venueName || "Grand Ballroom",
      venueAddress: formData.venueAddress || "Colombo, Sri Lanka",
      musicTitle: formData.musicTitle || wedlinkTheme.sampleData.musicTitle,
      musicUrl: formData.musicUrl || wedlinkTheme.sampleData.musicUrl,
      dressCodeTitle: formData.dressCodeTitle || wedlinkTheme.sampleData.dressCodeTitle,
      dressCodeDescription: formData.dressCodeDescription || wedlinkTheme.sampleData.dressCodeDescription,
      schedules: [
        {
          time: formData.primaryEventTime || "09:18 AM",
          title: formData.primaryEventTitle || "Auspicious Ceremony",
          description: formData.venueName || "Grand Ballroom",
          isNekath: true,
        },
        ...(formData.hasSecondaryEvent
          ? [
              {
                time: formData.secondaryEventTime || "06:30 PM",
                title: formData.secondaryEventTitle || "Reception",
                description: formData.secondaryEventVenue || "Grand Pavilion",
                isNekath: false,
              },
            ]
          : []),
      ],
    };
  }, [wedlinkTheme, combinedCoupleNames, formData]);

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
      setSuggestedSlug("");
      return;
    }
    setSlugStatus("checking");
    try {
      const res = await fetch(`/api/onboard/check-slug?slug=${encodeURIComponent(slugToCheck.trim())}`);
      const data = await res.json();
      if (data.available) {
        setSlugStatus("available");
        setSlugMessage("This link is available!");
        setSuggestedSlug("");
      } else {
        setSlugStatus("taken");
        setSlugMessage(data.message || "This link is already reserved.");
        if (data.suggestedSlug) {
          setSuggestedSlug(data.suggestedSlug);
        }
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
        if (data.suggestedSlug) {
          setSuggestedSlug(data.suggestedSlug);
        }
        throw new Error(data.error || "Failed to create your invitation.");
      }

      // Successfully created! Store active event ID so dashboard opens this newly created wedding
      if (typeof window !== "undefined" && data.eventId) {
        localStorage.setItem("active_wedding_event_id", data.eventId);
      }
      router.push(`/admin/dashboard?eventId=${data.eventId}`);
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
    <div className="min-h-screen bg-white text-[#111827] selection:bg-[#fcecef] selection:text-[#d62851] overflow-x-hidden font-sans">
      {/* Background Soft Radiant Ambient Glow (invitation.lk matching) */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f3] via-[#ffffff] to-[#ffffff] -z-10" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-gray-100 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 sm:h-9 w-28 sm:w-36 overflow-hidden">
            <Image
              src="/images/wedlink-logo.png"
              alt="WedLink.lk"
              fill
              priority
              sizes="144px"
              className="object-contain object-left group-hover:scale-105 transition"
            />
          </div>
          <span className="hidden sm:inline-block ml-2 text-xs text-[#9ca3af] border-l border-gray-200 pl-2">
            Self-Serve Wedding Builder
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-xs text-[#4b5563] hover:text-[#d62851] transition font-medium"
          >
            Already have an account? <span className="font-bold underline text-[#d62851]">Sign In</span>
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    currentStep === s.number
                      ? "bg-[#d62851] text-white shadow-md shadow-[#d62851]/25 ring-4 ring-[#fcecef]"
                      : currentStep > s.number
                      ? "bg-[#10b981] text-white cursor-pointer"
                      : "bg-[#f3f4f6] text-[#9ca3af] border border-gray-200"
                  }`}
                  aria-label={`Go to step ${s.number}: ${s.label}`}
                >
                  {currentStep > s.number ? <Check className="w-4 h-4" /> : s.number}
                </button>
                <span
                  className={`mt-1.5 text-xs hidden sm:block ${
                    currentStep === s.number ? "text-[#d62851] font-semibold" : "text-[#6b7280]"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 max-w-2xl mx-auto overflow-hidden">
            <div
              className="bg-[#d62851] h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-xl shadow-rose-950/5">
          {/* STEP 1: Template Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 1 of 5</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                  Choose Your Invitation Style
                </h2>
                <p className="text-sm text-[#6b7280] mt-1 font-sans">
                  Select a handcrafted aesthetic. You can tweak photos, schedule, and colors anytime later.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TEMPLATE_LIST.map((template) => {
                  const isSelected = formData.templateId === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => applyTemplateSelection(template.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#fff7f8] border-[#d62851] shadow-lg shadow-[#d62851]/10 ring-2 ring-[#d62851]"
                          : "bg-white border-gray-200 hover:border-[#d62851]/50 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-base text-[#111827]">
                            {template.name}
                          </h3>
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-[#d62851] flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#6b7280] bg-gray-100 px-2 py-0.5 rounded-full">
                              {template.categoryLabel}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-[#d62851] mb-3">
                          {template.tagline}
                        </p>

                        <div className="flex items-center gap-1.5 mb-3">
                          {template.palette.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-[#4b5563] font-sans line-clamp-3 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#d62851] font-semibold">
                        <span>✓ Wax seal &amp; RSVP</span>
                        <span className="underline">{isSelected ? "Selected" : "Select"}</span>
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
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 2 of 5</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Couple Names &amp; Custom Link
                </h2>
                <p className="text-sm text-[#6b7280] mt-1 font-sans">
                  Enter your names and pick your unique WhatsApp invitation web address.
                </p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Groom&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.groomName}
                    onChange={(e) => handleNameChange("groomName", e.target.value)}
                    placeholder="E.g. Sandharu Perera"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none transition shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Bride&apos;s Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.brideName}
                    onChange={(e) => handleNameChange("brideName", e.target.value)}
                    placeholder="E.g. Sanduni Silva"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              {/* Celebration Type */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
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
                      className={`p-3 rounded-xl border text-xs font-semibold transition ${
                        formData.celebrationType === t.id
                          ? "bg-[#fcecef] text-[#d62851] border-[#d62851] shadow-sm"
                          : "bg-white text-[#4b5563] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Web Link / Slug */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Your Custom Web Address
                </label>
                <div className="flex items-center rounded-xl bg-white border border-gray-200 overflow-hidden focus-within:border-[#d62851] focus-within:ring-2 focus-within:ring-[#fcecef] shadow-sm transition">
                  <span className="px-3.5 py-2.5 bg-gray-50 text-xs font-mono text-[#6b7280] border-r border-gray-200 font-semibold">
                    wedlink.lk/e/
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
                    className="flex-1 px-3.5 py-2.5 bg-transparent text-sm text-[#111827] font-mono focus:outline-none"
                  />
                </div>

                {/* Slug feedback indicator */}
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-sans">
                  {slugStatus === "checking" && (
                    <div className="flex items-center gap-1.5 text-[#6b7280]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking availability...</span>
                    </div>
                  )}
                  {slugStatus === "available" && (
                    <div className="flex items-center gap-1.5 text-[#10b981]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="font-semibold">{slugMessage}</span>
                    </div>
                  )}
                  {slugStatus === "taken" && (
                    <div className="flex items-center gap-1.5 text-[#ef4444]">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="font-semibold">{slugMessage}</span>
                    </div>
                  )}
                  {suggestedSlug && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, slug: suggestedSlug });
                        checkSlugAvailability(suggestedSlug);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold cursor-pointer transition"
                    >
                      <span>💡 Use suggested:</span>
                      <span className="font-mono underline">{suggestedSlug}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    WhatsApp Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none transition shadow-sm"
                  />
                  <p className="text-[11px] text-[#6b7280] mt-1 font-sans">
                    Used to sign in to your dashboard to view RSVPs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="couple@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none transition shadow-sm"
                  />
                  <p className="text-[11px] text-[#6b7280] mt-1 font-sans">
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
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 3 of 5</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Event Schedule &amp; Venues
                </h2>
                <p className="text-sm text-[#6b7280] mt-1 font-sans">
                  Configure Poruwa timings, banquet hall, and evening celebrations.
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Wedding Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none transition shadow-sm"
                  />
                </div>
              </div>

              {/* Primary Ceremony (Poruwa / Church) */}
              <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#d62851]">
                  <Crown className="w-4 h-4" />
                  <span>Primary Ceremony (Poruwa / Church / Kovil)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#4b5563] font-medium mb-1">Ceremony Title</label>
                    <input
                      type="text"
                      value={formData.primaryEventTitle}
                      onChange={(e) => setFormData({ ...formData, primaryEventTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#4b5563] font-medium mb-1">Auspicious Time (Nekath)</label>
                    <input
                      type="text"
                      value={formData.primaryEventTime}
                      onChange={(e) => setFormData({ ...formData, primaryEventTime: e.target.value })}
                      placeholder="09:18 AM"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#4b5563] font-medium mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="Shangri-La Ballroom, Colombo"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#4b5563] font-medium mb-1">Venue Address (For Google Maps)</label>
                  <input
                    type="text"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    placeholder="1 Galle Face, Colombo 02, Sri Lanka"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Secondary Celebration (Reception / Homecoming) */}
              <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#d62851]">
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
                        <label className="block text-xs text-[#4b5563] font-medium mb-1">Event Title</label>
                        <input
                          type="text"
                          value={formData.secondaryEventTitle}
                          onChange={(e) => setFormData({ ...formData, secondaryEventTitle: e.target.value })}
                          placeholder="Homecoming Reception"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-[#4b5563] font-medium mb-1">Starting Time</label>
                        <input
                          type="text"
                          value={formData.secondaryEventTime}
                          onChange={(e) => setFormData({ ...formData, secondaryEventTime: e.target.value })}
                          placeholder="06:30 PM"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#4b5563] font-medium mb-1">Reception Venue</label>
                      <input
                        type="text"
                        value={formData.secondaryEventVenue}
                        onChange={(e) => setFormData({ ...formData, secondaryEventVenue: e.target.value })}
                        placeholder="Grand Crystal Pavilion, Colombo"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
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
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 4 of 5</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Story, Dress Code &amp; Music
                </h2>
                <p className="text-sm text-[#6b7280] mt-1 font-sans">
                  Personalize the wording, soundtrack, and guest features.
                </p>
              </div>

              {/* Host Intro & Invitation Body */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Host Greeting
                </label>
                <input
                  type="text"
                  value={formData.hostIntro}
                  onChange={(e) => setFormData({ ...formData, hostIntro: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Invitation Body Message
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationBody}
                  onChange={(e) => setFormData({ ...formData, invitationBody: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] focus:outline-none shadow-sm leading-relaxed"
                />
              </div>

              {/* Dress Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Dress Code Title
                  </label>
                  <input
                    type="text"
                    value={formData.dressCodeTitle}
                    onChange={(e) => setFormData({ ...formData, dressCodeTitle: e.target.value })}
                    placeholder="Royal Splendor & Black Tie"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                    Dress Code Note
                  </label>
                  <input
                    type="text"
                    value={formData.dressCodeDescription}
                    onChange={(e) => setFormData({ ...formData, dressCodeDescription: e.target.value })}
                    placeholder="Warm tones of gold, burgundy, and ivory"
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#111827] focus:border-[#d62851] focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Music Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
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
                          ? "bg-[#fcecef] text-[#d62851] border-[#d62851] font-semibold"
                          : "bg-white text-[#4b5563] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Music className="w-4 h-4 shrink-0 text-[#d62851]" />
                      <span className="truncate">{m.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Toggles */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50/70 border border-gray-200 cursor-pointer text-[#374151]">
                  <input
                    type="checkbox"
                    checked={formData.showWaxSeal}
                    onChange={(e) => setFormData({ ...formData, showWaxSeal: e.target.checked })}
                    className="accent-[#d62851]"
                  />
                  <span>3D Wax Seal Unboxing</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50/70 border border-gray-200 cursor-pointer text-[#374151]">
                  <input
                    type="checkbox"
                    checked={formData.showCountdown}
                    onChange={(e) => setFormData({ ...formData, showCountdown: e.target.checked })}
                    className="accent-[#d62851]"
                  />
                  <span>Auspicious Countdown</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50/70 border border-gray-200 cursor-pointer text-[#374151]">
                  <input
                    type="checkbox"
                    checked={formData.showSeating}
                    onChange={(e) => setFormData({ ...formData, showSeating: e.target.checked })}
                    className="accent-[#d62851]"
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
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step 5 of 5</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  Preview &amp; Save Your Invitation
                </h2>
                <p className="text-sm text-[#6b7280] mt-1 font-sans">
                  Here is how your invitation looks right now! Tap the wax seal to test unsealing.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Summary Checklist */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <h3 className="font-bold text-base text-[#111827]">
                      Your Wedding Website Summary
                    </h3>

                    <div className="space-y-2 text-xs font-sans">
                      <div className="flex justify-between py-1.5 border-b border-gray-200">
                        <span className="text-[#6b7280]">Couple Names:</span>
                        <span className="font-semibold text-[#111827]">{combinedCoupleNames}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-200">
                        <span className="text-[#6b7280]">Selected Design:</span>
                        <span className="font-semibold text-[#d62851]">{activeTemplate.name}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-200">
                        <span className="text-[#6b7280]">Web Address:</span>
                        <span className="font-mono text-[#0284c7] font-semibold">
                          wedlink.lk/e/{formData.slug}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-200">
                        <span className="text-[#6b7280]">Celebration Date:</span>
                        <span className="font-semibold text-[#111827]">
                          {new Date(formData.eventDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-gray-200">
                        <span className="text-[#6b7280]">Main Banquet Hall:</span>
                        <span className="font-semibold text-[#111827]">{formData.venueName}</span>
                      </div>

                      <div className="flex justify-between py-1.5">
                        <span className="text-[#6b7280]">WhatsApp Delivery:</span>
                        <span className="text-[#10b981] font-semibold">Enabled (Unlimited Guests)</span>
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{errorMessage}</span>
                      </div>
                      {suggestedSlug && (
                        <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-rose-800">
                            Suggested link: <b className="font-mono">{suggestedSlug}</b>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, slug: suggestedSlug });
                              setErrorMessage("");
                              checkSlugAvailability(suggestedSlug);
                            }}
                            className="px-2.5 py-1 rounded-md bg-[#d62851] text-white text-[11px] font-semibold hover:bg-[#b81d42] transition cursor-pointer"
                          >
                            Use {suggestedSlug}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#d62851]/25 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 cursor-pointer"
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

                  <p className="text-xs text-center text-[#6b7280] font-sans">
                    ✓ Free to preview. No credit card required to start.
                  </p>
                </div>

                {/* Right: Interactive Smartphone Simulator */}
                <div className="lg:col-span-6 flex flex-col items-center">
                  <div className="relative w-[300px] sm:w-[330px] h-[640px] rounded-[48px] p-3.5 bg-neutral-900 shadow-2xl border-4 border-neutral-700 ring-1 ring-black/40 overflow-hidden">
                    {/* Dynamic Island / Notch */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 pointer-events-none" />

                    {/* Inside Screen with Themed Custom Styling */}
                    <div className="w-full h-full rounded-[38px] overflow-hidden flex flex-col relative text-[#111827] bg-[#fffdfa] border border-neutral-800/20 select-none">
                      {/* Top Status Bar */}
                      <div className="flex justify-between items-center text-[9px] text-gray-500 pt-2 px-3 pb-1 z-30 bg-transparent shrink-0">
                        <span className="font-semibold">9:41</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-mono px-1 rounded bg-black/10">wedlink.lk</span>
                          <span>5G 100%</span>
                        </div>
                      </div>

                      {/* Scrollable Rich Themed Invitation */}
                      <div className="flex-1 overflow-y-auto scrollbar-none relative">
                        <ThemedPhoneInvitationBody
                          theme={wedlinkTheme}
                          data={themedPhoneData}
                          isCompact={true}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-[#6b7280] font-sans text-center">
                    📱 Live previewing <b className="text-[#111827]">{activeTemplate.name}</b> theme
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#4b5563] bg-gray-50 border border-gray-200 hover:border-gray-300 hover:text-[#111827] flex items-center gap-1.5 transition cursor-pointer"
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
                className="px-6 py-2.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-xs font-bold text-white flex items-center gap-1.5 shadow-md shadow-[#d62851]/20 hover:scale-105 active:scale-95 transition cursor-pointer"
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
