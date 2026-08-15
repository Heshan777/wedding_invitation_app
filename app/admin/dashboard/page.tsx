"use client";

import { useEffect, useState } from "react";

type Guest = {
    id: string;
    token: string;
    displayName: string;
    salutation: string;
    inviteType: "SINGLE" | "COUPLE" | "FAMILY";
    tableNumber: number;
    notes: string | null;
    viewedAt: string | null;
};

const inviteTypeLabels: Record<Guest["inviteType"], string> = {
    SINGLE: "1 Person",
    COUPLE: "2 Persons (Mr & Mrs)",
    FAMILY: "Family",
};

const salutationHints: Record<Guest["inviteType"], string> = {
    SINGLE: "Mr / Mrs / Dr",
    COUPLE: "Mr & Mrs",
    FAMILY: "Mr / Mrs / Dr",
};

type FormState = {
    displayName: string;
    salutation: string;
    inviteType: Guest["inviteType"];
    tableNumber: string;
    notes: string;
};

const emptyForm: FormState = {
    displayName: "",
    salutation: "Mr",
    inviteType: "SINGLE",
    tableNumber: "",
    notes: "",
};

export default function AdminDashboard() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [form, setForm] = useState<FormState>(emptyForm);

    async function loadGuests() {
        setLoading(true);
        const res = await fetch("/api/admin/guests");
        const data = await res.json();
        setGuests(data);
        setLoading(false);
    }

    useEffect(() => {
        loadGuests();
    }, []);

    // Whenever the category changes, suggest a matching salutation —
    // but only if the admin hasn't already typed something custom.
    function handleCategoryChange(newType: Guest["inviteType"]) {
        setForm((prev) => {
            const shouldAutoFill =
                prev.salutation === "" || prev.salutation === "Mr" || prev.salutation === "Mr & Mrs";
            if (!shouldAutoFill) return { ...prev, inviteType: newType };

            const suggestion = newType === "COUPLE" ? "Mr & Mrs" : "Mr";
            return { ...prev, inviteType: newType, salutation: suggestion };
        });
    }

    async function handleAddGuest(e: React.FormEvent) {
        e.preventDefault();

        if (editingId) {
            await fetch(`/api/admin/guests/${editingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            setEditingId(null);
        } else {
            await fetch("/api/admin/guests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
        }

        setForm(emptyForm);
        loadGuests();
    }

    function startEdit(g: Guest) {
        setEditingId(g.id);
        setForm({
            displayName: g.displayName,
            salutation: g.salutation,
            inviteType: g.inviteType,
            tableNumber: String(g.tableNumber),
            notes: g.notes || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function cancelEdit() {
        setEditingId(null);
        setForm(emptyForm);
    }

    async function handleDelete(id: string) {
        if (!confirm("Remove this guest and their invite link?")) return;
        await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
        if (editingId === id) cancelEdit();
        loadGuests();
    }

    function inviteLink(token: string) {
        const base = typeof window !== "undefined" ? window.location.origin : "";
        return `${base}/invite/${token}`;
    }

    async function copyLink(guest: Guest) {
        await navigator.clipboard.writeText(inviteLink(guest.token));
        setCopiedId(guest.id);
        setTimeout(() => setCopiedId(null), 1500);
    }

    function shareLink(guest: Guest) {
        const link = inviteLink(guest.token);
        const text =
            "✨ Together with our families, we, Sandharu & Sanduni, warmly invite you to share in the joy and love of our Homecoming celebration! 💕 Your presence would mean the world to us as we begin this new chapter. 🥂🍾";
        if (navigator.share) {
            navigator.share({ title: "Homecoming Invitation", text, url: link });
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
        }
    }

    async function handleLogout() {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
    }

    return (
        <div className="min-h-screen bg-[#1A181C] text-[#FFF8F0] px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-serif text-[#D4AF37]">Guest & Invitation Management</h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm px-4 py-2 rounded-lg border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10"
                    >
                        Log Out
                    </button>
                </div>

                <form
                    onSubmit={handleAddGuest}
                    className="bg-[#FFF8F0] text-[#1A181C] rounded-2xl p-6 mb-8 grid gap-4 sm:grid-cols-2"
                >
                    {editingId && (
                        <div className="sm:col-span-2 flex items-center justify-between bg-[#D4AF37]/20 rounded-lg px-3 py-2 text-sm">
                            <span>Editing existing guest</span>
                            <button type="button" onClick={cancelEdit} className="underline">
                                Cancel
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm mb-1">Display Name</label>
                        <input
                            required
                            placeholder="e.g. Pradeep Somasiri"
                            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50"
                            value={form.displayName}
                            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Salutation</label>
                        <input
                            required
                            placeholder={salutationHints[form.inviteType]}
                            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50"
                            value={form.salutation}
                            onChange={(e) => setForm({ ...form, salutation: e.target.value })}
                        />
                        {form.inviteType === "COUPLE" && form.salutation !== "Mr & Mrs" && (
                            <p className="text-xs text-[#800020]/70 mt-1">
                                Tip: for a couple invite, this is usually "Mr & Mrs"
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Invite Category</label>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50"
                            value={form.inviteType}
                            onChange={(e) => handleCategoryChange(e.target.value as Guest["inviteType"])}
                        >
                            <option value="SINGLE">1 Person (Mr / Mrs)</option>
                            <option value="COUPLE">2 Persons (Mr & Mrs)</option>
                            <option value="FAMILY">Family</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Table Number</label>
                        <input
                            required
                            type="number"
                            min={1}
                            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50"
                            value={form.tableNumber}
                            onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm mb-1">Notes (Optional, Can only see for admins)</label>
                        <input
                            className="w-full px-3 py-2 rounded-lg border border-[#D4AF37]/50"
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="sm:col-span-2 py-2.5 rounded-lg bg-[#800020] text-[#FFF8F0] font-medium hover:bg-[#5c0017] transition"
                    >
                        {editingId ? "Save Changes" : "+ Add Guest & Generate Invite Link"}
                    </button>
                </form>

                {/* Guest List */}
                <div className="bg-[#FFF8F0] text-[#1A181C] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-3 bg-[#D4AF37]/20 text-sm font-medium">
                        <div>Guest</div>
                        <div>Category</div>
                        <div>Table</div>
                        <div>Actions</div>
                    </div>

                    {loading && <div className="p-4 text-sm">Loading...</div>}
                    {!loading && guests.length === 0 && (
                        <div className="p-4 text-sm text-[#1A181C]/60">No Guests added yet.</div>
                    )}

                    {guests.map((g) => (
                        <div
                            key={g.id}
                            className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-3 border-t border-[#D4AF37]/20 items-center text-sm"
                        >
                            <div>
                                <div className="font-medium">
                                    {g.salutation} {g.displayName}
                                </div>
                                {g.viewedAt && (
                                    <div className="text-xs text-[#800020]/70">
                                        Viewed {new Date(g.viewedAt).toLocaleString()}
                                    </div>
                                )}
                            </div>
                            <div>{inviteTypeLabels[g.inviteType]}</div>
                            <div className="font-semibold">#{g.tableNumber}</div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => startEdit(g)}
                                    className="px-2 py-1 rounded border border-[#1A181C]/30 hover:bg-[#1A181C]/5 text-xs"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => copyLink(g)}
                                    className="px-2 py-1 rounded border border-[#800020]/40 hover:bg-[#800020]/10 text-xs"
                                >
                                    {copiedId === g.id ? "Copied!" : "Copy Link"}
                                </button>
                                <button
                                    onClick={() => shareLink(g)}
                                    className="px-2 py-1 rounded border border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 text-xs"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={() => handleDelete(g.id)}
                                    className="px-2 py-1 rounded border border-red-400 text-red-600 hover:bg-red-50 text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}