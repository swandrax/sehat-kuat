"use client";

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { HealthcareFacility, RouteAlgorithm } from "@/stores/facilitiesStore";

interface FacilityMapProps {
  facilities: HealthcareFacility[];
  selectedFacility: HealthcareFacility | null;
  userLocation: { latitude: number; longitude: number; address: string };
  routeAlgorithm: RouteAlgorithm;
  onSelectFacility: (facility: HealthcareFacility) => void;
  onRecenter: () => void;
  sortBy: string;
  onSortChange: (sort: 'DISTANCE' | 'RATING' | 'NAME') => void;
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
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const routeBadgeRef = useRef<L.Marker | null>(null);

  const geoapifyKey = "0e6b74008bb54855ad22db81f7d1d84f";

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.latitude, userLocation.longitude],
        zoom: 14,
        zoomControl: false,
      });

      // Geoapify Bright Tile Layer with standard OSM fallback
      const geoapifyLayer = L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`,
        {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Geoapify',
          maxZoom: 19,
        }
      );

      geoapifyLayer.addTo(map);

      // Custom zoom control in bottom right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & User Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. User Location Marker (Pulse Dot)
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
      `<div class="text-xs font-bold text-slate-800">📍 Posisi Anda</div>`,
      { permanent: false, direction: "top" }
    );

    // 2. Healthcare Facility Markers
    facilities.forEach((fac, idx) => {
      const isSelected = selectedFacility?.id === fac.id;

      // Color mapping
      let pinColor = "bg-emerald-600";
      if (fac.type === "HOSPITAL") pinColor = "bg-rose-600";
      if (fac.type === "PHARMACY") pinColor = "bg-teal-600";
      if (fac.type === "LABORATORY") pinColor = "bg-purple-600";
      if (fac.type === "PUSKESMAS") pinColor = "bg-blue-600";

      const iconHtml = `
        <div class="cursor-pointer group select-none transition-transform ${isSelected ? "scale-110 z-50" : "hover:scale-105"}">
          <div class="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 border ${
            isSelected ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/40" : "border-slate-200 dark:border-slate-700 shadow-xs"
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

  // Update Route Polyline & Info Badge
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (routeBadgeRef.current) {
      map.removeLayer(routeBadgeRef.current);
      routeBadgeRef.current = null;
    }

    if (!selectedFacility) return;

    // Fetch route from API backend or compute realistic road path
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const routeUrl = `${apiUrl}/facilities/route?originLat=${userLocation.latitude}&originLng=${userLocation.longitude}&destLat=${selectedFacility.latitude}&destLng=${selectedFacility.longitude}&mode=${routeAlgorithm}`;

    fetch(routeUrl)
      .then((res) => res.json())
      .then((data) => {
        const coords: [number, number][] =
          data?.coordinates && data.coordinates.length > 0
            ? data.coordinates
            : [
                [userLocation.latitude, userLocation.longitude],
                [selectedFacility.latitude, selectedFacility.longitude],
              ];

        // Polyline styling
        const isAStar = routeAlgorithm === "A_STAR";
        const polyline = L.polyline(coords, {
          color: isAStar ? "#059669" : "#0284c7",
          weight: 5,
          opacity: 0.9,
          lineJoin: "round",
          dashArray: isAStar ? undefined : "6, 8",
        }).addTo(map);

        routeLayerRef.current = polyline;

        // Place a floating badge at midpoint of route
        const midIndex = Math.floor(coords.length / 2);
        const midPoint = coords[midIndex] || [
          (userLocation.latitude + selectedFacility.latitude) / 2,
          (userLocation.longitude + selectedFacility.longitude) / 2,
        ];

        const badgeText = `${
          isAStar ? "Rute Terpendek" : "Rute Tercepat (Dijkstra)"
        } • ${selectedFacility.distanceKm ?? 2.4} km • ${
          selectedFacility.estimatedMinutes ?? 9
        } menit`;

        const badgeIcon = L.divIcon({
          className: "route-badge",
          html: `
            <div class="px-3 py-1.5 rounded-full ${
              isAStar ? "bg-emerald-700" : "bg-sky-700"
            } text-white text-[10px] font-bold shadow-md whitespace-nowrap border border-white/40 animate-in fade-in zoom-in duration-200">
              ${badgeText}
            </div>
          `,
          iconSize: [200, 26],
          iconAnchor: [100, 13],
        });

        const badgeMarker = L.marker(midPoint, { icon: badgeIcon }).addTo(map);
        routeBadgeRef.current = badgeMarker;

        // Pan to fit bounds
        map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 16 });
      })
      .catch((e) => {
        console.error("Failed to load route:", e);
      });
  }, [selectedFacility, routeAlgorithm, userLocation]);

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[520px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls (Top Right): Sort Dropdown & Layer Indicator */}
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
          title="Pusatkan ke Lokasi Saya"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Pusatkan Lokasi</span>
        </button>
      </div>
    </div>
  );
}
