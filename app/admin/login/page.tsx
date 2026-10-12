"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, User, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import RoyalThemeToggle from "@/components/RoyalThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      setLoading(false);

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        const displayError = data.details
          ? `${data.error || "Authentication error"}: ${data.details}`
          : (data.error || "Invalid username or password");
        setError(displayError);
      }
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white text-[#111827] px-3 sm:px-4 py-8 sm:py-12 overflow-hidden selection:bg-[#fcecef] selection:text-[#d62851]">
      {/* Background soft ambient radial glow matching invitation.lk */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f3] via-[#ffffff] to-[#ffffff] -z-10" />

      <div className="relative z-10 w-full max-w-md">
        {/* Clean Modern Login Card */}
        <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-xl shadow-rose-950/5">
          {/* Header Logo */}
          <div className="text-center mb-6 flex flex-col items-center">
            <Link href="/" className="inline-block group mb-3">
              <div className="relative h-12 w-48 overflow-hidden group-hover:scale-105 transition">
                <Image
                  src="/images/wedlink-logo.png"
                  alt="WedLink.lk"
                  fill
                  priority
                  sizes="192px"
                  className="object-contain"
                />
              </div>
            </Link>
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Executive Portal
            </h1>
            <p className="text-xs text-[#6b7280] font-medium mt-1">
              Wedding Invitation Management
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] transition shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9ca3af] hover:text-[#111827] cursor-pointer min-w-[40px] min-h-[40px] justify-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#d62851] hover:bg-[#b81d42] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#d62851]/25 disabled:opacity-50 cursor-pointer min-h-[44px] transition active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="text-center mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-[#6b7280] font-sans mb-2">
              Need an account for your events company?
            </p>
            <a
              href="/admin/register"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#d62851] hover:underline min-h-[38px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d62851]" />
              Create Event Manager Account
            </a>
            <p className="text-[11px] text-[#9ca3af] font-sans mt-3">
              Protected &amp; encrypted multi-tenant session management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
