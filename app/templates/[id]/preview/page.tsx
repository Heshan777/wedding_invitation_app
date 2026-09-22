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
import InvitationView from "@/components/InvitationView";

export default function TemplatePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [activeId, setActiveId] = useState<string>(resolvedParams.id);
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setIsEmbedded(sp.get("embed") === "true");
    }
  }, []);

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
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    []
  );

  // Sample event settings reflecting the active template
  const sampleSettings = useMemo(
    () => ({
      id: "preview-event",
      coupleNames: "Sandharu & Sanduni",
      hostIntro: "Together with our families, we joyfully invite you to celebrate the homecoming of",
      invitationBody: "to witness our eternal vows and celebrate an unforgettable evening of sacred love and union.",
      eventDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days in future
      venueName: "Shangri-La Ballroom, Colombo",
      venueAddress: "1 Galle Face, Colombo 02, Sri Lanka",
      venueLat: 6.9271,
      venueLng: 79.8426,
      contactPhone: "+94 77 123 4567",
      heroImageUrl: "/images/couple-kiss.jpg",
      heroVideoUrl: null,
      videoThumbnailUrl: "/images/couple-kiss.jpg",
      welcomeImageUrl: "/images/couple-kiss.jpg",
      placeCardImageUrl: "/images/couple-kiss.jpg",
      placeCardNote: "Thank you for sharing in our joy and celebrating our royal beginning!",
      blessingImageUrl: "/images/couple-kiss.jpg",
      musicUrl: "/audio/background.mp3",
      dressCodeTitle: template.defaultDressCode.title,
      dressCodeDescription: template.defaultDressCode.description,
      timelineJson: JSON.stringify([
        { time: "05:00 PM", title: "Royal Guest Arrival", desc: "Welcome refreshments and traditional registration." },
        { time: "06:00 PM", title: "Poruwa & Sacred Vows", desc: "Auspicious blessings and ring exchange." },
        { time: "07:30 PM", title: "The Grand Reception", desc: "Champagne toast, celebratory dinner & live music." },
      ]),
      templateId: template.id,
    }),
    [template]
  );

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
      />
    </div>
  );
}
