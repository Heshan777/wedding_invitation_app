"use client";

import React, { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Palette,
  ExternalLink,
} from "lucide-react";
import {
  INVITATION_TEMPLATES,
  TEMPLATE_LIST,
  getTemplate,
  InvitationTemplate,
} from "@/lib/templates";
import { getWedLinkTemplate } from "@/lib/template-engine";
import InvitationView from "@/components/InvitationView";

export default function TemplatePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = use(params);
  const resolvedSearchParams = searchParams ? use(searchParams) : {};
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(resolvedParams.id);
  const isEmbedded = resolvedSearchParams?.embed === "true";
  const isOpened = resolvedSearchParams?.opened === "true";

  const template = useMemo(() => getTemplate(activeId), [activeId]);

  // Sample guest record for preview mode (Zero DB writes)
  const sampleGuest = useMemo(
    () => ({
      id: "demo-guest",
      token: "demo-preview",
      displayName: "Honored Guest",
      salutation: "Mr. & Mrs.",
      inviteType: "COUPLE",
      tableNumber: 1,
      notes: "VIP Guest",
      phone: "+94 77 123 4567",
      rsvpStatus: "PENDING",
      attendeeCount: 2,
      dietary: "NONE",
      rsvpMessage: null,
      rsvpSubmittedAt: null,
      viewedAt: null,
      createdAt: new Date("2026-11-01T00:00:00.000Z"),
      updatedAt: new Date("2026-11-01T00:00:00.000Z"),
    }),
    []
  );

  // Sample event settings reflecting the active template with deterministic date & authentic theme content
  const sampleSettings = useMemo(() => {
    const wedlinkTheme = getWedLinkTemplate(template.id);
    const data = wedlinkTheme.sampleData;

    // Use authentic hero photo for this specific template
    let heroPhoto = data.heroPhoto;
    if (template.id === "golden-mandala-heritage" || template.id === "nilame-traditional") {
      heroPhoto = data.cartoonCoupleArt || "/images/templates/kandyan/couple-art.png";
    } else if (template.id === "velvet-homecoming") {
      heroPhoto = "/images/templates/blush-floral/floral-header-arch.png";
    } else if (!heroPhoto) {
      heroPhoto = "/images/couple-kiss.jpg";
    }

    // Format authentic timeline schedules
    const schedulesList = data.schedules && data.schedules.length > 0
      ? data.schedules.map((s) => ({
          time: s.time,
          title: s.title,
          desc: s.description,
        }))
      : [
          { time: "09:18 AM", title: "Auspicious Vows", desc: data.venueName || "Grand Ballroom" },
          { time: "06:30 PM", title: "Celebratory Reception", desc: "Dinner & Dance" },
        ];

    return {
      id: "preview-event",
      coupleNames: template.coupleDemoNames || data.coupleNames,
      hostIntro: data.heroGreeting
        ? `${data.heroGreeting} • ${data.heroSubtitle || "You are cordially invited"}`
        : "Together with our families, we joyfully invite you to celebrate the marriage of",
      invitationBody: data.vowQuote || "to witness our eternal vows and celebrate an unforgettable evening of sacred love and union.",
      eventDate: new Date(data.eventDate ? `${data.eventDate}T12:00:00.000Z` : "2026-12-18T18:30:00.000Z"),
      venueName: data.venueName || "Grand Ballroom, Colombo",
      venueAddress: data.venueAddress || "Colombo, Sri Lanka",
      venueLat: 6.9271,
      venueLng: 79.8426,
      contactPhone: "+94 77 123 4567",
      heroImageUrl: heroPhoto,
      heroVideoUrl: null,
      videoThumbnailUrl: heroPhoto,
      welcomeImageUrl: heroPhoto,
      placeCardImageUrl: heroPhoto,
      placeCardNote: "Thank you for sharing in our joy and celebrating our royal beginning!",
      blessingImageUrl: heroPhoto,
      musicUrl: data.musicUrl || "/audio/background.mp3",
      dressCodeTitle: data.dressCodeTitle || template.defaultDressCode.title,
      dressCodeDescription: data.dressCodeDescription || template.defaultDressCode.description,
      timelineJson: JSON.stringify(schedulesList),
      templateId: template.id,
    };
  }, [template]);

  const samplePhotos = useMemo(
    () => [
      {
        id: "p1",
        url: "/images/couple-kiss.jpg",
        title: "Eternal Vows",
        subtitle: "A Sacred Moment of Love",
        tag: "Pre-Wedding",
        order: 0,
      },
      {
        id: "p2",
        url: "/images/bride-walk.jpg",
        title: "The Radiance of the Bride",
        subtitle: "Elegance in Silk & Gold",
        tag: "Pre-Wedding",
        order: 1,
      },
      {
        id: "p3",
        url: "/images/groom-walk.jpg",
        title: "The Arrival of the Groom",
        subtitle: "Standing in Regal Splendor",
        tag: "Pre-Wedding",
        order: 2,
      },
    ],
    []
  );

  const handleSwitchTemplate = (newId: string) => {
    setActiveId(newId);
    // Update browser URL without full refresh
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/templates/${newId}/preview${isEmbedded ? "?embed=true" : ""}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating Top Template Switcher Toolbar (Hidden if embedded in iframe) */}
      {!isEmbedded && (
        <div className="fixed top-3 inset-x-3 sm:inset-x-6 z-50 pointer-events-none flex justify-center">
          <div className="pointer-events-auto max-w-4xl w-full bg-[#160a12]/95 backdrop-blur-xl border border-[#dfba73]/50 rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(223,186,115,0.3)] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            {/* Left: Return to gallery */}
            <Link
              href="/templates"
              className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] hover:text-[#fff8ea] transition flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Templates Gallery</span>
              <span className="sm:hidden">Gallery</span>
            </Link>

            {/* Middle: Active Template Pills */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {TEMPLATE_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSwitchTemplate(t.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-cinzel font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    template.id === t.id
                      ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-sm scale-105"
                      : "text-[#dfba73]/70 hover:text-[#ffd700] hover:bg-white/5"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full border border-white/30 flex-shrink-0"
                    style={{ backgroundColor: t.primaryColor }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            {/* Right: Apply to Dashboard */}
            <Link
              href={`/admin/dashboard?tab=templates&select=${template.id}`}
              className="btn-gold-shimmer px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-cinzel font-bold tracking-wider flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition flex-shrink-0"
            >
              <span>Use Template</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Full-Screen Invitation View */}
      <InvitationView
        guest={sampleGuest}
        settings={sampleSettings}
        photos={samplePhotos}
        initialOpened={isOpened}
      />
    </div>
  );
}
