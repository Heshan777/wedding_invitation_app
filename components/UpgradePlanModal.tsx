"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Loader2,
  Users,
  Camera,
  Film,
} from "lucide-react";
import { PLAN_CONFIGS, PlanTier } from "@/lib/plan";
import { BUSINESS_CONFIG } from "@/lib/config";
import { Copy, Building, CreditCard } from "lucide-react";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: PlanTier;
  eventId?: string;
  triggerReason?: "guest_limit" | "photo_upload" | "video_upload" | "general";
  onPlanUpgraded?: (newPlan: PlanTier) => void;
}

export default function UpgradePlanModal({
  isOpen,
  onClose,
  currentPlan = "FREE",
  eventId,
  triggerReason = "general",
  onPlanUpgraded,
}: UpgradePlanModalProps) {
  const [upgradingTo, setUpgradingTo] = useState<PlanTier | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleCopyAccount = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(BUSINESS_CONFIG.bankTransfer.accountNumber);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const getWhatsAppUpgradeLink = (planName?: string) => {
    const text = `Hi WedLink! I would like to activate the ${planName || "Gold"} package for our wedding (Event ID: ${eventId || "my account"}). Here is our bank transfer payment slip:`;
    return `https://wa.me/${BUSINESS_CONFIG.supportPhone}?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  const handleUpgrade = async (plan: PlanTier) => {
    setUpgradingTo(plan);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, plan }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upgrade");
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#ffd700", "#c5a059", "#d62851", "#ffffff"],
        });
      } catch {}

      setSuccessMsg(`Congratulations! Your wedding has been upgraded to ${PLAN_CONFIGS[plan].name}. All limits are now unlocked!`);
      if (onPlanUpgraded) {
        onPlanUpgraded(plan);
      }
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      alert(err.message || "Failed to upgrade plan. Please try again.");
    } finally {
      setUpgradingTo(null);
    }
  };

  const reasonTitles = {
    guest_limit: "Free Plan Limit: 4 Invitation Links Reached",
    photo_upload: "Custom Photo Gallery is a Paid Tier Feature",
    video_upload: "Cinematic Pre-Shoot Video is a Paid Tier Feature",
    general: "Upgrade to a Paid Package to Unlock Full Features",
  };

  const reasonSubtitles = {
    guest_limit: "You've used all 4 free guest links. Upgrade to invite 100+ or unlimited guests with live WhatsApp RSVP tracking and guest headcounts.",
    photo_upload: "On the Free tier, custom gallery photos are locked. Upgrade to Silver, Gold, or Platinum to showcase your high-resolution pre-shoot photoshoot.",
    video_upload: "Pre-shoot video streaming & embed is available on Gold Prestige & Platinum Heritage packages.",
    general: "Choose a one-time Sri Lankan package to publish your wedding invitation and unlock all guest management tools.",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f0e13] border-2 border-[#c5a059]/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white overflow-hidden my-auto">
        {/* Top Gradient Ribbon */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c5a059] via-[#f5d77f] to-[#d62851]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-8 pb-4 text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcecef]/15 border border-[#d62851]/40 text-[#fca5a5] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#ffd700]" />
            <span>{reasonTitles[triggerReason]}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            Select Your Wedding Package
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {reasonSubtitles[triggerReason]}
          </p>

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 text-xs font-medium animate-pulse">
              {successMsg}
            </div>
          )}
        </div>

        {/* Tiers Grid */}
        <div className="px-4 sm:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {/* Plan 1: Silver Royal */}
          <div className="rounded-2xl bg-white/5 border border-white/15 p-5 flex flex-col justify-between hover:border-[#c5a059]/60 transition relative">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block font-bold">
                    STARTER
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">Silver Royal</h4>
                </div>
                <span className="text-xs font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                  100 Guests
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#f5d77f]">රු. 5,000</span>
                <span className="text-[10px] text-gray-400">/ one-time</span>
              </div>

              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Great for intimate weddings and close family celebrations.
              </p>

              <ul className="mt-4 space-y-2 text-[11px] text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Up to 100 Guest Links</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Photo Gallery (Up to 10 photos)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Live RSVP &amp; Guest Count Tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Google Maps Venue Directions</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={upgradingTo !== null || currentPlan === "SILVER"}
              onClick={() => handleUpgrade("SILVER")}
              className={`mt-6 w-full py-2.5 rounded-full font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentPlan === "SILVER"
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white/15 hover:bg-white text-white hover:text-black border border-white/30"
              }`}
            >
              {upgradingTo === "SILVER" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : currentPlan === "SILVER" ? (
                "Current Plan"
              ) : (
                "Select Silver (රු. 5,000)"
              )}
            </button>
          </div>

          {/* Plan 2: Gold Prestige (Most Popular) */}
          <div className="rounded-2xl bg-gradient-to-b from-[#1f171c] to-[#140e13] border-2 border-[#d62851] p-5 flex flex-col justify-between shadow-2xl relative -translate-y-1 sm:-translate-y-2">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d62851] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md">
              ★ MOST POPULAR
            </span>

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#f472b6] block font-bold">
                    RECOMMENDED
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">Gold Prestige</h4>
                </div>
                <span className="text-xs font-bold text-[#ffd700] bg-[#ffd700]/15 px-2 py-0.5 rounded-full border border-[#ffd700]/30">
                  Unlimited
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#ffd700]">රු. 8,500</span>
                <span className="text-[10px] text-gray-400">/ one-time</span>
              </div>

              <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
                Everything for a grand Sri Lankan banquet &amp; homecoming.
              </p>

              <ul className="mt-4 space-y-2 text-[11px] text-gray-200">
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>Unlimited Guest Links</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>2 Invitations (Wedding &amp; Homecoming)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>Full Photo Gallery (50 photos)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>4K Cinematic Pre-Shoot Video Embed</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>WhatsApp 1-Click Bulk Inviter</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>Table &amp; Seating Management</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
                  <span>Bilingual (English &amp; Sinhala)</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={upgradingTo !== null || currentPlan === "GOLD"}
              onClick={() => handleUpgrade("GOLD")}
              className={`mt-6 w-full py-3 rounded-full font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${
                currentPlan === "GOLD"
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-[#d62851] hover:bg-[#b81d42] text-white shadow-[#d62851]/40"
              }`}
            >
              {upgradingTo === "GOLD" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : currentPlan === "GOLD" ? (
                "Current Plan"
              ) : (
                "Upgrade to Gold (රු. 8,500)"
              )}
            </button>
          </div>

          {/* Plan 3: Platinum Heritage */}
          <div className="rounded-2xl bg-white/5 border border-white/15 p-5 flex flex-col justify-between hover:border-[#c5a059]/60 transition relative">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#c5a059] block font-bold">
                    ROYAL VIP
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white">Platinum Heritage</h4>
                </div>
                <span className="text-xs font-bold text-[#c5a059] bg-[#c5a059]/15 px-2 py-0.5 rounded-full border border-[#c5a059]/30">
                  Concierge
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#f5d77f]">රු. 14,500</span>
                <span className="text-[10px] text-gray-400">/ one-time</span>
              </div>

              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Full-service VIP luxury experience with dedicated wedding consultant.
              </p>

              <ul className="mt-4 space-y-2 text-[11px] text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Everything in Gold Prestige</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dedicated Specialist Setup</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Custom Subdomain &amp; QR Cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Uncapped Photos &amp; Video Streams</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              disabled={upgradingTo !== null || currentPlan === "PLATINUM"}
              onClick={() => handleUpgrade("PLATINUM")}
              className={`mt-6 w-full py-2.5 rounded-full font-bold text-xs tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer ${
                currentPlan === "PLATINUM"
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-white/15 hover:bg-white text-white hover:text-black border border-white/30"
              }`}
            >
              {upgradingTo === "PLATINUM" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : currentPlan === "PLATINUM" ? (
                "Current Plan"
              ) : (
                "Select Platinum (රු. 14,500)"
              )}
            </button>
          </div>
        </div>

        {/* Bank Transfer Details Drawer (Sri Lankan Payment Workflow) */}
        <div className="px-6 sm:px-8 pb-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowBankDetails(!showBankDetails)}
                className="flex items-center gap-2 text-xs font-bold text-[#dfba73] hover:text-white transition cursor-pointer"
              >
                <Building className="w-4 h-4" />
                <span>Bank Transfer Details (Commercial / Sampath / FriMi)</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {showBankDetails ? "▲ Hide" : "▼ Click to View Account Details"}
                </span>
              </button>

              <a
                href={getWhatsAppUpgradeLink("Package Upgrade")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-[11px] transition shrink-0"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>Send Slip via WhatsApp</span>
              </a>
            </div>

            {showBankDetails && (
              <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400">Bank: <strong className="text-white">{BUSINESS_CONFIG.bankTransfer.bankName}</strong></div>
                  <div className="text-[11px] text-gray-400">Account Name: <strong className="text-white">{BUSINESS_CONFIG.bankTransfer.accountName}</strong></div>
                  <div className="text-[11px] text-gray-400">Branch: <strong className="text-white">{BUSINESS_CONFIG.bankTransfer.branch}</strong></div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-gray-400 flex items-center gap-2">
                    <span>Account Number:</span>
                    <strong className="text-[#ffd700] font-mono text-sm">{BUSINESS_CONFIG.bankTransfer.accountNumber}</strong>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs transition cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-gray-300" />}
                    </button>
                  </div>
                  {BUSINESS_CONFIG.bankTransfer.frimiOrGenie && (
                    <div className="text-[11px] text-gray-400">FriMi / Genie: <strong className="text-white font-mono">{BUSINESS_CONFIG.bankTransfer.frimiOrGenie}</strong></div>
                  )}
                  <div className="text-[10px] text-amber-300/80 pt-1">
                    * Transfer the fee, take a screenshot of your bank slip, and send it to our WhatsApp for instant activation!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / WhatsApp Concierge Support */}
        <div className="px-6 sm:px-8 py-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
            <span>Bank Transfer & Card Payments Accepted • Fast WhatsApp Activation</span>
          </div>

          <a
            href={getWhatsAppUpgradeLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-[11px] transition"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
            <span>Questions? Chat with Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
