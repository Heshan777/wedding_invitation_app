"use client";

import React, { use, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import {
  WEDLINK_TEMPLATE_LIST,
  getWedLinkTemplate,
} from "@/lib/template-engine";
import LivePhoneSimulator from "@/components/LivePhoneSimulator";

export default function TemplateSlugPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [activeSlug, setActiveSlug] = useState<string>(resolvedParams.id);

  const currentTheme = useMemo(
    () => getWedLinkTemplate(activeSlug),
    [activeSlug]
  );

  const currentIndex = WEDLINK_TEMPLATE_LIST.findIndex(
    (t) => t.id === currentTheme.id
  );
  const totalCount = WEDLINK_TEMPLATE_LIST.length;

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + totalCount) % totalCount;
    setActiveSlug(WEDLINK_TEMPLATE_LIST[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % totalCount;
    setActiveSlug(WEDLINK_TEMPLATE_LIST[nextIdx].id);
  };

  return (
    <div className="relative min-h-screen bg-[#faf7f2] text-[#111827] flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#fcecef] selection:text-[#d62851]">
      {/* ----------------------------------------------------------------- */}
      {/* BACKGROUND TEXTURE & ORNAMENTS (Exact Match to Image 3) */}
      {/* ----------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft draped silk warm texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fffdfa] via-[#fcf8f0] to-[#f4ebe0] opacity-90" />

        {/* Decorative Lotus Reliefs (Left & Right floral accents from Image 3) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-80 sm:w-96 h-[600px] pointer-events-none opacity-20 -ml-12 hidden md:block">
          <svg viewBox="0 0 200 300" className="w-full h-full text-[#c5a059]" fill="currentColor">
            <path d="M 30 150 C 70 80, 140 100, 170 150 C 140 200, 70 220, 30 150 Z" opacity="0.6" />
            <path d="M 50 130 C 90 60, 160 80, 190 130 C 160 180, 90 200, 50 130 Z" opacity="0.4" />
            <circle cx="100" cy="150" r="22" opacity="0.7" />
          </svg>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-80 sm:w-96 h-[600px] pointer-events-none opacity-20 -mr-12 hidden md:block transform scale-x-[-1]">
          <svg viewBox="0 0 200 300" className="w-full h-full text-[#c5a059]" fill="currentColor">
            <path d="M 30 150 C 70 80, 140 100, 170 150 C 140 200, 70 220, 30 150 Z" opacity="0.6" />
            <path d="M 50 130 C 90 60, 160 80, 190 130 C 160 180, 90 200, 50 130 Z" opacity="0.4" />
            <circle cx="100" cy="150" r="22" opacity="0.7" />
          </svg>
        </div>

        {/* Velvet Homecoming specific garland backdrop */}
        {currentTheme.id === "velvet-homecoming" && (
          <div className="absolute inset-0 flex items-center justify-between opacity-80">
            <div className="relative w-80 h-[600px] -ml-10">
              <Image
                src="/images/templates/velvet-homecoming/floral-left.jpg"
                alt="Floral garland left"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="relative w-80 h-[600px] -mr-10">
              <Image
                src="/images/templates/velvet-homecoming/floral-right.jpg"
                alt="Floral garland right"
                fill
                className="object-contain object-right"
              />
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* FLOATING TOP NAVIGATION BAR (Exact Match to Image 3) */}
      {/* ----------------------------------------------------------------- */}
      <header className="fixed top-4 inset-x-4 sm:inset-x-8 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: ← All templates pill button */}
        <div className="pointer-events-auto">
          <Link
            href="/templates"
            className="px-4 py-2 rounded-full bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold tracking-wide shadow-md border border-gray-200/80 backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-gray-700" />
            <span>All templates</span>
          </Link>
        </div>

        {/* Right: < 㗊 Template Name 1/8 > pill switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-gray-200/80 px-2 py-1 rounded-full shadow-md text-xs">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition cursor-pointer"
            title="Previous template"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5 px-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-semibold text-gray-900 max-w-[130px] sm:max-w-none truncate">
              {currentTheme.name}
            </span>
            <span className="text-[11px] font-medium text-gray-400">
              {(currentIndex >= 0 ? currentIndex + 1 : 1)}/{totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition cursor-pointer"
            title="Next template"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN VIEWPORT: CENTERED PHONE SIMULATOR (Image 3 Match) */}
      {/* ----------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-2 sm:px-4">
        <div className="w-full max-w-lg mx-auto flex items-center justify-center">
          <LivePhoneSimulator theme={currentTheme} />
        </div>
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* BOTTOM-LEFT: FLOATING "MAKE IT YOURS →" CTA (Exact Match to Image 3) */}
      {/* ----------------------------------------------------------------- */}
      <div className="fixed bottom-6 left-6 z-40">
        <Link
          href={`/onboard?template=${currentTheme.id}`}
          className="px-5 py-2.5 rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#d62851]/30 flex items-center gap-1.5 transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Make it yours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* BOTTOM-RIGHT: FLOATING WHATSAPP SUPPORT BUBBLE (Exact Match) */}
      {/* ----------------------------------------------------------------- */}
      <a
        href="https://wa.me/94771234567?text=Hi%20WedLink%2C%20I%20am%20interested%20in%20customizing%20an%20invitation%20template!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span>Chat with Us</span>
      </a>
    </div>
  );
}
