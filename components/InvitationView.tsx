"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  Calendar,
  MapPin,
  Clock,
  Send,
  Share2,
  Copy,
  Check,
  Navigation,
  Sparkles,
  Heart,
  QrCode,
  Users,
  Compass,
  Music,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  ZoomIn,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
  Globe,
  RotateCcw,
  Edit3,
  CheckCircle2,
  ChevronUp,
  Plus,
  Minus,
  Phone,
} from "lucide-react";
import dynamic from "next/dynamic";
import CountdownTimer from "./CountdownTimer";
const VenueMap = dynamic(() => import("./VenueMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-2xl bg-[#1f1519] flex items-center justify-center border border-[#c5a059]/40 text-[#dfba73] text-xs font-cinzel">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#ffd700] animate-bounce" />
        <span>Loading Venue Map...</span>
      </div>
    </div>
  ),
});
import FallingDecor from "./FallingDecor";
import MusicPlayer from "./MusicPlayer";
import EnvelopeOpening from "./EnvelopeOpening";
import ScrollProgress from "./ScrollProgress";
import ScrollReveal from "./ScrollReveal";
import RoyalThemeToggle from "./RoyalThemeToggle";
import { formatEventDate } from "@/lib/date";
import { generateICS } from "@/lib/calendar";
import { translations, Locale } from "@/lib/translations";
import {
  parseContactPhones,
  extractGuestSide,
  cleanPhoneForUrl,
  cleanPhoneForWhatsApp,
} from "@/lib/contact-side";
import {
  getOptimizedVideoUrl,
  getVideoPosterUrl,
  getOptimizedImageUrl,
  getThumbnailUrl,
  getLightboxImageUrl,
} from "@/lib/media-optimization";

import {
  RoyalCornerFlourish,
  RoyalFlourishDivider,
  RoyalCrest,
  GildedCardBorder,
} from "./RoyalDecorations";
import { getTemplate } from "@/lib/templates";
import { resolveWeddingGallery } from "@/lib/gallery-resolver";
import GoldenMandalaInvitationView from "./templates/GoldenMandalaInvitationView";
import BotanicalLaceInvitationView from "./templates/BotanicalLaceInvitationView";
import NoirCathedralInvitationView from "./templates/NoirCathedralInvitationView";
import TuscanVillaInvitationView from "./templates/TuscanVillaInvitationView";
import BlushFloralInvitationView from "./templates/BlushFloralInvitationView";
import ModernIvoryInvitationView from "./templates/ModernIvoryInvitationView";
import CelestialMidnightInvitationView from "./templates/CelestialMidnightInvitationView";
import EtherealBlushInvitationView from "./templates/EtherealBlushInvitationView";
import RoyalHeritageInvitationView from "./templates/RoyalHeritageInvitationView";

function FloralDivider({
  className = "",
  variant = "lotus",
}: {
  className?: string;
  variant?: "lotus" | "crown" | "heart";
}) {
  return <RoyalFlourishDivider className={className} variant={variant} />;
}

type Guest = {
  id?: string;
  eventId?: string | null;
  token: string;
  displayName: string;
  salutation: string;
  inviteType: string;
  tableNumber: number;
  notes?: string | null;
  phone?: string | null;
  rsvpStatus?: string | null;
  attendeeCount?: number | null;
  dietary?: string | null;
  rsvpMessage?: string | null;
  rsvpSubmittedAt?: Date | string | null;
};

type Settings = {
  id?: string;
  coupleNames: string;
  hostIntro: string;
  invitationBody: string;
  eventDate: Date;
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
  templateId?: string | null;
};

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
  }
  return null;
}

function getVimeoEmbedUrl(url: string) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&playsinline=1&title=0&byline=0&portrait=0`;
  }
  return null;
}

type GuestbookWish = {
  id: string;
  authorName: string;
  message: string;
  likes: number;
  createdAt: string;
};



function formatInviteLine(guest: Guest) {
  if (guest.inviteType === "FAMILY") {
    return `${guest.salutation} ${guest.displayName} and Family`;
  }
  return `${guest.salutation} ${guest.displayName}`;
}

export default function InvitationView({
  guest,
  settings,
  photos,
}: {
  guest: Guest;
  settings: Settings;
  photos?: Array<{
    id?: string;
    url: string;
    title?: string | null;
    subtitle?: string | null;
    tag?: string | null;
    order?: number;
  }>;
}) {
  const [locale, setLocale] = useState<Locale>("en");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [isQrPassModalOpen, setIsQrPassModalOpen] = useState(false);

  // Photo Gallery & Lightbox state
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [urlTemplateId, setUrlTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("template");
      if (t) setUrlTemplateId(t);
    }
  }, []);

  const activeTemplate = useMemo(
    () => getTemplate(urlTemplateId || settings.templateId),
    [urlTemplateId, settings.templateId]
  );

  const isModern = activeTemplate.id === "modern-ivory" || activeTemplate.category === "minimalist";
  const isBotanical = activeTemplate.id === "botanical-silk-sanduni" || activeTemplate.category === "botanical";
  const isCelestial = activeTemplate.id === "celestial-midnight" || activeTemplate.category === "celestial";
  const isVelvet = activeTemplate.id === "velvet-homecoming";
  const isCathedral = activeTemplate.id === "cathedral-palace-doors";
  const isTraditional = activeTemplate.id === "golden-mandala-heritage" || activeTemplate.category === "traditional";
  const isEthereal = activeTemplate.id === "ethereal-blush";


  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; size: number }[]>([]);
  const galleryCardRef = useRef<HTMLDivElement>(null);
  const [loveCount, setLoveCount] = useState(142);
  const [hasLiked, setHasLiked] = useState(false);

  // Host contact information & guest side resolution
  const contactInfo = useMemo(() => parseContactPhones(settings.contactPhone), [settings.contactPhone]);
  const guestSide = useMemo(() => extractGuestSide(guest.notes), [guest.notes]);

  const { groomFirstName, brideFirstName } = useMemo(() => {
    const raw = settings.coupleNames || "";
    const parts = raw.split(/&|\band\b|\+/i).map((s) => s.trim());
    return {
      groomFirstName: parts[0] || "Groom",
      brideFirstName: parts[1] || "Bride",
    };
  }, [settings.coupleNames]);

  const youtubeEmbedUrl = useMemo(
    () => (settings.heroVideoUrl ? getYouTubeEmbedUrl(settings.heroVideoUrl) : null),
    [settings.heroVideoUrl]
  );
  const vimeoEmbedUrl = useMemo(
    () => (settings.heroVideoUrl ? getVimeoEmbedUrl(settings.heroVideoUrl) : null),
    [settings.heroVideoUrl]
  );

  // High performance Range streaming endpoint & adaptive Cloudinary video delivery
  const videoStreamUrl = useMemo(() => {
    if (!settings.heroVideoUrl) return "";
    // If it's a legacy non-existent demo video placeholder or unseeded local path, avoid 404
    if (settings.heroVideoUrl.includes("preshoot-video-0903") || settings.heroVideoUrl.startsWith("/uploads/")) {
      return "";
    }
    if (settings.heroVideoUrl.startsWith("/audio/")) {
      return `/api/media/stream?src=${encodeURIComponent(settings.heroVideoUrl)}`;
    }
    // Automatically apply adaptive bitrate, codec selection, and 1080p resolution capping
    return getOptimizedVideoUrl(settings.heroVideoUrl, { width: 1080 });
  }, [settings.heroVideoUrl]);

  const hasPlayableVideo = Boolean(
    (videoStreamUrl && videoStreamUrl.length > 0) ||
    youtubeEmbedUrl ||
    vimeoEmbedUrl
  );

  // Pre-Shoot Video state
  const [mediaMode, setMediaMode] = useState<"video" | "photo">(hasPlayableVideo ? "video" : "photo");
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoContainerRef = useRef<HTMLDivElement>(null);

  // Compute lightweight instant video poster frame (under 30KB)
  const videoPosterSrc = useMemo(() => {
    return getVideoPosterUrl(
      settings.heroVideoUrl,
      settings.videoThumbnailUrl || settings.heroImageUrl
    );
  }, [settings.heroVideoUrl, settings.videoThumbnailUrl, settings.heroImageUrl]);

  // Helper to reliably configure and play hero video across mobile and desktop browsers
  const playHeroVideoSafely = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.defaultMuted = true;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "true");
    v.setAttribute("webkit-playsinline", "true");
    if (isVideoPlaying) {
      v.play().catch(() => {});
    }
  };

  // Viewport-aware video observer: pause when scrolled out of view to save bandwidth & GPU
  useEffect(() => {
    if (!envelopeOpened || !heroVideoContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!heroVideoRef.current) return;
          if (entry.isIntersecting) {
            if (isVideoPlaying && heroVideoRef.current.paused) {
              playHeroVideoSafely();
            }
          } else {
            if (!heroVideoRef.current.paused) {
              heroVideoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "100px 0px" }
    );

    observer.observe(heroVideoContainerRef.current);
    return () => observer.disconnect();
  }, [envelopeOpened, isVideoPlaying]);

  // Auto-play hero video when envelope opens or video changes
  useEffect(() => {
    if (envelopeOpened) {
      playHeroVideoSafely();
    }
  }, [envelopeOpened, isVideoPlaying, videoStreamUrl]);

  // User interaction listener to trigger video autoplay if initially deferred by browser policy
  useEffect(() => {
    const handleGesturePlay = () => {
      if (heroVideoRef.current && heroVideoRef.current.paused && isVideoPlaying) {
        playHeroVideoSafely();
      }
    };

    window.addEventListener("start_wedding_music", handleGesturePlay);
    window.addEventListener("click", handleGesturePlay, { once: true });
    window.addEventListener("touchstart", handleGesturePlay, { once: true });

    return () => {
      window.removeEventListener("start_wedding_music", handleGesturePlay);
      window.removeEventListener("click", handleGesturePlay);
      window.removeEventListener("touchstart", handleGesturePlay);
    };
  }, [isVideoPlaying]);

  // Read saved locale on mount
  useEffect(() => {
    const savedLocale = sessionStorage.getItem("invite_locale") as Locale | null;
    if (savedLocale && ["en", "si", "ta"].includes(savedLocale)) {
      setLocale(savedLocale);
    }
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    sessionStorage.setItem("invite_locale", newLocale);
  };

  // Monitor scroll for floating quick-navigation dock
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 340);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const quickBlessingPresets = [
    "Warmest congratulations! 🥂",
    "Wishing you endless love & joy! 💕",
    "Can't wait to celebrate! ✨",
    "Deeply blessed marriage! 🙏",
  ];

  const handleApplyBlessingPreset = (preset: string) => {
    setRsvpWish((prev) => (prev ? `${prev} ${preset}` : preset));
    confetti({
      particleCount: 18,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#ffd700", "#dfba73", "#ffccd5", "#800020"],
    });
  };

  const t = translations[locale] || translations.en;

  const themeCardStyles = useMemo(() => {
    if (isModern) {
      return {
        cardBg: "bg-[#09090b] text-[#f4f4f5] border border-white/15 shadow-2xl",
        titleColor: "text-white",
        subtitleColor: "text-[#c5a059]",
        badgePill: "bg-white/10 text-[#c5a059] border border-[#c5a059]/40",
        badgeText: "✦ HIGH-FASHION MINIMALIST WEDDING ✦",
        flourishColor: "#71717a",
        introColor: "text-[#a1a1aa]",
        decreeCard: "bg-[#121216] border border-white/10 text-[#f4f4f5]",
        guestPill: "bg-[#c5a059] text-black border border-[#c5a059]",
        buttonClass: "bg-neutral-900 hover:bg-neutral-800 text-[#ffd700] border border-[#ffd700]/40",
      };
    }
    if (isBotanical) {
      return {
        cardBg: "bg-gradient-to-b from-[#ffffff] via-[#f7faf6] to-[#eef4ee] text-[#1b4332] border-2 border-[#2d6a4f]/40 shadow-2xl",
        titleColor: "text-[#1b4332]",
        subtitleColor: "text-[#2d6a4f]",
        badgePill: "bg-[#2d6a4f]/10 text-[#2d6a4f] border border-[#2d6a4f]/30",
        badgeText: "✦ BOTANICAL GARDEN CELEBRATION ✦",
        flourishColor: "#2d6a4f",
        introColor: "text-[#40916c]",
        decreeCard: "bg-[#f4f8f4] border border-[#2d6a4f]/30 text-[#1b4332]",
        guestPill: "bg-[#2d6a4f] text-white border border-[#2d6a4f]",
        buttonClass: "bg-[#2d6a4f] hover:bg-[#1b4332] text-white border border-[#52796f]",
      };
    }
    if (isCelestial) {
      return {
        cardBg: "bg-gradient-to-b from-[#0b1329] via-[#0f1d3b] to-[#040812] text-[#f8fafc] border-2 border-[#38bdf8]/50 shadow-[0_0_40px_rgba(56,189,248,0.2)]",
        titleColor: "text-[#38bdf8]",
        subtitleColor: "text-[#93c5fd]",
        badgePill: "bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40",
        badgeText: "✦ CELESTIAL STARRY NIGHT UNION ✦",
        flourishColor: "#38bdf8",
        introColor: "text-[#cbd5e1]",
        decreeCard: "bg-[#0f1d3b] border border-[#38bdf8]/30 text-[#f8fafc]",
        guestPill: "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white border border-[#60a5fa]",
        buttonClass: "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white border border-[#60a5fa]",
      };
    }
    if (isVelvet) {
      return {
        cardBg: "bg-gradient-to-b from-[#fffdfa] via-[#faf5eb] to-[#f4ebe0] text-[#3b1720] border-2 border-[#c5a059] shadow-2xl ring-1 ring-[#541221]/30",
        titleColor: "text-[#541221]",
        subtitleColor: "text-[#8a5d20]",
        badgePill: "bg-[#541221]/10 text-[#541221] border border-[#c5a059]/50",
        badgeText: "✦ THE HOMECOMING CELEBRATION ✦",
        flourishColor: "#c5a059",
        introColor: "text-[#7a4855]",
        decreeCard: "royal-decree-card text-[#3b1720]",
        guestPill: "bg-gradient-to-r from-[#541221] to-[#73172c] text-[#edd892] border border-[#c5a059]",
        buttonClass: "bg-gradient-to-r from-[#541221] to-[#73172c] text-[#edd892] border border-[#c5a059]",
      };
    }
    if (isTraditional) {
      return {
        cardBg: "bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f6ecda] text-[#362208] border-2 border-[#c5a059] shadow-2xl",
        titleColor: "text-[#8b1e2a]",
        subtitleColor: "text-[#c5a059]",
        badgePill: "bg-[#8b1e2a]/10 text-[#8b1e2a] border border-[#c5a059]/60",
        badgeText: "✦ ශ්‍රී සුභ මංගලම් • AUSPICIOUS WEDDING ✦",
        flourishColor: "#c5a059",
        introColor: "text-[#8a5d20]",
        decreeCard: "royal-decree-card text-[#362208]",
        guestPill: "bg-gradient-to-r from-[#8b1e2a] via-[#c5a059] to-[#8b1e2a] text-white border border-[#ffd700]",
        buttonClass: "bg-gradient-to-r from-[#c5a059] via-[#dfba73] to-[#8b1e2a] text-[#362208] border border-[#ffd700]",
      };
    }
    if (isCathedral) {
      return {
        cardBg: "bg-gradient-to-b from-[#ffffff] via-[#fbf8f4] to-[#f4eee6] text-[#2b2623] border-2 border-[#c5a059] shadow-2xl",
        titleColor: "text-[#2b2623]",
        subtitleColor: "text-[#8a6d3b]",
        badgePill: "bg-[#4a3b32]/10 text-[#2b2623] border border-[#c5a059]/50",
        badgeText: "✦ CATHEDRAL SACRED SOLEMNIZATION ✦",
        flourishColor: "#c5a059",
        introColor: "text-[#8a6d3b]",
        decreeCard: "royal-decree-card text-[#2b2623]",
        guestPill: "bg-[#2b2623] text-[#edd892] border border-[#c5a059]",
        buttonClass: "bg-[#2b2623] hover:bg-[#4a3b32] text-[#edd892] border border-[#c5a059]",
      };
    }
    if (isEthereal) {
      return {
        cardBg: "bg-gradient-to-b from-[#fffbfa] via-[#fdf2f4] to-[#f9e7ea] text-[#290916] border-2 border-[#fbcfe8] shadow-2xl",
        titleColor: "text-[#be185d]",
        subtitleColor: "text-[#fb7185]",
        badgePill: "bg-[#be185d]/10 text-[#be185d] border border-[#f472b6]/40",
        badgeText: "✦ ENCHANTED FAIRY-TALE ROMANCE ✦",
        flourishColor: "#e11d48",
        introColor: "text-[#9f1239]",
        decreeCard: "bg-[#fff0f5] border border-[#fbcfe8] text-[#290916]",
        guestPill: "bg-gradient-to-r from-[#be185d] to-[#db2777] text-white border border-[#fbcfe8]",
        buttonClass: "bg-gradient-to-r from-[#be185d] to-[#db2777] text-white border border-[#fbcfe8]",
      };
    }
    // Default Royal Heritage
    return {
      cardBg: "parchment-card text-[#1a1517]",
      titleColor: "text-[#661022]",
      subtitleColor: "text-[#8c6a2b]",
      badgePill: "bg-gradient-to-r from-[#661022]/10 via-[#dfba73]/25 to-[#661022]/10 border border-[#bda06d]/40 text-[#8c6a2b]",
      badgeText: `✦ ${t.royalHomecoming} ✦`,
      flourishColor: "#c5a059",
      introColor: "text-[#4a3b42]",
      decreeCard: "royal-decree-card text-[#1a1517]",
      guestPill: "bg-gradient-to-r from-[#661022] via-[#800020] to-[#661022] text-[#ffd700] border border-[#ffd700]/50",
      buttonClass: "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700]",
    };
  }, [activeTemplate, isModern, isBotanical, isCelestial, isVelvet, isTraditional, isCathedral, isEthereal, t.royalHomecoming]);

  function handleToggleVideoAudio(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (heroVideoRef.current) {
      const newMuted = !isVideoMuted;
      heroVideoRef.current.muted = newMuted;
      setIsVideoMuted(newMuted);
      if (!newMuted) {
        window.dispatchEvent(new CustomEvent("wedding_video_play"));
      } else {
        window.dispatchEvent(new CustomEvent("wedding_video_pause"));
      }
    }
  }

  function handleToggleVideoPlay(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (heroVideoRef.current) {
      if (heroVideoRef.current.paused) {
        heroVideoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        heroVideoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  }

  function openCinemaTheater() {
    setShowCinemaModal(true);
    window.dispatchEvent(new CustomEvent("wedding_video_play"));
  }

  function closeCinemaTheater() {
    setShowCinemaModal(false);
    window.dispatchEvent(new CustomEvent("wedding_video_pause"));
  }

  // RSVP Form state
  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "declined" | "">(
    guest.rsvpStatus === "ATTENDING" ? "attending" : guest.rsvpStatus === "DECLINED" ? "declined" : ""
  );
  const maxAttendees = guest.inviteType === "SINGLE" ? 1 : guest.inviteType === "COUPLE" ? 2 : 5;
  const [rsvpCount, setRsvpCount] = useState<number>(
    guest.attendeeCount ? Math.min(guest.attendeeCount, maxAttendees) : guest.inviteType === "COUPLE" ? 2 : 1
  );
  const [dietary, setDietary] = useState<string>(guest.dietary || "NONE");
  const [rsvpWish, setRsvpWish] = useState(guest.rsvpMessage || "");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(Boolean(guest.rsvpSubmittedAt || guest.rsvpStatus));
  const [submittingRsvp, setSubmittingRsvp] = useState(false);

  // Digital Guestbook wishes state
  const [wishes, setWishes] = useState<GuestbookWish[]>([]);
  const [loadingWishes, setLoadingWishes] = useState(false);
  const [likedWishIds, setLikedWishIds] = useState<Set<string>>(new Set());

  async function loadWishes() {
    try {
      setLoadingWishes(true);
      const eventId = (settings.id && settings.id !== "singleton" ? settings.id : (guest.eventId || settings.id || "")) || "";
      const res = await fetch(`/api/wishes${eventId ? `?eventId=${eventId}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setWishes(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingWishes(false);
    }
  }

  useEffect(() => {
    loadWishes();
  }, []);

  async function handleLikeWish(wishId: string) {
    if (likedWishIds.has(wishId)) return;
    setLikedWishIds((prev) => new Set(prev).add(wishId));
    setWishes((prev) =>
      prev.map((w) => (w.id === wishId ? { ...w, likes: w.likes + 1 } : w))
    );

    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.78 },
        colors: ["#ffd700", "#dfba73", "#ffccd5", "#800020"],
      });
    } catch {}

    try {
      const res = await fetch(`/api/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id: wishId }),
      });
      if (!res.ok) throw new Error('Like failed');
    } catch {
      // Rollback optimistic update on failure
      setLikedWishIds((prev) => {
        const next = new Set(prev);
        next.delete(wishId);
        return next;
      });
      setWishes((prev) => prev.map((w) => (w.id === wishId ? { ...w, likes: Math.max(0, w.likes - 1) } : w)));
    }
  }

  // Parse Gallery items from dedicated EventPhoto table, or fallback to settings.galleryJson / defaults
  const parsedGallery = useMemo(() => {
    return resolveWeddingGallery(settings, photos, [
      {
        src: "/images/coupleshare.png",
        title: "A Timeless Bond",
        subtitle: "Two souls, one sacred journey under the stars",
        tag: "Pre-Wedding Shoot",
      },
    ]);
  }, [photos, settings.galleryJson]);

  // Parse Timeline items if customized in settings
  const parsedTimeline = useMemo(() => {
    if (settings.timelineJson) {
      try {
        const parsed = JSON.parse(settings.timelineJson);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return t.defaultTimeline;
  }, [settings.timelineJson, t.defaultTimeline]);

  const date = useMemo(() => formatEventDate(settings.eventDate), [settings.eventDate]);

  // High-performance CDN optimized image URLs
  const rawHeroImage = settings.heroImageUrl && !settings.heroImageUrl.includes("preshoot-photo-Pragya")
    ? settings.heroImageUrl
    : "/images/couple-kiss.jpg";
  const heroImageSrc = useMemo(() => getOptimizedImageUrl(rawHeroImage, { width: 1080, quality: "auto:good" }), [rawHeroImage]);

  const rawWelcomeImage = settings.welcomeImageUrl && !settings.welcomeImageUrl.includes("preshoot-photo-423f")
    ? settings.welcomeImageUrl
    : "/images/couple-kiss.jpg";
  const welcomeImageSrc = useMemo(
    () => getOptimizedImageUrl(rawWelcomeImage, { width: 360, height: 360, crop: "fill", gravity: "face", quality: "auto:good" }),
    [rawWelcomeImage]
  );

  const rawPlaceCardImage = settings.placeCardImageUrl && !settings.placeCardImageUrl.includes("preshoot-photo-e5a4")
    ? settings.placeCardImageUrl
    : "/images/couple-kiss.jpg";
  const placeCardImageSrc = useMemo(
    () => getOptimizedImageUrl(rawPlaceCardImage, { width: 160, height: 160, crop: "fill", quality: "auto:good" }),
    [rawPlaceCardImage]
  );

  const rawBlessingImage = settings.blessingImageUrl && !settings.blessingImageUrl.includes("preshoot-photo-OIP2")
    ? settings.blessingImageUrl
    : "/images/couple-kiss.jpg";
  const blessingImageSrc = useMemo(() => getOptimizedImageUrl(rawBlessingImage, { width: 640, quality: "auto:good" }), [rawBlessingImage]);
  const placeCardNote = settings.placeCardNote || t.cantWaitToWelcome;


  const monogram = (() => {
    const parts = (settings.coupleNames || "").split(/&|and|\+/i).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]?.toUpperCase() || "S"} & ${parts[1][0]?.toUpperCase() || "S"}`;
    }
    const words = (settings.coupleNames || "").trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]?.toUpperCase() || "S"} & ${words[words.length - 1][0]?.toUpperCase() || "S"}`;
    }
    return (settings.coupleNames || "").slice(0, 2).toUpperCase() || "S & S";
  })();

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? parsedGallery.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === parsedGallery.length - 1 ? 0 : prev + 1));
  };

  // Automatic romantic slideshow interval
  useEffect(() => {
    if (!isSlideshowPlaying || isLightboxOpen) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => (prev === parsedGallery.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isSlideshowPlaying, isLightboxOpen, parsedGallery.length]);

  // 3D Parallax Tilt for Photo Card - direct DOM transform (0 React re-renders on mousemove)
  const handleGalleryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = galleryCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${-(y * 8)}deg) rotateY(${x * 8}deg)`;
  };

  const handleGalleryMouseLeave = () => {
    if (galleryCardRef.current) {
      galleryCardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // swipe left -> next
      handleNextPhoto();
    } else if (diff < -45) {
      // swipe right -> prev
      handlePrevPhoto();
    }
    setTouchStartX(null);
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") setCurrentPhotoIndex((prev) => (prev === 0 ? parsedGallery.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setCurrentPhotoIndex((prev) => (prev === parsedGallery.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, parsedGallery.length]);

  const handleSendLove = () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLoveCount((prev) => prev + 1);

    // Spawn 6 floating hearts
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      left: 15 + Math.random() * 70,
      size: 18 + Math.random() * 16,
    }));
    setFloatingHearts(newHearts);
    setTimeout(() => setFloatingHearts([]), 1800);

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#800020", "#c5a059", "#dfba73", "#ffccd5", "#ffd700"],
    });
  };


  const triggerReaction = (type: "love" | "cheers" | "bless") => {
    const colors =
      type === "love"
        ? ["#e63956", "#ff758f", "#ffd700"]
        : type === "cheers"
        ? ["#dfba73", "#ffd700", "#ffffff"]
        : ["#9e1b32", "#ffd700", "#e63956"];

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors,
    });
  };

  // Maps and navigation URLs
  const encodedVenue = encodeURIComponent(`${settings.venueName}, ${settings.venueAddress}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${settings.venueLat},${settings.venueLng}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodedVenue}&ll=${settings.venueLat},${settings.venueLng}`;
  const wazeUrl = `https://waze.com/ul?ll=${settings.venueLat},${settings.venueLng}&navigate=yes`;
  const uberUrl = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${settings.venueLat}&dropoff[longitude]=${settings.venueLng}&dropoff[nickname]=${encodeURIComponent(
    settings.venueName
  )}`;

  // Google Calendar & web calendar URLs with deterministic date computation
  const { googleCalendarWebUrl, yahooCalendarWebUrl, outlookCalendarWebUrl } = useMemo(() => {
    const eventDateObj = new Date(settings.eventDate);
    const validTime = isNaN(eventDateObj.getTime()) ? new Date("2026-12-18T18:30:00.000Z") : eventDateObj;
    const gCalStart = validTime.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const gCalEnd = new Date(validTime.getTime() + 5 * 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `${settings.coupleNames} — ${t.homecomingCelebration}`
    )}&dates=${gCalStart}/${gCalEnd}&details=${encodeURIComponent(
      `${t.homecomingCelebration} for ${settings.coupleNames}`
    )}&location=${encodeURIComponent(
      `${settings.venueName}, ${settings.venueAddress}`
    )}`;

    const yUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(
      `${settings.coupleNames} — ${t.homecomingCelebration}`
    )}&st=${gCalStart}&et=${gCalEnd}&desc=${encodeURIComponent(
      `${t.homecomingCelebration} for ${settings.coupleNames}`
    )}&in_loc=${encodeURIComponent(`${settings.venueName}, ${settings.venueAddress}`)}`;

    const oUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
      `${settings.coupleNames} — ${t.homecomingCelebration}`
    )}&startdt=${validTime.toISOString()}&enddt=${new Date(
      validTime.getTime() + 5 * 60 * 60 * 1000
    ).toISOString()}&body=${encodeURIComponent(
      `${t.homecomingCelebration} for ${settings.coupleNames}`
    )}&location=${encodeURIComponent(`${settings.venueName}, ${settings.venueAddress}`)}`;

    return {
      googleCalendarWebUrl: gUrl,
      yahooCalendarWebUrl: yUrl,
      outlookCalendarWebUrl: oUrl,
    };
  }, [settings.eventDate, settings.coupleNames, settings.venueName, settings.venueAddress, t.homecomingCelebration]);

  // Generate dynamic QR Code for guest VIP pass
  useEffect(() => {
    const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
    QRCode.toDataURL(
      inviteUrl,
      {
        width: 180,
        margin: 1,
        color: {
          dark: "#6b0f24",
          light: "#ffffff",
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [guest.token]);

  const handleStartOpenEnvelope = () => {
    // 1. Directly trigger video play synchronously inside user touch/click gesture window
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      heroVideoRef.current.playsInline = true;
      heroVideoRef.current.setAttribute("playsinline", "true");
      heroVideoRef.current.setAttribute("webkit-playsinline", "true");
      const p = heroVideoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }

    // 2. Broadcast event to start music player
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("start_wedding_music"));
    }
  };

  const handleOpenEnvelope = (selectedLocale: Locale) => {
    setLocale(selectedLocale);
    setEnvelopeOpened(true);
    setIsVideoPlaying(true);
    setIsVideoMuted(true);

    // Re-verify and ensure playback is running as envelope finishes dissolving
    playHeroVideoSafely();

    // Broadcast event to start music player
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("start_wedding_music"));
    }
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(
      `${settings.venueName}, ${settings.venueAddress}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `✨ ${t.cordiallyInvited}\n\n*${settings.coupleNames}* — ${t.homecomingCelebration}! 🥂🍾\n\n${t.tapToOpen}:\n${
      typeof window !== "undefined" ? window.location.href : ""
    }`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareInvite = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: `${settings.coupleNames} — ${t.homecomingCelebration}`,
      text: `✨ ${t.cordiallyInvited}\n\n*${settings.coupleNames}* — ${t.homecomingCelebration}! 🥂🍾`,
      url: shareUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to WhatsApp if dismissed or unsupported
      }
    }
    handleShareWhatsApp();
  };

  const handleDownloadICS = () => {
    generateICS({
      title: `${settings.coupleNames} — ${t.homecomingCelebration}`,
      description: `${t.homecomingCelebration} for ${settings.coupleNames}. ${t.cantWaitToWelcome}`,
      location: `${settings.venueName}, ${settings.venueAddress}`,
      startDate: settings.eventDate,
      durationHours: 5,
    });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpStatus) return;
    setSubmittingRsvp(true);

    try {
      await fetch("/api/invite/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: guest.token,
          status: rsvpStatus,
          attendeeCount: rsvpStatus === "attending" ? rsvpCount : 0,
          dietary: rsvpStatus === "attending" ? dietary : "NONE",
          message: rsvpWish,
        }),
      });

      setRsvpSubmitted(true);
      loadWishes();
      // Confetti for RSVP
      if (rsvpStatus === "attending") {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#c5a059", "#dfba73", "#800020", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRsvp(false);
    }
  };

  if (isTraditional || activeTemplate.id === "golden-mandala-heritage" || activeTemplate.id === "nilame-traditional") {
    return <GoldenMandalaInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (isBotanical) {
    return <BotanicalLaceInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (isCathedral) {
    return <NoirCathedralInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (activeTemplate.id === "embossed-ivory-envelope") {
    return <TuscanVillaInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (activeTemplate.id === "velvet-homecoming") {
    return <BlushFloralInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (isModern || activeTemplate.id === "modern-ivory") {
    return <ModernIvoryInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (isCelestial || activeTemplate.id === "celestial-midnight") {
    return <CelestialMidnightInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (isEthereal || activeTemplate.id === "ethereal-blush") {
    return <EtherealBlushInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  if (activeTemplate.id === "royal-heritage") {
    return <RoyalHeritageInvitationView guest={guest} settings={settings} photos={photos} />;
  }

  return (
    <div className={`relative min-h-screen ${activeTemplate.styles.pageBg} text-[#fdfbf7] selection:bg-[#c5a059]/30 selection:text-[#f7e4be] overflow-x-hidden transition-colors duration-700`}>
      {/* 3D Wax Seal Envelope Entrance Overlay */}
      <EnvelopeOpening
        guestName={guest.displayName}
        salutation={guest.salutation}
        coupleNames={settings.coupleNames}
        initialLocale={locale}
        templateId={activeTemplate.id}
        onStartOpen={handleStartOpenEnvelope}
        onOpen={handleOpenEnvelope}
      />

      {/* Floating Animated Rose Petals & Gold Sparkles Across All Sections */}
      <FallingDecor />

      {/* Interactive Golden Floral Scroll Progress Bar */}
      <ScrollProgress />

      {/* Floating Luxury Language Switcher & Royal Celestial Theme Toggle */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <RoyalThemeToggle variant="floating" />
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#181114]/90 border border-[#dfba73]/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {(["en", "si", "ta"] as Locale[]).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleLanguageChange(loc)}
              className={`px-3 py-1 rounded-full text-xs font-cinzel font-bold transition-all cursor-pointer flex items-center gap-1 ${
                locale === loc
                  ? "bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700] shadow-md scale-105"
                  : "text-[#edd892]/70 hover:text-[#ffd700]"
              }`}
            >
              <span>{translations[loc].langFlag}</span>
              <span className="hidden sm:inline">{translations[loc].langName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Luxury Vinyl Disc Background Music Player */}
      <MusicPlayer src={settings.musicUrl || "/audio/background.mp3"} />

      {/* Main Luxury Invitation Container */}
      <div className="relative z-10 max-w-xl mx-auto px-3 sm:px-6 py-6 sm:py-16">
        {/* Dynamic Themed Invitation Card Frame */}
        <div className={`${themeCardStyles.cardBg} rounded-2xl sm:rounded-3xl p-4 sm:p-10 relative overflow-hidden transition-all duration-500`}>
          {/* Theme-Adaptive Corner Flourishes or Modern Brackets */}
          {!isModern ? (
            <>
              <RoyalCornerFlourish position="top-left" size={68} />
              <RoyalCornerFlourish position="top-right" size={68} />
              <RoyalCornerFlourish position="bottom-left" size={68} />
              <RoyalCornerFlourish position="bottom-right" size={68} />
              <GildedCardBorder />
            </>
          ) : (
            <>
              {/* Modern Minimalist Geometric Corner Brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#c5a059] pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#c5a059] pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#c5a059] pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#c5a059] pointer-events-none" />
              <div className="absolute inset-2.5 rounded-2xl border border-white/10 pointer-events-none" />
            </>
          )}

          {/* Ambient Top Radiance Sheen */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffd700]/70 to-transparent pointer-events-none" />

          {/* Header Monogram & Title with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={750}>
            {isTraditional ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                {/* Rotating 24K Auspicious Poruwa Mandala Filigree */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#c5a059] animate-spin-slow opacity-60" />
                  <RoyalCrest monogram={monogram} size={64} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#8b1e2a]/15 text-[#8b1e2a] border border-[#c5a059]/60 shadow-xs mb-2 font-serif text-[11px] sm:text-xs tracking-[0.2em] font-bold">
                  <span>ශ්‍රී සුභ මංගලම් • SRI SUBA MANGALAM</span>
                </div>

                <h1 className="font-serif italic text-3xl sm:text-5xl text-[#8b1e2a] font-bold mt-1 tracking-tight drop-shadow-xs">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#8a5d20] font-serif leading-relaxed max-w-md mx-auto mt-2 italic font-semibold">
                  Auspicious Poruwa Ceremony &amp; Sacred Customs
                </p>
              </div>
            ) : isBotanical ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                <div className="flex items-center justify-center gap-2 text-[#2d6a4f] text-sm mb-2">
                  <span>❦</span>
                  <span>🌿</span>
                  <span className="text-xs uppercase tracking-[0.25em] font-cinzel font-bold text-[#2d6a4f]">Botanical Garden</span>
                  <span>🌿</span>
                  <span>❦</span>
                </div>

                <h1 className="font-serif italic text-3xl sm:text-5xl text-[#1b4332] font-bold mt-1 tracking-tight">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#40916c] font-sans leading-relaxed max-w-md mx-auto mt-2 italic">
                  Together in Nature&apos;s Embrace • Wedding Celebration
                </p>
              </div>
            ) : isCathedral ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                <div className="text-base text-[#c5a059] mb-1">⚜</div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4a3b32]/10 text-[#2b2623] border border-[#c5a059]/50 mb-2 font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold">
                  <span>Holy Matrimony</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl text-[#2b2623] font-bold mt-1 tracking-wide">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#8a6d3b] font-serif leading-relaxed max-w-md mx-auto mt-2 italic">
                  In the presence of God &amp; our families, we exchange sacred vows
                </p>
              </div>
            ) : isCelestial ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                <div className="text-sm text-[#38bdf8] mb-1 animate-pulse">✨ ✦ ✨</div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40 mb-2 font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold">
                  <span>Written in the Stars</span>
                </div>
                <h1 className="font-serif italic text-3xl sm:text-5xl text-[#f8fafc] font-bold mt-1 tracking-tight drop-shadow-[0_2px_12px_rgba(56,189,248,0.5)]">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#93c5fd] font-sans leading-relaxed max-w-md mx-auto mt-2 italic">
                  Under a canopy of stars, we unite our souls in eternal love
                </p>
              </div>
            ) : isVelvet ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                <div className="text-lg text-[#dfba73] mb-1">👑</div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#541221]/15 text-[#541221] border border-[#c5a059]/50 mb-2 font-cinzel text-[10px] tracking-[0.25em] uppercase font-bold">
                  <span>The Homecoming Celebration</span>
                </div>
                <h1 className="font-serif italic text-3xl sm:text-5xl text-[#541221] font-bold mt-1 tracking-tight">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#7a4855] font-sans leading-relaxed max-w-md mx-auto mt-2 italic">
                  A grand evening of romance, champagne toasts, &amp; banquet dance
                </p>
              </div>
            ) : isModern ? (
              <div className="text-center pt-2 sm:pt-4 mb-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#c5a059] border border-[#c5a059]/40 mb-2 font-mono text-[9px] tracking-[0.3em] uppercase font-bold">
                  <span>BLACK TIE • MINIMAL</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-5xl text-white font-bold mt-1 tracking-wide uppercase">
                  {settings.coupleNames}
                </h1>
                <p className="text-center text-xs sm:text-sm text-[#a1a1aa] font-mono leading-relaxed max-w-md mx-auto mt-2 tracking-wider">
                  CELEBRATION OF MARRIAGE &amp; UNION
                </p>
              </div>
            ) : (
              <div className="text-center pt-3 sm:pt-5 mb-4">
                <div className="flex justify-center mb-3">
                  <RoyalCrest monogram={monogram} size={76} />
                </div>
                <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full ${themeCardStyles.badgePill} shadow-2xs mb-2 font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-bold`}>
                  <span className="text-[10px] text-[#ffd700]">✦</span>
                  <span>{themeCardStyles.badgeText}</span>
                  <span className="text-[10px] text-[#ffd700]">✦</span>
                </div>
                <h1 className={`font-serif italic text-3xl sm:text-5xl ${themeCardStyles.titleColor} font-bold mt-1 tracking-tight drop-shadow-xs`}>
                  {settings.coupleNames}
                </h1>
                <p className={`text-center text-xs sm:text-sm ${themeCardStyles.introColor} font-sans leading-relaxed max-w-md mx-auto mb-4 italic`}>
                  {settings.hostIntro || t.familyIntro}
                </p>
              </div>
            )}

            {/* Symmetrical Royal Flourish Divider */}
            <RoyalFlourishDivider variant={isBotanical ? "lotus" : isCelestial ? "heart" : "crown"} className="!my-2.5 !sm:my-3" />
          </ScrollReveal>

          {/* Interactive Pre-Shoot Film / Couple Photo Switcher Pills */}
          {hasPlayableVideo && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  setMediaMode("video");
                  setIsVideoPlaying(true);
                  setTimeout(() => {
                    playHeroVideoSafely();
                  }, 50);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                  mediaMode === "video"
                    ? "bg-[#800020] text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.4)]"
                    : "bg-[#1f1519] text-[#dfba73]/70 border border-[#c5a059]/30 hover:text-[#edd892]"
                }`}
              >
                <Film className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{t.preshootFilm}</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaMode("photo")}
                className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                  mediaMode === "photo"
                    ? "bg-[#800020] text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.4)]"
                    : "bg-[#1f1519] text-[#dfba73]/70 border border-[#c5a059]/30 hover:text-[#edd892]"
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#dfba73]" />
                <span>{t.couplePortrait}</span>
              </button>
            </div>
          )}

          {/* Luxury Couple Hero Pre-Shoot Video / Photo Cinema Card with Scroll Reveal */}
          <ScrollReveal variant="scale-up" duration={850}>
            <div className="relative w-full my-6">
              <div className="relative rounded-3xl overflow-hidden gilded-frame bg-[#1a1215] group">
                {/* Gilded Inner Inset Fillet Line */}
                <div className="absolute inset-1.5 rounded-[22px] border border-[#ffd700]/30 pointer-events-none z-15" />
              {hasPlayableVideo && mediaMode === "video" ? (
                /* PRE-SHOOT CINEMATIC VIDEO MODE */
                <div className="relative w-full overflow-hidden bg-black">
                  {youtubeEmbedUrl ? (
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={youtubeEmbedUrl}
                        title={t.preshootTrailerTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : vimeoEmbedUrl ? (
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={vimeoEmbedUrl}
                        title={t.preshootTrailerTitle}
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    /* DIRECT MP4/WEBM VIDEO PLAYER */
                    <div ref={heroVideoContainerRef} className="relative h-80 sm:h-96 w-full overflow-hidden flex items-center justify-center">
                      <video
                        ref={heroVideoRef}
                        src={videoStreamUrl || undefined}
                        poster={videoPosterSrc || heroImageSrc}
                        autoPlay
                        loop
                        muted={isVideoMuted}
                        playsInline
                        preload="metadata"
                        onError={() => {
                          console.warn("Video playback error; switching to photo mode.");
                          setMediaMode("photo");
                        }}
                        onLoadedData={() => {
                          if (heroVideoRef.current && isVideoPlaying) {
                            playHeroVideoSafely();
                          }
                        }}
                        onCanPlay={() => {
                          if (heroVideoRef.current && isVideoPlaying && heroVideoRef.current.paused) {
                            playHeroVideoSafely();
                          }
                        }}
                        className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
                      />

                      {/* Ambient Scrim Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12080c] via-transparent to-[#12080c]/40 pointer-events-none" />

                      {/* Top Bar Badge & Controls */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#dfba73]/50 text-[#edd892] text-[10px] sm:text-xs font-cinzel font-semibold shadow-lg">
                          <Film className="w-3.5 h-3.5 text-[#ffd700]" />
                          <span>{t.preshootFilm}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Audio Mute/Unmute */}
                          <button
                            type="button"
                            onClick={handleToggleVideoAudio}
                            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-cinzel font-semibold flex items-center gap-1.5 shadow-lg transition cursor-pointer ${
                              isVideoMuted
                                ? "bg-black/60 text-[#dfba73] border-[#c5a059]/40 hover:bg-[#800020]"
                                : "bg-[#800020] text-[#fffdfa] border-[#ffd700] shadow-[0_0_15px_rgba(223,186,115,0.6)]"
                            }`}
                            title={isVideoMuted ? t.unmute : t.soundOn}
                          >
                            {isVideoMuted ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span className="text-[10px] hidden sm:inline">{t.unmute}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                                <span className="text-[10px] hidden sm:inline">{t.soundOn}</span>
                              </>
                            )}
                          </button>

                          {/* Fullscreen Cinema Theater */}
                          <button
                            type="button"
                            onClick={openCinemaTheater}
                            className="p-2 rounded-full bg-black/60 hover:bg-[#800020] text-[#edd892] backdrop-blur-md border border-[#c5a059]/40 transition shadow-lg cursor-pointer"
                            title={t.cinemaTheater}
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Center Play Button (for quick play/pause or theater opening) */}
                      <button
                        type="button"
                        onClick={openCinemaTheater}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 sm:p-5 rounded-full bg-[#800020]/85 hover:bg-[#6b0f24] text-[#fffdfa] border-2 border-[#ffd700] shadow-[0_0_35px_rgba(223,186,115,0.7)] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer z-10 group/btn"
                        title={t.watchLoveStory}
                      >
                        <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#ffd700] text-[#ffd700] ml-1 transition-transform group-hover/btn:scale-110" />
                        <span className="absolute -inset-2 rounded-full border border-[#ffd700]/50 animate-ping opacity-30 pointer-events-none" />
                      </button>

                      {/* Couple Names Calligraphy Overlaid at base of video */}
                      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-center text-[#fdfbf7] pointer-events-none z-10">
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#edd892] font-cinzel font-semibold mb-1 drop-shadow">
                          {t.preshootTrailerTitle}
                        </p>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#fff8ea] font-bold tracking-tight drop-shadow-lg">
                            {groomFirstName}
                          </h2>
                          <span className="font-alex text-3xl sm:text-4xl text-[#edd892] drop-shadow-lg">&</span>
                          <h2 className="font-serif italic text-3xl sm:text-4xl text-[#fff8ea] font-bold tracking-tight drop-shadow-lg">
                            {brideFirstName}
                          </h2>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* HIGH-RES COUPLE PHOTO MODE (Fallback) */
                <div className={`relative h-72 sm:h-96 w-full overflow-hidden ${
                  isTraditional && heroImageSrc.includes("couple-art.png")
                    ? "bg-gradient-to-b from-[#2a040e] via-[#1a0208] to-[#0c0104]"
                    : ""
                }`}>
                  <Image
                    src={heroImageSrc}
                    alt={settings.coupleNames}
                    fill
                    sizes="(max-width: 640px) 100vw, 550px"
                    className={`${
                      isTraditional && heroImageSrc.includes("couple-art.png")
                        ? "object-contain object-center p-3"
                        : "object-cover object-top"
                    } transition duration-700 group-hover:scale-105`}
                    priority
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#12080c] via-[#12080c]/30 to-transparent" />

                  {/* Traditional Corner Accents on Art Frame */}
                  {isTraditional && (
                    <>
                      <div className="absolute top-2 left-2 text-[#ffd700] text-sm select-none pointer-events-none opacity-80">⚜</div>
                      <div className="absolute top-2 right-2 text-[#ffd700] text-sm select-none pointer-events-none opacity-80">⚜</div>
                      <div className="absolute bottom-12 left-2 text-[#ffd700] text-sm select-none pointer-events-none opacity-80">⚜</div>
                      <div className="absolute bottom-12 right-2 text-[#ffd700] text-sm select-none pointer-events-none opacity-80">⚜</div>
                    </>
                  )}

                  {/* Lightbox Trigger Button */}
                  <button
                    type="button"
                    onClick={() => openLightbox(0)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-[#800020] text-[#edd892] backdrop-blur-md border border-[#c5a059]/40 transition shadow-lg cursor-pointer"
                    title={t.couplePortrait}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Couple Names Calligraphy Overlaid at base of photo */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-center text-[#fdfbf7]">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#edd892] font-cinzel font-semibold mb-1">
                      {isTraditional
                        ? "✦ මංගල යුවල • THE BRIDE & GROOM ✦"
                        : isBotanical
                        ? "✦ NATURAL HARMONY • THE BRIDE & GROOM ✦"
                        : isCathedral
                        ? "✦ SACRED MATRIMONY • THE BRIDE & GROOM ✦"
                        : isCelestial
                        ? "✦ WRITTEN IN THE STARS ✦"
                        : t.happyCouple}
                    </p>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                      <h2 className="font-serif italic text-3xl sm:text-4xl text-[#fff8ea] font-bold tracking-tight drop-shadow-md">
                        {groomFirstName}
                      </h2>
                      <span className="font-alex text-3xl sm:text-4xl text-[#edd892] drop-shadow">&</span>
                      <h2 className="font-serif italic text-3xl sm:text-4xl text-[#fff8ea] font-bold tracking-tight drop-shadow-md">
                        {brideFirstName}
                      </h2>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Host Intro & Personalized Guest Salutation Card with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={750}>
            <div className={`${themeCardStyles.decreeCard} relative text-center my-6 sm:my-8 px-5 py-7 sm:px-8 sm:py-9 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl`}>
              {/* Corner Filigree Mini-Ornaments on Guest Card */}
              {!isModern && (
                <>
                  <RoyalCornerFlourish position="top-left" size={44} />
                  <RoyalCornerFlourish position="top-right" size={44} />
                  <RoyalCornerFlourish position="bottom-left" size={44} />
                  <RoyalCornerFlourish position="bottom-right" size={44} />
                </>
              )}

              {/* Top ambient gold highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#dfba73]/70 to-transparent pointer-events-none" />

              {/* Host Intro Narrative */}
              {settings.hostIntro && (
                <p className={`text-xs sm:text-sm ${themeCardStyles.introColor} font-sans leading-relaxed max-w-md mx-auto mb-4 italic`}>
                  &ldquo;{settings.hostIntro}&rdquo;
                </p>
              )}

              {/* Regal Ribbon Badge */}
              <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full ${themeCardStyles.guestPill} text-[10px] sm:text-xs font-cinzel font-bold tracking-[0.25em] uppercase shadow-md mb-3`}>
                <Sparkles className="w-3 h-3 text-[#ffd700]" />
                <span>{t.honouredGuest}</span>
                <Sparkles className="w-3 h-3 text-[#ffd700]" />
              </div>

              {/* Personalized Guest Name in Grand Calligraphy */}
              <div className={`font-serif italic text-2xl sm:text-4xl ${themeCardStyles.titleColor} font-bold tracking-wide my-1 drop-shadow-xs`}>
                {formatInviteLine(guest)}
              </div>

              {/* Delicate Gold Flourish Underline */}
              <div className="flex items-center justify-center gap-2 my-3">
                <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-[#dfba73] to-transparent" />
                <span className="text-[#8c6a2b] text-xs select-none">❦</span>
                <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-[#dfba73] to-transparent" />
              </div>

              {/* Smart Guest Metadata Pills: Invitation Category & Table Reservation */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 pt-3 border-t border-[#bda06d]/20 text-xs">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 border border-[#bda06d]/30 text-[#661022] font-cinzel font-semibold shadow-2xs">
                  <Users className="w-3 h-3 text-[#8c6a2b]" />
                  <span>
                    {guest.inviteType === "FAMILY"
                      ? "Family Group Invitation"
                      : guest.inviteType === "COUPLE"
                      ? "Couple Invitation"
                      : "Personal VIP Invitation"}
                  </span>
                </span>

                {guest.tableNumber > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#661022]/10 border border-[#661022]/25 text-[#661022] font-cinzel font-bold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#661022]" />
                    <span>Table {guest.tableNumber} Reserved</span>
                  </span>
                )}
              </div>

              {/* Interactive Celebration Trigger */}
              <div className="mt-4 pt-1">
                <button
                  type="button"
                  onClick={() => triggerReaction("love")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#661022]/8 hover:bg-[#661022] text-[#661022] hover:text-[#ffd700] text-[11px] font-cinzel font-semibold border border-[#bda06d]/35 transition-all shadow-2xs cursor-pointer active:scale-95 group"
                >
                  <Heart className="w-3 h-3 fill-current text-[#661022] group-hover:text-[#ffd700] transition-colors" />
                  <span>Celebrate with Couple</span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* SWEET COUPLE WARM WELCOME VIGNETTE with Scroll Reveal */}
          <ScrollReveal variant="scale-up" duration={850}>
            <div className="relative my-6 sm:my-8 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#bda06d]/40 bg-[#1e171b] text-[#fdfbf7] p-5 sm:p-7 shadow-xl">
              {/* Corner Filigree Mini-Ornaments */}
              <RoyalCornerFlourish position="top-left" size={36} />
              <RoyalCornerFlourish position="bottom-right" size={36} />

              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6 relative z-10">
                {/* Sweet Couple Portrait Cameo with Royal Medallion Gold Rim */}
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#dfba73] via-[#ffd700] to-[#8c6a2b] shadow-[0_0_25px_rgba(223,186,115,0.4)] flex-shrink-0 group">
                  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#fff8ea]">
                    <Image
                      src={welcomeImageSrc}
                      alt={t.cantWaitToWelcome}
                      fill
                      sizes="144px"
                      loading="lazy"
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Sweet Welcome Narrative */}
                <div className="text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#661022]/60 text-[#dfba73] text-[10px] sm:text-xs font-cinzel font-medium mb-2 border border-[#bda06d]/30">
                    <Heart className="w-3 h-3 fill-[#dfba73] text-[#dfba73]" /> {t.withAllOurLove}
                  </div>
                  <h3 className="font-serif italic text-xl sm:text-2xl text-[#fdfbf7] font-normal">
                    {t.cantWaitToWelcome}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#edd892]/80 leading-relaxed mt-1.5">
                    {t.sweetWelcomeSub}
                  </p>

                  {/* Clean Reaction Buttons */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5">
                    <button
                      type="button"
                      onClick={() => triggerReaction("love")}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#661022] border border-[#bda06d]/30 text-[#edd892] text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                    >
                      <Heart className="w-3 h-3 text-[#dfba73]" /> {t.happyCouple}
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerReaction("cheers")}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#661022] border border-[#bda06d]/30 text-[#edd892] text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3 h-3 text-[#dfba73]" /> Cheers & Love
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerReaction("bless")}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#661022] border border-[#bda06d]/30 text-[#edd892] text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                    >
                      <Check className="w-3 h-3 text-[#dfba73]" /> Blessings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Invitation Body & Golden Date/Time Badge with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={800}>
            {/* Elegant Quotation Cartouche */}
            <div className="relative my-6 px-6 sm:px-10 py-4 text-center">
              <span className="absolute top-0 left-2 sm:left-4 text-3xl sm:text-4xl font-serif text-[#dfba73]/40 select-none pointer-events-none">
                “
              </span>
              <p className="text-center text-sm sm:text-base text-[#3d3238] font-sans leading-relaxed px-2 italic">
                {settings.invitationBody}
              </p>
              <span className="absolute bottom-0 right-2 sm:right-4 text-3xl sm:text-4xl font-serif text-[#dfba73]/40 select-none pointer-events-none">
                ”
              </span>
            </div>

            {/* Editorial Date & Time Lockup (The Royal Arch Calendar) */}
            <div className="my-8 relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#fdfbf7] via-[#faf5ec] to-[#f4ecd9] border border-[#dfba73]/50 p-6 sm:p-8 text-center shadow-md overflow-hidden">
              {/* Corner Filigree Mini-Ornaments */}
              <RoyalCornerFlourish position="top-left" size={38} />
              <RoyalCornerFlourish position="top-right" size={38} />
              <RoyalCornerFlourish position="bottom-left" size={38} />
              <RoyalCornerFlourish position="bottom-right" size={38} />

              {/* Top Arch Gold Highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent pointer-events-none" />

              {/* Weekday Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#661022]/8 border border-[#dfba73]/40 text-[#8c6a2b] mb-2 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#8c6a2b]" />
                <span className="text-[11px] font-cinzel font-bold uppercase tracking-[0.3em]">
                  {date.weekday}
                </span>
              </div>

              {/* Month */}
              <p className="font-serif italic text-xl sm:text-2xl text-[#661022] font-semibold mt-1">
                {date.month}
              </p>

              {/* Day with Ordinal */}
              <div className="flex items-center justify-center font-cinzel text-6xl sm:text-7xl text-[#1a1517] font-bold my-1 tracking-tight drop-shadow-xs">
                <span>{String(date.day).padStart(2, "0")}</span>
                <sup className="text-xl sm:text-2xl text-[#8c6a2b] font-serif italic ml-1">
                  {date.ordinal}
                </sup>
              </div>

              {/* Year */}
              <p className="font-cinzel text-lg sm:text-xl text-[#661022] font-bold tracking-[0.25em]">
                {date.year}
              </p>

              {/* Subtle Botanical Divider */}
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#dfba73] to-transparent mx-auto my-3" />

              {/* Time Details Pill */}
              <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl bg-white/90 border border-[#bda06d]/30 text-xs text-[#5a483e] font-sans font-medium shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#8c6a2b]" />
                <span>Ceremony & Reception from <strong className="text-[#661022] font-semibold">{date.time}</strong> onwards</span>
              </div>

              {/* Value-Giving Add to Calendar Button with Gold Shimmer */}
              <div className="mt-5 pt-3 border-t border-[#bda06d]/20 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadICS}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#661022] via-[#800020] to-[#661022] hover:opacity-95 text-[#fffdfa] text-xs font-cinzel font-bold border border-[#ffd700]/60 transition shadow-sm hover:shadow-md cursor-pointer active:scale-95 group"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{t.addToCalendarTitle}</span>
                  <Sparkles className="w-3 h-3 text-[#ffd700] opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* VIRTUAL LUXURY TABLE SEATING PLACE CARD with Scroll Reveal */}
          <ScrollReveal variant="scale-up" duration={850}>
            <div id="vip-pass" className="my-8 rounded-2xl sm:rounded-3xl border border-[#bda06d]/35 bg-[#fbf8f3] p-5 sm:p-7 shadow-lg relative overflow-hidden text-[#1a1517] scroll-mt-8 transition-all hover:shadow-xl hover:border-[#dfba73]">
              {/* Corner Filigree Mini-Ornaments */}
              <RoyalCornerFlourish position="top-left" size={32} />
              <RoyalCornerFlourish position="top-right" size={32} />

              {/* VIP Ticket Punch Side Notches */}
              <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-r-full bg-[#121013] border-r border-[#bda06d]/40 pointer-events-none" />
              <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-5 rounded-l-full bg-[#121013] border-l border-[#bda06d]/40 pointer-events-none" />

              {/* Top ambient gold highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#dfba73]/60 to-transparent pointer-events-none" />

              {/* Header Couple Cameo & Title */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-[#bda06d]/25">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#bda06d]/60 shadow-xs mb-2 bg-[#661022]/10 transition-transform hover:scale-105">
                  <Image
                    src={placeCardImageSrc}
                    alt={settings.coupleNames}
                    fill
                    sizes="64px"
                    loading="lazy"
                    className="object-cover object-top"
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#661022] font-cinzel font-bold">
                  {settings.coupleNames}
                </p>
                <span className="text-[9px] uppercase tracking-wider text-[#8c6a2b] font-cinzel">
                  {t.vipSeatingTitle}
                </span>
              </div>

              {/* Guest & Table Details */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#661022]/8 text-[#661022] text-xs font-cinzel font-semibold mb-1 border border-[#bda06d]/20">
                    <QrCode className="w-3.5 h-3.5 text-[#8c6a2b]" /> {t.vipCheckinPass}
                  </div>
                  <h3 className="font-serif italic text-2xl sm:text-3xl font-normal text-[#661022]">
                    {formatInviteLine(guest)}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-[#5a483e]">
                    <Users className="w-3.5 h-3.5 text-[#8c6a2b]" />
                    <span>{t.guestPlural}: <strong>{guest.inviteType === "COUPLE" ? "2 Persons (Couple)" : guest.inviteType === "FAMILY" ? "Family Group" : "1 Person"}</strong></span>
                  </div>
                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs text-[#5a483e] font-sans font-medium">{t.tablePrefix}:</span>
                    <div className="px-4 py-1.5 rounded-xl bg-[#661022] text-[#fdfbf7] font-cinzel font-bold text-sm sm:text-base shadow-sm border border-[#dfba73]/40">
                      {t.tableNumber(guest.tableNumber)}
                    </div>
                  </div>
                </div>

                {/* QR Code Scannable Reception Pass (Tap to Enlarge) */}
                {qrDataUrl && (
                  <button
                    type="button"
                    onClick={() => setIsQrPassModalOpen(true)}
                    className="group flex flex-col items-center bg-white p-2.5 rounded-xl border border-[#bda06d]/35 shadow-xs hover:shadow-md hover:border-[#dfba73] hover:scale-105 active:scale-95 transition-all cursor-pointer text-center touch-manipulation"
                    title="Tap to enlarge QR Pass"
                  >
                    <div className="relative">
                      <Image
                        src={qrDataUrl}
                        alt="Guest Reception QR Code"
                        width={100}
                        height={100}
                        loading="lazy"
                        className="w-20 h-20 sm:w-24 sm:h-24"
                      />
                      <div className="absolute inset-0 bg-[#661022]/0 group-hover:bg-[#661022]/10 rounded-lg flex items-center justify-center transition-colors">
                        <ZoomIn className="w-5 h-5 text-[#661022] opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                      </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#661022] font-cinzel font-semibold mt-1.5 text-center max-w-[110px] flex items-center justify-center gap-1 group-hover:text-[#800020]">
                      <ZoomIn className="w-3 h-3 text-[#8c6a2b]" /> {t.scanAtEntrance}
                    </span>
                  </button>
                )}
              </div>

              {/* Sweet Couple Note */}
              <div className="pt-3 border-t border-[#bda06d]/25 text-center">
                <p className="font-serif italic text-xs sm:text-sm text-[#661022] font-normal">
                  &ldquo;{placeCardNote}&rdquo;
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Live Countdown Section with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={750}>
            <div id="countdown" className="my-8 scroll-mt-8">
              <CountdownTimer targetDate={settings.eventDate} locale={locale} />
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Programme / Event Itinerary Timeline with Staggered Scroll Reveal */}
          <div id="timeline" className="my-10 scroll-mt-8">
            <ScrollReveal variant="fade-up" duration={750}>
              <div className="text-center mb-6">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold">
                  {t.programmeSubtitle}
                </span>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                  {t.programmeTitle}
                </h3>
              </div>
            </ScrollReveal>

            <div className="relative pl-5 sm:pl-7 space-y-3.5">
              {/* Continuous Vertical Golden Timeline Ribbon Line */}
              <div className="absolute left-2 sm:left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#bda06d]/20 via-[#dfba73] to-[#bda06d]/20 pointer-events-none" />

              {parsedTimeline.map((evt: { time?: string; title?: string; desc?: string; location?: string; mapUrl?: string }, idx: number) => (
                <ScrollReveal
                  key={idx}
                  variant="fade-up"
                  delay={idx * 80}
                  duration={650}
                >
                  <div className="relative group">
                    {/* Milestone Illuminated Node Pin */}
                    <div className="absolute -left-5 sm:-left-7 top-4 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#fffdfa] border-2 border-[#dfba73] shadow-xs flex items-center justify-center -translate-x-1/2 group-hover:scale-125 group-hover:border-[#800020] transition-all duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#800020] group-hover:bg-[#dfba73] transition-colors" />
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#fbf7ee] border border-[#c5a059]/30 hover:border-[#c5a059] shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                      <div className="min-w-[85px] px-2.5 py-1.5 rounded-xl bg-[#800020]/10 text-[#800020] font-cinzel text-xs font-bold text-center border border-[#800020]/20 shadow-xs group-hover:bg-[#800020] group-hover:text-[#ffd700] transition-colors">
                        {evt.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1a1517] group-hover:text-[#800020] transition-colors">
                            {evt.title}
                          </h4>
                          {evt.location && (
                            <span className="text-[10px] font-sans text-[#800020] bg-[#800020]/10 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold shrink-0">
                              <MapPin className="w-2.5 h-2.5" /> {evt.location}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#5a483e] font-sans mt-0.5 leading-relaxed">
                          {evt.desc}
                        </p>
                        {evt.mapUrl && (
                          <a
                            href={evt.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-[#800020] hover:text-[#dfba73] font-cinzel font-bold mt-1.5 transition"
                          >
                            <MapPin className="w-3 h-3" /> Get Venue Directions →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* DRESS CODE & STYLE PALETTE SECTION with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={800}>
            <div id="dress-code" className="my-10 p-6 rounded-3xl bg-gradient-to-b from-[#fffdfa] to-[#fbf6eb] border-2 border-[#c5a059]/40 shadow-xl text-center scroll-mt-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-cinzel font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" /> {t.dressCodeGuideTitle}
              </div>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                {settings.dressCodeTitle || t.dressCodeDefaultTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5a483e] max-w-md mx-auto mt-2 leading-relaxed">
                {settings.dressCodeDescription || t.dressCodeDefaultDesc}
              </p>

              {/* Color Palette Swatches with Staggered Visual Elegance */}
              <div className="mt-5 pt-4 border-t border-[#c5a059]/30">
                <span className="text-[10px] uppercase tracking-widest text-[#8c6a2b] font-cinzel font-semibold block mb-3">
                  {t.colorPaletteTitle}
                </span>
                <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  {(activeTemplate.palette && activeTemplate.palette.length > 0 ? activeTemplate.palette : t.paletteColors).map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1.5 transition-transform hover:scale-110"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <div
                        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full shadow-md flex items-center justify-center border-2 border-white/80"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[9px] font-cinzel text-[#5a483e] font-medium">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Moments of Love & Pre-Wedding Gallery Section with Scroll Reveal */}
          <ScrollReveal variant="scale-up" duration={850}>
            <div id="gallery" className="my-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#fffdfa] to-[#fbf6eb] border-2 border-[#c5a059]/50 shadow-xl scroll-mt-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-xs font-cinzel font-semibold mb-2">
                  <Camera className="w-3.5 h-3.5 text-[#c5a059]" /> {t.momentsOfLoveTitle}
                </div>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                  {t.momentsOfLoveTitle}
                </h3>
                <p className="font-serif italic text-xs sm:text-sm text-[#8c6a2b] mt-1">
                  &ldquo;{t.momentsOfLoveSubtitle}&rdquo;
                </p>
              </div>

              {/* Floating Sparkle Fountain Emitters */}
              {floatingHearts.map((h) => (
                <div
                  key={h.id}
                  className="absolute bottom-20 z-30 pointer-events-none animate-heart-float select-none text-center"
                  style={{
                    left: `${h.left}%`,
                    fontSize: `${h.size}px`,
                  }}
                >
                  ✨
                </div>
              ))}

              {/* 3D Interactive Featured Photo Carousel Card */}
              <div
                ref={galleryCardRef}
                onMouseMove={handleGalleryMouseMove}
                onMouseLeave={handleGalleryMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{
                  perspective: "1000px",
                }}
                className="relative rounded-2xl overflow-hidden border-2 border-[#c5a059]/70 shadow-2xl bg-[#140e11] group transition-transform duration-200 ease-out will-change-transform"
              >
                {/* Autoplay Golden Progress Bar Line */}
                {isSlideshowPlaying && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/20 z-30 overflow-hidden">
                    <div
                      key={`progress-${currentPhotoIndex}`}
                      className="h-full bg-gradient-to-r from-[#ffd700] via-[#dfba73] to-[#fff2cf]"
                      style={{
                        animation: "gold-progress 5s linear forwards",
                      }}
                    />
                  </div>
                )}

                {/* Ambient Bokeh & Twinkling Particles Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <div className="absolute top-6 left-12 w-6 h-6 rounded-full bg-[#ffd700]/30 blur-sm animate-bokeh" />
                  <div className="absolute bottom-14 right-10 w-9 h-9 rounded-full bg-[#dfba73]/25 blur-md animate-bokeh [animation-delay:2s]" />
                  <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-[#fff2cf]/40 blur-xs animate-bokeh [animation-delay:4s]" />
                </div>

                <div className="relative h-64 sm:h-84 w-full overflow-hidden flex items-center justify-center">
                  {/* Ken Burns Romantic Zooming Image Container */}
                  <div
                    key={`photo-${currentPhotoIndex}`}
                    className="relative w-full h-full animate-ken-burns"
                  >
                    <Image
                      src={getOptimizedImageUrl(parsedGallery[currentPhotoIndex]?.src || heroImageSrc, { width: 1080, quality: "auto:good" })}
                      alt={parsedGallery[currentPhotoIndex]?.title || settings.coupleNames}
                      fill
                      sizes="(max-width: 640px) 100vw, 550px"
                      className="object-cover object-center transition duration-500"
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none z-10" />

                  {/* Top Bar Badge & Controls */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#edd892] text-[10px] font-cinzel font-semibold shadow-lg">
                      <Sparkles className="w-3 h-3 text-[#ffd700] animate-spin-slow" />
                      <span>{t.photoCount(currentPhotoIndex + 1, parsedGallery.length)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Autoplay / Pause Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSlideshowPlaying((prev) => !prev);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md border text-xs font-cinzel font-semibold transition cursor-pointer shadow-md flex items-center gap-1 ${
                          isSlideshowPlaying
                            ? "bg-[#800020] text-[#ffd700] border-[#ffd700]"
                            : "bg-black/60 text-[#dfba73] border-[#c5a059]/40 hover:bg-[#800020]"
                        }`}
                        title={isSlideshowPlaying ? t.pauseSlideshow : t.playSlideshow}
                      >
                        {isSlideshowPlaying ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        <span className="text-[10px] hidden sm:inline">
                          {isSlideshowPlaying ? t.pauseSlideshow : t.playSlideshow}
                        </span>
                      </button>

                      {/* Lightbox Expand Button */}
                      <button
                        type="button"
                        onClick={() => openLightbox(currentPhotoIndex)}
                        className="p-2 rounded-full bg-black/60 hover:bg-[#800020] text-[#edd892] backdrop-blur-md border border-[#c5a059]/40 transition shadow-md cursor-pointer"
                        title="Expand to Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Carousel Left & Right Navigation Arrows */}
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-[#800020] text-white backdrop-blur-md border border-[#c5a059]/40 transition opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 hover:bg-[#800020] text-white backdrop-blur-md border border-[#c5a059]/40 transition opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Photo Caption Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white z-20">
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#800020]/80 text-[#edd892] text-[9px] font-cinzel uppercase tracking-wider mb-1">
                      {parsedGallery[currentPhotoIndex]?.tag || "Pre-Wedding"}
                    </div>
                    <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#fff8ea] drop-shadow-md">
                      {parsedGallery[currentPhotoIndex]?.title}
                    </h4>
                    <p className="text-xs text-[#dfba73] font-sans mt-0.5 drop-shadow">
                      {parsedGallery[currentPhotoIndex]?.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated Thumbnail Strip Selector */}
              <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                {parsedGallery.map((item: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentPhotoIndex(idx);
                      setIsSlideshowPlaying(false);
                    }}
                    className={`relative h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                      currentPhotoIndex === idx
                        ? "border-[#ffd700] ring-2 ring-[#ffd700] scale-105 shadow-[0_0_15px_rgba(223,186,115,0.6)] animate-glow-gold z-10"
                        : "border-[#c5a059]/40 opacity-70 hover:opacity-100 hover:scale-102"
                    }`}
                  >
                    <Image
                      src={getThumbnailUrl(item.src, 160)}
                      alt={item.title || `Photo ${idx + 1}`}
                      fill
                      sizes="100px"
                      loading="lazy"
                      className="object-cover"
                    />
                    {currentPhotoIndex === idx && (
                      <div className="absolute inset-0 bg-[#800020]/15 border-t border-[#ffd700]/60 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>

              {/* Interactive Love Reaction Bar */}
              <div className="mt-5 pt-4 border-t border-[#c5a059]/30 flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs text-[#5a483e] font-sans">
                  {t.loveReactions}:
                </span>
                <button
                  type="button"
                  onClick={handleSendLove}
                  className={`px-4 py-2 rounded-full text-xs font-cinzel font-bold flex items-center gap-2 transition cursor-pointer shadow-md active:scale-95 ${
                    hasLiked
                      ? "bg-[#800020] text-[#fdfbf7] scale-105 border border-[#c5a059] shadow-[0_0_15px_rgba(128,0,32,0.5)]"
                      : "bg-white text-[#800020] hover:bg-[#800020]/10 border border-[#c5a059]/50"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      hasLiked ? "fill-current text-[#edd892] animate-bounce" : "text-[#800020]"
                    }`}
                  />
                  <span>{hasLiked ? t.loved : t.sendLove}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-black/10 text-[10px]">
                    {loveCount}
                  </span>
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Venue & Location Suite with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={800}>
            <div id="venue" className="my-10 scroll-mt-8">
              <div className="text-center mb-4">
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#8c6a2b] font-cinzel font-semibold">
                  {t.venueSubtitle}
                </span>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                  {settings.venueName}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a483e] mt-1 max-w-sm mx-auto">
                  {settings.venueAddress}
                </p>
              </div>

              {/* Interactive Leaflet Venue Map */}
              <VenueMap
                lat={settings.venueLat}
                lng={settings.venueLng}
                venueName={settings.venueName}
              />

              {/* Quick Navigation Buttons (Including Ride Booking) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-shimmer py-2.5 px-3 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition min-h-[42px] touch-manipulation"
                >
                  <Compass className="w-3.5 h-3.5" /> {t.googleMaps}
                </a>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1a1517] text-[#fdfbf7] hover:bg-black py-2.5 px-3 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition min-h-[42px] touch-manipulation"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#dfba73]" /> {t.appleMaps}
                </a>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#2a1a20] text-[#edd892] hover:bg-[#800020] py-2.5 px-3 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition min-h-[42px] touch-manipulation"
                >
                  <MapPin className="w-3.5 h-3.5" /> {t.waze}
                </a>
                <a
                  href={uberUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="royal-uber-btn bg-black text-white hover:bg-neutral-900 py-2.5 px-3 rounded-xl text-center text-xs font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] transition border border-[#c5a059]/40 min-h-[42px] touch-manipulation"
                  title="Reserve Uber Ride"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-white font-semibold">{t.uberRide}</span>
                </a>
              </div>

              {/* Copy Address Button */}
              <button
                onClick={handleCopyAddress}
                className="mt-2.5 w-full py-2.5 px-4 rounded-xl bg-[#800020]/10 hover:bg-[#800020]/20 text-[#800020] text-xs font-cinzel font-semibold flex items-center justify-center gap-2 transition cursor-pointer border border-[#c5a059]/30 min-h-[42px] touch-manipulation"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> {t.addressCopied}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> {t.copyAddress}
                  </>
                )}
              </button>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Calendar Integration Hub with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={750}>
            <div className="my-8 p-5 rounded-2xl bg-[#fbf7ee] border border-[#c5a059]/40 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-[#800020]">
                <Calendar className="w-4 h-4" />
                <span className="font-cinzel text-xs uppercase tracking-widest font-semibold">
                  {t.addToCalendarTitle}
                </span>
              </div>
              <p className="text-xs text-[#5a483e] mb-4">
                {t.addToCalendarSub}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <a
                  href={googleCalendarWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  className="py-2.5 px-2.5 rounded-xl bg-[#800020] text-[#fdfbf7] hover:bg-[#5c0017] text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition min-h-[42px] touch-manipulation"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#edd892]" /> {t.googleCalendar}
                </a>
                <button
                  onClick={handleDownloadICS}
                  className="py-2.5 px-2.5 rounded-xl bg-[#1a1517] text-[#fdfbf7] hover:bg-black text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition cursor-pointer min-h-[42px] touch-manipulation"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#dfba73]" /> {t.appleCalendar}
                </button>
                <a
                  href={outlookCalendarWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  className="py-2.5 px-2.5 rounded-xl bg-[#0078d4] text-white hover:bg-[#005a9e] text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition min-h-[42px] touch-manipulation"
                >
                  <Calendar className="w-3.5 h-3.5" /> {t.outlookCalendar}
                </a>
                <a
                  href={yahooCalendarWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  suppressHydrationWarning
                  className="py-2.5 px-2.5 rounded-xl bg-[#5f01d1] text-white hover:bg-[#4900a3] text-[11px] font-cinzel font-semibold flex items-center justify-center gap-1.5 shadow transition min-h-[42px] touch-manipulation"
                >
                  <Calendar className="w-3.5 h-3.5" /> {t.yahooCalendar}
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Interactive Production RSVP Suite with Scroll Reveal */}
          <ScrollReveal variant="scale-up" duration={850}>
            <div id="rsvp" className="my-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#fffdfa] to-[#f7f2e7] border-2 border-[#c5a059]/60 shadow-2xl scroll-mt-8">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 text-[#800020] text-xs font-cinzel font-semibold mb-1">
                  <Sparkles className="w-4 h-4 text-[#c5a059]" /> {t.rsvpTitle}
                </div>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#6b0f24] font-bold">
                  {t.rsvpTitle}
                </h3>
                <p className="text-xs text-[#5a483e] mt-1">
                  {t.rsvpSubtitle}
                </p>
              </div>

              {rsvpSubmitted && !submittingRsvp ? (
                <div className="relative overflow-hidden text-center py-7 px-5 sm:px-8 bg-gradient-to-b from-[#fffcf7] via-[#fff9ef] to-[#f8f1e3] rounded-3xl border-2 border-[#dfba73]/70 shadow-xl shadow-[#800020]/10 space-y-4">
                  {/* Subtle top ambient gold shimmer */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-[#dfba73]/30 to-transparent blur-xl pointer-events-none" />

                  {/* Celebratory Couple Illustration with Floating Sway Animation */}
                  <div className="relative inline-flex flex-col items-center justify-center mx-auto my-2 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#dfba73]/30 via-[#ffd700]/15 to-transparent blur-2xl rounded-full scale-110 pointer-events-none animate-pulse" />
                    <div className="relative z-10 animate-couple-float transition-transform duration-500 hover:scale-105">
                      <Image
                        src="/images/coupleshare.png"
                        alt={settings.coupleNames || "Wedding Celebration"}
                        width={220}
                        height={200}
                        className="h-44 sm:h-52 w-auto max-w-[220px] object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(128,0,32,0.25)]"
                        loading="lazy"
                      />
                      <span className="absolute bottom-2 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg border-2 border-[#fffcf7] text-xs font-bold ring-2 ring-emerald-400/50">
                        ✓
                      </span>
                    </div>
                    <div className="w-32 sm:w-40 h-2 bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent blur-xs rounded-full -mt-1 pointer-events-none" />
                  </div>

                  {/* Title & Status Pill Badge */}
                  <div className="space-y-2">
                    <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#800020] tracking-wide">
                      {t.rsvpSuccessTitle}
                    </h4>

                    {/* Current recorded response status badge */}
                    <div>
                      {rsvpStatus === "attending" ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-cinzel font-bold text-emerald-900 bg-emerald-500/15 border border-emerald-600/40 shadow-sm animate-modal-in">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t.joyfullyAccept} • {rsvpCount} {rsvpCount === 1 ? t.guestSingle : t.guestPlural}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-cinzel font-bold text-stone-800 bg-stone-500/15 border border-stone-600/30 shadow-xs animate-modal-in">
                          <span>{t.regretfullyDecline}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirmation Message */}
                  <p className="text-xs sm:text-sm text-[#4a3b32] max-w-md mx-auto leading-relaxed">
                    {rsvpStatus === "attending"
                      ? `${t.rsvpSuccessAttending} (${rsvpCount} ${rsvpCount === 1 ? t.guestSingle : t.guestPlural}).`
                      : t.rsvpSuccessDeclined}
                  </p>

                  {/* Highlighted VIP Table Seating Card */}
                  {rsvpStatus === "attending" && guest.tableNumber && (
                    <div className="my-3 p-4 rounded-2xl bg-gradient-to-r from-[#800020]/10 via-[#dfba73]/15 to-[#800020]/10 border border-[#dfba73]/50 flex items-center justify-between gap-3 text-left shadow-xs">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-cinzel font-semibold text-[#8c6a2b]">
                          {t.vipSeatingTitle}
                        </p>
                        <h5 className="font-serif italic text-base sm:text-lg font-bold text-[#661022]">
                          {t.tableNumber(guest.tableNumber)}
                        </h5>
                        <p className="text-[11px] text-[#5a483e] font-sans">
                          {guest.inviteType === "COUPLE"
                            ? "Reserved for 2 Persons"
                            : guest.inviteType === "FAMILY"
                            ? "Reserved for Family Group"
                            : "Reserved for 1 Person"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => scrollToSection("vip-pass")}
                        className="px-3.5 py-2 rounded-xl bg-[#661022] hover:bg-[#800020] text-[#ffd700] text-xs font-cinzel font-bold border border-[#dfba73]/60 shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        View Pass ➔
                      </button>
                    </div>
                  )}

                  {/* Subtle Hairline Divider */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#bda06d]/30" />
                    <span className="text-[#bda06d]/50 text-[7px]">◇</span>
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#bda06d]/30" />
                  </div>

                  {/* "Update Your Response" Action Button */}
                  <div className="pt-2 pb-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => setRsvpSubmitted(false)}
                      className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#661022] hover:bg-[#4d0c19] text-[#fdfbf7] border border-[#bda06d]/40 shadow-md transition duration-200 cursor-pointer min-h-[46px] touch-manipulation font-cinzel font-semibold text-xs tracking-wider uppercase active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#dfba73] group-hover:-rotate-90 transition-transform duration-300 shrink-0" />
                      <span>{t.modifyRsvp}</span>
                    </button>

                    <p className="text-[11px] text-[#7a6458] font-serif italic max-w-sm mx-auto">
                      {t.modifyRsvpHelp}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-5">
                  {/* Attending / Decline Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus("attending")}
                      className={`py-3.5 px-3 rounded-xl font-cinzel text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px] touch-manipulation active:scale-95 ${
                        rsvpStatus === "attending"
                          ? "bg-[#661022] text-[#fdfbf7] border-[#661022] shadow-md scale-[1.02]"
                          : "bg-white text-[#1a1517] border-[#bda06d]/40 hover:bg-[#661022]/5"
                      }`}
                    >
                      {rsvpStatus === "attending" ? (
                        <Check className="w-3.5 h-3.5 text-[#dfba73] animate-checkmark-pop" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-[#661022]" />
                      )}
                      <span>{t.joyfullyAccept}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRsvpStatus("declined")}
                      className={`py-3.5 px-3 rounded-xl font-cinzel text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px] touch-manipulation active:scale-95 ${
                        rsvpStatus === "declined"
                          ? "bg-[#3d3238] text-[#fdfbf7] border-[#3d3238] shadow-md scale-[1.02]"
                          : "bg-white text-[#1a1517] border-[#bda06d]/40 hover:bg-[#661022]/5"
                      }`}
                    >
                      {rsvpStatus === "declined" ? (
                        <X className="w-3.5 h-3.5 text-[#edd892] animate-checkmark-pop" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-[#3d3238]" />
                      )}
                      <span>{t.regretfullyDecline}</span>
                    </button>
                  </div>

                  {/* Headcount & Dietary if attending */}
                  {rsvpStatus === "attending" && (
                    <div className="space-y-4 pt-1 animate-modal-in">
                      {/* Interactive Headcount Stepper */}
                      <div className="p-3.5 rounded-2xl bg-[#f8f4ed] border border-[#bda06d]/30">
                        <label className="block text-xs font-cinzel font-semibold text-[#1a1517] mb-2 text-center sm:text-left">
                          {t.numberOfGuests}
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setRsvpCount((c) => Math.max(1, c - 1))}
                            disabled={rsvpCount <= 1}
                            className="w-10 h-10 rounded-xl bg-white border border-[#bda06d]/40 text-[#661022] font-bold text-lg flex items-center justify-center hover:bg-[#661022]/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-xs active:scale-95 touch-manipulation"
                            title="Decrease guest count"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#bda06d]/40 text-center shadow-xs">
                            <span className="font-cinzel text-lg font-bold text-[#661022]">
                              {rsvpCount}
                            </span>{" "}
                            <span className="text-xs text-[#5a483e] font-sans font-medium">
                              {rsvpCount === 1 ? t.guestSingle : t.guestPlural}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRsvpCount((c) => Math.min(maxAttendees, c + 1))}
                            disabled={rsvpCount >= maxAttendees}
                            className="w-10 h-10 rounded-xl bg-white border border-[#bda06d]/40 text-[#661022] font-bold text-lg flex items-center justify-center hover:bg-[#661022]/10 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer shadow-xs active:scale-95 touch-manipulation"
                            title="Increase guest count"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick numbered buttons if multiple attendees allowed */}
                        {maxAttendees > 1 && (
                          <div className="flex items-center gap-1.5 mt-2.5">
                            {Array.from({ length: maxAttendees }, (_, i) => i + 1).map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setRsvpCount(n)}
                                className={`flex-1 py-1.5 rounded-lg text-[11px] font-cinzel font-bold transition-all cursor-pointer ${
                                  rsvpCount === n
                                    ? "bg-[#661022] text-[#fdfbf7] shadow-xs scale-102"
                                    : "bg-white/80 text-[#5a483e] border border-[#bda06d]/30 hover:bg-[#661022]/5"
                                }`}
                              >
                                {n} {n === 1 ? t.guestSingle : t.guestPlural}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Dietary Preference Interactive Selectable Chips */}
                      <div className="p-3.5 rounded-2xl bg-[#f8f4ed] border border-[#bda06d]/30">
                        <label className="block text-xs font-cinzel font-semibold text-[#1a1517] mb-2">
                          {t.dietaryTitle}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {t.dietaryOptions.map((opt) => {
                            const isSelected = dietary === opt.key;
                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => setDietary(opt.key)}
                                className={`px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 touch-manipulation active:scale-95 ${
                                  isSelected
                                    ? "bg-[#661022] text-[#fdfbf7] border border-[#661022] shadow-sm scale-102 font-semibold"
                                    : "bg-white text-[#5a483e] border border-[#bda06d]/40 hover:bg-[#661022]/5"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="w-3 h-3 text-[#dfba73] animate-checkmark-pop" />
                                )}
                                <span>{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Blessing Message with 1-Tap Quick Presets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="block text-xs font-cinzel font-semibold text-[#1a1517]">
                        {t.leaveBlessingPrompt}
                      </label>
                      <span className="text-[10px] text-[#8c6a2b] font-sans">
                        Quick tap to add:
                      </span>
                    </div>

                    {/* Quick Preset Blessing Chips */}
                    <div className="flex flex-wrap gap-1.5 pb-1">
                      {quickBlessingPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyBlessingPreset(preset)}
                          className="px-2.5 py-1 rounded-full bg-white text-[#661022] hover:bg-[#661022] hover:text-[#fdfbf7] border border-[#bda06d]/35 text-[11px] font-sans transition-all duration-200 cursor-pointer shadow-xs active:scale-95 touch-manipulation"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      placeholder={t.blessingPlaceholder}
                      value={rsvpWish}
                      onChange={(e) => setRsvpWish(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c5a059]/60 text-xs text-[#1a1517] focus:outline-none focus:ring-2 focus:ring-[#800020] resize-none shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!rsvpStatus || submittingRsvp}
                    className={`w-full py-3.5 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer min-h-[46px] touch-manipulation transition-all duration-200 ${
                      rsvpStatus ? "animate-pulse-subtle" : ""
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submittingRsvp ? t.submittingRsvp : t.submitRsvp}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* DIGITAL WISHES GUESTBOOK STREAM with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={800}>
            <div id="guestbook" className="my-8 sm:my-10 p-5 sm:p-7 rounded-2xl bg-[#fbf8f3] border border-[#bda06d]/30 shadow-md scroll-mt-8">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#661022]/8 text-[#661022] text-xs font-cinzel font-semibold mb-2 border border-[#bda06d]/20">
                  <Heart className="w-3 h-3 text-[#8c6a2b]" /> {t.guestbookTitle}
                </div>
                <h3 className="font-serif italic text-2xl sm:text-3xl text-[#661022] font-normal">
                  {t.guestbookTitle}
                </h3>
                <p className="text-xs text-[#5a483e] mt-1">
                  {t.guestbookSubtitle}
                </p>
              </div>

              {loadingWishes ? (
                <div className="text-center py-6 text-xs text-[#8c6a2b] font-cinzel">
                  Loading blessings...
                </div>
              ) : wishes.length === 0 ? (
                <div className="text-center py-6 px-4 rounded-xl bg-white/70 border border-[#bda06d]/25 text-xs text-[#5a483e] font-sans italic">
                  {t.noWishesYet}
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {wishes.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-white border border-[#c5a059]/40 shadow-sm flex items-start justify-between gap-3"
                    >
                      <div className="flex-1">
                        <h5 className="font-cinzel text-xs font-bold text-[#800020]">
                          {w.authorName}
                        </h5>
                        <p className="font-serif italic text-xs text-[#2a1d25] mt-1 leading-relaxed">
                          &ldquo;{w.message}&rdquo;
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleLikeWish(w.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-cinzel transition cursor-pointer ${
                          likedWishIds.has(w.id)
                            ? "bg-[#800020] text-white border border-[#c5a059]"
                            : "bg-[#fbf6eb] text-[#800020] hover:bg-[#800020]/10 border border-[#c5a059]/30"
                        }`}
                      >
                        <Heart
                          className={`w-3 h-3 ${
                            likedWishIds.has(w.id) ? "fill-current text-[#dfba73]" : "text-[#800020]"
                          }`}
                        />
                        <span>{w.likes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Floral Section Divider */}
          <FloralDivider />

          {/* Blessing Illustration & Couple Moment with Scroll Reveal */}
          <ScrollReveal variant="fade-up" duration={750}>
            <div className="my-8 text-center">
              <div className="relative max-w-xs mx-auto rounded-2xl overflow-hidden border border-[#c5a059]/40 shadow-lg mb-4 group cursor-pointer" onClick={() => openLightbox(1)}>
                <div className="relative h-48 w-full">
                  <Image
                    src={blessingImageSrc}
                    alt="Blessings from Couple"
                    fill
                    sizes="320px"
                    loading="lazy"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="text-[10px] font-cinzel text-[#edd892] uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#dfba73]" /> {t.withAllOurLove}
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-[#6b0f24] font-medium mt-3">
                &ldquo;{t.footerBlessing}&rdquo;
              </p>
            </div>

            {/* Royal Contact & Inquiries Section */}
            {(contactInfo.groomPhone || contactInfo.bridePhone || contactInfo.generalPhone) && (
              <div id="contact" className="my-10 pt-6 border-t border-[#c5a059]/30 scroll-mt-20">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/10 border border-[#c5a059]/40 text-[#800020] text-xs font-cinzel font-semibold mb-2 shadow-sm">
                    <Phone className="w-3 h-3 text-[#dfba73]" />
                    <span>{t.furtherInfoTitle}</span>
                  </div>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#2a1d25] tracking-wide">
                    {t.contactOrganizer}
                  </h4>
                  <p className="text-xs text-[#5a483e] font-sans mt-1 max-w-md mx-auto">
                    {t.furtherInfoSubtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
                  {/* Groom's Contact Card */}
                  {(contactInfo.groomPhone || contactInfo.generalPhone) && (
                    <div
                      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border shadow-sm hover:shadow-md ${
                        guestSide === "GROOM"
                          ? "bg-gradient-to-b from-[#f8f5ee] to-[#ece3d2] border-[#bda06d] ring-2 ring-[#c5a059]/40"
                          : "bg-[#fffdf9]/90 border-[#c5a059]/30"
                      }`}
                    >
                      {guestSide === "GROOM" && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#1e293b] text-[#dfba73] text-[9px] font-cinzel font-bold tracking-wider border border-[#dfba73]/40 shadow-sm">
                          {t.yourHostBadge}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🤵</span>
                        <div>
                          <div className="text-[10px] uppercase font-cinzel tracking-wider text-[#8c6a2b] font-semibold">
                            {t.groomContact}
                          </div>
                          <div className="font-serif italic font-bold text-sm text-[#1a1517]">
                            {groomFirstName}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-[#2a1d25] font-semibold py-1.5 px-2.5 rounded-lg bg-black/5 border border-black/10 mb-3 flex items-center justify-between">
                        <span>{contactInfo.groomPhone || contactInfo.generalPhone}</span>
                        <Phone className="w-3 h-3 text-[#c5a059]" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${cleanPhoneForUrl(contactInfo.groomPhone || contactInfo.generalPhone)}`}
                          className="py-2 px-2.5 rounded-xl bg-[#800020] hover:bg-[#6b0f24] text-[#ffd700] text-[11px] font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 touch-manipulation cursor-pointer"
                        >
                          <Phone className="w-3 h-3 text-[#ffd700]" />
                          <span>{t.callDirect}</span>
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(contactInfo.groomPhone || contactInfo.generalPhone)}?text=${encodeURIComponent(`Hi ${groomFirstName}, this is ${guest.displayName} regarding your wedding invitation!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 touch-manipulation cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Bride's Contact Card */}
                  {contactInfo.bridePhone && (
                    <div
                      className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border shadow-sm hover:shadow-md ${
                        guestSide === "BRIDE"
                          ? "bg-gradient-to-b from-[#f8f5ee] to-[#ece3d2] border-[#bda06d] ring-2 ring-[#c5a059]/40"
                          : "bg-[#fffdf9]/90 border-[#c5a059]/30"
                      }`}
                    >
                      {guestSide === "BRIDE" && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#800020] text-[#ffd700] text-[9px] font-cinzel font-bold tracking-wider border border-[#ffd700]/40 shadow-sm">
                          {t.yourHostBadge}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">👰</span>
                        <div>
                          <div className="text-[10px] uppercase font-cinzel tracking-wider text-[#8c6a2b] font-semibold">
                            {t.brideContact}
                          </div>
                          <div className="font-serif italic font-bold text-sm text-[#1a1517]">
                            {brideFirstName}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs text-[#2a1d25] font-semibold py-1.5 px-2.5 rounded-lg bg-black/5 border border-black/10 mb-3 flex items-center justify-between">
                        <span>{contactInfo.bridePhone}</span>
                        <Phone className="w-3 h-3 text-[#c5a059]" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`tel:${cleanPhoneForUrl(contactInfo.bridePhone)}`}
                          className="py-2 px-2.5 rounded-xl bg-[#800020] hover:bg-[#6b0f24] text-[#ffd700] text-[11px] font-cinzel font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 touch-manipulation cursor-pointer"
                        >
                          <Phone className="w-3 h-3 text-[#ffd700]" />
                          <span>{t.callDirect}</span>
                        </a>
                        <a
                          href={`https://wa.me/${cleanPhoneForWhatsApp(contactInfo.bridePhone)}?text=${encodeURIComponent(`Hi ${brideFirstName}, this is ${guest.displayName} regarding your wedding invitation!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-sans font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 touch-manipulation cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Share & Link Actions */}
            <div className="pt-6 border-t border-[#c5a059]/30 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleShareInvite}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#800020] text-[#ffd700] hover:bg-[#6b0f24] border border-[#dfba73]/60 text-xs font-cinzel font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition cursor-pointer min-h-[44px] touch-manipulation"
              >
                <Share2 className="w-3.5 h-3.5 text-[#ffd700]" /> Share Invitation
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer min-h-[44px] touch-manipulation"
              >
                <Share2 className="w-3.5 h-3.5" /> WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#1a1517] text-[#edd892] hover:bg-black text-xs font-sans font-semibold flex items-center justify-center gap-2 shadow transition cursor-pointer border border-[#c5a059]/40 min-h-[44px] touch-manipulation"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? "Link Copied!" : "Copy Invitation Link"}
              </button>
            </div>

            {/* Subtle Footer Divider */}
            <div className="flex items-center justify-center gap-3 mt-6 select-none pointer-events-none">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#bda06d]/30" />
              <span className="text-[#bda06d]/50 text-[7px]">◇</span>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#bda06d]/30" />
            </div>
          </ScrollReveal>

          {/* Footer Branding */}
          <div className="text-center pt-8 flex flex-col items-center justify-center gap-1.5">
            <div className="relative h-7 w-28 opacity-85 hover:opacity-100 transition">
              <Image
                src="/images/wedlink-logo.png"
                alt="WedLink.lk"
                fill
                sizes="112px"
                className="object-contain drop-shadow-xs"
              />
            </div>
            <p className="text-[10px] text-[#1a1517]/60 font-sans tracking-wider">
              Powered by WedLink.lk • Sri Lanka&apos;s Royal Wedding Platform
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Luxury Darkroom Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Top Bar: Counter & Close */}
          <div className="w-full max-w-5xl flex items-center justify-between text-[#edd892] z-10">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider">
                {t.photoCount(currentPhotoIndex + 1, parsedGallery.length)}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-[#dfba73] hidden sm:inline font-sans">
                {parsedGallery[currentPhotoIndex]?.tag || "Wedding"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#800020] text-white border border-[#c5a059]/40 transition cursor-pointer shadow-lg"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Center Container */}
          <div className="relative w-full max-w-4xl h-[60vh] sm:h-[72vh] flex items-center justify-center my-auto">
            <Image
              src={getLightboxImageUrl(parsedGallery[currentPhotoIndex]?.src || heroImageSrc)}
              alt={parsedGallery[currentPhotoIndex]?.title || settings.coupleNames}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-contain drop-shadow-2xl"
              priority
            />

            {/* Left Nav */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#800020] text-white border border-[#c5a059]/50 transition cursor-pointer shadow-xl backdrop-blur-md"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav */}
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#800020] text-white border border-[#c5a059]/50 transition cursor-pointer shadow-xl backdrop-blur-md"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Title & Subtitle */}
          <div className="w-full max-w-xl text-center z-10">
            <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#fff8ea]">
              {parsedGallery[currentPhotoIndex]?.title}
            </h4>
            <p className="text-xs sm:text-sm text-[#edd892] font-sans mt-1 italic">
              {parsedGallery[currentPhotoIndex]?.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* 4K Cinema Theater Modal */}
      {showCinemaModal && settings.heroVideoUrl && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in duration-300">
          {/* Top Bar: Title & Close */}
          <div className="w-full max-w-5xl flex items-center justify-between text-[#edd892] z-10">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-[#ffd700]" />
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-wider text-[#fffdfa]">
                {t.cinemaTheater}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-[#dfba73] font-cinzel">
                {settings.coupleNames}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCinemaTheater}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#800020] text-white border border-[#c5a059]/40 transition cursor-pointer shadow-lg"
              title="Close Theater (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Video Theater Center Container */}
          <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden border-2 border-[#dfba73] shadow-[0_0_50px_rgba(223,186,115,0.35)] my-auto bg-black flex items-center justify-center">
            {youtubeEmbedUrl ? (
              <iframe
                src={`${youtubeEmbedUrl}&autoplay=1`}
                title={t.preshootTrailerTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : vimeoEmbedUrl ? (
              <iframe
                src={`${vimeoEmbedUrl}?autoplay=1`}
                title={t.preshootTrailerTitle}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <video
                ref={modalVideoRef}
                src={videoStreamUrl}
                poster={videoPosterSrc || heroImageSrc}
                autoPlay
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Bottom Bar */}
          <div className="w-full max-w-xl text-center z-10">
            <h4 className="font-serif italic text-2xl sm:text-3xl text-[#fff8ea] font-bold">
              {settings.coupleNames}
            </h4>
            <p className="text-xs sm:text-sm text-[#edd892] font-cinzel font-semibold mt-1">
              {t.foreverBegins}
            </p>
          </div>
        </div>
      )}

      {/* Floating Quick Navigation Capsule */}
      {envelopeOpened && showFloatingNav && !isLightboxOpen && !showCinemaModal && !isQrPassModalOpen && (
        <aside aria-label="Quick invitation navigation" className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-3 animate-modal-in">
          <nav
            className="pointer-events-auto glass-dock px-2 sm:px-3 py-1.5 rounded-full flex items-center gap-1 sm:gap-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.85)] border border-[#dfba73]/40"
          >
            <button
              type="button"
              onClick={() => scrollToSection("vip-pass")}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-cinzel font-semibold text-[#edd892]/80 hover:text-[#ffd700] hover:bg-white/10 transition flex items-center gap-1 cursor-pointer touch-manipulation active:scale-95"
              title="VIP Table Pass"
            >
              <QrCode className="w-3.5 h-3.5 text-[#dfba73]" />
              <span className="hidden sm:inline">Pass</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("timeline")}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-cinzel font-semibold text-[#edd892]/80 hover:text-[#ffd700] hover:bg-white/10 transition flex items-center gap-1 cursor-pointer touch-manipulation active:scale-95"
              title="Event Schedule"
            >
              <Clock className="w-3.5 h-3.5 text-[#dfba73]" />
              <span className="hidden sm:inline">Schedule</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("venue")}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-cinzel font-semibold text-[#edd892]/80 hover:text-[#ffd700] hover:bg-white/10 transition flex items-center gap-1 cursor-pointer touch-manipulation active:scale-95"
              title="Venue & Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-[#dfba73]" />
              <span className="hidden sm:inline">Venue</span>
            </button>

            {/* Prominent RSVP CTA */}
            <button
              type="button"
              onClick={() => scrollToSection("rsvp")}
              className="px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold bg-gradient-to-r from-[#800020] to-[#6b0f24] text-[#ffd700] border border-[#ffd700]/80 shadow-[0_0_15px_rgba(223,186,115,0.45)] hover:scale-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer animate-pulse-subtle touch-manipulation"
              title="RSVP Attendance"
            >
              <Send className="w-3 h-3 text-[#ffd700]" />
              <span>RSVP</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("guestbook")}
              className="px-2.5 py-1.5 rounded-full text-[11px] font-cinzel font-semibold text-[#edd892]/80 hover:text-[#ffd700] hover:bg-white/10 transition flex items-center gap-1 cursor-pointer touch-manipulation active:scale-95"
              title="Guestbook Wishes"
            >
              <Heart className="w-3.5 h-3.5 text-[#dfba73]" />
              <span className="hidden sm:inline">Wishes</span>
            </button>

            {(contactInfo.groomPhone || contactInfo.bridePhone || contactInfo.generalPhone) && (
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="px-2.5 py-1.5 rounded-full text-[11px] font-cinzel font-semibold text-[#edd892]/80 hover:text-[#ffd700] hover:bg-white/10 transition flex items-center gap-1 cursor-pointer touch-manipulation active:scale-95"
                title="Contact Host"
              >
                <Phone className="w-3.5 h-3.5 text-[#dfba73]" />
                <span className="hidden sm:inline">Contact</span>
              </button>
            )}

            {/* Back to top */}
            <div className="w-px h-4 bg-white/20 mx-0.5" />
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-1.5 rounded-full text-[#edd892]/70 hover:text-[#ffd700] hover:bg-white/10 transition cursor-pointer touch-manipulation active:scale-95"
              title="Back to Top"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </nav>
        </aside>
      )}

      {/* Fullscreen High-Contrast VIP Reception Pass Modal */}
      {isQrPassModalOpen && qrDataUrl && (
        <div
          className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsQrPassModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#fffdfa] via-[#fcf8f0] to-[#f6efe1] p-6 text-[#1a1517] border-2 border-[#dfba73] shadow-2xl animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsQrPassModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-[#661022] hover:text-white transition text-[#1a1517] cursor-pointer"
              title="Close Pass"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#661022]/10 text-[#661022] text-xs font-cinzel font-bold border border-[#bda06d]/30">
                <QrCode className="w-3.5 h-3.5 text-[#8c6a2b]" />
                <span>{t.vipCheckinPass}</span>
              </div>

              <div>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#8c6a2b] font-cinzel font-semibold">
                  {settings.coupleNames}
                </p>
                <h3 className="font-serif italic text-2xl text-[#661022] font-bold mt-0.5">
                  {formatInviteLine(guest)}
                </h3>
              </div>

              {/* High Contrast Scannable QR Pass */}
              <div className="p-3 sm:p-4 bg-white rounded-2xl border-2 border-[#dfba73] shadow-inner inline-block mx-auto">
                <Image
                  src={qrDataUrl}
                  alt="VIP Reception QR Code"
                  width={240}
                  height={240}
                  className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                  priority
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-[#5a483e] font-sans font-medium">{t.tablePrefix}:</span>
                <span className="px-4 py-1.5 rounded-xl bg-[#661022] text-[#fdfbf7] font-cinzel font-bold text-base shadow-sm border border-[#dfba73]/40">
                  {t.tableNumber(guest.tableNumber)}
                </span>
              </div>

              <p className="text-[11px] text-[#8c6a2b] font-sans">
                {t.scanAtEntrance}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
