"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Eye,
  CheckCircle2,
  Layers,
  ArrowRight,
  Music,
  Compass,
  Palette,
  Crown,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Smartphone,
  Monitor,
  X,
} from "lucide-react";
import {
  INVITATION_TEMPLATES,
  TEMPLATE_LIST,
  InvitationTemplate,
  getTemplatesByCategory,
} from "@/lib/templates";
import RoyalThemeToggle from "@/components/RoyalThemeToggle";

export default function TemplatesCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewModalTemplate, setPreviewModalTemplate] = useState<InvitationTemplate | null>(null);
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("mobile");

  const categories = [
    { id: "all", label: "All Designs" },
    { id: "classic", label: "Classic Royal" },
    { id: "modern", label: "Modern Luxe" },
    { id: "botanical", label: "Garden & Botanical" },
    { id: "celestial", label: "Evening & Celestial" },
  ];

  const filteredTemplates = getTemplatesByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-[#0d090c] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] overflow-x-hidden font-sans">
      {/* Royal Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(128,0,32,0.35)_0%,rgba(15,8,12,0.7)_50%,#090507_100%)]" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle,rgba(223,186,115,0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      {/* Floating Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#140b10]/80 border-b border-[#dfba73]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#800020] to-[#470a16] border border-[#ffd700] flex items-center justify-center shadow-[0_0_12px_rgba(223,186,115,0.4)]">
            <Crown className="w-5 h-5 text-[#ffd700]" />
          </div>
          <div>
            <h1 className="font-cinzel font-bold text-sm sm:text-base text-[#ffd700] tracking-wider">
              Royal Invitation Gallery
            </h1>
            <p className="text-[10px] sm:text-xs text-[#edd892]/70 font-cinzel">
              Handcrafted Interactive Digital Wedding Designs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <RoyalThemeToggle variant="floating" />
          <Link
            href="/admin/login"
            className="btn-gold-shimmer px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition"
          >
            <span>Planner Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#240810]/80 border border-[#dfba73]/40 text-[#ffd700] text-xs font-cinzel font-bold mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-spin-slow" />
          <span>Curated Haute Couture Collection</span>
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-spin-slow" />
        </div>

        <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[#fff8ea] font-normal leading-tight tracking-wide drop-shadow-md max-w-3xl mx-auto">
          Invitations as Unique as Your Love Story
        </h2>

        <p className="mt-4 text-xs sm:text-sm md:text-base text-[#d8c7a2] max-w-2xl mx-auto font-sans leading-relaxed">
          Every template includes our signature 3D wax seal envelope entrance, romantic walk & kiss animation, multilingual support, RSVP manager, and interactive map navigation.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mt-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all cursor-pointer touch-manipulation ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.4)] scale-105"
                  : "bg-[#1f1017]/70 text-[#edd892]/70 hover:text-[#ffd700] hover:bg-[#2e1421]/80 border border-[#dfba73]/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-3xl bg-gradient-to-b from-[#220d16]/90 via-[#190810]/95 to-[#10040a] border border-[#dfba73]/40 p-5 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(223,186,115,0.15)] hover:border-[#ffd700] hover:shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(223,186,115,0.3)] transition-all duration-500 flex flex-col justify-between"
            >
              {/* Corner Filigrees */}
              <div className="absolute top-2.5 left-2.5 text-[#dfba73] text-xs select-none opacity-60">⚜</div>
              <div className="absolute top-2.5 right-2.5 text-[#dfba73] text-xs select-none opacity-60">⚜</div>

              {/* Template Card Top Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase tracking-widest font-cinzel font-bold text-[#dfba73]">
                    {template.categoryLabel}
                  </span>
                  {template.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-cinzel font-bold uppercase tracking-wider bg-gradient-to-r from-[#ffd700] to-[#dfba73] text-[#1a0810] shadow-sm">
                      {template.badge}
                    </span>
                  )}
                </div>

                {/* Aesthetic Visual Preview Banner */}
                <div
                  className={`relative w-full aspect-[16/10] rounded-2xl p-4 overflow-hidden border ${template.styles.envelopeBorder} bg-gradient-to-b ${template.styles.envelopeBoxGradient} shadow-inner flex flex-col items-center justify-center text-center my-3 group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer`}
                  onClick={() => setPreviewModalTemplate(template)}
                >
                  {/* Subtle Inner Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-60"
                    style={{
                      background: `radial-gradient(circle at center, ${template.styles.radialGlow} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Wax Seal Medallion Miniature */}
                  <div
                    className={`relative w-14 h-14 rounded-full flex flex-col items-center justify-center text-center border-2 ${template.styles.waxSealBorder} ${template.styles.waxSealGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    style={{
                      boxShadow: `0 8px 20px rgba(0,0,0,0.7), 0 0 15px ${template.styles.waxSealGlow}`,
                    }}
                  >
                    <span className={`font-cinzel text-xs font-bold ${template.styles.waxSealText}`}>
                      S & S
                    </span>
                    <Heart className="w-2 h-2 text-[#ffd700] fill-[#ffd700]" />
                  </div>

                  {/* Quick Tap Prompt */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs border border-white/20 text-[#fff8ea] text-[9px] font-cinzel font-medium">
                      <Eye className="w-2.5 h-2.5 text-[#ffd700]" />
                      <span>Click to Quick Preview</span>
                    </span>
                  </div>
                </div>

                {/* Template Title & Tagline */}
                <h3 className="font-serif italic text-2xl text-[#fff8ea] font-normal tracking-wide mt-2">
                  {template.name}
                </h3>
                <p className="text-xs text-[#ffd700] font-cinzel font-semibold mt-0.5 tracking-wider">
                  {template.tagline}
                </p>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1.5 my-3">
                  <Palette className="w-3.5 h-3.5 text-[#dfba73] mr-1 flex-shrink-0" />
                  {template.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="group/swatch relative w-4 h-4 rounded-full border border-white/40 shadow-xs cursor-pointer"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.hex})`}
                    />
                  ))}
                </div>

                {/* Description */}
                <p className="text-xs text-[#d8c7a2]/80 leading-relaxed font-sans mt-2">
                  {template.description}
                </p>

                {/* Key Features List */}
                <div className="mt-4 space-y-1.5 pt-3 border-t border-[#dfba73]/20">
                  {template.features.slice(0, 4).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-[#edd892]/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#dfba73]/30 flex flex-col gap-2">
                <Link
                  href={`/templates/${template.id}/preview`}
                  className="btn-gold-shimmer w-full py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full Live Demo</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </Link>

                <Link
                  href={`/admin/dashboard?tab=templates&select=${template.id}`}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#dfba73]/40 text-[#dfba73] hover:text-[#ffd700] text-xs font-cinzel font-semibold tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <span>Select in Planner Dashboard</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Guarantee Callout Banner */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 my-12 text-center">
        <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-[#2a0914]/90 via-[#1c0710]/95 to-[#2a0914]/90 border-2 border-[#dfba73]/50 shadow-2xl">
          <Crown className="w-8 h-8 text-[#ffd700] mx-auto mb-3" />
          <h3 className="font-serif italic text-2xl sm:text-3xl text-[#fff8ea] font-normal">
            Every Template Includes Our Complete Royal Suite
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#dfba73]/90 max-w-xl mx-auto font-sans">
            No matter which aesthetic you choose, your guests will experience interactive wax seal opening, custom music streaming, Google & Apple Maps routing, personalized table seating, and instant RSVP tracking.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/admin/register"
              className="btn-gold-shimmer px-7 py-3 rounded-full font-cinzel text-xs tracking-wider uppercase font-bold shadow-xl hover:scale-105 active:scale-95 transition"
            >
              Create Your Wedding Now
            </Link>
            <Link
              href="/admin/login"
              className="px-6 py-3 rounded-full bg-black/60 hover:bg-black/90 border border-[#dfba73]/50 text-[#dfba73] font-cinzel text-xs tracking-wider uppercase font-semibold transition active:scale-95"
            >
              Sign In to Existing Event
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#dfba73]/30 py-8 px-4 text-center text-xs text-[#dfba73]/60 font-cinzel">
        <p>© 2026 Royal Wedding & Homecoming Invitations. Handcrafted with Sacred Elegance.</p>
      </footer>

      {/* Interactive In-Page Modal Preview */}
      {previewModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-[#140a10] border-2 border-[#dfba73] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#dfba73]/40 bg-[#1c0d17]">
              <div className="flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-[#ffd700]" />
                <span className="font-cinzel font-bold text-sm sm:text-base text-[#ffd700]">
                  {previewModalTemplate.name}
                </span>
                <span className="hidden sm:inline text-xs text-[#dfba73]/70 font-cinzel">
                  • {previewModalTemplate.tagline}
                </span>
              </div>

              {/* Viewport switch & close */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center p-1 rounded-xl bg-black/50 border border-white/20">
                  <button
                    onClick={() => setDeviceView("mobile")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-cinzel flex items-center gap-1 transition ${
                      deviceView === "mobile" ? "bg-[#800020] text-[#ffd700]" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                  <button
                    onClick={() => setDeviceView("desktop")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-cinzel flex items-center gap-1 transition ${
                      deviceView === "desktop" ? "bg-[#800020] text-[#ffd700]" : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                </div>

                <Link
                  href={`/templates/${previewModalTemplate.id}/preview`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-[#dfba73] hover:text-[#ffd700] font-cinzel font-bold"
                >
                  <span>Open Fullscreen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setPreviewModalTemplate(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Live Preview Frame */}
            <div className="flex-1 overflow-auto bg-[#0a0508] p-4 flex items-center justify-center">
              <div
                className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border-2 border-[#dfba73]/50 ${
                  deviceView === "mobile"
                    ? "w-[390px] h-[640px] max-w-full"
                    : "w-full h-[640px]"
                }`}
              >
                <iframe
                  src={`/templates/${previewModalTemplate.id}/preview?embed=true`}
                  className="w-full h-full border-0"
                  title={`${previewModalTemplate.name} Preview`}
                />
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-3 border-t border-[#dfba73]/40 bg-[#1c0d17] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-[#dfba73]" />
                <span className="text-xs text-[#dfba73] font-cinzel font-semibold">Palette:</span>
                <div className="flex items-center gap-1">
                  {previewModalTemplate.palette.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 rounded-full border border-white/30"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/dashboard?tab=templates&select=${previewModalTemplate.id}`}
                  className="btn-gold-shimmer px-5 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider flex items-center gap-1.5 shadow-md"
                >
                  <span>Select this Template in Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
