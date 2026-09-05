"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  User,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Crown,
} from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Failed to create account");
      }
    } catch {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#121013] text-[#fdfbf7] px-4 py-12 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#800020]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl bg-[#1a1519]/95 border border-[#c5a059]/40 p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(197,160,89,0.15)] backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#800020] to-[#4a0013] border border-[#dfba73]/50 shadow-lg mb-3">
              <Crown className="w-7 h-7 text-[#ffd700]" />
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7] tracking-wide">
              Event Manager Signup
            </h1>
            <p className="text-xs uppercase tracking-[0.25em] text-[#dfba73] font-cinzel font-semibold mt-1">
              Create Your Digital Wedding Suite
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 text-xs text-rose-200 bg-rose-950/70 border border-rose-800/80 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Manager Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Johnathan Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Company / Brand
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Silva Celebrations"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <span className="text-xs font-bold text-[#c5a059]">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. silvaevents"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="planner@events.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 4 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#c5a059]/70 hover:text-[#dfba73]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c5a059]/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#231a20]/90 border border-[#c5a059]/40 text-sm text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl btn-gold-shimmer text-xs uppercase tracking-[0.15em] font-cinzel font-bold flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#121013] border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account & Launch Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 pt-4 border-t border-[#c5a059]/20">
            <p className="text-xs text-[#edd892]/70 font-sans">
              Already have an Event Manager account?{" "}
              <Link
                href="/admin/login"
                className="text-[#ffd700] font-cinzel font-bold hover:underline ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
