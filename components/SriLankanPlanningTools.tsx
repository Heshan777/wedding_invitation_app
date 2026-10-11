"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Utensils,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Copy,
  Download,
  Wine,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Check,
  AlertCircle,
  HelpCircle,
  ShoppingBag,
  Share2,
} from "lucide-react";

interface Guest {
  id: string;
  salutation: string;
  displayName: string;
  inviteType: "SINGLE" | "COUPLE" | "FAMILY";
  tableNumber: number;
  phone?: string | null;
  rsvpStatus: "PENDING" | "ATTENDING" | "DECLINED" | null;
  attendeeCount?: number | null;
  dietary?: string | null;
  notes?: string | null;
  viewedAt?: string | null;
}

interface ChecklistItem {
  id: string;
  title: string;
  titleSi: string;
  category: "NEKATH" | "PORUWA" | "ATTIRE" | "CEREMONY" | "RECEPTION" | "HOMECOMING";
  description: string;
  completed: boolean;
  priority: "HIGH" | "MEDIUM" | "OPTIONAL";
  notes?: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: "poruwa-1",
    title: "Auspicious Times Chart (Nekath Pathraya)",
    titleSi: "නැකත් පත්‍රය ලබා ගැනීම",
    category: "NEKATH",
    description: "Obtain astrological Nekath Pathraya specifying entry, ascending the poruwa, ring exchange, and going-away times.",
    completed: true,
    priority: "HIGH",
  },
  {
    id: "poruwa-2",
    title: "Ashtaka Reciter & Magul Bera Troupe",
    titleSi: "අෂ්ටක කියවන්නා සහ මඟුල් බෙර වාදකයින්",
    category: "CEREMONY",
    description: "Book qualified Ashtakacharya and traditional Kandyan/Low-country Magul Bera drummers for the arrival and ceremony.",
    completed: true,
    priority: "HIGH",
  },
  {
    id: "poruwa-3",
    title: "Traditional Poruwa Structure & Florals",
    titleSi: "මංගල පෝරුව සහ මල් සැරසිලි",
    category: "PORUWA",
    description: "Confirm dimensions, traditional motifs (Pun Kalas, Lotus, Sun/Moon), and white jasmine fresh floral mandapam.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-4",
    title: "Four Betel Leaf Sheaves (Bulath Hurulu 04)",
    titleSi: "බුලත් හුරුලු 04 (කොළ 20 බැගින්)",
    category: "PORUWA",
    description: "Prepare 4 bundles of 20 fresh betel leaves each for offering respect to both sets of parents.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-5",
    title: "White Linen Cloth / Piruwata",
    titleSi: "සුදු පිරුවටය / සුදු රෙදි",
    category: "PORUWA",
    description: "Arrange traditional clean white piruwata cloth to cover the floor of the poruwa from the traditional washerman.",
    completed: false,
    priority: "MEDIUM",
  },
  {
    id: "poruwa-6",
    title: "Traditional Brass Oil Lamp (Magul Pahana)",
    titleSi: "මඟුල් පිත්තල පහන සහ තෙල්",
    category: "CEREMONY",
    description: "Brass oil lamp with fresh coconut oil, cotton wicks, matches, and white jasmine flowers for couple & VIP lighting.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-7",
    title: "Pethi Maalaya & Wedding Rings",
    titleSi: "පැති මාලය සහ මංගල මුදු",
    category: "ATTIRE",
    description: "4-sovereign gold Pethi Maalaya necklace for the groom to tie on the bride, and customized wedding rings verified.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-8",
    title: "Pirith Nool & Holy Water Goblet (Kendiya)",
    titleSi: "පිරිත් නූල් සහ පැන් කෙණ්ඩිය",
    category: "CEREMONY",
    description: "Clean brass or silver Pan Kendiya filled with blessed water, Pirith nool thread to tie the couple's little fingers.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-9",
    title: "Jayamangala Gatha Choir Troupe",
    titleSi: "ජයමංගල ගාථා කණ්ඩායම",
    category: "CEREMONY",
    description: "Choir of 4-6 girls in traditional Lama Sari to chant blessings right after the ring and necklace exchange.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-10",
    title: "Auspicious Coconut Breaking (Pol Gediya)",
    titleSi: "පොල් ගෙඩිය බිඳීම",
    category: "CEREMONY",
    description: "Husked coconut and ceremonial billhook knife ready to be cleaved in two at the exact moment of stepping down.",
    completed: false,
    priority: "HIGH",
  },
  {
    id: "poruwa-11",
    title: "Traditional Milk Rice & Sweetmeats Table",
    titleSi: "කිරිබත්, කැවුම්, කොකිස් මංගල මේසය",
    category: "RECEPTION",
    description: "Ceremonial milk rice, Konda Kevum, Kokis, Athirasa, bananas, and first-meal feeding by the bride and groom.",
    completed: false,
    priority: "MEDIUM",
  },
  {
    id: "poruwa-12",
    title: "Homecoming (Second Day Reception) Planning",
    titleSi: "දෙවෙනි ගමන (හෝම්කමිං) සංවිධානය",
    category: "HOMECOMING",
    description: "Bride's red sari/lehenga change, groom's family welcoming ceremony, hotel banquet booking, and return gift cake boxes.",
    completed: false,
    priority: "MEDIUM",
  },
];

interface SriLankanPlanningToolsProps {
  guests: Guest[];
  rsvpStats: {
    totalInvited: number;
    attendingCount: number;
    totalHeadcount: number;
  };
  coupleNames: string;
  eventDate: string;
  venueName: string;
  activeEventId: string;
}

export default function SriLankanPlanningTools({
  guests,
  rsvpStats,
  coupleNames,
  eventDate,
  venueName,
  activeEventId,
}: SriLankanPlanningToolsProps) {
  const [plannerSubTab, setPlannerSubTab] = useState<"liquor" | "poruwa">("liquor");

  // ==========================================
  // 1. LIQUOR & BEVERAGE CALCULATOR STATE
  // ==========================================
  const [guestCount, setGuestCount] = useState<number>(rsvpStats.totalHeadcount || 150);
  const [drinkingPercent, setDrinkingPercent] = useState<number>(60); // 60% of guests drink alcohol in SL
  const [eventDurationHours, setEventDurationHours] = useState<number>(5); // 5 hours standard
  const [drinkingIntensity, setDrinkingIntensity] = useState<"light" | "moderate" | "party">("moderate");

  // Liquor preferences ratio
  const [arrackRatio, setArrackRatio] = useState<number>(35); // 35% Old Arrack
  const [whiskyRatio, setWhiskyRatio] = useState<number>(45); // 45% Scotch / Whiskey
  const [wineRatio, setWineRatio] = useState<number>(10); // 10% Wine
  const [beerRatio, setBeerRatio] = useState<number>(10); // 10% Beer

  // Synchronize initial headcount when rsvpStats updates
  useEffect(() => {
    if (rsvpStats.totalHeadcount > 0) {
      setGuestCount(rsvpStats.totalHeadcount);
    }
  }, [rsvpStats.totalHeadcount]);

  // Liquor calculations tailored for Sri Lankan Receptions
  const liquorEstimates = useMemo(() => {
    const drinkingGuests = Math.round((guestCount * drinkingPercent) / 100);
    const nonDrinkingGuests = guestCount - drinkingGuests;

    // Standard Sri Lankan consumption index per hour
    // Moderate = 1 drink (approx 30ml spirit or 1 glass beer/wine) per guest per hour
    const intensityMultiplier =
      drinkingIntensity === "light" ? 0.75 : drinkingIntensity === "party" ? 1.4 : 1.0;

    const totalAlcoholicDrinks = Math.round(
      drinkingGuests * eventDurationHours * intensityMultiplier
    );

    // Standard 750ml bottle has ~25 standard 30ml shots/servings
    const spiritShotsPerBottle = 25;
    // Wine bottle (750ml) has 5 glasses
    const wineGlassesPerBottle = 5;

    // Category drink allotments
    const whiskyDrinks = (totalAlcoholicDrinks * (whiskyRatio / 100));
    const arrackDrinks = (totalAlcoholicDrinks * (arrackRatio / 100));
    const wineDrinks = (totalAlcoholicDrinks * (wineRatio / 100));
    const beerDrinks = (totalAlcoholicDrinks * (beerRatio / 100));

    // Bottle counts
    const whiskyBottles = Math.ceil(whiskyDrinks / spiritShotsPerBottle);
    const arrackBottles = Math.ceil(arrackDrinks / spiritShotsPerBottle);
    const wineBottles = Math.ceil(wineDrinks / wineGlassesPerBottle);
    const beerCans = Math.ceil(beerDrinks); // 1 can per beer drink

    // Chasers & Soft Drinks
    // Each spirit drink usually requires 150ml of chaser (soda, tonic, ginger beer, cola)
    // Non-drinkers consume ~3 soft drinks over the function
    const softDrinksForSpiritsLiters = ((whiskyDrinks + arrackDrinks) * 0.15);
    const softDrinksForNonDrinkersLiters = (nonDrinkingGuests * 3 * 0.25);
    const totalSoftDrinksLiters = Math.ceil(softDrinksForSpiritsLiters + softDrinksForNonDrinkersLiters);

    // Chasers breakdown (Standard Sri Lankan proportions)
    const sodaLiters = Math.ceil(totalSoftDrinksLiters * 0.35);
    const gingerBeerLiters = Math.ceil(totalSoftDrinksLiters * 0.25); // Elephant House EGB
    const colaLiters = Math.ceil(totalSoftDrinksLiters * 0.25);
    const spriteLiters = Math.ceil(totalSoftDrinksLiters * 0.15);

    // Ice requirement: ~0.75kg ice per guest for drinks & banquet buckets
    const iceKg = Math.ceil(guestCount * 0.85);
    const iceBags5kg = Math.ceil(iceKg / 5);

    // Glassware needed
    const highballGlasses = Math.ceil(drinkingGuests * 1.5);
    const rockGlasses = Math.ceil(drinkingGuests * 1.2);
    const wineGlasses = Math.ceil((guestCount * 0.3) + 20);

    // Rough Sri Lankan Rupee budget estimation (Standard Wine Store Rates)
    // Whisky: ~Rs. 18,500 (Black Label / Chivas)
    // Old Arrack: ~Rs. 4,800 (Rockland / DCSL Double Distilled)
    // Wine: ~Rs. 6,500
    // Beer: ~Rs. 650 per can
    // Soft Drinks: ~Rs. 450 per 2L bottle
    const estimatedLkrBudget =
      whiskyBottles * 18500 +
      arrackBottles * 4800 +
      wineBottles * 6500 +
      beerCans * 650 +
      (totalSoftDrinksLiters / 2) * 450 +
      iceBags5kg * 400;

    return {
      drinkingGuests,
      nonDrinkingGuests,
      totalAlcoholicDrinks,
      whiskyBottles,
      arrackBottles,
      wineBottles,
      beerCans,
      totalSoftDrinksLiters,
      sodaLiters,
      gingerBeerLiters,
      colaLiters,
      spriteLiters,
      iceKg,
      iceBags5kg,
      highballGlasses,
      rockGlasses,
      wineGlasses,
      estimatedLkrBudget,
    };
  }, [
    guestCount,
    drinkingPercent,
    eventDurationHours,
    drinkingIntensity,
    arrackRatio,
    whiskyRatio,
    wineRatio,
    beerRatio,
  ]);

  // Copy shopping list to clipboard
  const [copiedList, setCopiedList] = useState(false);
  const handleCopyShoppingList = () => {
    const text = `🥂 WEDDING LIQUOR & BEVERAGE SHOPPING LIST 🥂
Couple: ${coupleNames}
Confirmed Guests: ${guestCount} (${liquorEstimates.drinkingGuests} Drinking Adults)
Venue: ${venueName}
Duration: ${eventDurationHours} Hours

🥃 SPIRITS & HARD LIQUOR:
• Scotch / Whiskey (Black Label / Chivas / Glenfiddich): ${liquorEstimates.whiskyBottles} Bottles (750ml)
• Ceylon Old Arrack (Rockland / DCSL Double Distilled): ${liquorEstimates.arrackBottles} Bottles (750ml)
• Wine (Red & White): ${liquorEstimates.wineBottles} Bottles (750ml)
• Beer (Lion Lager / Carlsberg): ${liquorEstimates.beerCans} Cans / Bottles

🥤 CHASERS & SOFT DRINKS:
• Soda (Club Soda / Lion Soda): ~${liquorEstimates.sodaLiters} Liters
• Elephant House Ginger Beer (EGB): ~${liquorEstimates.gingerBeerLiters} Liters
• Coca-Cola: ~${liquorEstimates.colaLiters} Liters
• Sprite / Lemonade: ~${liquorEstimates.spriteLiters} Liters

🧊 ICE & ESSENTIALS:
• Ice (5kg Packets): ${liquorEstimates.iceBags5kg} Bags (~${liquorEstimates.iceKg} kg)
• Recommended Highball Glasses: ${liquorEstimates.highballGlasses}
• Recommended Whiskey Rock Glasses: ${liquorEstimates.rockGlasses}

💰 Estimated Sri Lankan Retail Budget: LKR ${liquorEstimates.estimatedLkrBudget.toLocaleString()}

Generated by Wedding Platform Planning Suite 🇱🇰`;

    navigator.clipboard.writeText(text);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2500);
  };

  // ==========================================
  // 2. PORUWA CEREMONY & CHECKLIST STATE
  // ==========================================
  const storageKey = `poruwa_checklist_${activeEventId || "default"}`;
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST);
  const [checklistFilter, setChecklistFilter] = useState<string>("ALL");
  const [newCustomTask, setNewCustomTask] = useState<string>("");
  const [newCustomTaskSi, setNewCustomTaskSi] = useState<string>("");

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChecklist(parsed);
        }
      }
    } catch {}
  }, [storageKey]);

  // Persist to local storage
  const saveChecklist = (updated: ChecklistItem[]) => {
    setChecklist(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveChecklist(updated);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTask.trim()) return;

    const newTask: ChecklistItem = {
      id: `custom-${Date.now()}`,
      title: newCustomTask.trim(),
      titleSi: newCustomTaskSi.trim() || newCustomTask.trim(),
      category: "CEREMONY",
      description: "Custom checkpoint added by wedding planner.",
      completed: false,
      priority: "MEDIUM",
    };

    saveChecklist([...checklist, newTask]);
    setNewCustomTask("");
    setNewCustomTaskSi("");
  };

  const handleDeleteTask = (id: string) => {
    const updated = checklist.filter((item) => item.id !== id);
    saveChecklist(updated);
  };

  const completedCount = useMemo(
    () => checklist.filter((i) => i.completed).length,
    [checklist]
  );
  const progressPercent = useMemo(
    () => (checklist.length ? Math.round((completedCount / checklist.length) * 100) : 0),
    [completedCount, checklist.length]
  );

  const filteredChecklist = useMemo(() => {
    if (checklistFilter === "ALL") return checklist;
    if (checklistFilter === "COMPLETED") return checklist.filter((i) => i.completed);
    if (checklistFilter === "PENDING") return checklist.filter((i) => !i.completed);
    return checklist.filter((i) => i.category === checklistFilter);
  }, [checklist, checklistFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#21161d] via-[#1c1418] to-[#281a23] border border-[#c5a059]/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020]/30 text-[#dfba73] text-xs font-cinzel font-semibold mb-2 border border-[#dfba73]/30">
              <Sparkles className="w-3.5 h-3.5" /> Sri Lankan Wedding Suite
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#dfba73]">
              Cultural Wedding Toolkit & Planner
            </h2>
            <p className="text-xs text-[#fdfbf7]/70 font-sans mt-1 max-w-xl">
              Specialized Sri Lankan wedding calculations for banquet beverages & arrack, alongside revered Poruwa customs and auspicious Nekath checklists.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 bg-[#120d10] p-1.5 rounded-2xl border border-[#c5a059]/30">
            <button
              onClick={() => setPlannerSubTab("liquor")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-2 cursor-pointer ${
                plannerSubTab === "liquor"
                  ? "bg-[#800020] text-[#edd892] border border-[#dfba73]/60 shadow-md"
                  : "text-[#fdfbf7]/70 hover:text-[#dfba73]"
              }`}
            >
              <Wine className="w-4 h-4" />
              <span>Liquor Calculator</span>
            </button>
            <button
              onClick={() => setPlannerSubTab("poruwa")}
              className={`px-4 py-2 rounded-xl text-xs font-cinzel font-bold transition flex items-center gap-2 cursor-pointer ${
                plannerSubTab === "poruwa"
                  ? "bg-[#800020] text-[#edd892] border border-[#dfba73]/60 shadow-md"
                  : "text-[#fdfbf7]/70 hover:text-[#dfba73]"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Poruwa & Traditions</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1c1418] border border-[#dfba73]/40">
                {completedCount}/{checklist.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. LIQUOR & BEVERAGE CALCULATOR TAB CONTENT */}
      {/* ======================================================== */}
      {plannerSubTab === "liquor" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls Panel */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#1a1418] border border-[#c5a059]/30 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/20">
                <h3 className="font-cinzel text-base font-bold text-[#dfba73] flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#dfba73]" /> Banquet Parameters
                </h3>
                <span className="text-[11px] font-mono text-[#dfba73]/80 bg-[#281a23] px-2.5 py-1 rounded-lg border border-[#c5a059]/30">
                  LK Wine Store Index
                </span>
              </div>

              {/* Guest Headcount Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-cinzel font-semibold text-[#fdfbf7]/80">
                    Total Banquet Guests:
                  </label>
                  <span className="text-xs font-mono font-bold text-[#dfba73]">
                    {guestCount} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="5"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full accent-[#dfba73] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-[#fdfbf7]/50 mt-1">
                  <span>Intimate (50)</span>
                  <span>Grand Banquet (300)</span>
                  <span>Royal (500+)</span>
                </div>
              </div>

              {/* Percentage of Drinking Guests */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-cinzel font-semibold text-[#fdfbf7]/80">
                    Drinking Crowd Ratio:
                  </label>
                  <span className="text-xs font-mono font-bold text-[#dfba73]">
                    {drinkingPercent}% (~{liquorEstimates.drinkingGuests} adults)
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={drinkingPercent}
                  onChange={(e) => setDrinkingPercent(Number(e.target.value))}
                  className="w-full accent-[#dfba73] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-[#fdfbf7]/50 mt-1">
                  <span>Conservative (30%)</span>
                  <span>Sri Lankan Avg (60%)</span>
                  <span>High Energy (85%)</span>
                </div>
              </div>

              {/* Event Duration */}
              <div>
                <label className="text-xs font-cinzel font-semibold text-[#fdfbf7]/80 block mb-1.5">
                  Reception Duration:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6].map((hrs) => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setEventDurationHours(hrs)}
                      className={`py-2 rounded-xl text-xs font-cinzel font-bold border transition cursor-pointer ${
                        eventDurationHours === hrs
                          ? "bg-[#800020] text-[#edd892] border-[#dfba73]"
                          : "bg-[#231a20] text-[#fdfbf7]/70 border-[#c5a059]/20 hover:bg-[#c5a059]/10"
                      }`}
                    >
                      {hrs} Hours
                    </button>
                  ))}
                </div>
              </div>

              {/* Drinking Intensity */}
              <div>
                <label className="text-xs font-cinzel font-semibold text-[#fdfbf7]/80 block mb-1.5">
                  Celebration Mood:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "Mellow", desc: "0.75 drink/hr" },
                    { id: "moderate", label: "Standard", desc: "1.0 drink/hr" },
                    { id: "party", label: "Heavy Party", desc: "1.4 drink/hr" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDrinkingIntensity(lvl.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        drinkingIntensity === lvl.id
                          ? "bg-[#800020] text-[#edd892] border-[#dfba73] font-bold"
                          : "bg-[#231a20] text-[#fdfbf7]/70 border-[#c5a059]/20 hover:bg-[#c5a059]/10 font-normal"
                      }`}
                    >
                      <div className="text-xs font-cinzel">{lvl.label}</div>
                      <div className="text-[9px] opacity-70 font-sans">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Liquor Split Breakdown */}
              <div className="pt-2 border-t border-[#c5a059]/20 space-y-3">
                <label className="text-xs font-cinzel font-semibold text-[#fdfbf7]/80 block">
                  Liquor Preference Allotment (%):
                </label>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#fdfbf7]/70">🥃 Scotch / Whisky:</span>
                    <span className="font-mono text-[#dfba73] font-bold">{whiskyRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    value={whiskyRatio}
                    onChange={(e) => setWhiskyRatio(Number(e.target.value))}
                    className="w-full accent-[#dfba73]"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[#fdfbf7]/70">🥥 Ceylon Old Arrack:</span>
                    <span className="font-mono text-[#dfba73] font-bold">{arrackRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={arrackRatio}
                    onChange={(e) => setArrackRatio(Number(e.target.value))}
                    className="w-full accent-[#dfba73]"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[#fdfbf7]/70">🍷 Wine (Red/White):</span>
                    <span className="font-mono text-[#dfba73] font-bold">{wineRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={wineRatio}
                    onChange={(e) => setWineRatio(Number(e.target.value))}
                    className="w-full accent-[#dfba73]"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results Panel */}
            <div className="lg:col-span-7 space-y-5">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#1e161c] border border-[#c5a059]/40 text-center">
                  <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73]/80 block mb-1">
                    Whisky / Scotch
                  </span>
                  <div className="text-2xl font-cinzel font-bold text-[#dfba73]">
                    {liquorEstimates.whiskyBottles}
                  </div>
                  <span className="text-[10px] text-[#fdfbf7]/60 font-sans">Bottles (750ml)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1e161c] border border-[#c5a059]/40 text-center">
                  <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73]/80 block mb-1">
                    Ceylon Arrack
                  </span>
                  <div className="text-2xl font-cinzel font-bold text-[#dfba73]">
                    {liquorEstimates.arrackBottles}
                  </div>
                  <span className="text-[10px] text-[#fdfbf7]/60 font-sans">Bottles (750ml)</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1e161c] border border-[#c5a059]/40 text-center">
                  <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73]/80 block mb-1">
                    Wine Bottles
                  </span>
                  <div className="text-2xl font-cinzel font-bold text-[#dfba73]">
                    {liquorEstimates.wineBottles}
                  </div>
                  <span className="text-[10px] text-[#fdfbf7]/60 font-sans">Red & White</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1e161c] border border-[#c5a059]/40 text-center">
                  <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73]/80 block mb-1">
                    Beer Cans
                  </span>
                  <div className="text-2xl font-cinzel font-bold text-[#dfba73]">
                    {liquorEstimates.beerCans}
                  </div>
                  <span className="text-[10px] text-[#fdfbf7]/60 font-sans">Lion / Carlsberg</span>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-[#181216] border border-[#c5a059]/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c5a059]/20">
                  <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#dfba73] flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#dfba73]" /> Chasers & Banquet Bar Requirements
                  </h4>
                  <button
                    onClick={handleCopyShoppingList}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#800020] to-[#580016] text-[#dfba73] hover:text-[#fff] text-xs font-cinzel font-bold border border-[#dfba73]/40 flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    {copiedList ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedList ? "Copied List!" : "Copy Shopping List"}
                  </button>
                </div>

                {/* Chasers & Mixers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#231a20] border border-[#c5a059]/20 flex items-center justify-between">
                    <div>
                      <div className="font-cinzel font-bold text-[#fdfbf7]">Soda (Club / Lion)</div>
                      <div className="text-[10px] text-[#fdfbf7]/60">For Arrack & Whisky drinkers</div>
                    </div>
                    <span className="font-mono text-base font-bold text-[#dfba73]">
                      ~{liquorEstimates.sodaLiters} Liters
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#231a20] border border-[#c5a059]/20 flex items-center justify-between">
                    <div>
                      <div className="font-cinzel font-bold text-[#fdfbf7]">Elephant House EGB</div>
                      <div className="text-[10px] text-[#fdfbf7]/60">Ginger beer with Ceylon Arrack</div>
                    </div>
                    <span className="font-mono text-base font-bold text-[#dfba73]">
                      ~{liquorEstimates.gingerBeerLiters} Liters
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#231a20] border border-[#c5a059]/20 flex items-center justify-between">
                    <div>
                      <div className="font-cinzel font-bold text-[#fdfbf7]">Coca-Cola / Coke</div>
                      <div className="text-[10px] text-[#fdfbf7]/60">Classic mixers & soft drinks</div>
                    </div>
                    <span className="font-mono text-base font-bold text-[#dfba73]">
                      ~{liquorEstimates.colaLiters} Liters
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#231a20] border border-[#c5a059]/20 flex items-center justify-between">
                    <div>
                      <div className="font-cinzel font-bold text-[#fdfbf7]">Sprite / Lemonade</div>
                      <div className="text-[10px] text-[#fdfbf7]/60">Chasers & non-alcoholic guests</div>
                    </div>
                    <span className="font-mono text-base font-bold text-[#dfba73]">
                      ~{liquorEstimates.spriteLiters} Liters
                    </span>
                  </div>
                </div>

                {/* Ice & Glassware Row */}
                <div className="p-4 rounded-2xl bg-[#120d10] border border-[#c5a059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#dfba73]/10 text-[#dfba73] flex items-center justify-center font-bold text-lg border border-[#dfba73]/30">
                      🧊
                    </div>
                    <div>
                      <h5 className="font-cinzel text-xs font-bold text-[#fdfbf7]">
                        Ice Packets Required
                      </h5>
                      <p className="text-[11px] text-[#fdfbf7]/60 font-sans">
                        ~{liquorEstimates.iceKg} kg total for bar service & bucket chilling
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-cinzel font-bold text-[#dfba73]">
                      {liquorEstimates.iceBags5kg} Packets
                    </span>
                    <span className="text-[10px] text-[#fdfbf7]/50 block font-sans">(5kg bags)</span>
                  </div>
                </div>

                {/* Estimated Budget Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2a1723] to-[#1c1219] border border-[#dfba73]/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-cinzel font-semibold text-[#dfba73] block">
                      Estimated Retail Beverage Budget:
                    </span>
                    <div className="text-xl sm:text-2xl font-cinzel font-bold text-[#fff]">
                      LKR {liquorEstimates.estimatedLkrBudget.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#fdfbf7]/60 font-sans">
                      *Based on standard Sri Lankan wine store prices (excludes hotel corkage fees).
                    </span>
                  </div>
                  <button
                    onClick={handleCopyShoppingList}
                    className="btn-gold-shimmer px-4 py-2 rounded-xl text-xs font-cinzel font-bold shadow-lg cursor-pointer"
                  >
                    Share with Best Man
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PORUWA CEREMONY & TRADITIONS CHECKLIST TAB CONTENT */}
      {/* ======================================================== */}
      {plannerSubTab === "poruwa" && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1418] border border-[#c5a059]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg font-bold text-[#dfba73]">
                  Sri Lankan Traditional Poruwa Milestones
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-cinzel font-bold bg-[#800020] text-[#edd892] border border-[#dfba73]/40">
                  {completedCount} of {checklist.length} Completed
                </span>
              </div>
              <p className="text-xs text-[#fdfbf7]/70 font-sans">
                Authentic cultural rituals verified with Kandyan & Southern wedding customs.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "ALL", label: "All" },
                { id: "PENDING", label: "Pending" },
                { id: "COMPLETED", label: "Completed" },
                { id: "NEKATH", label: "නැකත්" },
                { id: "PORUWA", label: "පෝරුව" },
                { id: "CEREMONY", label: "චාරිත්‍ර" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setChecklistFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-cinzel font-semibold transition cursor-pointer border ${
                    checklistFilter === f.id
                      ? "bg-[#800020] text-[#edd892] border-[#dfba73] shadow-md"
                      : "bg-[#231a20] text-[#fdfbf7]/70 border-[#c5a059]/20 hover:bg-[#c5a059]/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#120d10] h-2.5 rounded-full overflow-hidden border border-[#c5a059]/30">
            <div
              className="bg-gradient-to-r from-[#dfba73] to-[#c5a059] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                  item.completed
                    ? "bg-[#181a17] border-emerald-800/40 opacity-80"
                    : "bg-[#1c1418] border-[#c5a059]/30 hover:border-[#dfba73] shadow-md"
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition ${
                    item.completed
                      ? "bg-emerald-600 text-white"
                      : "border border-[#dfba73]/60 bg-[#261c22] text-transparent hover:border-[#dfba73]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`font-cinzel text-xs sm:text-sm font-bold ${
                        item.completed
                          ? "line-through text-[#fdfbf7]/50"
                          : "text-[#fdfbf7]"
                      }`}
                    >
                      {item.title}
                    </h4>
                    {item.priority === "HIGH" && !item.completed && (
                      <span className="text-[9px] font-cinzel font-bold text-rose-300 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded-md shrink-0">
                        Essential
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#dfba73] font-sans font-medium mt-0.5">
                    {item.titleSi}
                  </p>

                  <p className="text-[11px] text-[#fdfbf7]/60 font-sans mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {item.id.startsWith("custom-") && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(item.id);
                    }}
                    className="text-[#fdfbf7]/40 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Task Form */}
          <form
            onSubmit={handleAddCustomTask}
            className="p-4 rounded-2xl bg-[#161014] border border-[#c5a059]/30 flex flex-col sm:flex-row items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Add custom ritual / wedding task in English..."
              value={newCustomTask}
              onChange={(e) => setNewCustomTask(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73] font-sans"
            />
            <input
              type="text"
              placeholder="සිංහල නම (විකල්ප)..."
              value={newCustomTaskSi}
              onChange={(e) => setNewCustomTaskSi(e.target.value)}
              className="w-full sm:w-56 px-3.5 py-2.5 rounded-xl bg-[#231a20] border border-[#c5a059]/40 text-xs text-[#fdfbf7] placeholder-[#fdfbf7]/40 focus:outline-none focus:border-[#dfba73] font-sans"
            />
            <button
              type="submit"
              disabled={!newCustomTask.trim()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl btn-gold-shimmer text-xs font-cinzel font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
