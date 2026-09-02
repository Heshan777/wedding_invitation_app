"use client";

import { useEffect, useState, useMemo } from "react";
import QRCode from "qrcode";
import {
  Users,
  Eye,
  Table,
  Plus,
  Search,
  Share2,
  Copy,
  Check,
  Edit,
  Trash2,
  Settings,
  QrCode,
  LogOut,
  ExternalLink,
  Sparkles,
  Save,
  Calendar,
  X,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

type Guest = {
  id: string;
  token: string;
  displayName: string;
  salutation: string;
  inviteType: "SINGLE" | "COUPLE" | "FAMILY";
  tableNumber: number;
  notes: string | null;
  viewedAt: string | null;
  createdAt: string;
};

type EventSettings = {
  coupleNames: string;
  hostIntro: string;
  invitationBody: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  musicUrl: string | null;
};

const inviteTypeLabels: Record<Guest["inviteType"], string> = {
  SINGLE: "1 Person",
  COUPLE: "2 Persons (Couple)",
  FAMILY: "Family Group",
};

const salutationHints: Record<Guest["inviteType"], string> = {
  SINGLE: "Mr / Mrs / Ms / Dr",
  COUPLE: "Mr & Mrs",
  FAMILY: "Mr & Mrs / Dr & Family",
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
  const [activeTab, setActiveTab] = useState<"guests" | "settings" | "tables">("guests");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showAddModal, setShowAddModal] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterViewed, setFilterViewed] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"created" | "name" | "table" | "viewed">("created");

  // QR Modal
  const [qrModalGuest, setQrModalGuest] = useState<Guest | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string>("");

  // Event Settings state
  const [settings, setSettings] = useState<EventSettings>({
    coupleNames: "Sandharu & Sanduni",
    hostIntro: "We Pradeep and Lasanthi, with gratitude and joyful hearts, cordially invite",
    invitationBody: "to join us as we welcome our beloved son and his bride...",
    eventDate: "2026-10-04T19:00",
    venueName: "Rose Garden Banquet Hall",
    venueAddress: "93/4, 1st Kilometer Post, Ragama Road, Kadawatha",
    venueLat: 7.0036509,
    venueLng: 79.9426378,
    musicUrl: "/audio/background.mp3",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [resGuests, resSettings] = await Promise.all([
        fetch("/api/admin/guests"),
        fetch("/api/admin/settings"),
      ]);

      if (resGuests.ok) {
        const guestData = await resGuests.json();
        setGuests(Array.isArray(guestData) ? guestData : []);
      }

      if (resSettings.ok) {
        const settingsData = await resSettings.json();
        if (settingsData && settingsData.coupleNames) {
          setSettings({
            ...settingsData,
            eventDate: settingsData.eventDate
              ? new Date(settingsData.eventDate).toISOString().slice(0, 16)
              : "2026-10-04T19:00",
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleCategoryChange(newType: Guest["inviteType"]) {
    setForm((prev) => {
      const suggestion = newType === "COUPLE" ? "Mr & Mrs" : "Mr";
      return { ...prev, inviteType: newType, salutation: suggestion };
    });
  }

  async function handleSaveGuest(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      await fetch(`/api/admin/guests/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("Guest details updated successfully!");
      setEditingId(null);
    } else {
      await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("New guest added and invite link generated!");
    }

    setForm(emptyForm);
    setShowAddModal(false);
    loadData();
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
    setShowAddModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this guest? This will invalidate their link.")) return;
    await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    showToast("Guest removed.");
    loadData();
  }

  function inviteLink(token: string) {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/invite/${token}`;
  }

  async function copyLink(guest: Guest) {
    await navigator.clipboard.writeText(inviteLink(guest.token));
    setCopiedId(guest.id);
    showToast(`Copied invite link for ${guest.displayName}`);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function shareWhatsApp(guest: Guest) {
    const link = inviteLink(guest.token);
    const text = `✨ Warm greetings ${guest.salutation} ${guest.displayName}!\n\nTogether with our families, we, *${settings.coupleNames}*, cordially invite you to celebrate our Homecoming! 🥂🍾\n\nYour reserved seating is *Table #${guest.tableNumber}*.\n\nPlease view your personalized royal invitation here:\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function openQrModal(guest: Guest) {
    setQrModalGuest(guest);
    const link = inviteLink(guest.token);
    const qr = await QRCode.toDataURL(link, { width: 300, margin: 2, color: { dark: "#6b0f24", light: "#ffffff" } });
    setQrModalUrl(qr);
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSettingsSuccess(true);
        showToast("Event settings updated!");
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch {
      showToast("Error updating settings");
    } finally {
      setSavingSettings(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  function handleExportCSV() {
    const headers = ["ID", "Salutation", "Display Name", "Category", "Table Number", "Viewed At", "Notes", "Invite URL"];
    const rows = guests.map((g) => [
      g.id,
      `"${g.salutation}"`,
      `"${g.displayName}"`,
      g.inviteType,
      g.tableNumber,
      g.viewedAt ? new Date(g.viewedAt).toLocaleString() : "Not Viewed",
      `"${(g.notes || "").replace(/"/g, '""')}"`,
      inviteLink(g.token),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Wedding_Guest_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Guest list CSV exported!");
  }

  const stats = useMemo(() => {
    const totalGuests = guests.length;
    let estimatedHeadcount = 0;
    let viewedCount = 0;
    const tableSet = new Set<number>();

    guests.forEach((g) => {
      if (g.inviteType === "SINGLE") estimatedHeadcount += 1;
      else if (g.inviteType === "COUPLE") estimatedHeadcount += 2;
      else if (g.inviteType === "FAMILY") estimatedHeadcount += 4;

      if (g.viewedAt) viewedCount += 1;
      if (g.tableNumber) tableSet.add(g.tableNumber);
    });

    const openRate = totalGuests > 0 ? Math.round((viewedCount / totalGuests) * 100) : 0;

    return {
      totalGuests,
      estimatedHeadcount,
      viewedCount,
      openRate,
      totalTables: tableSet.size,
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests
      .filter((g) => {
        const matchesSearch =
          g.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.salutation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(g.tableNumber).includes(searchQuery) ||
          (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = filterType === "ALL" || g.inviteType === filterType;
        const matchesViewed =
          filterViewed === "ALL" ||
          (filterViewed === "VIEWED" && g.viewedAt !== null) ||
          (filterViewed === "UNVIEWED" && g.viewedAt === null);

        return matchesSearch && matchesType && matchesViewed;
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.displayName.localeCompare(b.displayName);
        if (sortBy === "table") return a.tableNumber - b.tableNumber;
        if (sortBy === "viewed") {
          if (!a.viewedAt) return 1;
          if (!b.viewedAt) return -1;
          return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [guests, searchQuery, filterType, filterViewed, sortBy]);

  return (
    <div className="min-h-screen bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] px-4 py-8">
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#800020] text-[#fdfbf7] text-xs font-cinzel font-semibold shadow-2xl border border-[#dfba73] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#edd892]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Top Executive Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#c5a059]/30 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#dfba73] font-cinzel font-semibold">
                Executive Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#edd892] text-[10px] font-mono border border-[#c5a059]/40">
                Admin Mode
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7] mt-1">
              {settings.coupleNames} — Wedding Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/10 text-xs font-cinzel font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-[#800020]/20 border border-rose-800/60 text-rose-300 hover:bg-rose-950/40 text-xs font-cinzel font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#dfba73] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-cinzel font-semibold">
                Invited Guests
              </span>
              <Users className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              {stats.totalGuests}
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-1 block">
              ~{stats.estimatedHeadcount} Estimated Attendees
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#dfba73] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-cinzel font-semibold">
                Invitation Open Rate
              </span>
              <Eye className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              {stats.openRate}%
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-1 block">
              {stats.viewedCount} of {stats.totalGuests} opened links
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#dfba73] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-cinzel font-semibold">
                Assigned Tables
              </span>
              <Table className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              {stats.totalTables}
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-1 block">
              Seating tables configured
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#dfba73] mb-2">
              <span className="text-[11px] uppercase tracking-wider font-cinzel font-semibold">
                Event Schedule
              </span>
              <Calendar className="w-4 h-4" />
            </div>
            <div className="font-cinzel text-lg font-bold text-[#dfba73] truncate">
              {new Date(settings.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-1 block truncate">
              {settings.venueName}
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#c5a059]/20 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("guests")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === "guests"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Users className="w-4 h-4" /> Guest Directory ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === "settings"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Settings className="w-4 h-4" /> Ceremony & Settings
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeTab === "tables"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Printer className="w-4 h-4" /> Printable Place Cards
          </button>
        </div>

        {/* TAB 1: GUEST DIRECTORY */}
        {activeTab === "guests" && (
          <div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]/60" />
                  <input
                    type="text"
                    placeholder="Search guests by name, table, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="SINGLE">1 Person</option>
                  <option value="COUPLE">Couples</option>
                  <option value="FAMILY">Families</option>
                </select>

                <select
                  value={filterViewed}
                  onChange={(e) => setFilterViewed(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="VIEWED">Opened / Viewed</option>
                  <option value="UNVIEWED">Unopened</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                >
                  <option value="created">Recently Added</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="table">Table Number</option>
                  <option value="viewed">Recently Viewed</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setShowAddModal(true);
                }}
                className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Guest & Generate Link
              </button>
            </div>

            <div className="rounded-2xl bg-[#181216] border border-[#c5a059]/30 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-2 px-4 py-3.5 bg-[#261820] text-xs font-cinzel font-semibold text-[#dfba73] border-b border-[#c5a059]/30">
                <div className="col-span-4 sm:col-span-4">Guest Name & Salutation</div>
                <div className="col-span-2 sm:col-span-2">Category</div>
                <div className="col-span-2 sm:col-span-1">Table</div>
                <div className="col-span-2 sm:col-span-2 hidden sm:block">Status</div>
                <div className="col-span-4 sm:col-span-3 text-right">Actions</div>
              </div>

              {loading && (
                <div className="p-8 text-center text-xs font-cinzel text-[#dfba73]">
                  Loading guest records...
                </div>
              )}

              {!loading && filteredGuests.length === 0 && (
                <div className="p-12 text-center text-xs text-[#fdfbf7]/50 font-sans">
                  No guest records found matching your filters.
                </div>
              )}

              <div className="divide-y divide-[#c5a059]/15">
                {filteredGuests.map((g) => (
                  <div
                    key={g.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center text-xs hover:bg-[#c5a059]/5 transition"
                  >
                    <div className="col-span-4 sm:col-span-4">
                      <div className="font-cinzel font-bold text-[#fdfbf7] text-sm">
                        {g.salutation} {g.displayName}
                      </div>
                      {g.notes && (
                        <div className="text-[11px] text-[#edd892]/80 mt-0.5 font-sans truncate max-w-xs">
                          {g.notes}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 sm:col-span-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#c5a059]/15 text-[#dfba73] text-[10px] font-cinzel font-semibold">
                        {inviteTypeLabels[g.inviteType]}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="font-cinzel font-bold text-sm text-[#dfba73]">
                        #{g.tableNumber}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-2 hidden sm:block">
                      {g.viewedAt ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Viewed {new Date(g.viewedAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-[#fdfbf7]/40 text-[11px]">Unopened</span>
                      )}
                    </div>

                    <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openQrModal(g)}
                        title="View VIP QR Code"
                        className="p-1.5 rounded-lg bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 transition cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyLink(g)}
                        title="Copy Invitation Link"
                        className="p-1.5 rounded-lg bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 transition cursor-pointer"
                      >
                        {copiedId === g.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => shareWhatsApp(g)}
                        title="Share via WhatsApp"
                        className="p-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/50 text-emerald-400 hover:bg-[#25D366]/30 transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={inviteLink(g.token)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview Guest Invite"
                        className="p-1.5 rounded-lg bg-[#231a20] border border-[#c5a059]/40 text-[#edd892] hover:bg-[#c5a059]/20 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => startEdit(g)}
                        title="Edit Guest"
                        className="p-1.5 rounded-lg bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        title="Delete Guest"
                        className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CEREMONY & SETTINGS */}
        {activeTab === "settings" && (
          <div className="rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-6 sm:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="font-cinzel text-xl font-bold text-[#dfba73]">
                Event & Ceremony Settings
              </h2>
              <p className="text-xs text-[#fdfbf7]/60 font-sans mt-1">
                Customize wedding details, venue coordinates, and invitation wording in real-time.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Couple Names
                  </label>
                  <input
                    required
                    value={settings.coupleNames}
                    onChange={(e) => setSettings({ ...settings, coupleNames: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Event Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={settings.eventDate}
                    onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Host Introduction
                </label>
                <textarea
                  rows={2}
                  value={settings.hostIntro}
                  onChange={(e) => setSettings({ ...settings, hostIntro: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Invitation Story / Message
                </label>
                <textarea
                  rows={2}
                  value={settings.invitationBody}
                  onChange={(e) => setSettings({ ...settings, invitationBody: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Venue Name
                  </label>
                  <input
                    required
                    value={settings.venueName}
                    onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Venue Address
                  </label>
                  <input
                    required
                    value={settings.venueAddress}
                    onChange={(e) => setSettings({ ...settings, venueAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={settings.venueLat}
                    onChange={(e) => setSettings({ ...settings, venueLat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={settings.venueLng}
                    onChange={(e) => setSettings({ ...settings, venueLng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Music Audio URL
                  </label>
                  <input
                    value={settings.musicUrl || ""}
                    onChange={(e) => setSettings({ ...settings, musicUrl: e.target.value })}
                    placeholder="/audio/background.mp3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-gold-shimmer px-6 py-3 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {savingSettings ? "Saving..." : "Save Event Settings"}
                </button>
                {settingsSuccess && (
                  <span className="text-xs text-emerald-400 font-cinzel flex items-center gap-1">
                    <Check className="w-4 h-4" /> Changes saved successfully!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: PRINTABLE PLACE CARDS */}
        {activeTab === "tables" && (
          <div className="rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-[#dfba73]">
                  Table Seating Place Cards
                </h2>
                <p className="text-xs text-[#fdfbf7]/60 font-sans mt-1">
                  Ready-to-print luxury guest table cards for banquet place settings.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Cards
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-2xl bg-[#fffdfa] text-[#1a1517] border-2 border-[#c5a059] shadow-lg text-center relative overflow-hidden"
                >
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-cinzel font-semibold mb-1">
                    {settings.coupleNames}
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#1a1517]">
                    {g.salutation} {g.displayName}
                  </h3>
                  <div className="my-2 inline-block px-4 py-1 rounded-xl bg-[#800020] text-[#fdfbf7] font-cinzel font-bold text-sm shadow">
                    Table #{String(g.tableNumber).padStart(2, "0")}
                  </div>
                  <p className="text-[10px] text-[#5a483e] font-sans">
                    {inviteTypeLabels[g.inviteType]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD / EDIT GUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingId(null);
              }}
              className="absolute top-5 right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-cinzel text-xl font-bold text-[#dfba73] mb-1">
              {editingId ? "Edit Guest Details" : "Add New Guest"}
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-6">
              Generate a unique luxury invite link and assign table seating.
            </p>

            <form onSubmit={handleSaveGuest} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Full Display Name
                </label>
                <input
                  required
                  placeholder="e.g. Pradeep Somasiri"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Invite Category
                  </label>
                  <select
                    value={form.inviteType}
                    onChange={(e) => handleCategoryChange(e.target.value as Guest["inviteType"])}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                  >
                    <option value="SINGLE">1 Person (Single)</option>
                    <option value="COUPLE">2 Persons (Couple)</option>
                    <option value="FAMILY">Family Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Salutation
                  </label>
                  <input
                    required
                    placeholder={salutationHints[form.inviteType]}
                    value={form.salutation}
                    onChange={(e) => setForm({ ...form, salutation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Table Number
                </label>
                <input
                  required
                  type="number"
                  min={1}
                  placeholder="e.g. 5"
                  value={form.tableNumber}
                  onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Admin Notes (Optional)
                </label>
                <input
                  placeholder="e.g. Family elder / Vegetarian meal preference"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg cursor-pointer"
                >
                  {editingId ? "Save Changes" : "Create Guest & Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE PREVIEW MODAL */}
      {qrModalGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 text-center shadow-2xl">
            <button
              onClick={() => setQrModalGuest(null)}
              className="absolute top-4 right-4 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5" /> VIP Check-in Pass
            </div>

            <h3 className="font-cinzel text-lg font-bold text-[#fdfbf7]">
              {qrModalGuest.salutation} {qrModalGuest.displayName}
            </h3>
            <p className="text-xs text-[#dfba73] font-cinzel font-semibold mt-0.5">
              Table #{qrModalGuest.tableNumber} • {inviteTypeLabels[qrModalGuest.inviteType]}
            </p>

            {qrModalUrl && (
              <div className="my-5 p-3 bg-white rounded-2xl inline-block border border-[#c5a059]">
                <img src={qrModalUrl} alt="Guest QR" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <p className="text-[11px] text-[#fdfbf7]/60 mb-4 font-sans">
              Scan this QR code to view the personalized invitation.
            </p>

            <button
              onClick={() => copyLink(qrModalGuest)}
              className="w-full py-2.5 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Invite URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}