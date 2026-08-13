"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({ username, password }),
        });

        setLoading(false);

        if (res.ok) {
            router.push("/admin/dashboard");
            router.refresh();
        } else {
            const data = await res.json();
            setError(data.error || "Loading failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A181C] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#FFF8F0] rounded-2xl p-8 shadow-2xl border border-[#D4AF37]/40"
      >
        <h1 className="text-2xl font-serif text-[#800020] mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-[#1A181C]/60 text-center mb-6">Homecoming Invitation Manager</p>

        {error && (
          <div className="mb-4 text-sm text-[#800020] bg-[#800020]/10 border border-[#800020]/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <label className="block text-sm text-[#1A181C] mb-1">Username</label>
        <input
          className="w-full mb-4 px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block text-sm text-[#1A181C] mb-1">Password</label>
        <input
          type="password"
          className="w-full mb-6 px-3 py-2 rounded-lg border border-[#D4AF37]/50 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-[#800020] text-[#FFF8F0] font-medium hover:bg-[#5c0017] transition disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
    );
}