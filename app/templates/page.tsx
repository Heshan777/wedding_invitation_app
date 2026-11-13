"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Sparkles,
  Search,
  Music,
  BookOpen,
  Camera,
  Users,
  Eye,
  ArrowRight,
  Check,
} from "lucide-react";
import { TEMPLATE_LIST, InvitationTemplate } from "@/lib/templates";
import { BUSINESS_CONFIG } from "@/lib/config";
import TemplatePhoneMockup from "@/components/TemplatePhoneMockup";

const CATEGORIES = [
  { id: "all", label: "All designs" },
  { id: "wedding", label: "Wedding" },
  { id: "homecoming", label: "Homecoming" },
  { id: "nikah", label: "Nikah" },
  { id: "birthday", label: "Birthday", comingSoon: true },
  { id: "save-the-date", label: "Save the Date", comingSoon: true },
  { id: "parties", label: "Parties", comingSoon: true },
  { id: "corporate", label: "Corporate", comingSoon: true },
];

const STYLES = [
  { id: "all", label: "All styles" },
  { id: "traditional", label: "Traditional" },
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "cultural", label: "Cultural" },
];

export default function TemplatesPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Category counts based on actual TEMPLATE_LIST
  const categoryCounts = useMemo(() => {
    return {
      all: TEMPLATE_LIST.length,
      wedding: TEMPLATE_LIST.length,
      homecoming: TEMPLATE_LIST.filter(
        (t) => t.id === "velvet-homecoming" || t.category === "luxury" || t.id === "royal-heritage"
      ).length,
      nikah: TEMPLATE_LIST.filter(
        (t) => t.id === "royal-heritage" || t.id === "golden-mandala-heritage" || t.category === "classic"
      ).length,
    };
  }, []);

  // Filter templates dynamically
  const filteredTemplates = useMemo(() => {
    return TEMPLATE_LIST.filter((tpl) => {
      // 1. Category Filter
      if (selectedCat === "homecoming") {
        const isHomecoming =
          tpl.id === "velvet-homecoming" ||
          tpl.id === "royal-heritage" ||
          tpl.category === "luxury";
        if (!isHomecoming) return false;
      } else if (selectedCat === "nikah") {
        const isNikah =
          tpl.id === "royal-heritage" ||
          tpl.id === "golden-mandala-heritage" ||
          tpl.category === "classic";
        if (!isNikah) return false;
      }

      // 2. Style Filter
      if (selectedStyle === "traditional" && tpl.category !== "traditional" && tpl.category !== "classic") {
        return false;
      }
      if (selectedStyle === "classic" && tpl.category !== "classic" && tpl.category !== "traditional") {
        return false;
      }
      if (selectedStyle === "modern" && tpl.category !== "modern" && tpl.category !== "celestial" && tpl.category !== "minimalist") {
        return false;
      }
      if (selectedStyle === "cultural" && tpl.category !== "traditional" && tpl.category !== "botanical") {
        return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(q);
        const matchesCouple = tpl.coupleDemoNames.toLowerCase().includes(q);
        const matchesTagline = tpl.tagline?.toLowerCase().includes(q);
        const matchesCategory = tpl.categoryLabel?.toLowerCase().includes(q);
        if (!matchesName && !matchesCouple && !matchesTagline && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCat, selectedStyle, searchQuery]);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 pb-24 font-sans selection:bg-[#fcecef] selection:text-[#d62851]">
      {/* Top Header Matching Screenshot & Main Landing Nav */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-32 overflow-hidden">
            <Image
              src="/images/wedlink-logo.png"
              alt="WedLink.lk"
              fill
              priority
              sizes="128px"
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f7f5f0] p-1 rounded-full text-xs font-semibold">
          <Link
            href="/#templates"
            className="px-4 py-1.5 rounded-full bg-[#fcecef] text-[#d62851] font-bold shadow-xs transition"
          >
            Templates
          </Link>
          <Link
            href="/#how-to-use"
            className="px-4 py-1.5 rounded-full text-gray-600 hover:text-gray-900 transition"
          >
            How to use
          </Link>
          <Link
            href="/#features"
            className="px-4 py-1.5 rounded-full text-gray-600 hover:text-gray-900 transition"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="px-4 py-1.5 rounded-full text-gray-600 hover:text-gray-900 transition"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden sm:inline-block text-xs font-semibold text-[#111827] hover:text-[#d62851] transition"
          >
            Sign in
          </Link>
          <Link
            href="/onboard"
            className="px-5 py-2 text-xs font-bold rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white transition shadow-sm cursor-pointer active:scale-95"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        {/* Title & Intro Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcecef] text-[#d62851] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ALL DIGITAL INVITATION TEMPLATES</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight leading-[1.15]">
            Find the design that feels like <span className="text-[#d62851]">you</span>.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#4b5563] leading-relaxed">
            Real, working interactive invitations to open and try on your phone.
            Every design is on every plan, and free to try.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = (categoryCounts as any)[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => !cat.comingSoon && setSelectedCat(cat.id)}
                disabled={cat.comingSoon}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCat === cat.id
                    ? "bg-[#d62851] text-white shadow-md shadow-[#d62851]/20 ring-2 ring-[#fcecef]"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                } ${cat.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>{cat.label}</span>
                {count !== undefined && (
                  <span
                    className={`text-[10px] ${
                      selectedCat === cat.id ? "text-white/80" : "text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                )}
                {cat.comingSoon && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#fcecef] text-[#d62851] font-semibold">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Bar + Style Filters */}
        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 max-w-5xl mx-auto pb-4 border-b border-gray-200/70">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search designs, couples or styles..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-1 focus:ring-[#d62851] transition shadow-2xs"
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
            {STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStyle(st.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer ${
                  selectedStyle === st.id
                    ? "bg-[#fcecef] text-[#d62851] font-bold border border-[#f5dde2]"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 font-medium"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Gallery Grid (Matching user's exact phone mockups) */}
        {filteredTemplates.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 justify-items-center items-start">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="w-full flex justify-center">
                <TemplatePhoneMockup
                  template={template}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/80 my-8 p-8 max-w-xl mx-auto shadow-xs">
            <Sparkles className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No matching designs found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try clearing your search query or choosing a different style category.
            </p>
            <button
              onClick={() => {
                setSelectedCat("all");
                setSelectedStyle("all");
                setSearchQuery("");
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#d62851] text-white text-xs font-bold hover:bg-[#b81d42] transition shadow-xs"
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>

      {/* Floating WhatsApp Support Bubble */}
      <a
        href={`https://wa.me/${BUSINESS_CONFIG.supportPhone}?text=${encodeURIComponent("Hi WedLink! I am interested in customizing an invitation template for our wedding.")}`}
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
