"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Sparkles } from "lucide-react";
import PhoneCard from "@/components/PhoneCard";
import PreviewModal from "@/components/PreviewModal";
import { Template } from "@/types/template";

const TEMPLATES: Template[] = [
  // 1. Blush Peony Romance (Screenshot match: Sachini & Kavinda)
  {
    id: "1",
    slug: "sachini-kavinda",
    title: "Blush Peony Romance",
    names: "Sachini & Kavinda",
    date: "Sunday, December 27, 2026",
    location: "4:00 PM • Hikkaduwa Beach Resort",
    category: "wedding",
    styleType: "floral-peony",
  },

  // 2. Ocean Blue Agate & Gold Kintsugi (Screenshot match: Anna & Yusuf)
  {
    id: "2",
    slug: "anna-yusuf",
    title: "Sapphire Agate & Gold Kintsugi",
    names: "Anna & Yusuf",
    date: "Sunday, December 27, 2026",
    location: "9:00 AM • Berbelle Hotel, Colombo",
    category: "nikah",
    styleType: "ocean-agate",
  },

  // 3. Top Secret SLAF Dossier (Screenshot match: Operation Blue Wings)
  {
    id: "3",
    slug: "operation-blue-wings",
    title: "Operation Blue Wings (Classified)",
    names: "Dilshan & Shenaya",
    date: "Saturday, 14 November 2026",
    location: "Eagles' Lakeside, Attidiya",
    category: "wedding",
    styleType: "top-secret-dossier",
  },

  // 4. Nilame Traditional Kandyan Poruwa (Nethmi & Sanuja)
  {
    id: "4",
    slug: "nilame-traditional",
    title: "Nilame Traditional Kandyan",
    names: "Nethmi & Sanuja",
    date: "Saturday, 12th December 2026",
    location: "Kandy Heritage Poruwa",
    category: "wedding",
    styleType: "nilame-traditional",
  },

  // 5. Velvet Homecoming Dahlia (Amaya & Dinuka)
  {
    id: "5",
    slug: "velvet-homecoming",
    title: "Velvet Homecoming & Butterflies",
    names: "Amaya & Dinuka",
    date: "Sunday, 20 December 2026",
    location: "Water's Edge, Battaramulla",
    category: "homecoming",
    styleType: "velvet-homecoming",
  },

  // 6. Cathedral Palace Doors (Shenali & Rovan)
  {
    id: "6",
    slug: "cathedral-palace-doors",
    title: "Cathedral Palace Doors",
    names: "Shenali & Rovan",
    date: "Wednesday, 28 October 2026",
    location: "St. Andrew's Cathedral",
    category: "wedding",
    styleType: "cathedral-doors",
  },
];

const CATEGORIES = [
  { id: "all", label: "All designs", count: 31 },
  { id: "wedding", label: "Wedding", count: 30 },
  { id: "homecoming", label: "Homecoming", count: 1 },
  { id: "nikah", label: "Nikah", count: 1 },
  { id: "birthday", label: "Birthday", comingSoon: true },
  { id: "save-the-date", label: "Save the Date", comingSoon: true },
  { id: "parties", label: "Parties", comingSoon: true },
  { id: "corporate", label: "Corporate", comingSoon: true },
];

export default function TemplatesPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [activeModal, setActiveModal] = useState<Template | null>(null);

  const filteredTemplates =
    selectedCat === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCat);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-neutral-900 pb-20 font-sans selection:bg-[#fcecef] selection:text-[#d62851]">
      {/* Top Header Matching Screenshot */}
      <header className="border-b bg-white sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
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

        <div className="flex items-center gap-4">
          <Link
            href="/onboard"
            className="px-5 py-2 text-xs font-bold rounded-full bg-[#d62851] hover:bg-[#b81d42] text-white transition shadow-sm cursor-pointer active:scale-95"
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Category Filters (Exact Match to Screenshot) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
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
              {cat.count && (
                <span
                  className={`text-[10px] ${
                    selectedCat === cat.id ? "text-white/80" : "text-neutral-400"
                  }`}
                >
                  {cat.count}
                </span>
              )}
              {cat.comingSoon && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#fcecef] text-[#d62851] font-semibold">
                  Coming soon
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Templates Gallery Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 justify-items-center items-start">
          {filteredTemplates.map((template) => (
            <PhoneCard
              key={template.id}
              template={template}
              onPreview={(t) => setActiveModal(t)}
            />
          ))}
        </div>
      </main>

      {/* Interactive Unboxing Preview Modal */}
      <PreviewModal
        template={activeModal}
        onClose={() => setActiveModal(null)}
      />

      {/* Floating WhatsApp Support Bubble */}
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
