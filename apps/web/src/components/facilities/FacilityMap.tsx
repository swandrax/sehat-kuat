"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { HealthcareFacility, RouteAlgorithm } from "@/stores/facilitiesStore";

// Fix default leaflet icons in Next.js SSR/Webpack bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface FacilityMapProps {
  facilities: HealthcareFacility[];
  selectedFacility: HealthcareFacility | null;
  userLocation: { latitude: number; longitude: number; address: string };
  routeAlgorithm: RouteAlgorithm;
  onSelectFacility: (facility: HealthcareFacility) => void;
  onRecenter: () => void;
  sortBy: string;
  onSortChange: (sort: "DISTANCE" | "RATING" | "NAME") => void;
}

export default function FacilityMap({
  facilities,
  selectedFacility,
  userLocation,
  routeAlgorithm,
  onSelectFacility,
  onRecenter,
  sortBy,
  onSortChange,
}: FacilityMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const trafficPolylinesRef = useRef<L.Polyline[]>([]);
  const routeBadgeRef = useRef<L.Marker | null>(null);

  const [trafficSummary, setTrafficSummary] = useState<{
    smoothKm: number;
    moderateKm: number;
    congestedKm: number;
  } | null>(null);

  // 1. Initialize Leaflet Map with OpenStreetMap tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 14,
        zoomControl: false,
      });

      // Standard OSM Tile Layer (High reliability & immediate loading)
      const osmTileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
        }
      );
      osmTileLayer.addTo(map);

      // Custom zoom control in bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Invalidate size once container is rendered
      setTimeout(() => {
        map.invalidateSize();
      }, 200);

      const resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // 2. React to GPS location changes (Pan & FlyTo location)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation?.latitude || !userLocation?.longitude) return;

    map.flyTo([userLocation.latitude, userLocation.longitude], 14, {
      duration: 1.0,
      easeLinearity: 0.25,
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [userLocation.latitude, userLocation.longitude]);

  // 3. Update Markers & User Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // User Location Pulse Dot Marker
    const userIcon = L.divIcon({
      className: "custom-user-marker",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(markersLayerRef.current);

    userMarker.bindTooltip(
      `<div class="text-xs font-bold text-slate-800">📍 Posisi Perangkat Anda</div>`,
      { permanent: false, direction: "top" }
    );

    // Healthcare Facility Markers
    facilities.forEach((fac, idx) => {
      const isSelected = selectedFacility?.id === fac.id;

      let pinColor = "bg-emerald-600";
      if (fac.type === "HOSPITAL") pinColor = "bg-rose-600";
      if (fac.type === "PHARMACY") pinColor = "bg-teal-600";
      if (fac.type === "LABORATORY") pinColor = "bg-purple-600";
      if (fac.type === "PUSKESMAS") pinColor = "bg-blue-600";

      const iconHtml = `
        <div class="cursor-pointer group select-none transition-transform ${
          isSelected ? "scale-110 z-50" : "hover:scale-105"
        }">
          <div class="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 border ${
            isSelected
              ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/40"
              : "border-slate-200 dark:border-slate-700 shadow-xs"
          } rounded-xl text-[10px] font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
            <div class="w-4 h-4 rounded-md ${pinColor} text-white flex items-center justify-center text-[9px] font-black">
              ${idx + 1}
            </div>
            <span class="max-w-[110px] truncate">${fac.name}</span>
            <span class="text-amber-500 text-[9px]">★ ${fac.rating}</span>
          </div>
          <div class="w-2.5 h-2.5 bg-white dark:bg-slate-900 border-r border-b ${
            isSelected ? "border-emerald-600" : "border-slate-200 dark:border-slate-700"
          } rotate-45 mx-auto -mt-1 shadow-xs"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: `facility-pin-${fac.id}`,
        html: iconHtml,
        iconSize: [160, 32],
        iconAnchor: [80, 32],
      });

      const marker = L.marker([fac.latitude, fac.longitude], {
        icon: customIcon,
      }).addTo(markersLayerRef.current!);

      marker.on("click", () => {
        onSelectFacility(fac);
      });
    });
  }, [facilities, selectedFacility, userLocation]);

  // 4. Update Multi-Color Traffic Polyline:
  // - Biru (#2563eb): Lancar
  // - Kuning (#eab308): Ramai Lancar
  // - Merah (#ef4444): Macet / Padat
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing traffic polylines
    trafficPolylinesRef.current.forEach((poly) => map.removeLayer(poly));
    trafficPolylinesRef.current = [];

    if (routeBadgeRef.current) {
      map.removeLayer(routeBadgeRef.current);
      routeBadgeRef.current = null;
    }

    if (!selectedFacility) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const routeUrl = `${apiUrl}/facilities/route?originLat=${userLocation.latitude}&originLng=${userLocation.longitude}&destLat=${selectedFacility.latitude}&destLng=${selectedFacility.longitude}&mode=${routeAlgorithm}`;

    fetch(routeUrl)
      .then((res) => res.json())
      .then((data) => {
        const trafficSegments: Array<{
          coordinates: [number, number][];
          traffic: "SMOOTH" | "MODERATE" | "CONGESTED";
          color: string;
          label: string;
        }> = data?.trafficSegments || [];

        const allCoords: [number, number][] =
          data?.coordinates && data.coordinates.length > 0
            ? data.coordinates
            : [
                [userLocation.latitude, userLocation.longitude],
                [selectedFacility.latitude, selectedFacility.longitude],
              ];

        setTrafficSummary(data?.trafficSummary || null);

        // Render multi-color segments if available
        if (trafficSegments.length > 0) {
          trafficSegments.forEach((seg) => {
            const poly = L.polyline(seg.coordinates, {
              color: seg.color, // Blue, Yellow, or Red
              weight: 6,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }).addTo(map);

            poly.bindTooltip(
              `<div class="text-[10px] font-bold">Lalu Lintas: ${seg.label}</div>`,
              { sticky: true }
            );

            trafficPolylinesRef.current.push(poly);
          });
        } else {
          // Fallback single line
          const fallbackPoly = L.polyline(allCoords, {
            color: "#2563eb",
            weight: 6,
            opacity: 0.9,
          }).addTo(map);
          trafficPolylinesRef.current.push(fallbackPoly);
        }

        // Add Midpoint Badge with distance & travel time
        const midIndex = Math.floor(allCoords.length / 2);
        const midPoint = allCoords[midIndex] || [
          (userLocation.latitude + selectedFacility.latitude) / 2,
          (userLocation.longitude + selectedFacility.longitude) / 2,
        ];

        const isShortest = routeAlgorithm === "A_STAR";
        const badgeText = `${
          isShortest ? "Rute Terpendek" : "Rute Tercepat"
        } • ${selectedFacility.distanceKm ?? 2.4} km • ${
          selectedFacility.estimatedMinutes ?? 9
        } menit`;

        const badgeIcon = L.divIcon({
          className: "route-badge",
          html: `
            <div class="px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-md whitespace-nowrap border border-white/30 flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>${badgeText}</span>
            </div>
          `,
          iconSize: [220, 28],
          iconAnchor: [110, 14],
        });

        const badgeMarker = L.marker(midPoint, { icon: badgeIcon }).addTo(map);
        routeBadgeRef.current = badgeMarker;

        // Auto zoom & pan bounds
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
      })
      .catch((e) => {
        console.error("Failed to load route:", e);
      });
  }, [selectedFacility, routeAlgorithm, userLocation]);

  return (
    <div className="relative w-full h-[420px] lg:h-[540px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-100 dark:bg-slate-800">
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Sort Dropdown (Top Right) */}
      <div className="absolute top-4 right-4 z-400 flex items-center gap-2">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm flex items-center gap-1.5 text-xs">
          <span className="text-[10px] font-semibold text-slate-500 pl-1">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-transparent font-bold text-slate-800 dark:text-slate-100 text-xs focus:outline-hidden cursor-pointer"
          >
            <option value="DISTANCE">Terdekat</option>
            <option value="RATING">Rating Tertinggi</option>
            <option value="NAME">Nama A-Z</option>
          </select>
        </div>
      </div>

      {/* Floating Recenter GPS Button (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-400 flex items-center gap-2">
        <button
          onClick={onRecenter}
          className="p-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md transition flex items-center gap-2 text-xs font-bold active:scale-95"
          title="Pusatkan ke Posisi Saya"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Pusatkan Lokasi</span>
        </button>
      </div>

      {/* Live Traffic Legend Badge (Bottom Right) */}
      <div className="absolute bottom-4 right-14 z-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-2.5 text-[10px] font-bold">
        <span className="text-slate-400 text-[9px] hidden sm:inline">Kondisi Jalan:</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span className="text-slate-700 dark:text-slate-200">Lancar</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-slate-700 dark:text-slate-200">Ramai Lancar</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
          <span className="text-slate-700 dark:text-slate-200">Macet</span>
        </div>
      </div>
    </div>
  );
}
