"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { uploadToCloudinary, isCloudinaryClientConfigured } from "@/lib/cloudinary-client";
import {
  getOptimizedVideoUrl,
  getVideoPosterUrl,
  getOptimizedImageUrl,
  getThumbnailUrl,
} from "@/lib/media-optimization";

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
  MapPin,
  FileText,
  Filter,
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
  ShieldCheck,
  UserPlus,
  Building2,
  Briefcase,
  Music,
  User,
  Mail,
  Key,
  AlertTriangle,
  ArrowUpDown,
  ChevronDown,
  Pencil,
} from "lucide-react";

export type WeddingEventItem = {
  id: string;
  slug: string;
  managerId?: string;
  manager?: {
    id: string;
    username: string;
    name: string;
    company?: string | null;
  };
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

export type EventManagerListItem = {
  id: string;
  username: string;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  role: string;
  createdAt: string;
  _count?: {
    events: number;
  };
  events?: {
    id: string;
    slug: string;
    coupleNames: string;
    eventDate: string;
    venueName: string;
  }[];
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

export const DEFAULT_PRODUCTION_URL = "https://wedding-invitation-app-silk.vercel.app";

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("wedding_invitation_base_url");
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, "");
    }
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1") && !origin.includes("0.0.0.0")) {
      return origin.replace(/\/+$/, "");
    }
  }

  return DEFAULT_PRODUCTION_URL;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "guests" | "photos" | "settings" | "tables" | "events" | "managers"
  >("guests");
  const [manager, setManager] = useState<ManagerProfile | null>(null);
  const [events, setEvents] = useState<WeddingEventItem[]>([]);
  const [activeEventId, setActiveEventId] = useState<string>("");
  const [eventPhotos, setEventPhotos] = useState<EventPhotoItem[]>([]);

  // Super Admin: Event Managers Directory state
  const [managers, setManagers] = useState<EventManagerListItem[]>([]);
  const [showCreateManagerModal, setShowCreateManagerModal] = useState(false);
  const [newManagerForm, setNewManagerForm] = useState({
    username: "",
    password: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    role: "MANAGER",
    createStarterWedding: true,
    starterCoupleNames: "",
    starterVenueName: "",
  });
  const [creatingManager, setCreatingManager] = useState(false);
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [selectedManagerFilter, setSelectedManagerFilter] = useState<"ALL" | "SUPER_ADMIN" | "MANAGER">("ALL");
  const [managerSortBy, setManagerSortBy] = useState<"newest" | "name" | "weddings">("newest");
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Super Admin: Edit Manager Modal state
  const [showEditManagerModal, setShowEditManagerModal] = useState(false);
  const [editingManager, setEditingManager] = useState<EventManagerListItem | null>(null);
  const [editManagerForm, setEditManagerForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    role: "MANAGER",
    newPassword: "",
  });
  const [updatingManager, setUpdatingManager] = useState(false);

  // Super Admin: Delete Confirmation Modal state
  const [managerToDelete, setManagerToDelete] = useState<{
    id: string;
    username: string;
    name: string;
    weddingCount: number;
  } | null>(null);
  const [deletingManager, setDeletingManager] = useState(false);

  // Create Wedding Modal
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    coupleNames: "",
    eventDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16),
    venueName: "",
    venueAddress: "",
    slug: "",
    contactPhone: "",
    managerId: "",
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
  const [storageStatus, setStorageStatus] = useState<{
    configured: boolean;
    provider: string;
    isVercel: boolean;
    hasCloudinary?: boolean;
    hasBlobToken?: boolean;
    cloudName?: string | null;
    message: string;
  } | null>(null);
  const [appBaseUrl, setAppBaseUrl] = useState<string>(DEFAULT_PRODUCTION_URL);

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

  // Place Card & Luxury Wedding Invitation Designer states
  const [cardStationeryType, setCardStationeryType] = useState<"wedding-card" | "place-card">("wedding-card");
  const [singlePrintGuestId, setSinglePrintGuestId] = useState<string | null>(null);
  const [cardSearchQuery, setCardSearchQuery] = useState("");
  const [cardFilterTable, setCardFilterTable] = useState<string>("all");
  const [cardImportantNote, setCardImportantNote] = useState(
    "Kindly present this personalized wedding card or scan the QR code upon arrival at the VIP reception desk. Formal Attire / Traditional Elegance."
  );
  const [showVenueOnCards, setShowVenueOnCards] = useState(true);
  const [showImportantThingsOnCards, setShowImportantThingsOnCards] = useState(true);
  const [showDateOnCards, setShowDateOnCards] = useState(true);
  const [guestQrMap, setGuestQrMap] = useState<Record<string, string>>({});
  const [placeCardLayout, setPlaceCardLayout] = useState<"cameo" | "banner" | "side" | "minimal">("cameo");
  const [showQrOnCards, setShowQrOnCards] = useState(true);

  // Reset single-card print target after browser print dialog closes
  useEffect(() => {
    const handleAfterPrint = () => {
      setSinglePrintGuestId(null);
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  // Pre-generate scannable QR codes for all guests when viewing cards
  useEffect(() => {
    if (activeTab === "tables" && guests.length > 0) {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const generateAllQrs = async () => {
        const qrs: Record<string, string> = {};
        await Promise.all(
          guests.map(async (g) => {
            try {
              const url = `${origin}/invite/${g.token}`;
              const qrData = await QRCode.toDataURL(url, {
                width: 220,
                margin: 1,
                color: { dark: "#6b0f24", light: "#ffffff" },
              });
              qrs[g.id] = qrData;
            } catch (e) {
              console.error("QR generation error for guest", g.id, e);
            }
          })
        );
        setGuestQrMap(qrs);
      };
      generateAllQrs();
    }
  }, [activeTab, guests]);

  const handlePrintSingleCard = (guestId: string) => {
    setSinglePrintGuestId(guestId);
    setTimeout(() => {
      window.print();
    }, 60);
  };

  const availableTableNumbers = useMemo(() => {
    const set = new Set<number>();
    guests.forEach((g) => {
      if (typeof g.tableNumber === "number") set.add(g.tableNumber);
    });
    return Array.from(set).sort((a, b) => a - b);
  }, [guests]);

  const filteredPrintableGuests = useMemo(() => {
    return guests.filter((g) => {
      if (cardFilterTable !== "all" && String(g.tableNumber) !== cardFilterTable) {
        return false;
      }
      if (cardSearchQuery.trim()) {
        const query = cardSearchQuery.toLowerCase();
        const name = (g.displayName || "").toLowerCase();
        const salutation = (g.salutation || "").toLowerCase();
        const table = `table ${g.tableNumber}`.toLowerCase();
        return name.includes(query) || salutation.includes(query) || table.includes(query);
      }
      return true;
    });
  }, [guests, cardFilterTable, cardSearchQuery]);

  const formattedEventDate = useMemo(() => {
    if (!settings.eventDate) return "Date to be announced";
    try {
      return new Date(settings.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return settings.eventDate;
    }
  }, [settings.eventDate]);

  const formattedEventTime = useMemo(() => {
    if (!settings.eventDate) return "";
    try {
      return new Date(settings.eventDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  }, [settings.eventDate]);

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
    const base = getAppBaseUrl();
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
      `"${base}/invite/${g.token}"`,
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
    const link = inviteLink(g.token);
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
        body: JSON.stringify({ action: "bulk", guests: parsedGuests, eventId: activeEventId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Bulk import failed");
      }

      const data = await res.json();
      setShowBulkModal(false);
      setBulkCsvText("");
      showToast(`Successfully imported ${parsedGuests.length} guests!`);
      if (data.guests && Array.isArray(data.guests)) {
        setGuests(data.guests);
      } else {
        loadData(activeEventId);
      }
    } catch (err: any) {
      alert(err.message || "Failed to import guests");
    } finally {
      setBulkImporting(false);
    }
  }



  // Toast notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

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

    const isVid = file.type.startsWith("video/") || Boolean(file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i));
    const isAudio = file.type.startsWith("audio/") || Boolean(file.name.match(/\.(mp3|wav|ogg|m4a)$/i));
    const mediaLabel = isVid ? "Pre-shoot video" : isAudio ? "Audio track" : "Photo";

    setUploadingField(fieldKey);
    setUploadProgress(0);
    showToast(`Uploading ${mediaLabel.toLowerCase()}... Please wait.`);

    try {
      let finalUrl: string | null = null;

      // Strategy 1: Direct Client Upload to Cloudinary (bypasses 4.5MB Serverless Limit!)
      if (isCloudinaryClientConfigured()) {
        try {
          const cloudRes = await uploadToCloudinary(file, {
            folder: isVid ? "wedding-videos" : isAudio ? "wedding-audio" : "wedding-photos",
            onProgress: (pct) => setUploadProgress(pct),
          });
          if (cloudRes && cloudRes.secure_url) {
            finalUrl = cloudRes.secure_url;
          }
        } catch (cloudErr: any) {
          console.warn("Direct Cloudinary upload failed, attempting server upload:", cloudErr);
          // If file is too large for server fallback (> 4.5MB), rethrow direct upload error
          if (file.size > 4.5 * 1024 * 1024) {
            throw new Error(`Cloudinary upload failed: ${cloudErr.message || "Unknown error"}`);
          }
        }
      }

      // Strategy 2: Fallback to standard Multipart/FormData Server Upload (works for local dev or files <= 4.5MB)
      if (!finalUrl) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 413) {
            throw new Error(
              `File is too large for this upload path (${(file.size / (1024 * 1024)).toFixed(1)} MB). Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.`
            );
          }
          if (data.error) {
            throw new Error(data.error);
          }
          throw new Error(`Upload failed (${res.status})`);
        }

        finalUrl = data.url;
      }

      if (!finalUrl) {
        throw new Error("Failed to receive valid uploaded media URL");
      }

      onSuccess(finalUrl);
      showToast(`${mediaLabel} uploaded successfully!`);
    } catch (err: any) {
      console.error("Upload error:", err);
      const errMsg = err.message || "Failed to upload media file";
      showToast(`Upload failed: ${errMsg}`);
      alert(errMsg);
    } finally {
      setUploadingField(null);
      setUploadProgress(null);
      e.target.value = "";
    }
  }


  async function loadData(targetEventId?: string) {
    setLoading(true);
    setAppBaseUrl(getAppBaseUrl());
    try {
      const savedEventId = typeof window !== "undefined" ? localStorage.getItem("active_wedding_event_id") : null;
      const queryEventId = targetEventId || activeEventId || savedEventId || "";
      const url = queryEventId
        ? `/api/admin/bootstrap?eventId=${encodeURIComponent(queryEventId)}`
        : "/api/admin/bootstrap";

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setManager(data.manager || null);
        const evList: WeddingEventItem[] = data.events || [];
        setEvents(evList);

        const activeId = data.activeEventId || evList[0]?.id || "";
        setActiveEventId(activeId);
        if (typeof window !== "undefined" && activeId) {
          localStorage.setItem("active_wedding_event_id", activeId);
        }

        if (data.storageStatus) {
          setStorageStatus(data.storageStatus);
        }

        setGuests(Array.isArray(data.guests) ? data.guests : []);

        if (data.settings && data.settings.coupleNames) {
          setSettings({
            ...data.settings,
            eventDate: data.settings.eventDate
              ? new Date(data.settings.eventDate).toISOString().slice(0, 16)
              : "2026-10-04T19:00",
          });
        }

        setEventPhotos(data.photos || []);

        if (data.manager?.role === "SUPER_ADMIN") {
          setManagers(data.managers || []);
        } else {
          setActiveTab((prev) => (prev === "events" || prev === "managers" ? "guests" : prev));
        }
      } else if (res.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
      }
    } catch (err) {
      console.error("Dashboard loadData error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadManagers() {
    try {
      const res = await fetch("/api/admin/managers");
      if (res.ok) {
        const data = await res.json();
        setManagers(data.managers || []);
      }
    } catch (err) {
      console.error("Load managers error:", err);
    }
  }

  async function handleCreateManager(e: React.FormEvent) {
    e.preventDefault();
    setCreatingManager(true);
    try {
      const res = await fetch("/api/admin/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newManagerForm),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Event Manager "@${newManagerForm.username}" created successfully!`);
        setShowCreateManagerModal(false);
        setNewManagerForm({
          username: "",
          password: "",
          name: "",
          company: "",
          email: "",
          phone: "",
          role: "MANAGER",
          createStarterWedding: true,
          starterCoupleNames: "",
          starterVenueName: "",
        });
        loadManagers();
        loadData();
      } else {
        alert(data.error || "Failed to create Event Manager");
      }
    } catch {
      alert("Network error creating Event Manager");
    } finally {
      setCreatingManager(false);
    }
  }

  function handleOpenEditManager(mgr: EventManagerListItem) {
    setEditingManager(mgr);
    setEditManagerForm({
      name: mgr.name,
      company: mgr.company || "",
      email: mgr.email || "",
      phone: mgr.phone || "",
      role: mgr.role || "MANAGER",
      newPassword: "",
    });
    setShowEditManagerModal(true);
  }

  async function handleUpdateManager(e: React.FormEvent) {
    e.preventDefault();
    if (!editingManager) return;
    setUpdatingManager(true);
    try {
      const res = await fetch("/api/admin/managers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingManager.id,
          name: editManagerForm.name,
          company: editManagerForm.company,
          email: editManagerForm.email,
          phone: editManagerForm.phone,
          role: editManagerForm.role,
          newPassword: editManagerForm.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Event Manager "@${editingManager.username}" updated successfully!`);
        setShowEditManagerModal(false);
        setEditingManager(null);
        loadManagers();
        loadData();
      } else {
        alert(data.error || "Failed to update Event Manager");
      }
    } catch {
      alert("Network error updating Event Manager");
    } finally {
      setUpdatingManager(false);
    }
  }

  function handleOpenDeleteModal(mgr: EventManagerListItem) {
    setManagerToDelete({
      id: mgr.id,
      username: mgr.username,
      name: mgr.name,
      weddingCount: mgr._count?.events || mgr.events?.length || 0,
    });
  }

  async function handleConfirmDeleteManager() {
    if (!managerToDelete) return;
    setDeletingManager(true);
    try {
      const res = await fetch(`/api/admin/managers?id=${managerToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Event Manager "@${managerToDelete.username}" removed.`);
        setManagerToDelete(null);
        loadManagers();
        loadData();
      } else {
        alert(data.error || "Failed to delete Event Manager");
      }
    } catch {
      alert("Network error deleting Event Manager");
    } finally {
      setDeletingManager(false);
    }
  }

  async function handleCopyUsername(username: string) {
    try {
      await navigator.clipboard.writeText(`@${username}`);
      setCopiedUsername(username);
      showToast(`Copied "@${username}" to clipboard!`);
      setTimeout(() => setCopiedUsername(null), 2200);
    } catch {
      showToast(`Username: @${username}`);
    }
  }

  const filteredManagers = useMemo(() => {
    let list = [...managers];

    // Role filter
    if (selectedManagerFilter === "SUPER_ADMIN") {
      list = list.filter((m) => m.role === "SUPER_ADMIN");
    } else if (selectedManagerFilter === "MANAGER") {
      list = list.filter((m) => m.role !== "SUPER_ADMIN");
    }

    // Search query filter
    if (managerSearchQuery.trim()) {
      const q = managerSearchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.username.toLowerCase().includes(q) ||
          (m.company && m.company.toLowerCase().includes(q)) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.phone && m.phone.includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (managerSortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (managerSortBy === "weddings") {
        const countA = a._count?.events || a.events?.length || 0;
        const countB = b._count?.events || b.events?.length || 0;
        return countB - countA;
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [managers, managerSearchQuery, selectedManagerFilter, managerSortBy]);

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
          managerId: "",
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
      const data = await res.json();
      if (res.ok) {
        showToast("Photo added to EventPhoto table!");
        setShowAddPhotoModal(false);
        setNewPhotoForm({ url: "", title: "", subtitle: "", tag: "Pre-Wedding" });
        if (data.photo) {
          setEventPhotos((prev) => [...prev, data.photo]);
        }
      } else {
        alert(data.error || "Failed to add photo");
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

    try {
      if (editingId) {
        const res = await fetch(`/api/admin/guests/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to update guest");
        }
        const updatedGuest: Guest = await res.json();
        setGuests((prev) => prev.map((g) => (g.id === editingId ? updatedGuest : g)));
        showToast("Guest details updated successfully!");
        setEditingId(null);
      } else {
        const res = await fetch("/api/admin/guests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            eventId: activeEventId,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to add guest");
        }
        const createdGuest: Guest = await res.json();
        setGuests((prev) => [createdGuest, ...prev]);
        showToast("New guest added and invite link generated!");
      }

      setForm(emptyForm);
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message || "Failed to save guest");
    }
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
    try {
      const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Guest removed.");
        setGuests((prev) => prev.filter((g) => g.id !== id));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to remove guest");
      }
    } catch {
      alert("Network error removing guest");
    }
  }

  function inviteLink(token: string) {
    const base = getAppBaseUrl();
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
      } else {
        const errData = await res.json().catch(() => ({}));
        const msg = errData.error || "Failed to update event settings";
        showToast(msg);
        alert(msg);
      }
    } catch {
      showToast("Network error updating settings");
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
    <div className="min-h-screen bg-[#121013] text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#800020] text-[#fdfbf7] text-xs font-cinzel font-semibold shadow-2xl border border-[#dfba73] flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#edd892]" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Tier 1: Top Navigation Bar (Manager Identity + System Actions & Switcher) */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c5a059]/25">
          {/* Left: Event Manager Profile Avatar & Interactive Identity Hub */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="group flex items-center gap-3.5 p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-[#1c1519] via-[#231821] to-[#181116] border border-[#c5a059]/35 hover:border-[#dfba73]/70 shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.2)] transition-all duration-300 w-full sm:w-auto text-left cursor-pointer"
              aria-expanded={showProfileMenu}
              title="Click to view Account Profile details"
            >
              {/* Profile Icon / Medallion */}
              <div className="relative shrink-0">
                {/* Outer gilded glow ring */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 shadow-md flex items-center justify-center ${
                    manager?.role === "SUPER_ADMIN"
                      ? "bg-gradient-to-tr from-[#c5a059] via-[#edd892] to-[#8c6a2b] shadow-[#c5a059]/20"
                      : "bg-gradient-to-tr from-emerald-600 via-[#85e3b3] to-emerald-800 shadow-emerald-500/20"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-[14px] flex items-center justify-center font-cinzel font-bold text-base transition-transform group-hover:scale-105 duration-200 ${
                      manager?.role === "SUPER_ADMIN"
                        ? "bg-gradient-to-b from-[#3a0614] via-[#22070f] to-[#140409] text-[#dfba73]"
                        : "bg-gradient-to-b from-[#062d1d] via-[#091b13] to-[#06100c] text-emerald-300"
                    }`}
                  >
                    {manager?.role === "SUPER_ADMIN" ? (
                      <div className="relative flex items-center justify-center">
                        <Crown className="w-6 h-6 text-[#edd892] drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
                      </div>
                    ) : (
                      <span className="tracking-tighter">
                        {(
                          manager?.name
                            ?.trim()
                            .split(/\s+/)
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("") ||
                          manager?.username?.slice(0, 2) ||
                          "EM"
                        ).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Precision Online Status Pip */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#1c1519] items-center justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </span>
                </span>
              </div>

              {/* Identity Text & Details */}
              <div className="min-w-0 flex-1 pr-1">
                {/* Row 1: Role pill + Username */}
                <div className="flex items-center gap-1.5 mb-1">
                  {manager?.role === "SUPER_ADMIN" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#800020]/80 to-[#420614]/90 text-[#edd892] text-[10px] font-cinzel font-bold border border-[#dfba73]/40 shadow-sm">
                      <Crown className="w-2.5 h-2.5 text-[#dfba73]" /> Super Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-sans font-medium border border-emerald-500/40">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Event Planner
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-[#edd892]/70 group-hover:text-[#edd892] transition-colors">
                    @{manager?.username || "admin"}
                  </span>
                </div>

                {/* Row 2: User Name */}
                <div className="font-cinzel font-bold text-sm sm:text-base text-[#fdfbf7] group-hover:text-[#edd892] transition-colors leading-tight truncate">
                  {manager?.name || (manager?.role === "SUPER_ADMIN" ? "Lead Wedding Planner" : "Event Manager")}
                </div>

                {/* Row 3: Studio / Agency */}
                <div className="text-[11px] text-[#edd892]/75 flex items-center gap-1.5 mt-0.5 truncate font-sans">
                  <Building2 className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                  <span className="truncate">{manager?.company || "Royal Digital Wedding Suite"}</span>
                  <ChevronDown className="w-3 h-3 text-[#dfba73]/50 group-hover:text-[#dfba73] group-hover:translate-y-0.5 transition-all ml-1 shrink-0" />
                </div>
              </div>
            </button>

            {/* Executive Account Details Dropdown Popover */}
            {showProfileMenu && (
              <>
                {/* Backdrop to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />

                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#1b1419] border border-[#dfba73]/50 shadow-2xl z-50 p-4 space-y-3.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {/* Account Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-[#c5a059]/20">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-cinzel font-bold text-sm border ${
                        manager?.role === "SUPER_ADMIN"
                          ? "bg-gradient-to-br from-[#800020] to-[#25040b] text-[#edd892] border-[#dfba73]/50"
                          : "bg-gradient-to-br from-emerald-950 to-[#121013] text-emerald-300 border-emerald-500/50"
                      }`}
                    >
                      {manager?.role === "SUPER_ADMIN" ? (
                        <Crown className="w-5 h-5 text-[#dfba73]" />
                      ) : (
                        (manager?.name?.[0] || "M").toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-cinzel font-bold text-sm text-white truncate">
                        {manager?.name || "Lead Wedding Planner"}
                      </div>
                      <div className="text-xs font-mono text-[#edd892]/70">@{manager?.username}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Active Authenticated Session</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Details */}
                  <div className="space-y-1.5 text-xs text-[#fdfbf7]/80">
                    <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                      <span className="text-white/40">Studio / Agency</span>
                      <span className="text-[#edd892] font-semibold truncate max-w-[170px] text-right">
                        {manager?.company || "Royal Digital Wedding Suite"}
                      </span>
                    </div>
                    {manager?.email && (
                      <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                        <span className="text-white/40">Email</span>
                        <span className="text-white/80 font-mono truncate max-w-[170px] text-right">
                          {manager.email}
                        </span>
                      </div>
                    )}
                    {manager?.phone && (
                      <div className="flex items-center justify-between text-[11px] py-1 border-b border-white/5">
                        <span className="text-white/40">Contact</span>
                        <span className="text-white/80 font-mono text-right">{manager.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] py-1">
                      <span className="text-white/40">Access Level</span>
                      <span className="text-[#dfba73] font-cinzel font-bold text-right">
                        {manager?.role === "SUPER_ADMIN" ? "Super Admin Authority" : "Event Planner Portfolio"}
                      </span>
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="pt-2 border-t border-[#c5a059]/20 space-y-1.5">
                    {manager?.role === "SUPER_ADMIN" && (
                      <button
                        onClick={() => {
                          setActiveTab("managers");
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#241a21] hover:bg-[#800020]/40 text-[#dfba73] text-xs font-cinzel font-semibold flex items-center justify-between transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" /> Planners Directory
                        </span>
                        <span className="text-[10px] font-mono text-[#edd892]">{managers.length}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#241a21] hover:bg-[#c5a059]/15 text-[#dfba73] text-xs font-cinzel font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" /> Wedding Suite Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-cinzel font-semibold flex items-center gap-2 transition cursor-pointer border border-rose-900/40"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Wedding Switcher & Global Toolbar Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-start md:justify-end">
            {/* Wedding Switcher Selector: Dropdown for Super Admin, Dedicated Badge for Event Manager */}
            {manager?.role === "SUPER_ADMIN" ? (
              <div className="flex items-center gap-2 bg-[#1c161a] border border-[#c5a059]/60 rounded-xl px-3 py-2 shadow-md w-full sm:w-auto min-h-[42px]">
                <Sparkles className="w-4 h-4 text-[#dfba73] shrink-0" />
                <select
                  value={activeEventId}
                  onChange={(e) => handleSelectEvent(e.target.value)}
                  className="bg-transparent text-xs font-cinzel font-semibold text-[#fdfbf7] focus:outline-none cursor-pointer w-full sm:max-w-[200px] md:max-w-[240px] truncate"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id} className="bg-[#1c161a] text-white">
                      {ev.coupleNames} {ev.manager ? `(${ev.manager.company || ev.manager.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-[#1c161a] border border-[#c5a059]/40 rounded-xl px-3 py-2 shadow-md w-full sm:w-auto min-h-[42px]">
                <Sparkles className="w-4 h-4 text-[#dfba73] shrink-0" />
                <span className="text-xs font-cinzel font-semibold text-[#fdfbf7] truncate max-w-[180px]">
                  {currentEvent?.coupleNames || settings.coupleNames}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono shrink-0">
                  Dedicated
                </span>
              </div>
            )}

            {/* Super Admin: + Add Event Manager Button */}
            {manager?.role === "SUPER_ADMIN" && (
              <button
                onClick={() => setShowCreateManagerModal(true)}
                className="px-3 py-2 rounded-xl bg-[#800020] hover:bg-[#6b0f24] text-white text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow border border-[#dfba73]/60 cursor-pointer min-h-[42px] touch-manipulation transition shrink-0"
                title="Create a new Event Manager login"
              >
                <UserPlus className="w-3.5 h-3.5" /> <span className="truncate">+ Manager</span>
              </button>
            )}

            {/* Super Admin: + New Wedding Button */}
            {manager?.role === "SUPER_ADMIN" && (
              <button
                onClick={() => setShowCreateEventModal(true)}
                className="btn-gold-shimmer px-3 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer min-h-[42px] touch-manipulation shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> <span className="truncate">New Wedding</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/10 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[42px] touch-manipulation shrink-0"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const current = getAppBaseUrl();
                const custom = prompt(
                  "Public Domain for WhatsApp Invites & QR Codes:\n\nDefault: https://wedding-invitation-app-silk.vercel.app\nEnter your custom or production URL:",
                  current
                );
                if (custom !== null && custom.trim()) {
                  const clean = custom.trim().replace(/\/+$/, "");
                  localStorage.setItem("wedding_invitation_base_url", clean);
                  setAppBaseUrl(clean);
                  showToast(`Active invite domain set to: ${clean}`);
                }
              }}
              className="px-3 py-2 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/10 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[42px] touch-manipulation shrink-0"
              title={`Active Public Domain: ${appBaseUrl} (Click to change)`}
            >
              <Link2 className="w-3.5 h-3.5 text-[#ffd700]" /> <span>Domain</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-[#800020]/20 border border-rose-800/60 text-rose-300 hover:bg-rose-950/40 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[42px] touch-manipulation shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" /> <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Tier 2: Active Wedding Showcase Hero Banner (Prominent, dedicated breathing room) */}
        <div className="my-5 p-4 sm:p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#1c1519] via-[#22161f] to-[#181116] border border-[#c5a059]/35 shadow-xl relative overflow-hidden">
          {/* Gilded atmospheric glow effect */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Wedding Title & Badges */}
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase font-cinzel font-bold text-[#dfba73]/80 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#edd892]" /> Active Wedding Suite
                </span>
                {currentEvent?.venueName && (
                  <span className="text-[11px] text-[#fdfbf7]/50 font-sans hidden sm:inline-flex items-center gap-1">
                    • <MapPin className="w-3 h-3 text-[#dfba73]" /> {currentEvent.venueName}
                  </span>
                )}
              </div>

              <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold gold-foil-text tracking-tight break-words">
                {currentEvent?.coupleNames || settings.coupleNames}
              </h1>

              {/* Meta Badges Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {/* 1-Click Copy Public Invite Link */}
                <button
                  type="button"
                  onClick={() => {
                    const url = `${appBaseUrl}/e/${currentEvent?.slug || "wedding"}`;
                    navigator.clipboard.writeText(url);
                    showToast("Copied public invitation link to clipboard!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#130d12] hover:bg-[#20151f] border border-[#c5a059]/35 font-mono text-[11px] text-[#edd892] shadow-sm transition cursor-pointer group"
                  title="Click to copy public invitation URL"
                >
                  <Link2 className="w-3 h-3 text-[#dfba73] group-hover:scale-110 transition-transform" />
                  <span>/e/{currentEvent?.slug || "wedding"}</span>
                  <Copy className="w-3 h-3 text-[#dfba73]/60 group-hover:text-[#edd892] ml-1" />
                </button>

                {/* Planner Pill (Super Admin view) */}
                {currentEvent?.manager && manager?.role === "SUPER_ADMIN" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020]/25 border border-[#dfba73]/35 text-[11px] text-[#dfba73] font-sans shadow-sm">
                    <User className="w-3 h-3 text-[#edd892]" />
                    <span>
                      Planner: <strong className="text-white">{currentEvent.manager.name}</strong>
                      {currentEvent.manager.company ? ` (${currentEvent.manager.company})` : ""}
                    </span>
                  </span>
                )}

                {/* Event Date Badge if set */}
                {currentEvent?.eventDate && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191217] border border-[#c5a059]/25 text-[11px] text-[#edd892] font-sans shadow-sm">
                    <Calendar className="w-3 h-3 text-[#dfba73]" />
                    <span>
                      {new Date(currentEvent.eventDate).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Action: Preview Wedding in New Tab */}
            <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <a
                href={`/e/${currentEvent?.slug || "wedding"}`}
                target="_blank"
                rel="noreferrer"
                className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center justify-center gap-2 shadow-lg transition touch-manipulation cursor-pointer w-full sm:w-auto min-h-[44px]"
                title="Open guest invitation preview in new tab"
              >
                <ExternalLink className="w-4 h-4" /> <span>Preview Wedding</span>
              </a>
            </div>
          </div>
        </div>

        {/* Executive Stats & Live RSVP Analytics Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4 mb-6">
          {/* Card 1: Total Invited */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/30 backdrop-blur-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#dfba73] mb-1">
                <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                  Total Invited
                </span>
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
                {rsvpStats.totalInvited}
              </div>
            </div>
            <span className="text-[10px] text-[#fdfbf7]/60 font-sans mt-1 block">
              ~{stats.estimatedHeadcount} Max Potential
            </span>
          </div>

          {/* Card 2: Confirmed Attending */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c161a] border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-transparent backdrop-blur-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                  Attending
                </span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-emerald-300">
                {rsvpStats.attendingCount}
              </div>
            </div>
            <span className="text-[10px] text-emerald-400/90 font-sans mt-1 block font-medium truncate">
              {rsvpStats.totalHeadcount} Seats Claimed
            </span>
          </div>

          {/* Card 3: Declined */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c161a] border border-rose-800/40 bg-gradient-to-b from-rose-950/20 to-transparent backdrop-blur-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                  Declined
                </span>
                <XCircle className="w-3.5 h-3.5" />
              </div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-rose-300">
                {rsvpStats.declinedCount}
              </div>
            </div>
            <span className="text-[10px] text-rose-400/70 font-sans mt-1 block truncate">
              Regretfully cannot join
            </span>
          </div>

          {/* Card 4: Pending RSVP */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#1c161a] border border-[#c5a059]/40 backdrop-blur-sm shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#dfba73] mb-1">
                <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold">
                  Pending RSVP
                </span>
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#dfba73]">
                {rsvpStats.pendingCount}
              </div>
            </div>
            <span className="text-[10px] text-[#dfba73]/70 font-sans mt-1 block truncate">
              Awaiting confirmation
            </span>
          </div>

          {/* Card 5: Open Rate */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1c161a] to-[#251821] border border-[#c5a059]/40 backdrop-blur-sm shadow-md col-span-2 sm:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#dfba73] mb-1">
                <span className="text-[10px] uppercase tracking-wider font-cinzel font-semibold flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Open Rate
                </span>
                <span className="text-[10px] font-mono text-[#edd892] font-semibold">
                  {stats.viewedCount}/{stats.totalGuests}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fdfbf7]">
                  {stats.openRate}%
                </div>
                <span className="text-[10px] text-[#fdfbf7]/60 font-sans">engagement</span>
              </div>
            </div>
            {/* Elegant mini progress track */}
            <div className="w-full h-1.5 rounded-full bg-[#120e11] border border-[#c5a059]/20 mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#c5a059] to-[#ffd700] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, stats.openRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dietary Preferences Overview Bar */}
        {Object.keys(rsvpStats.dietaryCounts).length > 0 && (
          <div className="mb-6 px-3.5 sm:px-4 py-3 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[#dfba73] font-cinzel font-bold shrink-0">
              <Utensils className="w-3.5 h-3.5" /> Catering & Dietary Requirements:
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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

        {/* Luxury Responsive Tabs Navigation */}
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:flex xl:flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setActiveTab("guests")}
              className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] ${
                activeTab === "guests"
                  ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/80 shadow-lg shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                  : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/15 border border-[#c5a059]/20"
              }`}
            >
              <Users className="w-4 h-4 text-[#dfba73] shrink-0" />
              <span className="truncate hidden sm:inline">Guest Directory</span>
              <span className="truncate sm:hidden">Guests</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                activeTab === "guests" ? "bg-white/20 text-white" : "bg-[#181216] text-[#dfba73]"
              }`}>
                {guests.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("photos")}
              className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] ${
                activeTab === "photos"
                  ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/80 shadow-lg shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                  : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/15 border border-[#c5a059]/20"
              }`}
            >
              <Camera className="w-4 h-4 text-[#dfba73] shrink-0" />
              <span className="truncate hidden sm:inline">Photos Table</span>
              <span className="truncate sm:hidden">Photos</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                activeTab === "photos" ? "bg-white/20 text-white" : "bg-[#181216] text-[#dfba73]"
              }`}>
                {eventPhotos.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] ${
                activeTab === "settings"
                  ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/80 shadow-lg shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                  : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/15 border border-[#c5a059]/20"
              }`}
            >
              <Settings className="w-4 h-4 text-[#dfba73] shrink-0" />
              <span className="truncate hidden sm:inline">Ceremony & Settings</span>
              <span className="truncate sm:hidden">Settings</span>
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] ${
                activeTab === "tables"
                  ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/80 shadow-lg shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                  : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/15 border border-[#c5a059]/20"
              }`}
            >
              <Printer className="w-4 h-4 text-[#dfba73] shrink-0" />
              <span className="truncate hidden sm:inline">Printable Cards & Invitations</span>
              <span className="truncate sm:hidden">Print Cards</span>
            </button>
            {manager?.role === "SUPER_ADMIN" && (
              <button
                onClick={() => setActiveTab("events")}
                className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] col-span-1 sm:col-span-1 xl:col-auto ${
                  activeTab === "events"
                    ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73]/80 shadow-lg shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                    : "bg-[#231a20] text-[#fdfbf7]/70 hover:bg-[#c5a059]/15 border border-[#c5a059]/20"
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#dfba73] shrink-0" />
                <span className="truncate hidden sm:inline">Platform Weddings</span>
                <span className="truncate sm:hidden">Weddings</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                  activeTab === "events" ? "bg-white/20 text-white" : "bg-[#181216] text-[#dfba73]"
                }`}>
                  {events.length}
                </span>
              </button>
            )}
            {manager?.role === "SUPER_ADMIN" && (
              <button
                onClick={() => setActiveTab("managers")}
                className={`w-full xl:w-auto px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold tracking-wider transition cursor-pointer flex items-center justify-center sm:justify-start gap-2 touch-manipulation min-h-[44px] col-span-1 sm:col-span-1 xl:col-auto ${
                  activeTab === "managers"
                    ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73] shadow-lg ring-1 ring-[#dfba73]/40"
                    : "bg-[#2a1721] text-[#dfba73] hover:bg-[#c5a059]/15 border border-[#c5a059]/30"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#dfba73] shrink-0" />
                <span className="truncate hidden sm:inline">Event Managers</span>
                <span className="truncate sm:hidden">Managers</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                  activeTab === "managers" ? "bg-white/20 text-white" : "bg-[#181216] text-[#dfba73]"
                }`}>
                  {managers.length}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: GUEST DIRECTORY */}
        {activeTab === "guests" && (
          <div className="space-y-4">
            {/* Search & Filter Toolbar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#1c1519] border border-[#c5a059]/30 shadow-lg space-y-3">
              {/* Row 1: Search Input & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c5a059]/70" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, table number, notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73] min-h-[42px]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dfba73]/60 hover:text-white p-1"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/50 text-[#dfba73] hover:bg-[#c5a059]/15 text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition cursor-pointer min-h-[42px] touch-manipulation"
                  >
                    <Upload className="w-3.5 h-3.5" /> <span>Bulk CSV</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                      setShowAddModal(true);
                    }}
                    className="flex-1 sm:flex-initial btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer min-h-[42px] touch-manipulation"
                  >
                    <Plus className="w-4 h-4" /> <span>Add Guest</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Quick RSVP Filter Pills + Secondary Dropdowns */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-[#c5a059]/15">
                {/* RSVP Status Chips (One-touch filter) */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73]/70 mr-1 shrink-0">
                    RSVP:
                  </span>
                  {[
                    { id: "ALL", label: `All (${guests.length})` },
                    { id: "ATTENDING", label: `Attending (${rsvpStats.attendingCount})` },
                    { id: "PENDING", label: `Pending (${rsvpStats.pendingCount})` },
                    { id: "DECLINED", label: `Declined (${rsvpStats.declinedCount})` },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setFilterRsvp(chip.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-cinzel font-semibold whitespace-nowrap transition cursor-pointer shrink-0 border ${
                        filterRsvp === chip.id
                          ? chip.id === "ATTENDING"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                            : chip.id === "DECLINED"
                            ? "bg-rose-950 text-rose-300 border-rose-700"
                            : chip.id === "PENDING"
                            ? "bg-[#800020] text-[#edd892] border-[#dfba73]"
                            : "bg-[#800020] text-white border-[#dfba73]"
                          : "bg-[#231a20] text-[#fdfbf7]/70 border-[#c5a059]/30 hover:bg-[#c5a059]/15"
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Secondary Select Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#261c22] border border-[#c5a059]/40 text-[11px] font-cinzel text-[#dfba73] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="SINGLE">1 Person</option>
                    <option value="COUPLE">Couples</option>
                    <option value="FAMILY">Families</option>
                  </select>

                  <select
                    value={filterViewed}
                    onChange={(e) => setFilterViewed(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#261c22] border border-[#c5a059]/40 text-[11px] font-cinzel text-[#dfba73] focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Opens</option>
                    <option value="VIEWED">Opened</option>
                    <option value="UNVIEWED">Unopened</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#261c22] border border-[#c5a059]/40 text-[11px] font-cinzel text-[#dfba73] focus:outline-none cursor-pointer"
                  >
                    <option value="created">Recently Added</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="table">Table Number</option>
                    <option value="viewed">Recently Viewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {!loading && filteredGuests.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-[#181216] border border-[#c5a059]/30 space-y-3">
                <Users className="w-10 h-10 text-[#dfba73]/40 mx-auto" />
                <h3 className="font-cinzel text-base font-bold text-[#fdfbf7]">No Guests Found</h3>
                <p className="text-xs text-[#fdfbf7]/60 max-w-sm mx-auto font-sans">
                  No guest records match your search or filters. Try adjusting your query or add a new guest.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRsvp("ALL");
                    setFilterType("ALL");
                    setFilterViewed("ALL");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs font-cinzel text-[#dfba73] hover:bg-[#c5a059]/15"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* MOBILE VIEW (< md): Luxury Guest Cards */}
            <div className="block md:hidden space-y-3">
              {filteredGuests.map((g) => (
                <div
                  key={`mobile-${g.id}`}
                  className="rounded-2xl bg-[#1c141a] border border-[#c5a059]/35 p-4 shadow-lg space-y-3 transition hover:border-[#dfba73]/60"
                >
                  {/* Top Row: Name + Salutation and Table Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-cinzel font-bold text-base text-[#fdfbf7] leading-snug">
                        {g.salutation} {g.displayName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-[#c5a059]/15 text-[#dfba73] text-[10px] font-cinzel font-semibold">
                          {inviteTypeLabels[g.inviteType]}
                        </span>
                        {g.viewedAt ? (
                          <span className="text-[10px] text-emerald-400 font-sans flex items-center gap-0.5">
                            <Eye className="w-3 h-3" /> Opened
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#fdfbf7]/40 font-sans flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> Unopened
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-[#281822] border border-[#c5a059]/40 font-cinzel font-bold text-xs text-[#dfba73] shadow-inner">
                        Table #{String(g.tableNumber).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: RSVP Status & Dietary */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#c5a059]/15">
                    {g.rsvpStatus === "ATTENDING" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 text-xs font-cinzel font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Attending ({g.attendeeCount || 1} {g.attendeeCount === 1 ? "seat" : "seats"})
                      </span>
                    ) : g.rsvpStatus === "DECLINED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-700/70 text-rose-300 text-xs font-cinzel font-semibold">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" /> Declined
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2a1d25] border border-[#c5a059]/30 text-[#dfba73] text-xs font-cinzel">
                        <Clock className="w-3.5 h-3.5" /> Pending RSVP
                      </span>
                    )}

                    {g.dietary && g.dietary !== "NONE" && (
                      <span className="px-2.5 py-1 rounded-lg bg-[#2b1e17] border border-amber-500/40 text-amber-300 text-[11px] font-sans">
                        🥗 {g.dietary}
                      </span>
                    )}
                  </div>

                  {/* Contact & Notes */}
                  {(g.phone || g.notes) && (
                    <div className="space-y-1 text-xs text-[#fdfbf7]/70 font-sans pt-1">
                      {g.phone && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#dfba73]">📞</span>
                          <a href={`tel:${g.phone}`} className="font-mono text-[#dfba73] hover:underline">
                            {g.phone}
                          </a>
                        </div>
                      )}
                      {g.notes && (
                        <div className="text-[11px] text-[#edd892]/80 italic bg-[#231a20]/60 px-2.5 py-1 rounded-lg border border-[#c5a059]/20">
                          &quot;{g.notes}&quot;
                        </div>
                      )}
                    </div>
                  )}

                  {/* Touch Action Bar (Min 44px tap targets) */}
                  <div className="pt-2 border-t border-[#c5a059]/20 flex items-center gap-1.5">
                    {/* Primary WhatsApp Action */}
                    <button
                      onClick={() => handleSendWhatsApp(g)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-400 text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer min-h-[42px]"
                      title="Send WhatsApp Invitation"
                    >
                      <Send className="w-3.5 h-3.5" /> <span>WhatsApp</span>
                    </button>

                    {/* Secondary Action Icons */}
                    <button
                      onClick={() => openQrModal(g)}
                      title="View VIP QR Pass"
                      className="w-10 h-10 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 flex items-center justify-center transition cursor-pointer touch-manipulation shrink-0"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyLink(g)}
                      title="Copy Personalized Invite Link"
                      className="w-10 h-10 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 flex items-center justify-center transition cursor-pointer touch-manipulation shrink-0"
                    >
                      {copiedId === g.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <a
                      href={inviteLink(g.token)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open and Preview Guest Invite"
                      className="w-10 h-10 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#edd892] hover:bg-[#c5a059]/20 flex items-center justify-center transition shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => startEdit(g)}
                      title="Edit Guest Details"
                      className="w-10 h-10 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#c5a059]/20 flex items-center justify-center transition cursor-pointer touch-manipulation shrink-0"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id)}
                      title="Delete Guest"
                      className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 flex items-center justify-center transition cursor-pointer touch-manipulation shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (≥ md): Full Data Table */}
            <div className="hidden md:block rounded-2xl bg-[#181216] border border-[#c5a059]/30 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 gap-2 px-4 py-3.5 bg-[#261820] text-xs font-cinzel font-semibold text-[#dfba73] border-b border-[#c5a059]/30">
                <div className="col-span-4">Guest & Contact</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1 text-center">Table</div>
                <div className="col-span-2">RSVP & Dietary</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {loading && (
                <div className="p-8 text-center text-xs font-cinzel text-[#dfba73]">
                  Loading guest records...
                </div>
              )}

              <div className="divide-y divide-[#c5a059]/15">
                {filteredGuests.map((g) => (
                  <div
                    key={`desktop-${g.id}`}
                    className="grid grid-cols-12 gap-2 px-4 py-3.5 items-center text-xs hover:bg-[#c5a059]/5 transition"
                  >
                    <div className="col-span-4">
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

                    <div className="col-span-2">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#c5a059]/15 text-[#dfba73] text-[10px] font-cinzel font-semibold">
                        {inviteTypeLabels[g.inviteType]}
                      </span>
                    </div>

                    <div className="col-span-1 text-center">
                      <span className="font-cinzel font-bold text-sm text-[#dfba73]">
                        #{String(g.tableNumber).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="col-span-2">
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

                    <div className="col-span-3 flex items-center justify-end gap-1.5">
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
          <div className="rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-4 sm:p-6 lg:p-8 shadow-2xl space-y-6 sm:space-y-8">
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
              <div className="flex items-center gap-3 bg-[#231a20] border border-[#c5a059]/40 px-4 py-2.5 rounded-2xl shadow-inner w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#800020] border border-[#dfba73] flex items-center justify-center text-[#fdfbf7] font-cinzel font-bold text-sm shadow shrink-0">
                    {dashboardMonogram}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel block">
                      Live Monogram
                    </span>
                    <span className="text-xs font-semibold text-[#fdfbf7] truncate max-w-[180px] block">
                      {settings.coupleNames}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6 sm:space-y-8">
              {/* CARD 1: COUPLE & INVITATION WORDING */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px] [color-scheme:dark]"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-y min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Invitation Body / Message
                  </label>
                  <textarea
                    rows={3}
                    value={settings.invitationBody}
                    onChange={(e) => setSettings({ ...settings, invitationBody: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-y min-h-[90px]"
                  />
                </div>
              </div>

              {/* CARD 2: COUPLE PHOTOS & MEDIA MANAGER */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#c5a059]/20">
                  <div className="flex items-center gap-2 text-[#dfba73] font-cinzel text-sm font-bold uppercase tracking-wider">
                    <Film className="w-4 h-4 text-[#dfba73]" /> 2. Couple Pre-Shoot Video & Media Suite
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {storageStatus?.hasCloudinary || storageStatus?.hasBlobToken ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 text-[10px] font-cinzel font-semibold border border-emerald-500/40 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ☁️ Cloudinary Active {storageStatus.cloudName ? `(${storageStatus.cloudName})` : ""}
                      </span>
                    ) : storageStatus?.isVercel ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 text-amber-300 text-[10px] font-cinzel font-semibold border border-amber-500/40 inline-flex items-center gap-1.5">
                        ⚠️ Cloudinary Setup Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-cinzel border border-zinc-600">
                        Local Disk Storage
                      </span>
                    )}
                    {settings.heroVideoUrl && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#800020] text-[#edd892] text-[10px] font-cinzel font-semibold border border-[#dfba73]/40">
                        🎬 Video Mode Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Storage Notification Banner if deployed on Vercel without Cloudinary */}
                {storageStatus && storageStatus.isVercel && !storageStatus.hasCloudinary && !storageStatus.hasBlobToken && (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/50 to-orange-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3 shadow-md">
                    <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-cinzel font-bold text-amber-300 text-[12px]">
                        Notice: Enable Cloudinary for Direct Audio, Video & Photo Uploads
                      </div>
                      <p className="text-[11px] text-amber-100/90 font-sans leading-relaxed">
                        On Vercel, the local server filesystem is read-only. To upload high-resolution wedding photos, large pre-shoot videos, and background music tracks:
                        Ensure <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> and <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> are set in your deployment environment variables.
                      </p>
                      <p className="text-[10px] text-amber-300/80 font-sans italic">
                        💡 You can also paste any direct image or video URL (from Dropbox, Google Drive, Imgur, YouTube, etc.) directly into the URL fields below.
                      </p>
                    </div>
                  </div>
                )}

                {/* CINEMATIC PRE-SHOOT VIDEO SECTION */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2c131d] via-[#1f0d14] to-[#14060b] border-2 border-[#dfba73]/60 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#ffd700] font-cinzel font-bold">
                        <Video className="w-4 h-4" /> Couple Pre-Shoot Cinematic Film / Trailer
                      </div>
                      <p className="text-[11px] text-[#fdfbf7]/70 font-sans mt-0.5">
                        Upload a pre-shoot video file (.mp4, .mov, .webm) or link a YouTube / Vimeo trailer.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[44px] touch-manipulation">
                        {uploadingField === "video" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Uploading Video{uploadProgress !== null ? ` (${uploadProgress}%)` : "..."}</span>
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
                          className="px-3.5 py-2.5 rounded-xl bg-black/50 hover:bg-rose-950/80 text-rose-300 border border-rose-500/30 text-xs font-cinzel font-medium cursor-pointer transition min-h-[44px] touch-manipulation text-center"
                          title="Remove video and switch back to Hero Photo"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-2">
                    <div className="lg:col-span-2 space-y-2">
                      <label className="block text-[11px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                        Video File URL or YouTube / Vimeo Link
                      </label>
                      <input
                        value={settings.heroVideoUrl || ""}
                        onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                        placeholder="e.g. /uploads/preshoot-video.mp4 or https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1117] border border-[#c5a059]/50 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] font-mono min-h-[44px]"
                      />
                      <p className="text-[10px] text-[#edd892]/60 italic font-sans">
                        💡 Tip: If you leave this blank, the invitation automatically displays the high-resolution Couple Portrait Photo below.
                      </p>
                    </div>

                    {/* Video Live Preview */}
                    <div className="flex flex-col items-center sm:items-start lg:items-center w-full">
                      <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                        Video Preview
                      </span>
                      <div className="relative w-full max-w-[280px] sm:max-w-[240px] aspect-video rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black flex items-center justify-center mx-auto lg:mx-0">
                        {settings.heroVideoUrl ? (
                          settings.heroVideoUrl.includes("youtube.com") || settings.heroVideoUrl.includes("youtu.be") ? (
                            <div className="p-2 text-center text-[10px] text-[#dfba73] font-cinzel">
                              <Film className="w-5 h-5 mx-auto mb-1 text-[#ffd700]" />
                              YouTube Embed Ready
                            </div>
                          ) : (
                            <video
                              src={
                                settings.heroVideoUrl.startsWith("/uploads/")
                                  ? `/api/media/stream?src=${encodeURIComponent(settings.heroVideoUrl)}`
                                  : getOptimizedVideoUrl(settings.heroVideoUrl, { width: 640, quality: "auto:eco" })
                              }
                              poster={getVideoPosterUrl(settings.heroVideoUrl)}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-2">
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Main Hero Couple Portrait Photo
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[44px] touch-manipulation">
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
                        <span className="text-[11px] text-[#edd892]/70 font-sans text-center sm:text-left">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.heroImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-Pragya-Siddharth-Pix-1788547160301-318.jpg or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />

                    {/* Quick Preset Selector */}
                    <div>
                      <span className="text-[10px] text-[#edd892]/70 font-sans block mb-1">
                        Uploaded Photo Presets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {PHOTO_PRESETS.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSettings({ ...settings, heroImageUrl: p.url })}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-cinzel font-medium transition cursor-pointer border min-h-[32px] touch-manipulation ${
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
                  <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Hero Portrait Preview
                    </span>
                    <div className="relative w-32 h-36 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black mx-auto lg:mx-0">
                      <Image
                        src={getOptimizedImageUrl(settings.heroImageUrl || "/images/coupleshare.png", { width: 300, quality: "auto:eco" })}
                        alt="Hero Couple Preview"
                        fill
                        sizes="130px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Warm Welcome Couple Photo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Warm Welcome Couple Photo (Invitation Greeting Plaque)
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[44px] touch-manipulation">
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
                        <span className="text-[11px] text-[#edd892]/70 font-sans text-center sm:text-left">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.welcomeImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, welcomeImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-423f40cc366ebcbcb01c-1788547168710-655.jpg or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PHOTO_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSettings({ ...settings, welcomeImageUrl: p.url })}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-cinzel font-medium transition cursor-pointer border min-h-[32px] touch-manipulation ${
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

                  <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Welcome Preview
                    </span>
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black mx-auto lg:mx-0">
                      <Image
                        src={getOptimizedImageUrl(settings.welcomeImageUrl || "/images/coupleshare.png", { width: 300, quality: "auto:eco" })}
                        alt="Welcome Preview"
                        fill
                        sizes="130px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Table Seating Place Card Photo & Sweet Note */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Table Place Card Couple Photo
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[44px] touch-manipulation">
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
                        <span className="text-[11px] text-[#edd892]/70 font-sans text-center sm:text-left">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.placeCardImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, placeCardImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Place Card Sweet Thank You Note
                      </label>
                      <input
                        value={settings.placeCardNote || ""}
                        onChange={(e) => setSettings({ ...settings, placeCardNote: e.target.value })}
                        placeholder="Thank you for sharing our joy and celebrating with us!"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Place Card Preview
                    </span>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#c5a059] shadow-md bg-black mx-auto lg:mx-0">
                      <Image
                        src={getOptimizedImageUrl(settings.placeCardImageUrl || "/images/coupleshare.png", { width: 200, height: 200, crop: "fill", quality: "auto:eco" })}
                        alt="Place Card Preview"
                        fill
                        sizes="96px"
                        className="object-cover object-top"
                      />
                    </div>
                  </div>
                </div>

                {/* Blessing Section Photo */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-4 border-t border-[#c5a059]/20">
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                        Blessing Section Photo
                      </label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[44px] touch-manipulation">
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
                        <span className="text-[11px] text-[#edd892]/70 font-sans text-center sm:text-left">
                          or paste URL below
                        </span>
                      </div>
                    </div>

                    <input
                      value={settings.blessingImageUrl || ""}
                      onChange={(e) => setSettings({ ...settings, blessingImageUrl: e.target.value })}
                      placeholder="/uploads/preshoot-photo-OIP2-1788547184704-193.webp or https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />
                  </div>

                  <div className="flex flex-col items-center justify-center w-full">
                    <span className="text-[10px] uppercase text-[#dfba73] font-cinzel mb-1">
                      Blessing Preview
                    </span>
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-[#c5a059] shadow-md bg-black mx-auto lg:mx-0">
                      <Image
                        src={getOptimizedImageUrl(settings.blessingImageUrl || "/images/coupleshare.png", { width: 300, quality: "auto:eco" })}
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                      Moments of Love: Gallery Photos (4 Slots)
                    </label>
                    <span className="text-[10px] text-[#edd892]/70 font-sans">
                      Upload from computer or set custom URLs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {galleryList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 rounded-xl bg-[#261c22] border border-[#c5a059]/30 space-y-3 flex flex-col justify-between shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#c5a059]/50 shrink-0 bg-black">
                            <Image
                              src={getThumbnailUrl(item.src || "/images/coupleshare.png", 160)}
                              alt={item.title || `Slot ${idx + 1}`}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] uppercase text-[#dfba73] font-cinzel font-bold truncate">
                                Photo Slot #{idx + 1}
                              </span>
                              <label className="px-2.5 py-1 rounded-lg bg-[#800020] hover:bg-[#6b0f24] text-[10px] text-[#edd892] font-cinzel font-bold cursor-pointer border border-[#c5a059]/40 flex items-center gap-1 shrink-0 min-h-[30px] touch-manipulation transition">
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
                              className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none min-h-[38px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <input
                            value={item.title}
                            onChange={(e) => updateGalleryItem(idx, "title", e.target.value)}
                            placeholder="Title (e.g. A Timeless Bond)"
                            className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/30 text-xs text-[#fdfbf7] focus:outline-none min-h-[38px]"
                          />
                          <input
                            value={item.subtitle}
                            onChange={(e) => updateGalleryItem(idx, "subtitle", e.target.value)}
                            placeholder="Subtitle / Romantic Quote"
                            className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/30 text-xs text-[#fdfbf7] focus:outline-none min-h-[38px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CARD 3: WEDDING DAY TIMELINE & PROGRAMME */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-[#c5a059]/20">
                  <div className="flex items-center gap-2 text-[#dfba73] font-cinzel text-sm font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-[#dfba73]" /> 3. Wedding Day Timeline & Programme
                  </div>
                  <button
                    type="button"
                    onClick={addTimelineItem}
                    className="px-3.5 py-2 rounded-xl bg-[#800020] text-[#edd892] hover:bg-[#6b0f24] text-xs font-cinzel font-bold border border-[#c5a059]/40 flex items-center gap-1.5 cursor-pointer min-h-[40px] touch-manipulation transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Moment
                  </button>
                </div>

                <div className="space-y-3">
                  {timelineList.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl bg-[#261c22] border border-[#c5a059]/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                    >
                      <div className="w-full sm:w-36">
                        <label className="block text-[10px] uppercase text-[#dfba73] font-cinzel font-semibold mb-1">
                          Time
                        </label>
                        <input
                          value={item.time}
                          onChange={(e) => updateTimelineItem(idx, "time", e.target.value)}
                          placeholder="05:30 PM"
                          className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none min-h-[42px]"
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
                          className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none min-h-[42px]"
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
                          className="w-full px-3 py-2 rounded-lg bg-[#1c1419] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none min-h-[42px]"
                        />
                      </div>
                      <div className="flex items-center justify-end sm:self-center pt-1 sm:pt-4">
                        <button
                          type="button"
                          onClick={() => removeTimelineItem(idx)}
                          className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-400 hover:bg-rose-900/60 transition cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center touch-manipulation"
                          title="Remove Moment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: DRESS CODE & STYLE PALETTE */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-4 shadow-md">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 5: VENUE & BACKGROUND MUSIC */}
              <div className="p-4 sm:p-6 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 space-y-6 shadow-md">
                <div className="flex items-center gap-2 text-[#dfba73] pb-2 border-b border-[#c5a059]/20 font-cinzel text-sm font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-[#dfba73]" /> 5. Venue Location & Atmosphere
                </div>

                {/* Venue Name & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                      Venue Name
                    </label>
                    <input
                      required
                      value={settings.venueName}
                      onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Coordinates & Contact Phone */}
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#2a1d25] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Dedicated Background Music Subcard */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#281520] to-[#1a1017] border border-[#dfba73]/40 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#ffd700] font-cinzel font-bold">
                        <Music className="w-4 h-4 text-[#ffd700]" /> Background Music & Atmosphere Track
                      </div>
                      <p className="text-[11px] text-[#fdfbf7]/70 font-sans mt-0.5">
                        Plays automatically or on guest interaction throughout the luxury invitation experience.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                      <label className="btn-gold-shimmer px-4 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.02] transition min-h-[42px] touch-manipulation">
                        {uploadingField === "music" ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Audio{uploadProgress !== null ? ` (${uploadProgress}%)` : "..."}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Audio Track</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="audio/*,.mp3,.wav,.ogg,.m4a"
                          disabled={uploadingField !== null}
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, "music", (url) =>
                              setSettings((prev) => ({ ...prev, musicUrl: url }))
                            )
                          }
                        />
                      </label>
                      {settings.musicUrl && settings.musicUrl !== "/audio/background.mp3" && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, musicUrl: "/audio/background.mp3" })}
                          className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-sans transition min-h-[42px] touch-manipulation text-center"
                          title="Reset to default instrumental track"
                        >
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    value={settings.musicUrl || ""}
                    onChange={(e) => setSettings({ ...settings, musicUrl: e.target.value })}
                    placeholder="/audio/background.mp3 or https://res.cloudinary.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1117] border border-[#c5a059]/40 text-xs sm:text-sm text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] font-mono min-h-[44px]"
                  />

                  {settings.musicUrl && (
                    <div className="pt-1">
                      <audio
                        controls
                        src={settings.musicUrl}
                        className="w-full h-9 rounded-xl opacity-90 shadow-sm"
                        preload="none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SAVE BUTTON BAR */}
              <div className="pt-3 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-gold-shimmer w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs sm:text-sm font-cinzel font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer min-h-[48px] touch-manipulation transition"
                >
                  <Save className="w-4 h-4" />
                  {savingSettings ? "Saving All Settings..." : "Save All Couple & Event Settings"}
                </button>
                {settingsSuccess && (
                  <span className="text-xs text-emerald-400 font-cinzel flex items-center justify-center gap-1.5 bg-emerald-950/40 px-4 py-3 rounded-xl border border-emerald-800/50 w-full sm:w-auto text-center">
                    <Check className="w-4 h-4" /> Changes saved and active immediately across invitations!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}


        {/* TAB 3: PRINTABLE WEDDING CARDS & PLACE CARDS */}
        {activeTab === "tables" && (
          <div
            className={`printable-cards-container rounded-3xl bg-[#181216] border border-[#c5a059]/40 p-5 sm:p-8 shadow-2xl space-y-6 ${
              singlePrintGuestId ? "single-print-active" : ""
            }`}
          >
            {/* Header & Controls Toolbar (Hidden on Print) */}
            <div className="no-print space-y-6 pb-6 border-b border-[#c5a059]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 text-[#edd892] text-[10px] font-mono border border-[#c5a059]/40">
                      Physical Stationery Studio
                    </span>
                    <span className="text-xs text-[#dfba73] font-cinzel font-semibold">
                      {guests.length} Registered Guests
                    </span>
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73]">
                    Personalized Wedding Cards & Place Stationery
                  </h2>
                  <p className="text-xs text-[#fdfbf7]/60 font-sans mt-1 max-w-2xl">
                    Generate authentic luxury wedding invitation cards and table place settings with venue address, auspicious date & timings, dress code, and scannable VIP check-in QR passes.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSinglePrintGuestId(null);
                      setTimeout(() => window.print(), 50);
                    }}
                    className="btn-gold-shimmer px-5 py-3 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print All ({filteredPrintableGuests.length} Cards)
                  </button>
                </div>
              </div>

              {/* Stationery Format Selector Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#20161c] border border-[#c5a059]/30">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCardStationeryType("wedding-card")}
                    className={`px-4 py-2.5 rounded-xl font-cinzel font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                      cardStationeryType === "wedding-card"
                        ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73] shadow-md shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                        : "text-[#dfba73]/70 hover:text-white hover:bg-[#c5a059]/10"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-[#dfba73]" />
                    <span>📜 Luxury Wedding Invitation Cards (Separate Print)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardStationeryType("place-card")}
                    className={`px-4 py-2.5 rounded-xl font-cinzel font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                      cardStationeryType === "place-card"
                        ? "bg-[#800020] text-[#fdfbf7] border border-[#dfba73] shadow-md shadow-[#800020]/40 ring-1 ring-[#dfba73]/30"
                        : "text-[#dfba73]/70 hover:text-white hover:bg-[#c5a059]/10"
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-[#dfba73]" />
                    <span>🍽️ Banquet Table Seating Place Cards</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#dfba73] font-cinzel flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#140e12] border border-[#c5a059]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Each card can be printed individually or in batch</span>
                </div>
              </div>

              {/* Guest Search & Table Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#20161c] border border-[#c5a059]/30">
                <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#dfba73]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={cardSearchQuery}
                      onChange={(e) => setCardSearchQuery(e.target.value)}
                      placeholder="Search guest by name or salutation..."
                      className="w-full pl-9 pr-8 py-2 bg-[#140e12] border border-[#c5a059]/30 rounded-xl text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:border-[#dfba73] focus:outline-none"
                    />
                    {cardSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCardSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#dfba73]/60 hover:text-white cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-[#dfba73]" />
                    <select
                      value={cardFilterTable}
                      onChange={(e) => setCardFilterTable(e.target.value)}
                      className="bg-[#140e12] border border-[#c5a059]/30 rounded-xl px-3 py-2 text-xs text-[#dfba73] font-cinzel focus:border-[#dfba73] focus:outline-none cursor-pointer"
                    >
                      <option value="all">All Tables ({guests.length} Guests)</option>
                      {availableTableNumbers.map((num) => (
                        <option key={num} value={String(num)}>
                          Table #{String(num).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end">
                  <span className="text-[11px] text-[#fdfbf7]/60 font-sans">
                    Showing <strong className="text-[#dfba73]">{filteredPrintableGuests.length}</strong> of {guests.length} cards
                  </span>

                  {singlePrintGuestId && (
                    <button
                      type="button"
                      onClick={() => setSinglePrintGuestId(null)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-cinzel font-bold flex items-center gap-1 hover:bg-amber-500/30 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Exit Single Print Mode
                    </button>
                  )}
                </div>
              </div>

              {/* Card Customizer Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 text-xs">
                {/* Column 1: Layout Selector */}
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

                {/* Column 2: Photo Selector */}
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

                {/* Column 3: Content Toggles */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1.5">
                    Card Content & Details
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer text-[#fdfbf7]/80 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showQrOnCards}
                        onChange={(e) => setShowQrOnCards(e.target.checked)}
                        className="rounded accent-[#800020]"
                      />
                      <span>Include Check-in QR Code on Cards</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#fdfbf7]/80 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showVenueOnCards}
                        onChange={(e) => setShowVenueOnCards(e.target.checked)}
                        className="rounded accent-[#800020]"
                      />
                      <span>Include Venue & Address</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#fdfbf7]/80 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showDateOnCards}
                        onChange={(e) => setShowDateOnCards(e.target.checked)}
                        className="rounded accent-[#800020]"
                      />
                      <span>Include Ceremony Date & Time</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-[#fdfbf7]/80 hover:text-white">
                      <input
                        type="checkbox"
                        checked={showImportantThingsOnCards}
                        onChange={(e) => setShowImportantThingsOnCards(e.target.checked)}
                        className="rounded accent-[#800020]"
                      />
                      <span>Include Important Information & Dress Code</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Important Notes & Guidelines Editor */}
              <div className="p-4 rounded-2xl bg-[#20161c] border border-[#c5a059]/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                    Important Guest Guidelines / Dress Code Message on Cards
                  </label>
                  <span className="text-[10px] text-[#fdfbf7]/50 font-sans">
                    Will appear in the Important Information box on printed cards
                  </span>
                </div>
                <input
                  type="text"
                  value={cardImportantNote}
                  onChange={(e) => setCardImportantNote(e.target.value)}
                  placeholder="e.g. Kindly present this invitation card or scan QR code at VIP reception desk. Formal Attire."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#140e12] border border-[#c5a059]/30 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:border-[#dfba73] focus:outline-none"
                />
              </div>

              {/* Single Print Notification Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#800020]/20 border border-[#c5a059]/30 text-xs text-[#edd892]">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-[#dfba73] shrink-0" />
                  <span>
                    <strong>How to print separately:</strong> Click the gold <strong>&ldquo;Print This Card Separately&rdquo;</strong> button below any card to print only that individual card!
                  </span>
                </div>
                {singlePrintGuestId && (
                  <span className="font-bold text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-500/40">
                    Single Card Print Active
                  </span>
                )}
              </div>
            </div>

            {/* PRINTABLE CARDS CONTAINER */}
            {filteredPrintableGuests.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-[#140e12] border border-[#c5a059]/20">
                <Printer className="w-10 h-10 text-[#dfba73]/40 mx-auto mb-2" />
                <h3 className="font-cinzel text-base font-bold text-[#dfba73]">No Cards Match Current Filter</h3>
                <p className="text-xs text-[#fdfbf7]/60 mt-1">
                  Try clearing the search query or changing the table filter.
                </p>
              </div>
            ) : cardStationeryType === "wedding-card" ? (
              /* ============================================================ */
              /* FORMAT 1: LUXURY WEDDING INVITATION CARDS (PHYSICAL WEDDING CARDS) */
              /* ============================================================ */
              <div className="printable-wedding-cards-grid grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPrintableGuests.map((g) => (
                  <div
                    key={g.id}
                    className={`printable-wedding-card relative rounded-3xl bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f8f1e3] text-[#1a1517] p-6 sm:p-8 border-2 border-[#c5a059] shadow-xl flex flex-col justify-between overflow-hidden transition hover:border-[#dfba73] ${
                      singlePrintGuestId
                        ? singlePrintGuestId === g.id
                          ? "single-card-target"
                          : "single-card-hide no-print"
                        : ""
                    }`}
                    style={{ minHeight: "530px" }}
                  >
                    {/* Ornate Gold Filigree Corner Accents & Dual Inset Frame */}
                    <div className="absolute inset-2 sm:inset-2.5 rounded-2xl border border-[#c5a059]/40 pointer-events-none" />
                    <div className="absolute inset-3.5 sm:inset-4 rounded-xl border border-[#dfba73]/30 pointer-events-none" />
                    <div className="absolute top-3 left-3 text-[#c5a059] text-sm select-none">⚜</div>
                    <div className="absolute top-3 right-3 text-[#c5a059] text-sm select-none">⚜</div>
                    <div className="absolute bottom-3 left-3 text-[#c5a059] text-sm select-none">⚜</div>
                    <div className="absolute bottom-3 right-3 text-[#c5a059] text-sm select-none">⚜</div>

                    {/* Subtle Royal Background Seal Watermark */}
                    <div className="absolute right-6 bottom-16 w-48 h-48 opacity-[0.035] pointer-events-none select-none rounded-full border-8 border-[#800020] flex items-center justify-center">
                      <span className="font-cinzel text-6xl font-bold text-[#800020]">{dashboardMonogram}</span>
                    </div>

                    <div className="relative z-10 space-y-4">
                      {/* HEADER: Couple Portrait & Names */}
                      {placeCardLayout === "cameo" && (
                        <div className="flex flex-col items-center text-center">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#c5a059] shadow-lg mb-2 bg-[#800020]/10 ring-2 ring-[#dfba73]/40">
                            <Image
                              src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                              alt={settings.coupleNames}
                              fill
                              sizes="80px"
                              className="object-cover object-top"
                            />
                          </div>
                          <p className="text-xs uppercase tracking-[0.28em] text-[#800020] font-cinzel font-bold">
                            {settings.coupleNames}
                          </p>
                          <p className="text-[10px] font-cinzel text-[#8c6a2b] uppercase tracking-[0.18em] mt-0.5">
                            Royal Wedding Celebration
                          </p>
                        </div>
                      )}

                      {placeCardLayout === "banner" && (
                        <div className="flex flex-col items-center text-center mb-1">
                          <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-[#c5a059]/70 shadow-md mb-2 bg-black">
                            <Image
                              src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                              alt={settings.coupleNames}
                              fill
                              sizes="450px"
                              className="object-cover object-top"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <span className="absolute bottom-1.5 inset-x-0 text-xs uppercase tracking-widest text-[#fff8ea] font-cinzel font-bold drop-shadow">
                              {settings.coupleNames}
                            </span>
                          </div>
                        </div>
                      )}

                      {placeCardLayout === "side" && (
                        <div className="flex items-center gap-3.5 pb-2.5 border-b border-[#c5a059]/40 mb-1">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#c5a059] flex-shrink-0 bg-black shadow">
                            <Image
                              src={settings.placeCardImageUrl || "/uploads/preshoot-photo-e5a487a560c507085cda-1788547177206-113.jpg"}
                              alt={settings.coupleNames}
                              fill
                              sizes="64px"
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#800020] font-cinzel font-bold">
                              {settings.coupleNames}
                            </p>
                            <span className="text-[10px] uppercase tracking-wider text-[#8c6a2b] font-cinzel">
                              Wedding Invitation Pass
                            </span>
                          </div>
                        </div>
                      )}

                      {placeCardLayout === "minimal" && (
                        <div className="text-center pb-1">
                          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#800020]/10 border-2 border-[#c5a059]/60 mb-1.5 shadow-sm">
                            <span className="font-cinzel text-sm font-bold text-[#800020]">
                              {dashboardMonogram}
                            </span>
                          </div>
                          <p className="text-xs uppercase tracking-[0.28em] text-[#800020] font-cinzel font-bold">
                            {settings.coupleNames}
                          </p>
                        </div>
                      )}

                      {/* FORMAL INVITATION VERSE */}
                      <div className="text-center space-y-1 my-1">
                        <p className="font-serif italic text-xs text-[#7a6254]">
                          Together with their families, cordially invite
                        </p>
                        {/* HONORED GUEST NAME */}
                        <h3 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#6b0f24] leading-snug">
                          {g.salutation} {g.displayName}
                        </h3>
                        <div className="flex items-center justify-center gap-2 pt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-cinzel font-bold bg-[#800020]/10 text-[#800020] border border-[#c5a059]/40 shadow-xs">
                            👥 {inviteTypeLabels[g.inviteType]} • Reserved Seating
                          </span>
                        </div>
                      </div>

                      {/* CEREMONY PILLARS: DATE & TIME, VENUE & HALL, RESERVED TABLE */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#fffdfa] border border-[#dfba73]/60 shadow-xs text-center text-xs">
                        {showDateOnCards && (
                          <div className="p-2 rounded-xl bg-[#fdf8ef] border border-[#c5a059]/20 flex flex-col justify-center items-center">
                            <Calendar className="w-4 h-4 text-[#800020] mb-1 shrink-0" />
                            <span className="text-[9px] uppercase tracking-wider text-[#8c6a2b] font-cinzel font-bold">
                              Date & Time
                            </span>
                            <p className="font-serif font-bold text-[11px] text-[#1a1517] leading-tight mt-0.5">
                              {formattedEventDate}
                            </p>
                            {formattedEventTime && (
                              <span className="text-[10px] font-mono text-[#800020] font-bold mt-0.5">
                                {formattedEventTime}
                              </span>
                            )}
                          </div>
                        )}

                        {showVenueOnCards && (
                          <div className="p-2 rounded-xl bg-[#fdf8ef] border border-[#c5a059]/20 flex flex-col justify-center items-center">
                            <MapPin className="w-4 h-4 text-[#800020] mb-1 shrink-0" />
                            <span className="text-[9px] uppercase tracking-wider text-[#8c6a2b] font-cinzel font-bold">
                              Venue & Hall
                            </span>
                            <p className="font-serif font-bold text-[11px] text-[#1a1517] leading-tight mt-0.5">
                              {settings.venueName || "Grand Ballroom"}
                            </p>
                            <span className="text-[9px] text-[#5a483e] font-sans line-clamp-2 mt-0.5">
                              {settings.venueAddress || "Sri Lanka"}
                            </span>
                          </div>
                        )}

                        <div className="p-2 rounded-xl bg-[#800020]/10 border border-[#c5a059]/30 flex flex-col justify-center items-center">
                          <Utensils className="w-4 h-4 text-[#800020] mb-1 shrink-0" />
                          <span className="text-[9px] uppercase tracking-wider text-[#800020] font-cinzel font-bold">
                            Assigned Table
                          </span>
                          <p className="font-cinzel font-bold text-base text-[#800020] mt-0.5">
                            Table #{String(g.tableNumber).padStart(2, "0")}
                          </p>
                          <span className="text-[9px] text-[#8c6a2b] font-cinzel mt-0.5">
                            VIP Guest Seating
                          </span>
                        </div>
                      </div>

                      {/* IMPORTANT INFORMATION & GUIDELINES BOX */}
                      {showImportantThingsOnCards && (
                        <div className="p-3 sm:p-3.5 rounded-2xl bg-[#fcf5e8] border border-[#c5a059]/50 text-left space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-[10px] font-cinzel font-bold text-[#800020] uppercase tracking-wider">
                            <span>⚜</span> Important Guest Information
                          </div>
                          {settings.dressCodeTitle && (
                            <p className="text-[11px] text-[#4a3b32] font-sans">
                              <strong className="text-[#800020]">Dress Code:</strong> {settings.dressCodeTitle}
                            </p>
                          )}
                          <p className="text-[10px] text-[#6b584e] font-sans leading-relaxed">
                            {cardImportantNote}
                          </p>
                        </div>
                      )}

                      {/* VIP CHECK-IN QR CODE & SCAN PASS */}
                      {showQrOnCards && guestQrMap[g.id] && (
                        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-[#c5a059]/40 shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#c5a059]/50 bg-white p-0.5">
                              <img
                                src={guestQrMap[g.id]}
                                alt="VIP Check-in QR"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-left">
                              <span className="inline-flex items-center gap-1 text-[9px] font-cinzel font-bold uppercase tracking-wider text-[#800020]">
                                <QrCode className="w-3 h-3 text-[#c5a059]" /> VIP Check-in Pass
                              </span>
                              <p className="text-[10px] text-[#5a483e] font-sans mt-0.5">
                                Scan for personalized invitation & venue GPS
                              </p>
                              <span className="text-[9px] font-mono text-[#8c6a2b]">
                                Pass #{g.token.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="hidden sm:block text-right pr-1">
                            <span className="font-serif italic text-[11px] text-[#800020] font-bold block">
                              {settings.placeCardNote || "Sharing our joy & love"}
                            </span>
                            <span className="text-[9px] text-[#8c6a2b] font-cinzel">
                              Honoured Guest
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD ACTION BAR (Hidden during Print) */}
                    <div className="no-print pt-3 mt-3 border-t border-[#c5a059]/30 flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handlePrintSingleCard(g.id)}
                        className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-1.5 shadow cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print This Card Separately
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={inviteLink(g.token)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] text-xs font-cinzel font-bold flex items-center gap-1 transition border border-[#c5a059]/30"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Invite
                        </a>
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(g)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-cinzel font-bold flex items-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" /> WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ============================================================ */
              /* FORMAT 2: BANQUET TABLE PLACE CARDS (TABLE TENT FORMAT) */
              /* ============================================================ */
              <div className="printable-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrintableGuests.map((g) => (
                  <div
                    key={g.id}
                    className={`printable-place-card relative rounded-2xl bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f7f0e4] text-[#1a1517] p-5 sm:p-6 border-2 border-[#c5a059] shadow-lg flex flex-col justify-between overflow-hidden ${
                      singlePrintGuestId
                        ? singlePrintGuestId === g.id
                          ? "single-card-target"
                          : "single-card-hide no-print"
                        : ""
                    }`}
                    style={{ minHeight: "260px" }}
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

                      {showVenueOnCards && (
                        <p className="text-[9px] text-[#8c6a2b] font-cinzel font-semibold mt-1">
                          📍 {settings.venueName || "Grand Ballroom"} {showDateOnCards && `• ${formattedEventDate}`}
                        </p>
                      )}
                    </div>

                    {/* Mini QR if enabled */}
                    {showQrOnCards && guestQrMap[g.id] && (
                      <div className="my-1 py-1 px-2 rounded-lg bg-white/70 border border-[#c5a059]/30 flex items-center justify-center gap-2">
                        <img src={guestQrMap[g.id]} alt="QR" className="w-8 h-8 object-contain" />
                        <span className="text-[9px] font-mono text-[#800020]">VIP Pass</span>
                      </div>
                    )}

                    {/* Table Badge & Sweet Note Footer */}
                    <div className="pt-2 border-t border-[#c5a059]/30 flex items-center justify-between gap-2 mt-auto">
                      <div className="px-3 py-1 rounded-xl bg-[#800020] text-[#fdfbf7] font-cinzel font-bold text-xs shadow">
                        Table #{String(g.tableNumber).padStart(2, "0")}
                      </div>
                      <span className="font-serif italic text-[10px] text-[#8c6a2b] text-right line-clamp-1">
                        {settings.placeCardNote || "Sharing our joy & love"}
                      </span>
                    </div>

                    {/* Print single button in Place Card mode (no-print) */}
                    <div className="no-print pt-2 mt-2 border-t border-[#c5a059]/20 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handlePrintSingleCard(g.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] text-[10px] font-cinzel font-bold flex items-center gap-1 cursor-pointer border border-[#c5a059]/30"
                      >
                        <Printer className="w-3 h-3" /> Print This Card
                      </button>
                      <a
                        href={inviteLink(g.token)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-cinzel text-[#8c6a2b] hover:underline"
                      >
                        View Invite ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: PHOTOS TABLE (Dedicated EventPhoto Database Records) */}
        {activeTab === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1c161a] border border-[#c5a059]/40 shadow-xl">
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

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer w-full sm:w-auto min-h-[42px] touch-manipulation"
                >
                  <Plus className="w-4 h-4" /> Add Photo to Table
                </button>
              </div>
            </div>

            {/* Table Display */}
            {eventPhotos.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl sm:rounded-3xl bg-[#181216] border border-[#c5a059]/30">
                <Camera className="w-12 h-12 text-[#dfba73]/40 mx-auto mb-3" />
                <h3 className="font-cinzel text-lg font-bold text-[#fdfbf7]">No Photos in Table Yet</h3>
                <p className="text-xs text-[#fdfbf7]/60 max-w-md mx-auto mt-1 mb-5">
                  Add high-resolution pre-shoot portraits, couple moments, and wedding memories to populate the guest invitation gallery.
                </p>
                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold inline-flex items-center gap-2 cursor-pointer min-h-[42px] touch-manipulation"
                >
                  <Plus className="w-4 h-4" /> Add First Photo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* MOBILE VIEW (< md): Responsive Photo Cards */}
                <div className="block md:hidden space-y-3">
                  {eventPhotos.map((photo, idx) => (
                    <div
                      key={`mobile-photo-${photo.id}`}
                      className="rounded-2xl bg-[#1c141a] border border-[#c5a059]/35 p-3.5 shadow-lg flex items-center gap-3.5"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#c5a059]/50 bg-black/40 shrink-0">
                        <img
                          src={getThumbnailUrl(photo.url, 200)}
                          alt={photo.title || "Wedding Photo"}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-[#edd892]">
                          #{photo.order !== undefined ? photo.order + 1 : idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="font-cinzel font-bold text-[#fdfbf7] text-sm truncate">
                          {photo.title || "Untitled Portrait"}
                        </div>
                        {photo.subtitle && (
                          <div className="text-[11px] text-[#fdfbf7]/60 italic truncate">
                            {photo.subtitle}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="px-2 py-0.5 rounded-full bg-[#800020]/30 text-[#edd892] text-[9px] font-cinzel font-semibold border border-[#c5a059]/30">
                            {photo.tag || "Pre-Wedding"}
                          </span>
                          <a
                            href={photo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#c5a059] hover:text-white inline-flex items-center gap-1 text-[10px]"
                          >
                            <ExternalLink className="w-3 h-3" /> View
                          </a>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="w-10 h-10 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 flex items-center justify-center transition cursor-pointer touch-manipulation"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VIEW (≥ md): Full Relational Data Table */}
                <div className="hidden md:block rounded-3xl bg-[#181216] border border-[#c5a059]/40 overflow-hidden shadow-2xl">
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
                                  src={getThumbnailUrl(photo.url, 160)}
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
                          src={getThumbnailUrl(photo.url, 400)}
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

        {/* TAB: ALL WEDDINGS PORTFOLIO (Super Admin Exclusive) */}
        {activeTab === "events" && manager?.role === "SUPER_ADMIN" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#1c161a] border border-[#c5a059]/40 shadow-xl">
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
                className="btn-gold-shimmer px-5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer w-full sm:w-auto min-h-[42px] touch-manipulation"
              >
                <Plus className="w-4 h-4" /> Create New Wedding
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {events.map((ev) => {
                const isCurrent = ev.id === activeEventId;
                return (
                  <div
                    key={ev.id}
                    className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition flex flex-col justify-between ${
                      isCurrent
                        ? "bg-[#23171f] border-[#dfba73] shadow-2xl ring-1 ring-[#dfba73]/40"
                        : "bg-[#181216] border-[#c5a059]/30 hover:border-[#c5a059]/70 shadow-lg"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[10px] text-[#dfba73] px-2 py-0.5 rounded bg-[#120e11] border border-[#c5a059]/30 truncate">
                          /e/{ev.slug}
                        </span>
                        {isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-[10px] font-cinzel font-bold shrink-0">
                            Active
                          </span>
                        )}
                      </div>

                      {ev.heroImageUrl && (
                        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 border border-[#c5a059]/20">
                          <img
                            src={getThumbnailUrl(ev.heroImageUrl, 400)}
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
                          <span className="truncate">Venue: {ev.venueName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#c5a059]/20 flex items-center justify-between gap-2">
                      {isCurrent ? (
                        <button
                          onClick={() => setActiveTab("guests")}
                          className="btn-gold-shimmer flex-1 py-2.5 rounded-xl text-xs font-cinzel font-bold text-center cursor-pointer min-h-[40px] touch-manipulation"
                        >
                          Manage Guests & Portal
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleSelectEvent(ev.id);
                            setActiveTab("guests");
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-[#2a1c24] border border-[#c5a059]/40 text-[#dfba73] hover:bg-[#800020] hover:text-white text-xs font-cinzel font-bold transition cursor-pointer min-h-[40px] touch-manipulation"
                        >
                          Switch & Manage
                        </button>
                      )}

                      <a
                        href={`/e/${ev.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-[#1c1519] border border-[#c5a059]/30 text-[#dfba73] hover:text-white flex items-center justify-center transition shrink-0"
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

        {/* TAB: EVENT MANAGERS DIRECTORY (Super Admin Exclusive) */}
        {activeTab === "managers" && manager?.role === "SUPER_ADMIN" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e151b] via-[#241a22] to-[#171115] border border-[#c5a059]/40 p-5 sm:p-7 shadow-2xl">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#dfba73]/5 blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/30 text-[#dfba73] text-[11px] font-cinzel font-bold border border-[#dfba73]/40 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#edd892]" /> Super Admin Console
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#251820] text-[#edd892] font-mono text-[11px] border border-[#c5a059]/25">
                      {managers.length} {managers.length === 1 ? "Planner Registered" : "Planners Registered"}
                    </span>
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold text-[#dfba73]">
                    Event Managers & Planners Directory
                  </h2>
                  <p className="text-xs sm:text-sm text-[#fdfbf7]/70 mt-1.5 max-w-2xl leading-relaxed">
                    Centrally provision, supervise, and administer independent Event Manager accounts. Each planner operates within an isolated workspace with dedicated wedding portals, guest registries, and RSVP tracking.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateManagerModal(true)}
                  className="btn-gold-shimmer px-5 py-3 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer w-full md:w-auto min-h-[44px] touch-manipulation shrink-0"
                >
                  <UserPlus className="w-4 h-4" /> Add Event Manager
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1e151b] to-[#171115] border border-[#c5a059]/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                    Total Event Managers
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#dfba73]/10 border border-[#dfba73]/25 flex items-center justify-center text-[#dfba73]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#fdfbf7] mt-2">{managers.length}</div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#edd892]/70 font-sans">
                  <span>{managers.filter((m) => m.role === "SUPER_ADMIN").length} Super Admins</span>
                  <span>•</span>
                  <span>{managers.filter((m) => m.role !== "SUPER_ADMIN").length} Event Managers</span>
                </div>
              </div>

              <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1e151b] to-[#171115] border border-[#c5a059]/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                    Client Wedding Suites
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#edd892] mt-2">{events.length}</div>
                <span className="text-[11px] text-[#fdfbf7]/50 mt-1.5 block font-sans">
                  Portfolios managed across SaaS accounts
                </span>
              </div>

              <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#1e151b] to-[#171115] border border-[#c5a059]/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold">
                    Total Platform Guests
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-cinzel text-3xl font-bold text-emerald-400 mt-2">
                  {events.reduce((acc, ev) => acc + (ev._count?.guests || 0), 0)}
                </div>
                <span className="text-[11px] text-[#fdfbf7]/50 mt-1.5 block font-sans">
                  Invitations provisioned platform-wide
                </span>
              </div>
            </div>

            {/* Smart Search, Filter & Sort Control Bar */}
            <div className="p-3 sm:p-4 rounded-2xl bg-[#1b1419] border border-[#c5a059]/30 shadow-xl space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c5a059]/70" />
                  <input
                    type="text"
                    placeholder="Search by manager name, username, agency, email, or phone..."
                    value={managerSearchQuery}
                    onChange={(e) => setManagerSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#22171f] border border-[#c5a059]/30 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73] focus:ring-1 focus:ring-[#dfba73]/30 min-h-[40px] transition"
                  />
                  {managerSearchQuery && (
                    <button
                      onClick={() => setManagerSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Role Tabs */}
                  <div className="inline-flex rounded-xl bg-[#22171f] p-1 border border-[#c5a059]/25">
                    <button
                      onClick={() => setSelectedManagerFilter("ALL")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition cursor-pointer ${
                        selectedManagerFilter === "ALL"
                          ? "bg-[#800020] text-[#dfba73] shadow-md border border-[#dfba73]/40"
                          : "text-[#fdfbf7]/60 hover:text-[#dfba73]"
                      }`}
                    >
                      All ({managers.length})
                    </button>
                    <button
                      onClick={() => setSelectedManagerFilter("MANAGER")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition cursor-pointer ${
                        selectedManagerFilter === "MANAGER"
                          ? "bg-[#800020] text-[#dfba73] shadow-md border border-[#dfba73]/40"
                          : "text-[#fdfbf7]/60 hover:text-[#dfba73]"
                      }`}
                    >
                      Managers ({managers.filter((m) => m.role !== "SUPER_ADMIN").length})
                    </button>
                    <button
                      onClick={() => setSelectedManagerFilter("SUPER_ADMIN")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition cursor-pointer ${
                        selectedManagerFilter === "SUPER_ADMIN"
                          ? "bg-[#800020] text-[#dfba73] shadow-md border border-[#dfba73]/40"
                          : "text-[#fdfbf7]/60 hover:text-[#dfba73]"
                      }`}
                    >
                      Admins ({managers.filter((m) => m.role === "SUPER_ADMIN").length})
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22171f] border border-[#c5a059]/25 text-xs text-[#edd892]">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#dfba73]" />
                    <span className="text-white/40 hidden sm:inline">Sort:</span>
                    <select
                      value={managerSortBy}
                      onChange={(e) => setManagerSortBy(e.target.value as any)}
                      className="bg-transparent text-xs text-[#edd892] focus:outline-none cursor-pointer"
                    >
                      <option value="newest" className="bg-[#1c1519] text-[#fdfbf7]">Newest First</option>
                      <option value="name" className="bg-[#1c1519] text-[#fdfbf7]">Name (A-Z)</option>
                      <option value="weddings" className="bg-[#1c1519] text-[#fdfbf7]">Most Weddings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status Line */}
              <div className="flex items-center justify-between text-[11px] text-[#fdfbf7]/50 px-1 pt-1">
                <span>
                  Showing <strong className="text-[#edd892]">{filteredManagers.length}</strong> of{" "}
                  {managers.length} accounts
                </span>
                {(managerSearchQuery || selectedManagerFilter !== "ALL") && (
                  <button
                    onClick={() => {
                      setManagerSearchQuery("");
                      setSelectedManagerFilter("ALL");
                    }}
                    className="text-[#dfba73] hover:underline cursor-pointer"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredManagers.length === 0 && (
              <div className="rounded-3xl bg-[#181216]/90 border border-dashed border-[#c5a059]/40 p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#dfba73]/10 border border-[#dfba73]/30 mx-auto flex items-center justify-center text-[#dfba73]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#dfba73]">
                  No Event Planners Found
                </h3>
                <p className="text-xs text-[#fdfbf7]/60 max-w-sm mx-auto">
                  No accounts matched your search criteria. Try modifying your keywords or resetting filters.
                </p>
                <button
                  onClick={() => {
                    setManagerSearchQuery("");
                    setSelectedManagerFilter("ALL");
                  }}
                  className="px-4 py-2 rounded-xl bg-[#2a1c24] text-[#dfba73] border border-[#c5a059]/40 text-xs font-cinzel hover:bg-[#800020] transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* MOBILE VIEW (< md): Responsive Manager Cards */}
            {filteredManagers.length > 0 && (
              <div className="block md:hidden space-y-3.5">
                {filteredManagers.map((mgr) => {
                  const isSelf = mgr.id === manager.id;
                  const weddingCount = mgr._count?.events || mgr.events?.length || 0;
                  const initials = mgr.name
                    ? mgr.name
                        .trim()
                        .split(/\s+/)
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "EM";

                  return (
                    <div
                      key={`mobile-mgr-${mgr.id}`}
                      className="rounded-2xl bg-gradient-to-b from-[#1e151b] to-[#161014] border border-[#c5a059]/35 p-4 shadow-xl space-y-3.5 relative overflow-hidden"
                    >
                      {/* Top Row: Avatar, Name, Role */}
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#420614] via-[#241a22] to-[#171115] border border-[#dfba73]/50 flex items-center justify-center font-cinzel font-bold text-[#dfba73] text-sm shadow-md shrink-0">
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-cinzel font-bold text-[#fdfbf7] text-sm truncate">
                              {mgr.name}
                            </h3>
                            {isSelf && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/40 shrink-0">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#edd892]/80 flex items-center gap-1 mt-0.5 truncate">
                            <Building2 className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                            <span className="truncate">{mgr.company || "Independent Studio"}</span>
                          </div>
                        </div>

                        {/* Role Badge */}
                        <div className="shrink-0">
                          {mgr.role === "SUPER_ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#800020]/50 text-[#dfba73] text-[10px] font-cinzel font-bold border border-[#dfba73]/40 shadow-sm">
                              <Crown className="w-2.5 h-2.5" /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-sans font-medium border border-emerald-600/40">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Planner
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle Details Grid */}
                      <div className="rounded-xl bg-[#22171f]/80 border border-[#c5a059]/15 p-3 space-y-2 text-xs">
                        {/* Username & Weddings count */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleCopyUsername(mgr.username)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1217] border border-[#c5a059]/30 text-[#edd892] font-mono text-xs hover:border-[#dfba73] transition cursor-pointer"
                            title="Click to copy username"
                          >
                            <span>@{mgr.username}</span>
                            {copiedUsername === mgr.username ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-[#dfba73]/60" />
                            )}
                          </button>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1217] border border-[#c5a059]/25 text-[#edd892] font-mono text-[11px]">
                            <Heart className="w-3 h-3 text-[#dfba73]" />
                            {weddingCount} {weddingCount === 1 ? "Wedding" : "Weddings"}
                          </span>
                        </div>

                        {/* Contact details */}
                        {(mgr.email || mgr.phone) ? (
                          <div className="space-y-1 pt-1 border-t border-[#c5a059]/15 text-[11px]">
                            {mgr.email && (
                              <a
                                href={`mailto:${mgr.email}`}
                                className="flex items-center gap-1.5 text-[#fdfbf7]/80 hover:text-[#dfba73] truncate"
                              >
                                <Mail className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                                <span className="truncate">{mgr.email}</span>
                              </a>
                            )}
                            {mgr.phone && (
                              <a
                                href={`tel:${mgr.phone}`}
                                className="flex items-center gap-1.5 text-[#fdfbf7]/70 font-mono hover:text-[#dfba73]"
                              >
                                <Phone className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                                <span>{mgr.phone}</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="pt-1 border-t border-[#c5a059]/15 text-[10px] text-white/40 italic">
                            No contact details specified
                          </div>
                        )}

                        {/* Starter wedding couple name if present */}
                        {mgr.events && mgr.events.length > 0 && (
                          <div className="text-[11px] text-[#edd892]/80 pt-1 border-t border-[#c5a059]/15 flex items-center gap-1.5 truncate">
                            <Sparkles className="w-3 h-3 text-[#dfba73] shrink-0" />
                            <span className="truncate">{mgr.events[0].coupleNames}</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="pt-1 flex items-center gap-2">
                        {mgr.events && mgr.events.length > 0 && (
                          <button
                            onClick={() => {
                              handleSelectEvent(mgr.events![0].id);
                              setActiveTab("guests");
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-[#2a1c24] hover:bg-[#800020] text-[#dfba73] hover:text-white border border-[#c5a059]/40 text-xs font-cinzel font-bold transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[40px] touch-manipulation"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Manage Wedding
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditManager(mgr)}
                          className="px-3 py-2.5 rounded-xl bg-[#22171f] hover:bg-[#2e1f2a] text-[#dfba73] border border-[#c5a059]/35 text-xs font-cinzel transition cursor-pointer flex items-center justify-center gap-1 min-h-[40px] touch-manipulation"
                          title="Edit Planner Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        {!isSelf && mgr.username !== "admin" && (
                          <button
                            onClick={() => handleOpenDeleteModal(mgr)}
                            className="w-10 h-10 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 flex items-center justify-center transition cursor-pointer touch-manipulation shrink-0"
                            title="Delete Event Manager Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DESKTOP VIEW (≥ md): Executive Management Table */}
            {filteredManagers.length > 0 && (
              <div className="hidden md:block rounded-3xl bg-[#181216]/95 border border-[#c5a059]/35 overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#241a21]/90 text-[#dfba73] font-cinzel text-[11px] uppercase tracking-wider font-semibold border-b border-[#c5a059]/30">
                      <tr>
                        <th className="py-4 px-5">Manager / Agency</th>
                        <th className="py-4 px-4">Login Username</th>
                        <th className="py-4 px-4">Contact Info</th>
                        <th className="py-4 px-4 text-center">Role</th>
                        <th className="py-4 px-4 text-center">Wedding Portfolio</th>
                        <th className="py-4 px-4">Joined Date</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c5a059]/15">
                      {filteredManagers.map((mgr) => {
                        const isSelf = mgr.id === manager.id;
                        const weddingCount = mgr._count?.events || mgr.events?.length || 0;
                        const initials = mgr.name
                          ? mgr.name
                              .trim()
                              .split(/\s+/)
                              .map((w) => w[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()
                          : "EM";

                        return (
                          <tr
                            key={mgr.id}
                            className="hover:bg-[#231a20]/60 transition-colors duration-150 group"
                          >
                            {/* Planner & Agency */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#420614] via-[#241a22] to-[#171115] border border-[#dfba73]/50 flex items-center justify-center font-cinzel font-bold text-[#dfba73] text-sm shadow-md shrink-0">
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-cinzel font-bold text-[#fdfbf7] text-sm group-hover:text-[#edd892] transition-colors flex items-center gap-2">
                                    <span className="truncate">{mgr.name}</span>
                                    {isSelf && (
                                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/40 shrink-0">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#edd892]/70 flex items-center gap-1.5 mt-0.5 truncate">
                                    <Building2 className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                                    <span className="truncate">{mgr.company || "Independent Studio"}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Login Username */}
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleCopyUsername(mgr.username)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22171f] border border-[#c5a059]/25 text-[#edd892] font-mono text-xs hover:border-[#dfba73] hover:bg-[#2a1c24] transition cursor-pointer group/copy"
                                title="Click to copy username"
                              >
                                <span>@{mgr.username}</span>
                                {copiedUsername === mgr.username ? (
                                  <span className="inline-flex items-center gap-0.5 text-emerald-400 font-sans text-[10px] font-semibold">
                                    <Check className="w-3 h-3" />
                                  </span>
                                ) : (
                                  <Copy className="w-3 h-3 text-[#dfba73]/50 group-hover/copy:text-[#dfba73] transition-colors" />
                                )}
                              </button>
                            </td>

                            {/* Contact Info */}
                            <td className="py-4 px-4 text-[11px] space-y-1">
                              {mgr.email ? (
                                <a
                                  href={`mailto:${mgr.email}`}
                                  className="flex items-center gap-1.5 text-[#fdfbf7]/80 hover:text-[#dfba73] transition truncate max-w-[190px]"
                                  title={mgr.email}
                                >
                                  <Mail className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                                  <span className="truncate">{mgr.email}</span>
                                </a>
                              ) : null}
                              {mgr.phone ? (
                                <a
                                  href={`tel:${mgr.phone}`}
                                  className="flex items-center gap-1.5 text-[#fdfbf7]/60 font-mono hover:text-[#dfba73] transition"
                                  title={mgr.phone}
                                >
                                  <Phone className="w-3 h-3 text-[#dfba73]/70 shrink-0" />
                                  <span>{mgr.phone}</span>
                                </a>
                              ) : null}
                              {!mgr.email && !mgr.phone && (
                                <span className="text-white/30 italic text-[11px]">— No contact details —</span>
                              )}
                            </td>

                            {/* Role */}
                            <td className="py-4 px-4 text-center">
                              {mgr.role === "SUPER_ADMIN" ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#800020]/50 to-[#420614]/70 text-[#edd892] text-[10px] font-cinzel font-bold border border-[#dfba73]/50 shadow-sm">
                                  <Crown className="w-3 h-3 text-[#dfba73]" /> Super Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-sans font-medium border border-emerald-600/40 shadow-sm">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Event Manager
                                </span>
                              )}
                            </td>

                            {/* Managed Weddings */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#251820] border border-[#c5a059]/30 text-[#edd892] font-mono font-semibold text-xs">
                                  <Heart className="w-3 h-3 text-[#dfba73]" />
                                  {weddingCount} {weddingCount === 1 ? "Wedding" : "Weddings"}
                                </span>
                                {mgr.events && mgr.events.length > 0 && (
                                  <span className="text-[10px] text-[#dfba73]/70 font-sans truncate max-w-[140px] mt-1 flex items-center gap-1">
                                    <Sparkles className="w-2.5 h-2.5 text-[#dfba73]" />
                                    {mgr.events[0].coupleNames}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Created Date */}
                            <td className="py-4 px-4 font-mono text-[11px] text-[#fdfbf7]/60">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3 text-[#dfba73]/60 shrink-0" />
                                <span>
                                  {new Date(mgr.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {mgr.events && mgr.events.length > 0 && (
                                  <button
                                    onClick={() => {
                                      handleSelectEvent(mgr.events![0].id);
                                      setActiveTab("guests");
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#2a1c24] hover:bg-[#800020] text-[#dfba73] hover:text-white border border-[#c5a059]/40 text-xs font-cinzel font-semibold transition cursor-pointer flex items-center gap-1.5"
                                    title="Open Manager's Wedding Portal"
                                  >
                                    <ExternalLink className="w-3 h-3" /> View Wedding
                                  </button>
                                )}

                                {/* Edit Button */}
                                <button
                                  onClick={() => handleOpenEditManager(mgr)}
                                  className="p-1.5 rounded-lg bg-[#22171f] hover:bg-[#2e1f2a] text-[#dfba73] border border-[#c5a059]/35 hover:border-[#dfba73] text-xs transition cursor-pointer"
                                  title="Edit Planner Details & Credentials"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Button */}
                                {!isSelf && mgr.username !== "admin" && (
                                  <button
                                    onClick={() => handleOpenDeleteModal(mgr)}
                                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 border border-rose-800/40 hover:border-rose-600/60 text-rose-300 text-xs transition cursor-pointer"
                                    title="Delete Event Manager Account"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ADD / EDIT GUEST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-5 sm:p-8 shadow-2xl my-auto max-h-[92dvh] overflow-y-auto overscroll-contain">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingId(null);
              }}
              className="absolute top-4 right-4 text-[#fdfbf7]/60 hover:text-[#dfba73] p-1.5 rounded-lg hover:bg-white/5 cursor-pointer touch-manipulation"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-cinzel text-xl font-bold text-[#dfba73] mb-1">
              {editingId ? "Edit Guest Details" : "Add New Guest"}
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-5">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Invite Category
                  </label>
                  <select
                    value={form.inviteType}
                    onChange={(e) => handleCategoryChange(e.target.value as Guest["inviteType"])}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none cursor-pointer"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={form.rsvpStatus}
                    onChange={(e) => setForm({ ...form, rsvpStatus: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none cursor-pointer"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none cursor-pointer"
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

              <div className="pt-3 border-t border-[#c5a059]/20 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg cursor-pointer min-h-[42px] touch-manipulation"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-5 sm:p-8 shadow-2xl my-auto max-h-[92dvh] overflow-y-auto overscroll-contain">
            <button
              onClick={() => setShowBulkModal(false)}
              className="absolute top-4 right-4 text-[#fdfbf7]/60 hover:text-[#dfba73] p-1.5 rounded-lg hover:bg-white/5 cursor-pointer touch-manipulation"
              title="Close modal"
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
                  <label className="px-3 py-1.5 rounded-lg bg-[#800020] hover:bg-[#6b0f24] text-[10px] font-cinzel font-bold text-[#edd892] cursor-pointer border border-[#c5a059]/40 flex items-center gap-1">
                    <FolderUp className="w-3.5 h-3.5" /> Select .CSV File
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
                  rows={7}
                  required
                  placeholder={`Mr & Mrs, Roshan & Anoma Perera, COUPLE, 1, +94771234567\nDr, Sunimal Jayasinghe, SINGLE, 2, +94779876543\nMr & Mrs, Gamini De Silva & Family, FAMILY, 3, +94711112233`}
                  value={bulkCsvText}
                  onChange={(e) => setBulkCsvText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs font-mono text-[#fdfbf7] focus:outline-none focus:border-[#dfba73] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setBulkCsvText(
                      `Mr & Mrs, Roshan & Anoma Perera, COUPLE, 1, +94771234567\nDr, Sunimal Jayasinghe, SINGLE, 2, +94779876543\nMr & Mrs, Gamini De Silva & Family, FAMILY, 3, +94711112233\nMrs, Nirmala Wickramasinghe, SINGLE, 4, +94773334455`
                    )
                  }
                  className="text-xs text-[#dfba73] hover:underline font-cinzel font-semibold cursor-pointer text-center sm:text-left"
                >
                  Load Sample Template
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bulkImporting || !bulkCsvText.trim()}
                    className="flex-1 sm:flex-initial btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation"
                  >
                    {bulkImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {bulkImporting ? "Importing..." : "Import All Guests"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* QR CODE PREVIEW MODAL */}
      {qrModalGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-sm max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-5 sm:p-6 text-center shadow-2xl my-auto">
            <button
              onClick={() => setQrModalGuest(null)}
              className="absolute top-4 right-4 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#c5a059]/10 transition-colors"
              aria-label="Close QR Modal"
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
                <img src={qrModalUrl} alt="Guest QR" className="w-44 h-44 sm:w-48 sm:h-48 mx-auto object-contain" />
              </div>
            )}

            <p className="text-[11px] text-[#fdfbf7]/60 mb-4 font-sans">
              Scan this QR code to view the personalized invitation.
            </p>

            <button
              onClick={() => copyLink(qrModalGuest)}
              className="w-full py-2.5 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] touch-manipulation"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Invite URL
            </button>
          </div>
        </div>
      )}

      {/* CREATE NEW WEDDING MODAL (Super Admin Exclusive) */}
      {showCreateEventModal && manager?.role === "SUPER_ADMIN" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-5 sm:p-8 shadow-2xl my-auto">
            <button
              onClick={() => setShowCreateEventModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#c5a059]/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Commercial Multi-Tenancy
            </div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#dfba73] mb-1">
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

              {manager?.role === "SUPER_ADMIN" && managers.length > 0 && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Assign to Event Manager
                  </label>
                  <select
                    value={newEventForm.managerId || manager.id}
                    onChange={(e) => setNewEventForm({ ...newEventForm, managerId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none"
                  >
                    <option value={manager.id}>Assign to Myself (Super Admin)</option>
                    {managers
                      .filter((m) => m.id !== manager.id)
                      .map((m) => {
                        const hasWedding = (m._count?.events || m.events?.length || 0) > 0;
                        return (
                          <option key={m.id} value={m.id} disabled={hasWedding}>
                            {m.name} (@{m.username}) {m.company ? `— ${m.company}` : ""} {hasWedding ? "— (1-Wedding Limit Reached)" : "— (Available)"}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingEvent}
                  className="flex-1 sm:flex-initial btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#1c1519] border border-[#c5a059]/60 p-5 sm:p-8 shadow-2xl my-auto">
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#c5a059]/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Camera className="w-3.5 h-3.5" /> Dedicated EventPhoto Table
            </div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#dfba73] mb-1">
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
                  <label className="flex-1 btn-gold-shimmer px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow min-h-[42px] touch-manipulation">
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
                    src={getThumbnailUrl(newPhotoForm.url, 400)}
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

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPhotoModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingPhoto || !newPhotoForm.url}
                  className="flex-1 sm:flex-initial btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation"
                >
                  {addingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  {addingPhoto ? "Saving Photo..." : "Save Photo to Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE EVENT MANAGER MODAL (Super Admin) */}
      {showCreateManagerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#1c1519] border border-[#dfba73]/60 p-5 sm:p-8 shadow-2xl my-auto">
            <button
              onClick={() => setShowCreateManagerModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#c5a059]/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#edd892]" /> Super Admin Provisioning
            </div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#dfba73] mb-1">
              Add New Event Manager
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-5">
              Create an isolated planner account. The event manager can log in with their unique username and password to access their own isolated wedding dashboard and client portfolios.
            </p>

            <form onSubmit={handleCreateManager} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Unique Username *
                  </label>
                  <input
                    required
                    placeholder="e.g. royal_planner"
                    value={newManagerForm.username}
                    onChange={(e) =>
                      setNewManagerForm({
                        ...newManagerForm,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs font-mono text-[#edd892] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 5 characters"
                    value={newManagerForm.password}
                    onChange={(e) => setNewManagerForm({ ...newManagerForm, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Planner Full Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Kasun Fernando"
                    value={newManagerForm.name}
                    onChange={(e) => setNewManagerForm({ ...newManagerForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Agency / Company Name
                  </label>
                  <input
                    placeholder="e.g. Royal Blooms Wedding Co."
                    value={newManagerForm.company}
                    onChange={(e) => setNewManagerForm({ ...newManagerForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="planner@company.com"
                    value={newManagerForm.email}
                    onChange={(e) => setNewManagerForm({ ...newManagerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Contact Phone
                  </label>
                  <input
                    placeholder="+94 77 123 4567"
                    value={newManagerForm.phone}
                    onChange={(e) => setNewManagerForm({ ...newManagerForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              {/* Dedicated Wedding Provisioning */}
              <div className="p-4 rounded-2xl bg-[#261c22] border border-[#c5a059]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#dfba73]">
                  <Sparkles className="w-3.5 h-3.5 text-[#edd892]" />
                  <span>Dedicated Wedding Portal (1-to-1 Architecture)</span>
                </div>
                <p className="text-[11px] text-[#fdfbf7]/60">
                  Each Event Manager is dedicated to exactly one wedding event. A starter wedding will be automatically provisioned for this manager.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#edd892] font-cinzel font-semibold mb-1">
                      Couple Names (Optional)
                    </label>
                    <input
                      placeholder="e.g. Kasun & Shenali"
                      value={newManagerForm.starterCoupleNames}
                      onChange={(e) =>
                        setNewManagerForm({ ...newManagerForm, starterCoupleNames: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#1a1217] border border-[#c5a059]/30 text-xs text-[#fdfbf7] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#edd892] font-cinzel font-semibold mb-1">
                      Venue Name
                    </label>
                    <input
                      placeholder="e.g. Shangri-La Ballroom"
                      value={newManagerForm.starterVenueName}
                      onChange={(e) =>
                        setNewManagerForm({ ...newManagerForm, starterVenueName: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#1a1217] border border-[#c5a059]/30 text-xs text-[#fdfbf7] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateManagerModal(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingManager}
                  className="flex-1 sm:flex-initial btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation"
                >
                  {creatingManager ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {creatingManager ? "Creating Planner Account..." : "Create Event Manager"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT MANAGER MODAL (Super Admin) */}
      {showEditManagerModal && editingManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl bg-[#1c1519] border border-[#dfba73]/60 p-5 sm:p-8 shadow-2xl my-auto">
            <button
              onClick={() => {
                setShowEditManagerModal(false);
                setEditingManager(null);
              }}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[#fdfbf7]/60 hover:text-[#dfba73] cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-[#c5a059]/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/20 text-[#dfba73] text-xs font-cinzel font-semibold mb-2">
              <Pencil className="w-3.5 h-3.5 text-[#edd892]" /> Account Administration
            </div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#dfba73] mb-1">
              Edit Event Manager
            </h2>
            <p className="text-xs text-[#fdfbf7]/60 mb-5">
              Update details for <span className="font-mono text-[#edd892]">@{editingManager.username}</span>. You can also reset their password if needed.
            </p>

            <form onSubmit={handleUpdateManager} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Username
                  </label>
                  <input
                    disabled
                    value={`@${editingManager.username}`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#20161d] border border-[#c5a059]/20 text-xs font-mono text-[#edd892]/70 cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    System Role *
                  </label>
                  <select
                    value={editManagerForm.role}
                    disabled={editingManager.username === "admin"}
                    onChange={(e) => setEditManagerForm({ ...editManagerForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#dfba73] focus:outline-none disabled:opacity-50 cursor-pointer"
                  >
                    <option value="MANAGER">Event Manager (Planner)</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Planner Full Name *
                  </label>
                  <input
                    required
                    value={editManagerForm.name}
                    onChange={(e) => setEditManagerForm({ ...editManagerForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Agency / Company Name
                  </label>
                  <input
                    value={editManagerForm.company}
                    onChange={(e) => setEditManagerForm({ ...editManagerForm, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editManagerForm.email}
                    onChange={(e) => setEditManagerForm({ ...editManagerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#dfba73] font-cinzel font-semibold mb-1">
                    Contact Phone
                  </label>
                  <input
                    value={editManagerForm.phone}
                    onChange={(e) => setEditManagerForm({ ...editManagerForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#261c22] border border-[#c5a059]/40 text-xs text-[#fdfbf7] focus:outline-none focus:border-[#dfba73]"
                  />
                </div>
              </div>

              {/* Password Reset Section */}
              <div className="p-4 rounded-2xl bg-[#241a22] border border-[#c5a059]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#dfba73]">
                  <Key className="w-3.5 h-3.5 text-[#edd892]" />
                  <span>Reset Planner Password (Optional)</span>
                </div>
                <p className="text-[11px] text-[#fdfbf7]/60">
                  Leave this field blank to keep their current password unchanged. Enter a new password (min 5 characters) to immediately overwrite it.
                </p>
                <input
                  type="password"
                  placeholder="New password (leave blank to keep current)"
                  value={editManagerForm.newPassword}
                  onChange={(e) => setEditManagerForm({ ...editManagerForm, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#191116] border border-[#c5a059]/35 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/30 focus:outline-none focus:border-[#dfba73]"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditManagerModal(false);
                    setEditingManager(null);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingManager}
                  className="flex-1 sm:flex-initial btn-gold-shimmer px-6 py-2.5 rounded-xl text-xs font-cinzel font-bold shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation"
                >
                  {updatingManager ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  {updatingManager ? "Saving Changes..." : "Save Manager Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE EVENT MANAGER CONFIRMATION MODAL (Super Admin) */}
      {managerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto overscroll-contain">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1f141b] to-[#161014] border border-rose-800/60 p-6 sm:p-8 shadow-2xl my-auto text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-700/50 flex items-center justify-center mx-auto text-rose-300 shadow-lg">
              <AlertTriangle className="w-7 h-7 text-rose-400" />
            </div>

            <div>
              <h2 className="font-cinzel text-xl font-bold text-[#fdfbf7]">
                Delete Event Manager Account
              </h2>
              <p className="text-xs text-[#fdfbf7]/70 mt-1.5 leading-relaxed">
                Are you sure you want to permanently delete account{" "}
                <span className="font-mono text-[#edd892] font-semibold">@{managerToDelete.username}</span> ({managerToDelete.name})?
              </p>
            </div>

            <div className="rounded-2xl bg-rose-950/30 border border-rose-800/40 p-3.5 text-left text-xs text-rose-200/90 space-y-1">
              <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Permanent Impact Notice:
              </div>
              <p className="text-[11px] text-rose-200/75 leading-relaxed">
                This account manages <strong className="text-white">{managerToDelete.weddingCount} wedding portfolio(s)</strong>. Deleting this account will permanently cascade-erase all associated wedding portals, guest lists, seating tables, and RSVP logs.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setManagerToDelete(null)}
                disabled={deletingManager}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#261c22] text-[#fdfbf7]/70 text-xs font-cinzel font-semibold hover:bg-[#c5a059]/10 cursor-pointer min-h-[42px] touch-manipulation"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteManager}
                disabled={deletingManager}
                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-cinzel font-bold shadow-lg border border-rose-600/50 flex items-center justify-center gap-1.5 min-h-[42px] touch-manipulation cursor-pointer disabled:opacity-50"
              >
                {deletingManager ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                {deletingManager ? "Deleting Account..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
