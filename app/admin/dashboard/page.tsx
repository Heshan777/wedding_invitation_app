"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
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
  Camera,
  Image as ImageIcon,
  Download,
  Send,
  MessageSquare,
  Clock,
  Utensils,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Phone,
  Upload,
  FolderUp,
  Loader2,
  Heart,
  Film,
  Video,
  Play,
  Crown,
  Layers,
  FolderPlus,
  Tag,
  Link2,
} from "lucide-react";

export type WeddingEventItem = {
  id: string;
  slug: string;
  coupleNames: string;
  eventDate: string;
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  contactPhone?: string | null;
  heroImageUrl?: string | null;
  heroVideoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  welcomeImageUrl?: string | null;
  placeCardImageUrl?: string | null;
  blessingImageUrl?: string | null;
  musicUrl?: string | null;
  dressCodeTitle?: string | null;
  dressCodeDescription?: string | null;
  timelineJson?: string | null;
  _count?: {
    guests: number;
    photos: number;
    tables: number;
    wishes: number;
  };
};

export type EventPhotoItem = {
  id: string;
  eventId: string;
  url: string;
  title?: string | null;
  subtitle?: string | null;
  tag?: string | null;
  order: number;
  createdAt: string;
};

export type ManagerProfile = {
  id: string;
  username: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  role: string;
};

type Guest = {
  id: string;
  token: string;
  displayName: string;
  salutation: string;
  inviteType: "SINGLE" | "COUPLE" | "FAMILY";
  tableNumber: number;
  phone: string | null;
  rsvpStatus: "PENDING" | "ATTENDING" | "DECLINED" | null;
  attendeeCount: number | null;
  dietary: string | null;
  rsvpMessage: string | null;
  notes: string | null;
  viewedAt: string | null;
  rsvpSubmittedAt: string | null;
  createdAt: string;
};

type GalleryItem = {
  src: string;
  title: string;
  subtitle: string;
  tag: string;
};

type TimelineEvent = {
  time: string;
  title: string;
  desc: string;
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
  heroImageUrl?: string | null;
  heroVideoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  galleryJson?: string | null;
  blessingImageUrl?: string | null;
  welcomeImageUrl?: string | null;
  placeCardImageUrl?: string | null;
  placeCardNote?: string | null;
  musicUrl?: string | null;
  dressCodeTitle?: string | null;
  dressCodeDescription?: string | null;
  timelineJson?: string | null;
  contactPhone?: string | null;
};

const DEFAULT_TIMELINE: TimelineEvent[] = [
  { time: "05:30 PM", title: "Sacred Poruwa Blessing Ceremony", desc: "Traditional auspicious customs & cultural blessings" },
  { time: "06:45 PM", title: "Grand Couple Entrance & Toast", desc: "Welcoming the newly weds with fireworks & champagne" },
  { time: "07:30 PM", title: "Royal Banquet Dinner", desc: "Lavish multi-cuisine dining with live acoustic music" },
  { time: "09:00 PM", title: "First Dance & Celebrations", desc: "Cake cutting, dancing & joyful festivities" },
];


const DEFAULT_GALLERY: GalleryItem[] = [
  {
    src: "/uploads/preshoot-photo-OIP1-1788547193363-824.webp",
    title: "A Timeless Bond",
    subtitle: "Two souls, one sacred journey under the stars",
    tag: "Pre-Wedding Shoot",
  },
  {
    src: "/uploads/preshoot-photo-OIP-1788547202839-374.webp",
    title: "Golden Hour Romance",
    subtitle: "Embracing a lifetime of love and shared dreams",
    tag: "Tender Moments",
  },
  {
    src: "/uploads/preshoot-photo-59eb71b052447c093b9c-1788547231474-321.jpg",
    title: "Walking into Forever",
    subtitle: "Hand in hand towards a bright new chapter",
    tag: "Celebration",
  },
  {
    src: "/uploads/preshoot-photo-pre-wedding-shoot-gu-1788547212295-734.jpg",
    title: "The Sacred Promise",
    subtitle: "Tokens of love and eternal devotion",
    tag: "Wedding Rings",
  },
];

const PHOTO_PRESETS = [
  { label: "Hero Portrait", url: "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg" },
  { label: "Warm Welcome", url: "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg" },
  { label: "Banquet Place Card", url: "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg" },
  { label: "Blessing Cameo", url: "/uploads/preshoot-photo-OIP2-1788547184704-193.webp" },
  { label: "Gallery Photo 1", url: "/uploads/preshoot-photo-OIP1-1788547193363-824.webp" },
  { label: "Gallery Photo 2", url: "/uploads/preshoot-photo-OIP-1788547202839-374.webp" },
  { label: "Gallery Photo 3", url: "/uploads/preshoot-photo-59eb71b052447c093b9c-1788547231474-321.jpg" },
  { label: "Gallery Photo 4", url: "/uploads/preshoot-photo-pre-wedding-shoot-gu-1788547212295-734.jpg" },
];



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
  phone: string;
  dietary: string;
  rsvpStatus: "PENDING" | "ATTENDING" | "DECLINED";
  attendeeCount: string;
  notes: string;
};

const emptyForm: FormState = {
  displayName: "",
  salutation: "Mr & Mrs",
  inviteType: "COUPLE",
  tableNumber: "",
  phone: "",
  dietary: "NONE",
  rsvpStatus: "PENDING",
  attendeeCount: "2",
  notes: "",
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"guests" | "photos" | "settings" | "tables" | "events">("guests");
  const [manager, setManager] = useState<ManagerProfile | null>(null);
  const [events, setEvents] = useState<WeddingEventItem[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>("");
  const [eventPhotos, setEventPhotos] = useState<EventPhotoItem[]>([]);

  // Create Wedding Modal
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    coupleNames: "",
    eventDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    venueName: "",
    venueAddress: "",
    slug: "",
    contactPhone: "",
  });
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Add Photo Modal
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhotoForm, setNewPhotoForm] = useState({
    url: "",
    title: "",
    subtitle: "",
    tag: "Pre-Wedding",
  });
  const [addingPhoto, setAddingPhoto] = useState(false);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showAddModal, setShowAddModal] = useState(false);

  // Bulk Import Modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState("");
  const [bulkImporting, setBulkImporting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterRsvp, setFilterRsvp] = useState<string>("ALL");
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
    heroImageUrl: "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg",

    galleryJson: JSON.stringify(DEFAULT_GALLERY),
    blessingImageUrl: "/uploads/preshoot-photo-OIP2-1788547184704-193.webp",
    welcomeImageUrl: "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg",
    placeCardImageUrl: "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg",
    placeCardNote: "Thank you for sharing our joy and celebrating with us!",

    musicUrl: "/audio/background.mp3",
    dressCodeTitle: "Royal Splendor & Black Tie",
    dressCodeDescription: "Traditional Sri Lankan elegance or formal evening attire in warm tones of gold, burgundy, and ivory.",
    timelineJson: JSON.stringify(DEFAULT_TIMELINE),
    contactPhone: "+94 77 123 4567",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Place Card Designer states
  const [placeCardLayout, setPlaceCardLayout] = useState<"cameo" | "banner" | "side" | "minimal">("cameo");
  const [showQrOnCards, setShowQrOnCards] = useState(true);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === activeEventId) || events[0] || null;
  }, [events, activeEventId]);

  const dashboardMonogram = useMemo(() => {
    const parts = (settings.coupleNames || "").split(/&|and|\+/i).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]?.toUpperCase() || "S"} & ${parts[1][0]?.toUpperCase() || "S"}`;
    }
    const words = (settings.coupleNames || "").trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]?.toUpperCase() || "S"} & ${words[words.length - 1][0]?.toUpperCase() || "S"}`;
    }
    return (settings.coupleNames || "").slice(0, 2).toUpperCase() || "S & S";
  }, [settings.coupleNames]);

  const galleryList: GalleryItem[] = useMemo(() => {
    if (settings.galleryJson) {
      try {
        const parsed = JSON.parse(settings.galleryJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_GALLERY;
  }, [settings.galleryJson]);

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    const updated = [...galleryList];
    if (!updated[index]) {
      updated[index] = { ...DEFAULT_GALLERY[index % DEFAULT_GALLERY.length] };
    }
    updated[index] = { ...updated[index], [field]: value };
    setSettings((prev) => ({
      ...prev,
      galleryJson: JSON.stringify(updated),
    }));
  };

  const timelineList: TimelineEvent[] = useMemo(() => {
    if (settings.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return DEFAULT_TIMELINE;
  }, [settings.timelineJson]);

  const updateTimelineItem = (index: number, field: keyof TimelineEvent, value: string) => {
    const updated = [...timelineList];
    if (!updated[index]) {
      updated[index] = { ...DEFAULT_TIMELINE[index % DEFAULT_TIMELINE.length] };
    }
    updated[index] = { ...updated[index], [field]: value };
    setSettings((prev) => ({
      ...prev,
      timelineJson: JSON.stringify(updated),
    }));
  };

  const addTimelineItem = () => {
    const updated = [...timelineList, { time: "08:00 PM", title: "New Celebration Moment", desc: "Description of event" }];
    setSettings((prev) => ({
      ...prev,
      timelineJson: JSON.stringify(updated),
    }));
  };

  const removeTimelineItem = (index: number) => {
    const updated = timelineList.filter((_, i) => i !== index);
    setSettings((prev) => ({
      ...prev,
      timelineJson: JSON.stringify(updated),
    }));
  };

  // RSVP & Headcount Statistics
  const rsvpStats = useMemo(() => {
    const totalInvited = guests.length;
    const attending = guests.filter((g) => g.rsvpStatus === "ATTENDING");
    const declined = guests.filter((g) => g.rsvpStatus === "DECLINED");
    const pending = guests.filter((g) => !g.rsvpStatus || g.rsvpStatus === "PENDING");
    const totalHeadcount = attending.reduce(
      (acc, g) => acc + (g.attendeeCount || (g.inviteType === "COUPLE" ? 2 : g.inviteType === "FAMILY" ? 4 : 1)),
      0
    );

    const dietaryCounts: Record<string, number> = {};
    attending.forEach((g) => {
      const diet = g.dietary || "NONE";
      dietaryCounts[diet] = (dietaryCounts[diet] || 0) + (g.attendeeCount || 1);
    });

    return {
      totalInvited,
      attendingCount: attending.length,
      declinedCount: declined.length,
      pendingCount: pending.length,
      totalHeadcount,
      dietaryCounts,
    };
  }, [guests]);

  // Export to CSV
  function handleExportCSV() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const headers = [
      "Salutation",
      "Full Name",
      "Category",
      "Table Number",
      "Phone",
      "RSVP Status",
      "Headcount",
      "Dietary",
      "Wishes/Message",
      "Invite Link",
    ];

    const rows = guests.map((g) => [
      `"${g.salutation}"`,
      `"${g.displayName}"`,
      `"${g.inviteType}"`,
      g.tableNumber,
      `"${g.phone || ""}"`,
      `"${g.rsvpStatus || "PENDING"}"`,
      g.rsvpStatus === "ATTENDING" ? g.attendeeCount || 1 : 0,
      `"${g.dietary || "NONE"}"`,
      `"${(g.rsvpMessage || "").replace(/"/g, '""')}"`,
      `"${origin}/invite/${g.token}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Wedding_Guests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Guest list exported to CSV successfully!");
  }

  // 1-Click WhatsApp Invitation Dispatcher
  function handleSendWhatsApp(g: Guest) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${origin}/invite/${g.token}`;
    const salutationName = `${g.salutation} ${g.displayName}`.trim();
    const formattedDate = new Date(settings.eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const text = `✨ *ROYAL WEDDING INVITATION* ✨\n\nDear *${salutationName}*,\n\nWe warmly invite you to celebrate the joyous Homecoming of *${settings.coupleNames}*! 🥂🍾\n\n📅 *Date:* ${formattedDate}\n📍 *Venue:* ${settings.venueName}\n🍽 *Reserved Table:* Table #${String(g.tableNumber).padStart(2, "0")}\n\n👉 *View Your Personalized Luxury Invitation & RSVP:* \n${link}\n\nWe look forward to celebrating together! 💖`;

    const phoneClean = g.phone ? g.phone.replace(/[^0-9]/g, "") : "";
    const waUrl = phoneClean
      ? `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
  }

  // Bulk Import CSV submit
  async function handleBulkImportSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bulkCsvText.trim()) return;
    setBulkImporting(true);

    try {
      const lines = bulkCsvText.trim().split(/\r?\n/).filter(Boolean);
      const parsedGuests = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (i === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("salutation"))) {
          continue;
        }

        const parts = line.split(",").map((s) => s.replace(/^["']|["']$/g, "").trim());
        if (parts.length < 2) continue;

        let salutation = "Mr & Mrs";
        let displayName = "";
        let inviteType: Guest["inviteType"] = "COUPLE";
        let tableNumber = 1;
        let phone = "";
        let notes = "";

        if (parts.length === 2) {
          displayName = parts[0];
          tableNumber = Number(parts[1]) || 1;
        } else if (parts.length >= 3) {
          salutation = parts[0] || "Mr & Mrs";
          displayName = parts[1];
          const typeCandidate = parts[2]?.toUpperCase();
          if (["SINGLE", "COUPLE", "FAMILY"].includes(typeCandidate)) {
            inviteType = typeCandidate as any;
          }
          if (parts[3]) tableNumber = Number(parts[3]) || 1;
          if (parts[4]) phone = parts[4];
          if (parts[5]) notes = parts[5];
        }

        if (displayName) {
          parsedGuests.push({
            salutation,
            displayName,
            inviteType,
            tableNumber,
            phone: phone || null,
            notes: notes || null,
          });
        }
      }

      if (parsedGuests.length === 0) {
        alert("No valid guest rows found. Format: Salutation, Full Name, Category, Table Number, Phone");
        setBulkImporting(false);
        return;
      }

      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bulk", guests: parsedGuests }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Bulk import failed");
      }

      setShowBulkModal(false);
      setBulkCsvText("");
      showToast(`Successfully imported ${parsedGuests.length} guests!`);
      loadData();
    } catch (err: any) {
      alert(err.message || "Failed to import guests");
    } finally {
      setBulkImporting(false);
    }
  }



  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    onSuccess: (url: string) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onSuccess(data.url);
      const isVid = file.type.startsWith("video/") || file.name.match(/\.(mp4|mov|webm)$/i);
      showToast(isVid ? "Pre-shoot video uploaded successfully!" : "Pre-shoot photo uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to upload media file");
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }

  }


  async function loadData(targetEventId?: string) {
    setLoading(true);
    try {
      // 1. Fetch manager profile & events list
      const resEvents = await fetch("/api/admin/events");
      if (resEvents.ok) {
        const data = await resEvents.json();
        setManager(data.manager || null);
        const evList: WeddingEventItem[] = data.events || [];
        setEvents(evList);

        // Determine which event is active
        let selectedId = targetEventId || activeEventId;
        if (!selectedId && typeof window !== "undefined") {
          selectedId = localStorage.getItem("active_wedding_event_id") || "";
        }
        if (!selectedId || !evList.some((e) => e.id === selectedId)) {
          selectedId = evList[0]?.id || "";
        }
        setActiveEventId(selectedId);
        if (typeof window !== "undefined" && selectedId) {
          localStorage.setItem("active_wedding_event_id", selectedId);
        }

        // 2. Fetch scoped guests, settings, and photos for selected event
        if (selectedId) {
          const [resGuests, resSettings, resPhotos] = await Promise.all([
            fetch(`/api/admin/guests?eventId=${selectedId}`),
            fetch(`/api/admin/settings?eventId=${selectedId}`),
            fetch(`/api/admin/photos?eventId=${selectedId}`),
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

          if (resPhotos.ok) {
            const photosData = await resPhotos.json();
            setEventPhotos(photosData.photos || []);
          }
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

  function handleSelectEvent(newEventId: string) {
    setActiveEventId(newEventId);
    if (typeof window !== "undefined") {
      localStorage.setItem("active_wedding_event_id", newEventId);
    }
    loadData(newEventId);
    showToast("Switched wedding event!");
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!newEventForm.coupleNames || !newEventForm.venueName) return;
    setCreatingEvent(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEventForm),
      });
      if (res.ok) {
        const data = await res.json();
        showToast(`Wedding event created for ${newEventForm.coupleNames}!`);
        setShowCreateEventModal(false);
        setNewEventForm({
          coupleNames: "",
          eventDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16),
          venueName: "",
          venueAddress: "",
          slug: "",
          contactPhone: "",
        });
        loadData(data.event?.id);
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create event");
      }
    } catch {
      alert("Network error creating event");
    } finally {
      setCreatingEvent(false);
    }
  }

  async function handleAddPhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!newPhotoForm.url || !activeEventId) return;
    setAddingPhoto(true);
    try {
      const res = await fetch("/api/admin/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPhotoForm,
          eventId: activeEventId,
          order: eventPhotos.length,
        }),
      });
      if (res.ok) {
        showToast("Photo added to EventPhoto table!");
        setShowAddPhotoModal(false);
        setNewPhotoForm({ url: "", title: "", subtitle: "", tag: "Pre-Wedding" });
        const resPhotos = await fetch(`/api/admin/photos?eventId=${activeEventId}`);
        if (resPhotos.ok) {
          const data = await resPhotos.json();
          setEventPhotos(data.photos || []);
        }
      } else {
        const err = await res.json();
        alert(err.error || "Failed to add photo");
      }
    } catch {
      alert("Network error adding photo");
    } finally {
      setAddingPhoto(false);
    }
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("Are you sure you want to remove this photo from the table?")) return;
    try {
      const res = await fetch(`/api/admin/photos?id=${photoId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Photo removed from table!");
        setEventPhotos((prev) => prev.filter((p) => p.id !== photoId));
      }
    } catch {
      alert("Failed to delete photo");
    }
  }

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
        body: JSON.stringify({
          ...form,
          eventId: activeEventId,
        }),
      });
      showToast("New guest added and invite link generated!");
    }

    setForm(emptyForm);
    setShowAddModal(false);
    loadData(activeEventId);
  }

  function startEdit(g: Guest) {
    setEditingId(g.id);
    setForm({
      displayName: g.displayName,
      salutation: g.salutation,
      inviteType: g.inviteType,
      tableNumber: String(g.tableNumber),
      phone: g.phone || "",
      dietary: g.dietary || "NONE",
      rsvpStatus: g.rsvpStatus || "PENDING",
      attendeeCount: String(g.attendeeCount || (g.inviteType === "COUPLE" ? 2 : 1)),
      notes: g.notes || "",
    });
    setShowAddModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this guest? This will invalidate their link.")) return;
    await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    showToast("Guest removed.");
    loadData(activeEventId);
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
        body: JSON.stringify({
          ...settings,
          eventId: activeEventId,
        }),
      });

      if (res.ok) {
        setSettingsSuccess(true);
        showToast("Event settings updated for this wedding!");
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
          (g.phone && g.phone.includes(searchQuery)) ||
          (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesType = filterType === "ALL" || g.inviteType === filterType;
        const matchesRsvp = filterRsvp === "ALL" || (g.rsvpStatus || "PENDING") === filterRsvp;
        const matchesViewed =
          filterViewed === "ALL" ||
          (filterViewed === "VIEWED" && g.viewedAt !== null) ||
          (filterViewed === "UNVIEWED" && g.viewedAt === null);

        return matchesSearch && matchesType && matchesRsvp && matchesViewed;
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
  }, [guests, searchQuery, filterType, filterRsvp, filterViewed, sortBy]);

  const currentEvent = events.find((e) => e.id === activeEventId) || events[0];

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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#c5a059]/30 mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.3em] text-[#dfba73] font-cinzel font-semibold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#dfba73]" /> Executive Event Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 text-[#edd892] text-[10px] font-mono border border-[#c5a059]/40">
                {manager ? (manager.company ? `${manager.company} (${manager.username})` : manager.username) : "Event Manager"}
              </span>
            </div>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7] mt-1">
              {currentEvent?.coupleNames || settings.coupleNames}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#dfba73]/80">
              <span className="px-2 py-0.5 rounded bg-[#231a20] border border-[#c5a059]/30 font-mono text-[11px] text-[#edd892]">
                Slug: /e/{currentEvent?.slug || "wedding"}
              </span>
              <a
                href={`/e/${currentEvent?.slug || "wedding"}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white flex items-center gap-1 text-[11px] underline"
              >
                <ExternalLink className="w-3 h-3" /> Preview Wedding
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Wedding Switcher Selector */}
            <div className="flex items-center gap-1.5 bg-[#1c161a] border border-[#c5a059]/50 rounded-xl px-2.5 py-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#dfba73]" />
              <select
                value={activeEventId}
                onChange={(e) => handleSelectEvent(e.target.value)}
                className="bg-transparent text-xs font-cinzel font-semibold text-[#fdfbf7] focus:outline-none cursor-pointer max-w-[180px] sm:max-w-[220px]"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id} className="bg-[#1c161a] text-white">
                    {ev.coupleNames}
                  </option>
                ))}
              </select>
            </div>

            {/* + New Wedding Button */}
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="btn-gold-shimmer px-3.5 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Wedding
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/10 text-xs font-cinzel font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-[#800020]/20 border border-rose-800/60 text-rose-300 hover:bg-rose-950/40 text-xs font-cinzel font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Exit
            </button>
          </div>
        </div>

        {/* Executive Stats & Live RSVP Analytics Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-[#dfba73] mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                Total Invited
              </span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              {rsvpStats.totalInvited}
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-0.5 block">
              ~{stats.estimatedHeadcount} Max Potential
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-transparent backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                Confirmed Attending
              </span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-emerald-300">
              {rsvpStats.attendingCount}
            </div>
            <span className="text-[10px] text-emerald-400/80 font-sans mt-0.5 block font-semibold">
              {rsvpStats.totalHeadcount} Total Seats Claimed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-rose-800/40 bg-gradient-to-b from-rose-950/20 to-transparent backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-rose-400 mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                Declined
              </span>
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-rose-300">
              {rsvpStats.declinedCount}
            </div>
            <span className="text-[10px] text-rose-400/70 font-sans mt-0.5 block">
              Regretfully cannot join
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/40 backdrop-blur-sm shadow-md">
            <div className="flex items-center justify-between text-[#dfba73] mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                Pending RSVP
              </span>
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#dfba73]">
              {rsvpStats.pendingCount}
            </div>
            <span className="text-[10px] text-[#dfba73]/70 font-sans mt-0.5 block">
              Awaiting confirmation
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm shadow-md col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-[#dfba73] mb-1.5">
              <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                Open Rate
              </span>
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
              {stats.openRate}%
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-0.5 block">
              {stats.viewedCount} of {stats.totalGuests} opened
            </span>
          </div>
        </div>

        {/* Dietary Preferences Overview Bar */}
        {Object.keys(rsvpStats.dietaryCounts).length > 0 && (
          <div className="mb-6 px-4 py-3 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#dfba73] font-cinzel font-bold">
              <Utensils className="w-3.5 h-3.5" /> Catering & Dietary Requirements:
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {Object.entries(rsvpStats.dietaryCounts).map(([diet, count]) => (
                <span
                  key={diet}
                  className="px-2.5 py-1 rounded-lg bg-[#2d1f27] border border-[#c5a059]/30 text-[#edd892] text-[11px] font-sans font-medium"
                >
                  {diet === "NONE" ? "Standard Gourmet" : diet}: <strong className="text-white font-cinzel">{count}</strong>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#c5a059]/20 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("guests")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "guests"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Users className="w-4 h-4" /> Guest Directory ({guests.length})
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "photos"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Camera className="w-4 h-4" /> Photos Table ({eventPhotos.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Settings className="w-4 h-4" /> Ceremony & Settings
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "tables"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Printer className="w-4 h-4" /> Printable Place Cards
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "events"
                ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/60 shadow-lg"
                : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/10"
            }`}
          >
            <Sparkles className="w-4 h-4" /> All Weddings ({events.length})
          </button>
        </div>

        {/* TAB 1: GUEST DIRECTORY */}
        {activeTab === "guests" && (
          <div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#c5a059]/60" />
                  <input
                    type="text"
                    placeholder="Search guests by name, phone, table..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <select
                  value={filterRsvp}
                  onChange={(e) => setFilterRsvp(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-[#1c161a] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                >
                  <option value="ALL">All RSVPs</option>
                  <option value="ATTENDING">Attending</option>
                  <option value="DECLINED">Declined</option>
                  <option value="PENDING">Pending</option>
                </select>

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
                  <option value="ALL">All Opens</option>
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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/50 text-[#dfba73] hover:bg-[#c5a059]/15 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Bulk Import (CSV)
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setShowAddModal(true);
                  }}
                  className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Guest
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#181216] border border-[#c5a059]/30 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-2 px-4 py-3.5 bg-[#261820] text-xs font-cinzel font-semibold text-[#dfba73] border-b border-[#c5a059]/30">
                <div className="col-span-4 sm:col-span-4">Guest & Contact</div>
                <div className="col-span-2 sm:col-span-2">Category</div>
                <div className="col-span-2 sm:col-span-1">Table</div>
                <div className="col-span-2 sm:col-span-2 hidden sm:block">RSVP & Dietary</div>
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
                      <div className="flex items-center gap-2 mt-0.5">
                        {g.phone && (
                          <span className="text-[10px] text-[#dfba73]/80 font-mono">
                            📞 {g.phone}
                          </span>
                        )}
                        {g.notes && (
                          <span className="text-[10px] text-[#edd892]/70 font-sans truncate max-w-[140px]">
                            • {g.notes}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#c5a059]/15 text-[#dfba73] text-[10px] font-cinzel font-semibold">
                        {inviteTypeLabels[g.inviteType]}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="font-cinzel font-bold text-sm text-[#dfba73]">
                        #{String(g.tableNumber).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-2 hidden sm:block">
                      <div className="space-y-1">
                        {g.rsvpStatus === "ATTENDING" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-[10px] font-cinzel font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Attending ({g.attendeeCount || 1})
                          </span>
                        ) : g.rsvpStatus === "DECLINED" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/60 text-rose-300 text-[10px] font-cinzel font-semibold">
                            <XCircle className="w-3 h-3" /> Declined
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2a1d25] border border-[#c5a059]/30 text-[#dfba73] text-[10px] font-cinzel">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                        {g.dietary && g.dietary !== "NONE" && (
                          <div className="text-[10px] text-[#edd892] font-sans">
                            🥗 {g.dietary}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleSendWhatsApp(g)}
                        title="Send Royal WhatsApp Invitation Blast"
                        className="p-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/50 text-emerald-400 hover:bg-[#25D366]/30 transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
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
          <div className="rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-6 sm:p-8 shadow-2xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#c5a059]/30">
              <div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73]">
                  Event & Couple Customization Suite
                </h2>
                <p className="text-xs text-[#fdfbf7]/60 font-sans mt-1">
                  Adjust couple details, upload/select couple photos, and customize the invitation experience in real-time.
                </p>
              </div>

              {/* Live Couple Monogram Preview Badge */}
              <div className="flex items-center gap-3 bg-[#231a20] border border-[#c5a059]/40 px-4 py-2 rounded-2xl shadow-inner">
                <div className="w-10 h-10 rounded-full bg-[#800020] border border-[#dfba73] flex items-center justify-center text-[#fdfbf7] font-cinzel font-bold text-sm shadow">
                  {dashboardMonogram}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel block">
                    Live Monogram
                  </span>
                  <span className="text-xs font-semibold text-[#fdfbf7]">
                    {settings.coupleNames}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* CARD 1: COUPLE & INVITATION WORDING */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
                <div className="flex items-center gap-2 text-[#dfba73] pb-2 border-b border-[#c5a059]/20 font-cinzel text-sm font-bold uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-[#dfba73]" /> 1. Couple Names & Invitation Story
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Couple Names (e.g. Sandharu & Sanduni)
                    </label>
                    <input
                      required
                      value={settings.coupleNames}
                      onChange={(e) => setSettings({ ...settings, coupleNames: e.target.value })}
                      placeholder="Groom Name & Bride Name"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Invitation Body / Message
                  </label>
                  <textarea
                    rows={2}
                    value={settings.invitationBody}
                    onChange={(e) => setSettings({ ...settings, invitationBody: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                  />
                </div>
              </div>

              {/* CARD 2: COUPLE PHOTOS & MEDIA MANAGER */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-6 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-[#c5a059]/20">
                  <div className="flex items-center gap-2 text-[#dfba73] font-cinzel text-sm font-bold uppercase tracking-wider">
                    <Film className="w-4 h-4 text-[#dfba73]" /> 2. Couple Pre-Shoot Video & Media Suite
                  </div>
                  {settings.heroVideoUrl && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#800020] text-[#edd892] text-[10px] font-cinzel font-semibold border border-[#dfba73]/40">
                      🎬 Video Mode Active
                    </span>
                  )}
                </div>

                {/* CINEMATIC PRE-SHOOT VIDEO SECTION */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2c131d] via-[#1f0d14] to-[#14060b] border-2 border-[#dfba73]/60 shadow-lg space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#ffd700] font-cinzel font-bold">
                        <Video className="w-4 h-4" /> Couple Pre-Shoot Cinematic Film / Trailer
                      </div>
                      <p className="text-[11px] text-[#fdfbf7]/70 font-sans mt-0.5">
                        Upload a pre-shoot video file (.mp4, .mov, .webm) or link a YouTube / Vimeo trailer.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition">
                        {uploadingField === "video" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading Video...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Pre-Shoot Video</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="video/*,.mp4,.mov,.webm,.m4v"
                          disabled={uploadingField !== null}
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, "video", (url) =>
                              setSettings((prev) => ({ ...prev, heroVideoUrl: url }))
                            )
                          }
                        />
                      </label>

                      {settings.heroVideoUrl && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, heroVideoUrl: "" })}
                          className="px-3 py-2 rounded-xl bg-black/50 hover:bg-rose-950/80 text-rose-300 border border-rose-500/30 text-xs font-cinzel font-medium cursor-pointer transition"
                          title="Remove video and switch back to Hero Photo"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-2">
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-[11px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                        Video File URL or YouTube / Vimeo Link
                      </label>
                      <input
                        value={settings.heroVideoUrl || ""}
                        onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                        placeholder="e.g. /uploads/preshoot-video.mp4 or https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1117] border border-[#c5a059]/50 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] font-mono"
                      />
                      <p className="text-[10px] text-[#edd892]/60 italic font-sans">
                        💡 Tip: If you leave this blank, the invitation automatically displays the high-resolution Couple Portrait Photo below.
                      </p>
                    </div>

                    {/* Video Live Preview */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                        Video Preview
                      </span>
                      <div className="relative w-full max-w-[200px] aspect-video rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black flex items-center justify-center">
                        {settings.heroVideoUrl ? (
                          settings.heroVideoUrl.includes("youtube.com") || settings.heroVideoUrl.includes("youtu.be") ? (
                            <div className="p-2 text-center text-[10px] text-[#dfba73] font-cinzel">
                              <Film className="w-5 h-5 mx-auto mb-1 text-[#ffd700]" />
                              YouTube Embed Ready
                            </div>
                          ) : (
                            <video
                              src={settings.heroVideoUrl.startsWith("/uploads/") ? `/api/media/stream?src=${encodeURIComponent(settings.heroVideoUrl)}` : settings.heroVideoUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="p-2 text-center text-[10px] text-white/40 font-cinzel">
                            No Video Set (Photo Mode)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Couple Portrait Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-2">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Main Hero Couple Portrait Photo
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition">
                          {uploadingField === "hero" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Pre-Shoot Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingField !== null}
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, "hero", (url) =>
                                setSettings((prev) => ({ ...prev, heroImageUrl: url }))
                              )
                            }
                          />
                        </label>
                        <span className="text-[11px] text-[#edd892]/70 font-sans">
                          or paste URL below
                        </span>
                      </div>
                    </div>


                    <input
                      value={settings.heroImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />

                    {/* Quick Preset Selector */}
                    <div>
                      <span className="text-[10px] text-[#edd892]/70 font-sans block mb-1">
                        Uploaded Photo Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PHOTO_PRESETS.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSettings({ ...settings, heroImageUrl: p.url })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-cinzel font-medium transition cursor-pointer border ${
                              (settings.heroImageUrl || "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg") === p.url
                                ? "bg-[#800020] text-[#fdfbf7] border-[#dfba73]"
                                : "bg-[#181014] text-[#dfba73]/80 border-[#c5a059]/30 hover:bg-[#c5a059]/10"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Hero Portrait Preview
                    </span>
                    <div className="relative w-32 h-36 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black">
                      <Image
                        src={settings.heroImageUrl || "/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg"}
                        alt="Hero Couple Preview"
                        fill
                        sizes="130px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>

                </div>

                {/* Warm Welcome Couple Photo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Warm Welcome Couple Photo (Invitation Greeting Plaque)
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition">
                          {uploadingField === "welcome" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Welcome Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingField !== null}
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, "welcome", (url) =>
                                setSettings((prev) => ({ ...prev, welcomeImageUrl: url }))
                              )
                            }
                          />
                        </label>
                        <span className="text-[11px] text-[#edd892]/70 font-sans">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.welcomeImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, welcomeImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {PHOTO_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSettings({ ...settings, welcomeImageUrl: p.url })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-cinzel font-medium transition cursor-pointer border ${
                            (settings.welcomeImageUrl || "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg") === p.url
                              ? "bg-[#800020] text-[#fdfbf7] border-[#dfba73]"
                              : "bg-[#181014] text-[#dfba73]/80 border-[#c5a059]/30 hover:bg-[#c5a059]/10"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Welcome Preview
                    </span>
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black">
                      <Image
                        src={settings.welcomeImageUrl || "/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg"}
                        alt="Welcome Preview"
                        fill
                        sizes="130px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Table Seating Place Card Photo & Sweet Note */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Table Place Card Couple Photo
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition">
                          {uploadingField === "placeCard" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Place Card Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingField !== null}
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, "placeCard", (url) =>
                                setSettings((prev) => ({ ...prev, placeCardImageUrl: url }))
                              )
                            }
                          />
                        </label>
                        <span className="text-[11px] text-[#edd892]/70 font-sans">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.placeCardImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, placeCardImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Place Card Sweet Thank You Note
                      </label>
                      <input
                        value={settings.placeCardNote || ""}
                        onChange={(e) => setSettings({ ...settings, placeCardNote: e.target.value })}
                        placeholder="Thank you for sharing our joy and celebrating with us!"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Place Card Preview
                    </span>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#c5a059] shadow-md bg-black">
                      <Image
                        src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                        alt="Place Card Preview"
                        fill
                        sizes="96px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Blessing Section Photo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Blessing Section Photo
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition">
                          {uploadingField === "blessing" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Uploading Photo...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Upload Blessing Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingField !== null}
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, "blessing", (url) =>
                                setSettings((prev) => ({ ...prev, blessingImageUrl: url }))
                              )
                            }
                          />
                        </label>
                        <span className="text-[11px] text-[#edd892]/70 font-sans">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.blessingImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, blessingImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-OIP2-1788547184704-193.webp or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Blessing Preview
                    </span>
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black">
                      <Image
                        src={settings.blessingImageUrl || "/uploads/preshoot-photo-OIP2-1788547184704-193.webp"}
                        alt="Blessing Preview"
                        fill
                        sizes="130px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Moments of Love: 4 Gallery Slots */}
                <div className="pt-4 border-t border-[#c5a059]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                      Moments of Love: Gallery Photos (4 Slots)
                    </label>
                    <span className="text-[10px] text-[#edd892]/70 font-sans">
                      Upload from computer or set custom URLs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {galleryList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-[#261c22] border border-[#c5a059]/30 space-y-2 flex flex-col justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#c5a059]/50 flex-shrink-0 bg-black">
                            <Image
                              src={item.src || "/uploads/preshoot-photo-OIP1-1788547193363-824.webp"}
                              alt={item.title || `Slot ${idx + 1}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase text-[#dfba73] font-cinzel font-bold">

                                Photo Slot #{idx + 1}
                              </span>
                              <label className="px-2 py-0.5 rounded bg-[#800020] hover:bg-[#6b0f24] text-[10px] text-[#edd892] font-cinzel font-bold cursor-pointer border border-[#c5a059]/40 flex items-center gap-1">
                                {uploadingField === `gallery_${idx}` ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3" />
                                )}
                                <span>Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingField !== null}
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, `gallery_${idx}`, (url) =>
                                      updateGalleryItem(idx, "src", url)
                                    )
                                  }
                                />
                              </label>
                            </div>
                            <input
                              value={item.src}
                              onChange={(e) => updateGalleryItem(idx, "src", e.target.value)}
                              placeholder="Image URL or Upload above"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-[11px] text-[#fdfbf7] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <input
                            value={item.title}
                            onChange={(e) => updateGalleryItem(idx, "title", e.target.value)}
                            placeholder="Title (e.g. A Timeless Bond)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/30 text-[11px] text-[#fdfbf7] focus:outline-none"
                          />
                          <input
                            value={item.subtitle}
                            onChange={(e) => updateGalleryItem(idx, "subtitle", e.target.value)}
                            placeholder="Subtitle / Romantic Quote"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/30 text-[11px] text-[#fdfbf7] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* CARD 3: WEDDING DAY TIMELINE & PROGRAMME */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-[#c5a059]/20">
                  <div className="flex items-center gap-2 text-[#dfba73] font-cinzel text-sm font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-[#dfba73]" /> 3. Wedding Day Timeline & Programme
                  </div>
                  <button
                    type="button"
                    onClick={addTimelineItem}
                    className="px-3 py-1.5 rounded-lg bg-[#800020] text-[#edd892] hover:bg-[#6b0f24] text-[11px] font-cinzel font-bold border border-[#c5a059]/40 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Moment
                  </button>
                </div>

                <div className="space-y-3">
                  {timelineList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#261c22] border border-[#c5a059]/30 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <div className="w-full sm:w-32">
                        <label className="block text-[10px] uppercase text-[#dfba73] font-cinzel font-semibold mb-1">
                          Time
                        </label>
                        <input
                          value={item.time}
                          onChange={(e) => updateTimelineItem(idx, "time", e.target.value)}
                          placeholder="05:30 PM"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] uppercase text-[#dfba73] font-cinzel font-semibold mb-1">
                          Ceremony Title
                        </label>
                        <input
                          value={item.title}
                          onChange={(e) => updateTimelineItem(idx, "title", e.target.value)}
                          placeholder="e.g. Poruwa Ceremony & Blessings"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] uppercase text-[#dfba73] font-cinzel font-semibold mb-1">
                          Short Description
                        </label>
                        <input
                          value={item.desc}
                          onChange={(e) => updateTimelineItem(idx, "desc", e.target.value)}
                          placeholder="e.g. Traditional customs & family greetings"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(idx)}
                        className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-400 hover:bg-rose-900/60 transition cursor-pointer self-end sm:self-center"
                        title="Remove Moment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: DRESS CODE & STYLE PALETTE */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
                <div className="flex items-center gap-2 text-[#dfba73] pb-2 border-b border-[#c5a059]/20 font-cinzel text-sm font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#dfba73]" /> 4. Dress Code & Style Guide
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Dress Code Title
                    </label>
                    <input
                      value={settings.dressCodeTitle || ""}
                      onChange={(e) => setSettings({ ...settings, dressCodeTitle: e.target.value })}
                      placeholder="e.g. Royal Splendor & Black Tie"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Dress Code Instructions & Notes
                    </label>
                    <input
                      value={settings.dressCodeDescription || ""}
                      onChange={(e) => setSettings({ ...settings, dressCodeDescription: e.target.value })}
                      placeholder="e.g. Traditional Sri Lankan attire or formal evening wear in warm gold & velvet tones."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 5: VENUE & BACKGROUND MUSIC */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
                <div className="flex items-center gap-2 text-[#dfba73] pb-2 border-b border-[#c5a059]/20 font-cinzel text-sm font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#dfba73]" /> 5. Venue Location & Background Music
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={settings.venueLat}
                      onChange={(e) => setSettings({ ...settings, venueLat: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Event Contact Phone
                    </label>
                    <input
                      value={settings.contactPhone || ""}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      placeholder="+94 77 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                    />
                  </div>
                </div>
              </div>


              {/* SAVE BUTTON */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-gold-shimmer px-8 py-3.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {savingSettings ? "Saving All Settings..." : "Save All Couple & Event Settings"}
                </button>
                {settingsSuccess && (
                  <span className="text-xs text-emerald-400 font-cinzel flex items-center gap-1 bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-800/50">
                    <Check className="w-4 h-4" /> Changes saved and active immediately across invitations!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}


        {/* TAB 3: PRINTABLE PLACE CARDS */}
        {activeTab === "tables" && (
          <div className="printable-cards-container rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header & Controls Toolbar (Hidden on Print) */}
            <div className="no-print space-y-6 pb-6 border-b border-[#c5a059]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73]">
                    Banquet Table Seating Place Cards
                  </h2>
                  <p className="text-xs text-[#fdfbf7]/60 font-sans mt-1">
                    Luxury place setting stationery with couple portrait, guest typography, and cutting guidelines.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn-gold-shimmer px-6 py-3 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print Place Cards (A4 / Letter)
                </button>
              </div>

              {/* Place Card Customizer Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 text-xs">
                {/* Layout Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1.5">
                    Card Design Style
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "cameo", label: "Cameo Medallion" },
                      { id: "banner", label: "Top Banner" },
                      { id: "side", label: "Side Portrait" },
                      { id: "minimal", label: "Classic Monogram" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setPlaceCardLayout(l.id as any)}
                        className={`px-2.5 py-2 rounded-lg font-cinzel font-medium text-[11px] transition cursor-pointer border ${
                          placeCardLayout === l.id
                            ? "bg-[#800020] text-white border-[#dfba73]"
                            : "bg-[#181014] text-[#dfba73]/70 border-[#c5a059]/20 hover:bg-[#c5a059]/10"
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Selector */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1.5">
                    Couple Photo on Cards
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="btn-gold-shimmer px-3 py-1.5 rounded-lg text-[11px] font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow">
                      {uploadingField === "placeCardTab" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Card Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingField !== null}
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, "placeCardTab", (url) =>
                            setSettings((prev) => ({ ...prev, placeCardImageUrl: url }))
                          )
                        }
                      />
                    </label>

                    <div className="flex flex-wrap gap-1">
                      {PHOTO_PRESETS.slice(0, 4).map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSettings({ ...settings, placeCardImageUrl: p.url })}
                          className={`px-2 py-0.5 rounded text-[10px] font-sans transition cursor-pointer border ${
                            (settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg") === p.url
                              ? "bg-[#800020] text-white border-[#dfba73]"
                              : "bg-[#181014] text-[#dfba73]/70 border-[#c5a059]/20"
                          }`}
                        >
                          {p.label.split("(")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>


                {/* Toggles */}
                <div className="flex flex-col justify-center space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-[#fdfbf7]/80 hover:text-white">
                    <input
                      type="checkbox"
                      checked={showQrOnCards}
                      onChange={(e) => setShowQrOnCards(e.target.checked)}
                      className="rounded accent-[#800020]"
                    />
                    <span>Include Check-in QR Code on Cards</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Printable Cards Grid (Optimized for Screen & Print) */}
            <div className="printable-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="printable-place-card relative rounded-2xl bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f7f0e4] text-[#1a1517] p-5 sm:p-6 border-2 border-[#c5a059] shadow-lg flex flex-col justify-between overflow-hidden"
                  style={{ minHeight: "240px" }}
                >
                  {/* Subtle Gold Frame Lines */}
                  <div className="absolute inset-1.5 rounded-xl border border-[#c5a059]/40 pointer-events-none" />
                  <div className="absolute top-2.5 left-2.5 text-[#c5a059] text-xs select-none">⚜</div>
                  <div className="absolute top-2.5 right-2.5 text-[#c5a059] text-xs select-none">⚜</div>
                  <div className="absolute bottom-2.5 left-2.5 text-[#c5a059] text-xs select-none">⚜</div>
                  <div className="absolute bottom-2.5 right-2.5 text-[#c5a059] text-xs select-none">⚜</div>

                  {/* LAYOUT 1: CAMEO MEDALLION */}
                  {placeCardLayout === "cameo" && (
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#c5a059] shadow-md mb-2 bg-[#800020]/10">
                        <Image
                          src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                          alt={settings.coupleNames}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-cinzel font-bold">
                        {settings.coupleNames}
                      </p>
                    </div>
                  )}

                  {/* LAYOUT 2: TOP BANNER */}
                  {placeCardLayout === "banner" && (
                    <div className="flex flex-col items-center text-center mb-2">
                      <div className="relative w-full h-16 rounded-lg overflow-hidden border border-[#c5a059]/60 shadow-sm mb-1.5 bg-black">
                        <Image
                          src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                          alt={settings.coupleNames}
                          fill
                          sizes="280px"
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-1 inset-x-0 text-[10px] uppercase tracking-widest text-[#fff8ea] font-cinzel font-bold drop-shadow">
                          {settings.coupleNames}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 3: SIDE PORTRAIT */}
                  {placeCardLayout === "side" && (
                    <div className="flex items-center gap-3 pb-2 border-b border-[#c5a059]/30 mb-2">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#c5a059] flex-shrink-0 bg-black shadow">
                        <Image
                          src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                          alt={settings.coupleNames}
                          fill
                          sizes="56px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#800020] font-cinzel font-bold">
                          {settings.coupleNames}
                        </p>
                        <span className="text-[9px] uppercase tracking-wider text-[#8c6a2b] font-cinzel">

                          Royal Banquet Seating
                        </span>
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 4: MINIMAL MONOGRAM */}
                  {placeCardLayout === "minimal" && (
                    <div className="text-center pb-1">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#800020]/10 border border-[#c5a059]/60 mb-1">
                        <span className="font-cinzel text-xs font-bold text-[#800020]">
                          {dashboardMonogram}
                        </span>
                      </div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#800020] font-cinzel font-bold">
                        {settings.coupleNames}
                      </p>
                    </div>
                  )}

                  {/* Guest Name & Salutation */}
                  <div className="text-center my-auto py-2">
                    <span className="text-[9px] uppercase tracking-widest text-[#8c6a2b] font-cinzel">
                      Table Place Setting
                    </span>
                    <h3 className="font-serif italic text-xl sm:text-2xl font-bold text-[#6b0f24] leading-tight mt-0.5">
                      {g.salutation} {g.displayName}
                    </h3>
                    <p className="text-[10px] text-[#5a483e] font-sans mt-0.5">
                      {inviteTypeLabels[g.inviteType]}
                    </p>
                  </div>

                  {/* Table Badge & Sweet Note Footer */}
                  <div className="pt-2 border-t border-[#c5a059]/30 flex items-center justify-between gap-2 mt-auto">
                    <div className="px-3 py-1 rounded-xl bg-[#800020] text-[#fdfbf7] font-cinzel font-bold text-xs shadow">
                      Table #{String(g.tableNumber).padStart(2, "0")}
                    </div>
                    <span className="font-serif italic text-[10px] text-[#8c6a2b] text-right line-clamp-1">
                      {settings.placeCardNote || "Sharing our joy & love"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PHOTOS TABLE (Dedicated EventPhoto Database Records) */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1c161a] border border-[#c5a059]/40 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 text-[#edd892] text-[10px] font-mono border border-[#c5a059]/40">
                    Relational Table: EventPhoto
                  </span>
                  <span className="text-xs text-[#dfba73] font-cinzel font-semibold">
                    {eventPhotos.length} Records in Database
                  </span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73] mt-1">
                  Wedding Photo Gallery Table
                </h2>
                <p className="text-xs text-[#fdfbf7]/60 mt-1 max-w-2xl">
                  Each photo is stored as an independent relational record in the <code className="text-[#dfba73]">EventPhoto</code> table with its own primary key, order, caption, category tag, and CDN link.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Photo to Table
                </button>
              </div>
            </div>

            {/* Table Display */}
            {eventPhotos.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl bg-[#181216] border border-[#c5a059]/30">
                <Camera className="w-12 h-12 text-[#dfba73]/40 mx-auto mb-3" />
                <h3 className="font-cinzel text-lg font-bold text-[#fdfbf7]">No Photos in Table Yet</h3>
                <p className="text-xs text-[#fdfbf7]/60 max-w-md mx-auto mt-1 mb-5">
                  Add high-resolution pre-shoot portraits, couple moments, and wedding memories to populate the guest invitation gallery.
                </p>
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add First Photo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#181216] border border-[#c5a059]/40 overflow-hidden shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#241a21] text-[#dfba73] font-cinzel font-bold border-b border-[#c5a059]/30">
                        <tr>
                          <th className="py-3.5 px-4 text-center w-16">#</th>
                          <th className="py-3.5 px-4 w-24">Preview</th>
                          <th className="py-3.5 px-4">Title & Subtitle</th>
                          <th className="py-3.5 px-4">Tag / Category</th>
                          <th className="py-3.5 px-4">Media URL</th>
                          <th className="py-3.5 px-4">Created Date</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#c5a059]/15">
                        {eventPhotos.map((photo, idx) => (
                          <tr key={photo.id} className="hover:bg-[#231a20]/60 transition">
                            <td className="py-3 px-4 text-center font-mono text-[#edd892]">
                              {photo.order !== undefined ? photo.order + 1 : idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-[#c5a059]/40 bg-black/40">
                                <img
                                  src={photo.url}
                                  alt={photo.title || "Wedding Photo"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-cinzel font-bold text-[#fdfbf7] text-sm">
                                {photo.title || "Untitled Portrait"}
                              </div>
                              {photo.subtitle && (
                                <div className="text-[11px] text-[#fdfbf7]/60 italic">
                                  {photo.subtitle}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-full bg-[#800020]/30 text-[#edd892] text-[10px] font-cinzel font-semibold border border-[#c5a059]/30">
                                {photo.tag || "Pre-Wedding"}
                              </span>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[11px] text-[#dfba73]/80 truncate block max-w-[200px]">
                                  {photo.url}
                                </span>
                                <a
                                  href={photo.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#c5a059] hover:text-white shrink-0"
                                  title="Open full image"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-[#fdfbf7]/50">
                              {new Date(photo.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-cinzel transition cursor-pointer inline-flex items-center gap-1"
                                title="Delete from database table"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual Grid Preview */}
                <div className="p-6 rounded-3xl bg-[#181216] border border-[#c5a059]/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-[#dfba73]" />
                    <h3 className="font-cinzel text-sm font-bold text-[#dfba73] uppercase tracking-wider">
                      Live Gallery Showcase Preview
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {eventPhotos.map((photo) => (
                      <div
                        key={`grid-${photo.id}`}
                        className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#c5a059]/30 bg-black/40 shadow-md"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title || "Gallery"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition">
                          <p className="font-cinzel font-bold text-xs text-[#fdfbf7] truncate">
                            {photo.title || "Wedding Photo"}
                          </p>
                          <span className="text-[10px] text-[#dfba73] font-mono">
                            {photo.tag || "Pre-Wedding"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: ALL WEDDINGS PORTFOLIO */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1c161a] border border-[#c5a059]/40 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#800020]/40 text-[#dfba73] text-[10px] font-cinzel font-semibold border border-[#dfba73]/40">
                    SaaS Client Portfolio
                  </span>
                  <span className="text-xs text-[#edd892] font-mono">
                    {events.length} Active Weddings
                  </span>
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73] mt-1">
                  All Client Wedding Events
                </h2>
                <p className="text-xs text-[#fdfbf7]/60 mt-1 max-w-2xl">
                  Manage multiple independent client wedding portals. Each event has isolated guests, place cards, settings, photos, and custom vanity URL slug.
                </p>
              </div>

              <button
                onClick={() => setShowCreateEventModal(true)}
                className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create New Wedding
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((ev) => {
                const isCurrent = ev.id === activeEventId;
                return (
                  <div
                    key={ev.id}
                    className={`rounded-3xl p-5 border transition flex flex-col justify-between ${
                      isCurrent
                        ? "bg-[#23171f] border-[#dfba73] shadow-2xl ring-1 ring-[#dfba73]/40"
                        : "bg-[#181216] border-[#c5a059]/30 hover:border-[#c5a059]/70 shadow-lg"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[10px] text-[#dfba73] px-2 py-0.5 rounded bg-[#120e11] border border-[#c5a059]/30">
                          /e/{ev.slug}
                        </span>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-[10px] font-cinzel font-bold">
                            Active
                          </span>
                        )}
                      </div>

                      {ev.heroImageUrl && (
                        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 border border-[#c5a059]/20">
                          <img
                            src={ev.heroImageUrl}
                            alt={ev.coupleNames}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <h3 className="font-cinzel text-lg font-bold text-[#fdfbf7]">
                        {ev.coupleNames}
                      </h3>

                      <div className="mt-2 space-y-1.5 text-xs text-[#fdfbf7]/70 font-sans">
                        <div className="flex items-center gap-1.5 text-[#edd892]">
                          <Calendar className="w-3.5 h-3.5 text-[#dfba73]" />
                          <span>{new Date(ev.eventDate).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#fdfbf7]/60">
                          <Users className="w-3.5 h-3.5 text-[#dfba73]" />
                          <span>Venue: {ev.venueName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#c5a059]/20 flex items-center justify-between gap-2">
                      {isCurrent ? (
                        <button
                          onClick={() => setActiveTab("guests")}
                          className="btn-gold-shimmer flex-1 py-2 rounded-xl text-xs font-cinzel font-bold text-center cursor-pointer"
                        >
                          Manage Guests & Portal
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleSelectEvent(ev.id);
                            setActiveTab("guests");
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#2a1c24] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#800020] hover:text-white text-xs font-cinzel font-bold transition cursor-pointer"
                        >
                          Switch & Manage
                        </button>
                      )}

                      <a
                        href={`/e/${ev.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-[#1c1519] border border-[#c5a059]/30 text-[#dfba73] hover:text-white transition"
                        title="Preview Public Wedding"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ADD / EDIT GUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 sm:p-8 shadow-2xl my-8">
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
              Generate a unique luxury invite link and assign table seating & catering preferences.
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

              <div className="grid grid-cols-2 gap-3">
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
                    WhatsApp / Phone
                  </label>
                  <input
                    placeholder="e.g. +94771234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={form.rsvpStatus}
                    onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ATTENDING">Attending</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Headcount (Pax)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={form.attendeeCount}
                    onChange={(e) => setForm({ ...form, attendeeCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Dietary
                  </label>
                  <select
                    value={form.dietary}
                    onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                  >
                    <option value="NONE">Standard</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="VEGAN">Vegan</option>
                    <option value="HALAL">Halal</option>
                    <option value="GLUTEN_FREE">Gluten-Free</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Admin Notes (Optional)
                </label>
                <input
                  placeholder="e.g. VIP groom's family elder / seating request"
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

      {/* BULK CSV GUEST IMPORTER MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setShowBulkModal(false)}
              className="absolute top-5 right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Upload className="w-3.5 h-3.5" /> High-Speed Guest Onboarding
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#dfba73] mb-1">
              Bulk Import Guests from CSV
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-4">
              Paste CSV text or upload your guest spreadsheet file. Each row will generate a VIP pass and invite link.
            </p>

            <div className="mb-4 p-3.5 rounded-2xl bg-[#261c22] border border-[#c5a059]/30 text-[11px] font-mono text-[#edd892]/90 space-y-1">
              <div className="text-[#dfba73] font-cinzel font-bold text-xs mb-1">
                Supported CSV Format:
              </div>
              <div className="text-white">Salutation, Full Name, Category, Table Number, Phone Number</div>
              <div className="text-[10px] text-[#fdfbf7]/50 font-sans mt-1">
                Example: <code>Mr & Mrs, Roshan Perera, COUPLE, 4, +94771234567</code>
              </div>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                    CSV Data (Paste or Upload)
                  </label>
                  <label className="px-3 py-1 rounded-lg bg-[#800020] hover:bg-[#6b0f24] text-[10px] font-cinzel font-bold text-[#edd892] cursor-pointer border border-[#c5a059]/40 flex items-center gap-1">
                    <FolderUp className="w-3 h-3" /> Select .CSV File
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setBulkCsvText(event.target?.result as string || "");
                          };
                          reader.readAsText(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={8}
                  required
                  placeholder={`Mr & Mrs, Roshan & Anoma Perera, COUPLE, 1, +94771234567\nDr, Sunimal Jayasinghe, SINGLE, 2, +94779876543\nMr & Mrs, Gamini De Silva & Family, FAMILY, 3, +94711112233`}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs font-mono text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setBulkCsvText(
                      `Mr & Mrs, Roshan & Anoma Perera, COUPLE, 1, +94771234567\nDr, Sunimal Jayasinghe, SINGLE, 2, +94779876543\nMr & Mrs, Gamini De Silva & Family, FAMILY, 3, +94711112233\nMrs, Nirmala Wickramasinghe, SINGLE, 4, +94773334455`
                    )
                  }
                  className="text-xs text-[#dfba73] hover:underline font-cinzel font-semibold cursor-pointer"
                >
                  Load Sample Template
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bulkImporting || !bulkCsvText.trim()}
                    className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {bulkImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {bulkImporting ? "Importing Guests..." : "Import All Guests"}
                  </button>
                </div>
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

      {/* CREATE NEW WEDDING MODAL */}
      {showCreateEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setShowCreateEventModal(false)}
              className="absolute top-5 right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Commercial Multi-Tenancy
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#dfba73] mb-1">
              Create New Wedding Event
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-5">
              Set up a dedicated wedding event under your manager account with an isolated database record and unique slug.
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Couple Names *
                </label>
                <input
                  required
                  placeholder="e.g. Kasun & Shenali"
                  value={newEventForm.coupleNames}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");
                    setNewEventForm((prev) => ({
                      ...prev,
                      coupleNames: val,
                      slug: prev.slug ? prev.slug : `${autoSlug}-2026`,
                    }));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Event Slug (URL identifier) *
                  </label>
                  <input
                    required
                    placeholder="e.g. kasun-shenali-2026"
                    value={newEventForm.slug}
                    onChange={(e) =>
                      setNewEventForm({
                        ...newEventForm,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs font-mono text-[#edd892] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Ceremony Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newEventForm.eventDate}
                    onChange={(e) => setNewEventForm({ ...newEventForm, eventDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Venue Name *
                </label>
                <input
                  required
                  placeholder="e.g. Cinnamon Grand Colombo / Rose Garden Hall"
                  value={newEventForm.venueName}
                  onChange={(e) => setNewEventForm({ ...newEventForm, venueName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Venue Address
                </label>
                <input
                  placeholder="e.g. 77 Galle Road, Colombo 03, Sri Lanka"
                  value={newEventForm.venueAddress}
                  onChange={(e) => setNewEventForm({ ...newEventForm, venueAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Event Contact Phone
                </label>
                <input
                  placeholder="+94 77 123 4567"
                  value={newEventForm.contactPhone}
                  onChange={(e) => setNewEventForm({ ...newEventForm, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingEvent}
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {creatingEvent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {creatingEvent ? "Creating Wedding..." : "Create Wedding Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PHOTO TO TABLE MODAL */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-5 right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Camera className="w-3.5 h-3.5" /> Dedicated EventPhoto Table
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#dfba73] mb-1">
              Add Photo to Wedding Table
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-5">
              Upload a picture or provide an image link to store a new record in the <code className="text-[#dfba73]">EventPhoto</code> table.
            </p>

            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Upload Photo File or Enter URL *
                </label>
                <div className="flex gap-2 mb-2">
                  <label className="flex-1 btn-gold-shimmer px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow">
                    {uploadingField === "addPhotoModal" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading file...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Photo from Device</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingField !== null}
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, "addPhotoModal", (url) =>
                          setNewPhotoForm((prev) => ({ ...prev, url }))
                        )
                      }
                    />
                  </label>
                </div>

                <input
                  required
                  placeholder="https://... or /uploads/..."
                  value={newPhotoForm.url}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs font-mono text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              {newPhotoForm.url && (
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-[#c5a059]/40 bg-black/40">
                  <img
                    src={newPhotoForm.url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                  Photo Caption / Title
                </label>
                <input
                  placeholder="e.g. Golden Hour at Botanical Gardens"
                  value={newPhotoForm.title}
                  onChange={(e) => setNewPhotoForm({ ...newPhotoForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Subtitle / Location
                  </label>
                  <input
                    placeholder="e.g. Peradeniya, Sri Lanka"
                    value={newPhotoForm.subtitle}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Category Tag
                  </label>
                  <select
                    value={newPhotoForm.tag}
                    onChange={(e) => setNewPhotoForm({ ...newPhotoForm, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                  >
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Ceremony">Ceremony</option>
                    <option value="Poruwa">Poruwa Ceremony</option>
                    <option value="Reception">Reception</option>
                    <option value="Portrait">Couple Portrait</option>
                    <option value="Family">Family & Friends</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPhoto || !newPhotoForm.url}
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {addingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {addingPhoto ? "Saving Photo..." : "Save Photo to Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}