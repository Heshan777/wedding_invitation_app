"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

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

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    (async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icon paths for bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!).setView([lat, lng], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([lat, lng]).addTo(map).bindPopup(venueName).openPopup();

      mapInstance.current = map;
    })();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [lat, lng, venueName]);

  return (
    <div
      ref={mapRef}
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-[#D4AF37]/40"
    />
  );
}