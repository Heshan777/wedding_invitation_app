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
import RoyalThemeToggle from "@/components/RoyalThemeToggle";

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
    <div className="relative min-h-screen flex items-center justify-center bg-white text-[#111827] px-3 sm:px-4 py-8 sm:py-12 overflow-hidden selection:bg-[#fcecef] selection:text-[#d62851]">
      {/* Ambient background glow matching invitation.lk */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f3] via-[#ffffff] to-[#ffffff] -z-10" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-3xl bg-white border border-gray-100 p-6 sm:p-10 shadow-xl shadow-rose-950/5">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fcecef] text-[#d62851] shadow-sm mb-3">
              <Crown className="w-7 h-7 text-[#d62851]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Event Manager Signup
            </h1>
            <p className="text-xs text-[#6b7280] font-medium mt-1">
              Create Your Digital Wedding Suite
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Manager Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Perera"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Company / Brand
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Royal Celebrations"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Username *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <span className="text-xs font-bold text-[#d62851]">@</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. royalplanner"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="planner@events.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9ca3af] hover:text-[#111827]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = formData.password.length >= 12 ? 4 : formData.password.length >= 10 ? 3 : formData.password.length >= 8 ? 2 : formData.password.length >= 4 ? 1 : 0;
                        return (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= strength
                                ? strength >= 4 ? 'bg-emerald-500' : strength >= 3 ? 'bg-[#d62851]' : strength >= 2 ? 'bg-amber-500' : 'bg-rose-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className={`text-[10px] mt-0.5 font-semibold ${
                      formData.password.length >= 12 ? 'text-emerald-600' : formData.password.length >= 10 ? 'text-[#d62851]' : formData.password.length >= 8 ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {formData.password.length >= 12 ? '✦ Highly Secure' : formData.password.length >= 10 ? '◇ Strong' : formData.password.length >= 8 ? '◈ Acceptable' : '⚠ Too Short (min 8)'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9ca3af]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-[#111827] placeholder-gray-400 focus:outline-none focus:border-[#d62851] focus:ring-2 focus:ring-[#fcecef] shadow-sm transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-[#d62851] hover:bg-[#b81d42] text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-[#d62851]/25 disabled:opacity-50 cursor-pointer min-h-[44px] transition active:scale-98"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account &amp; Launch Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-[#6b7280] font-sans">
              Already have an Event Manager account?{" "}
              <Link
                href="/admin/login"
                className="text-[#d62851] font-semibold hover:underline ml-1 inline-block py-1"
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
