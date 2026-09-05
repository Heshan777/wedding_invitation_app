"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Lock, Eye, EyeOff, Sparkles, KeyRound, AlertCircle, ArrowRight } from "lucide-react";

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
        const data = await res.json();
        setError(data.error || "Invalid username or password");
      }
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  // Helper function to fill default admin credentials in 1 click
  function handleFillDefaults() {
    setUsername("admin");
    setPassword("admin");
    setError("");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#121013] text-[#fdfbf7] px-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#800020]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Luxury Glassmorphism Login Card */}
        <div className="rounded-3xl bg-[#1a1519]/90 border border-[#c5a059]/40 p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_30px_rgba(197,160,89,0.15)] backdrop-blur-xl">
          {/* Header Monogram / Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800020] to-[#4a0013] border border-[#dfba73]/50 shadow-lg mb-3">
              <ShieldCheck className="w-7 h-7 text-[#dfba73]" />
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-wide">
              Executive Portal
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#dfba73] font-cinzel font-semibold mt-1">
              Wedding Invitation Management
            </p>
          </div>

          {/* Quick Default Fill Helper Banner */}
          <div className="mb-6 p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#dfba73]" />
              <div className="text-left">
                <span className="text-[11px] font-cinzel font-bold text-[#dfba73] block">
                  Default Credentials
                </span>
                <span className="text-[10px] text-[#fdfbf7]/70 font-mono">
                  admin / admin
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDefaults}
              className="px-3 py-1.5 rounded-lg bg-[#c5a059]/20 hover:bg-[#c5a059]/30 text-[#edd892] text-xs font-cinzel font-semibold border border-[#c5a059]/50 transition cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Auto-Fill
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 text-xs text-rose-200 bg-rose-950/70 border border-rose-800/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#c5a059]/70 hover:text-[#dfba73] cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl btn-gold-shimmer text-xs uppercase tracking-[0.15em] font-cinzel font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#121013] border-t-transparent rounded-full animate-spin" />
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
          <div className="text-center mt-5 pt-4 border-t border-[#c5a059]/20">
            <p className="text-xs text-[#edd892]/70 font-sans mb-2">
              Need an account for your events company?
            </p>
            <a
              href="/admin/register"
              className="inline-flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#ffd700] hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              Create Event Manager Account
            </a>
            <p className="text-[10px] text-[#fdfbf7]/40 font-sans mt-3">
              Protected & encrypted multi-tenant session management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
