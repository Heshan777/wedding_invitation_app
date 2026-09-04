"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

export default function VenueMap({
  lat,
  lng,
  venueName,
}: {
  lat: number;
  lng: number;
  venueName: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isDisposed = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (isDisposed || !mapRef.current) return;

      // If a map instance already exists, remove it cleanly first
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // If the DOM node has leftover _leaflet_id from previous init, delete it
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }

      // Fix default marker icon paths for Next.js bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
      }).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom popup HTML
      const popupContent = `
        <div style="font-family: var(--font-cinzel), serif; text-align: center; padding: 4px;">
          <h4 style="color: #800020; font-weight: 700; font-size: 14px; margin: 0 0 4px 0;">${venueName}</h4>
          <span style="font-size: 11px; color: #555;">Reception & Homecoming Venue</span>
        </div>
      `;

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

      if (!isDisposed) {
        mapInstance.current = map;
        setMapLoaded(true);
      } else {
        map.remove();
      }
    })();

    return () => {
      isDisposed = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      if (mapRef.current && (mapRef.current as any)._leaflet_id) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [lat, lng, venueName]);


  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#c5a059]/50 shadow-xl group">
      {/* Loading Skeleton */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-[#2a1a1f]/30 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
          <MapPin className="w-6 h-6 text-[#dfba73] animate-bounce" />
          <span className="text-xs font-cinzel text-[#dfba73]">Locating Venue...</span>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-64 sm:h-80 z-0 bg-[#fbf8f2]" />

      {/* Floating Badge */}
      <div className="absolute top-3 right-3 z-[400] bg-[#181114]/90 border border-[#c5a059]/50 text-[#dfba73] px-3 py-1.5 rounded-full text-xs font-cinzel flex items-center gap-1.5 backdrop-blur-md shadow-md">
        <Navigation className="w-3 h-3 text-[#edd892]" />
        <span>Interactive Map</span>
      </div>
    </div>
  );
}