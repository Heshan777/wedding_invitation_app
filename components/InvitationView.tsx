"use client";

import Image from "next/image";
import CountdownTimer from "./CountdownTimer";
import VenueMap from "./VenueMap";
import FallingDecor from "./FallingDecor";
import MusicPlayer from "./MusicPlayer";
import { formatEventDate } from "@/lib/date";
import { generateICS } from "@/lib/calendar";

type Guest = {
  displayName: string;
  salutation: string;
  inviteType: "SINGLE" | "COUPLE" | "FAMILY";
  tableNumber: number;
};

type Settings = {
  coupleNames: string;
  hostIntro: string;
  invitationBody: string;
  eventDate: Date;
  venueName: string;
  venueAddress: string;
  venueLat: number;
  venueLng: number;
  heroImageUrl: string | null;
  musicUrl: string | null;
};

function formatInviteLine(guest: Guest) {
  if (guest.inviteType === "FAMILY") {
    return `${guest.salutation} ${guest.displayName} and Family`;
  }
  return `${guest.salutation} ${guest.displayName}`;
}

export default function InvitationView({ guest, settings }: { guest: Guest; settings: Settings }) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.venueLat},${settings.venueLng}`;
  const date = formatEventDate(settings.eventDate);

  function handleAddToCalendar() {
    generateICS({
      title: `${settings.coupleNames} — Homecoming`,
      description: `Homecoming ceremony for ${settings.coupleNames}`,
      location: `${settings.venueName}, ${settings.venueAddress}`,
      startDate: settings.eventDate,
    });
  }

  return (
    <div className="relative min-h-screen bg-[#FFF8F0] text-[#1A181C] overflow-hidden">
      <FallingDecor />
      <MusicPlayer src={settings.musicUrl || "/audio/background.mp3"} />

      <div className="relative z-10 max-w-md mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="font-serif italic text-5xl text-center text-[#1A181C] mb-6">Invitation</h1>
        <p className="text-center text-base leading-relaxed mb-8">
          Join us as we celebrate the wonderful union of
        </p>

        {/* Couple names with hero illustration */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-2xl mb-8">
          <div className="relative h-[420px] sm:h-[520px]">
            <Image
            src="/images/couple-hero.png"
            alt=""
            width={500}
            height={600}
            className="absolute inset-0 w-full h-full object-contain opacity-25 -z-10"
          />
          <Image
            src="/images/groom-small.png"
            alt=""
            width={90}
            height={140}
            className="absolute -left-2 top-6"
          />
          <Image
            src="/images/bride-small.png"
            alt=""
            width={90}
            height={140}
            className="absolute -right-2 top-24"
          />

          <div className="text-center py-8">
            <div className="w-32 h-px bg-[#1A181C]/40 mx-auto mb-4" />
            <h2 className="font-serif italic text-5xl text-[#800020] leading-tight">
              {settings.coupleNames.split("&")[0]}
              <br />
              <span className="text-3xl">&</span>
              <br />
              {settings.coupleNames.split("&")[1]}
            </h2>
            <div className="w-32 h-px bg-[#1A181C]/40 mx-auto mt-4" />
          </div>
          </div>
        </div>

        <p className="text-center text-base leading-relaxed mb-6">{settings.hostIntro}</p>

        {/* Guest name pill */}
        <div className="bg-[#800020] text-[#FFF8F0] font-semibold rounded-full py-3 px-6 text-center mb-6 text-lg">
          {formatInviteLine(guest)}
        </div>

        <p className="text-center text-base leading-relaxed mb-10">{settings.invitationBody}</p>

        {/* Date */}
        <div className="text-center mb-2">
          <div className="w-24 h-px bg-[#800020] mx-auto mb-3" />
          <p className="font-serif text-2xl text-[#800020] leading-tight">
            {date.weekday}
            <br />
            {date.month}
          </p>
          <p className="font-serif text-6xl text-[#1A181C] my-1">
            {String(date.day).padStart(2, "0")}
            <sup className="text-2xl">{date.ordinal}</sup>
          </p>
          <p className="font-serif text-xl text-[#800020]">{date.year}</p>
          <div className="w-24 h-px bg-[#800020] mx-auto mt-3" />
        </div>

        <p className="text-center text-sm my-4">from {date.time} onwards</p>

        {/* Table number */}
        <p className="text-center text-sm mb-8">
          Your reserved table no:{" "}
          <span className="inline-block bg-[#800020] text-[#FFF8F0] font-semibold rounded-full px-3 py-1 ml-1">
            {String(guest.tableNumber).padStart(2, "0")}
          </span>
        </p>

        {/* Countdown */}
        <div className="mb-8">
          <CountdownTimer targetDate={settings.eventDate} />
        </div>

        <p className="text-center text-sm mb-2">at</p>

        {/* Venue */}
        <h3 className="font-serif text-2xl text-[#800020] text-center mb-1">{settings.venueName}</h3>
        <p className="text-sm text-center text-[#1A181C]/70 mb-4">{settings.venueAddress}</p>

        <VenueMap lat={settings.venueLat} lng={settings.venueLng} venueName={settings.venueName} />

        
          <a href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block text-center bg-[#1A181C] hover:bg-black transition text-[#FFF8F0] py-3 rounded-full font-medium"
        >
          Get directions via Google Maps
        </a>

        <button
          onClick={handleAddToCalendar}
          className="mt-3 w-full text-center bg-[#1A181C] hover:bg-black transition text-[#FFF8F0] py-3 rounded-full font-medium"
        >
          Add this event to calendar
        </button>

        <p className="text-center text-base leading-relaxed mt-10 mb-10">
          Your presence and blessings are sincerely appreciated.
        </p>

        <Image
          src="/images/couple-kneeling.png"
          alt=""
          width={280}
          height={320}
          className="mx-auto mb-16"
        />

        <p className="text-center text-xs text-[#1A181C]/50">Developed By: Pramuka Navodh</p>
      </div>
    </div>
  );
}