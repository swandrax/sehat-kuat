"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  MapPin,
  Navigation,
  SlidersHorizontal,
  Info,
  Check,
  Star,
  Clock,
  Phone,
  ShieldCheck,
  Crosshair,
  Building2,
  Building,
  HeartPulse,
  Pill,
  FlaskConical,
  Users,
  ShieldAlert,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Route as RouteIcon,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  useFacilitiesStore,
  FacilityType,
  RouteAlgorithm,
  HealthcareFacility,
} from "@/stores/facilitiesStore";
import { FacilityDetailsModal } from "@/components/facilities/FacilityDetailsModal";
import { toast } from "sonner";

// Dynamically import Leaflet Map to prevent SSR window issues
const FacilityMap = dynamic(
  () => import("@/components/facilities/FacilityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] lg:min-h-[520px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center text-slate-400 text-xs font-bold">
        Memuat Peta Fasilitas Kesehatan Zavora Life...
      </div>
    ),
  }
);

export default function FacilitiesPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    maxDistance,
    setMaxDistance,
    selectedServices,
    toggleService,
    openStatus,
    setOpenStatus,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
    routeAlgorithm,
    setRouteAlgorithm,
    selectedFacilityId,
    setSelectedFacilityId,
    facilityDetailsModal,
    setFacilityDetailsModal,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    activeTab,
    setActiveTab,
    userLocation,
    setUserLocation,
    resetFilters,
  } = useFacilitiesStore();

  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  // TanStack Query: Fetch facilities from NestJS API
  const { data: facilitiesData, isLoading, refetch } = useQuery({
    queryKey: [
      "facilities",
      selectedType,
      maxDistance,
      minRating,
      openStatus,
      selectedServices,
      searchQuery,
      sortBy,
      userLocation,
    ],
    queryFn: async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const params = new URLSearchParams();

      if (selectedType && selectedType !== "ALL") params.set("type", selectedType);
      if (maxDistance) params.set("maxDistance", maxDistance.toString());
      if (minRating > 0) params.set("minRating", minRating.toString());
      if (openStatus !== "ALL") params.set("openStatus", openStatus);
      if (selectedServices.length > 0) params.set("services", selectedServices.join(","));
      if (searchQuery) params.set("search", searchQuery);
      if (sortBy) params.set("sortBy", sortBy);
      params.set("latitude", userLocation.latitude.toString());
      params.set("longitude", userLocation.longitude.toString());

      const res = await fetch(`${apiUrl}/facilities?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch facilities");
      return res.json();
    },
  });

  const facilities: HealthcareFacility[] = facilitiesData?.data || [];
  const selectedFacility =
    facilities.find((f) => f.id === selectedFacilityId) || facilities[0] || null;

  // Fast & Precise Device Location Resolver (High accuracy GPS -> Network Triangulation -> Reverse Geocoding)
  const handleUseCurrentLocation = () => {
    toast.loading("Mendeteksi lokasi perangkat presisi...", { id: "gps-fetch" });

    const resolveAddressAndSet = async (lat: number, lng: number, source: string) => {
      let resolvedAddress = `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
          { headers: { "Accept-Language": "id" }, signal: AbortSignal.timeout(3500) }
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.address) {
            const addr = data.address;
            const street = addr.road || addr.suburb || addr.neighbourhood || addr.village || "";
            const city = addr.city || addr.town || addr.city_district || addr.county || "Wilayah Anda";
            const state = addr.state || "";
            resolvedAddress = [street, city, state].filter(Boolean).slice(0, 3).join(", ");
          } else if (data?.display_name) {
            resolvedAddress = data.display_name.split(", ").slice(0, 3).join(", ");
          }
        }
      } catch {
        // Graceful fallback to coordinate label
      }

      setUserLocation({
        latitude: lat,
        longitude: lng,
        address: resolvedAddress,
      });

      toast.success(`Lokasi terdeteksi: ${resolvedAddress}`, { id: "gps-fetch" });
    };

    // Fallback using IP geolocation if hardware GPS is unavailable or blocked on localhost
    const fallbackToIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            const cityName = `${data.city || "Kota Anda"}, ${data.region || data.country_name || ""}`;
            setUserLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              address: cityName,
            });
            toast.success(`Lokasi terdeteksi (Jaringan): ${cityName}`, { id: "gps-fetch" });
            return;
          }
        }
      } catch {}
      toast.error("Tidak dapat mendeteksi lokasi otomatis. Silakan izinkan sensor lokasi browser.", { id: "gps-fetch" });
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolveAddressAndSet(pos.coords.latitude, pos.coords.longitude, "GPS");
        },
        (err) => {
          // If high accuracy times out on desktop localhost, retry with low-accuracy or IP
          navigator.geolocation.getCurrentPosition(
            (pos2) => {
              resolveAddressAndSet(pos2.coords.latitude, pos2.coords.longitude, "Triangulation");
            },
            () => {
              fallbackToIP();
            },
            { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
      );
    } else {
      fallbackToIP();
    }
  };

  // Auto detect device location on initial page load if still default
  useEffect(() => {
    if ("geolocation" in navigator && userLocation.address.includes("Kalibabang")) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleUseCurrentLocation();
        },
        () => {},
        { timeout: 3000, maximumAge: 60000 }
      );
    }
  }, []);

  // Facility Types Grid Configuration
  const facilityTypes: {
    type: FacilityType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "ALL", label: "Semua", icon: <Building className="w-4 h-4" /> },
    { type: "CLINIC", label: "Klinik", icon: <Building2 className="w-4 h-4" /> },
    { type: "HOSPITAL", label: "Rumah Sakit", icon: <HeartPulse className="w-4 h-4" /> },
    { type: "PHARMACY", label: "Apotek", icon: <Pill className="w-4 h-4" /> },
    { type: "LABORATORY", label: "Laboratorium", icon: <FlaskConical className="w-4 h-4" /> },
    { type: "PUSKESMAS", label: "Puskesmas", icon: <Users className="w-4 h-4" /> },
    { type: "EMERGENCY", label: "IGD 24 Jam", icon: <ShieldAlert className="w-4 h-4" /> },
    { type: "OTHER", label: "Faskes Lain", icon: <Sparkles className="w-4 h-4" /> },
  ];

  const availableServices = [
    "BPJS",
    "Asuransi Swasta",
    "Telemedicine",
    "IGD 24 Jam",
    "Parkir",
    "Farmasi",
    "Laboratorium",
    "Rawat Inap",
  ];

  return (
    <div className="space-y-5 select-none">
      {/* 1. Page Header & Algorithm Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
              ZAVORA-LIFE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Temukan Fasilitas Kesehatan Terdekat
          </h1>
        </div>

        {/* Navigation Mode Toggle (Clean and patient-friendly) */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto shadow-2xs">
          <button
            onClick={() => setRouteAlgorithm("A_STAR")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              routeAlgorithm === "A_STAR"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>Rute Terpendek</span>
          </button>
          <button
            onClick={() => setRouteAlgorithm("DIJKSTRA")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              routeAlgorithm === "DIJKSTRA"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Rute Tercepat</span>
          </button>
        </div>
      </div>

      {/* 2. Main Layout: Left Sidebar (Filters) + Right Map & Facility Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Mobile Filter Toggle Button (Visible on mobile/tablet) */}
        <div className="lg:hidden col-span-1 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filter & Preferensi Faskes</span>
          </button>
          <button
            onClick={handleUseCurrentLocation}
            className="py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold flex items-center gap-1.5"
          >
            <Crosshair className="w-4 h-4" />
            <span>Lokasi Saya</span>
          </button>
        </div>

        {/* Desktop Left Sidebar / Filter Panel */}
        <aside
          className={`col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-5 ${
            isFilterDrawerOpen
              ? "fixed inset-y-0 left-0 z-50 w-full sm:w-96 rounded-none p-6 overflow-y-auto"
              : "hidden lg:block"
          }`}
        >
          {/* Mobile Drawer Close Header */}
          {isFilterDrawerOpen && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 lg:hidden">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Filter Fasilitas Kesehatan
              </h2>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Filter / Preferensi Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab("filter")}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "filter"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
            </button>
            <button
              onClick={() => setActiveTab("preferensi")}
              className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === "preferensi"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                  : "text-slate-500"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Preferensi
            </button>
          </div>

          {/* Jenis Fasilitas Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Jenis Fasilitas
            </label>
            <div className="grid grid-cols-4 gap-2">
              {facilityTypes.map((item) => {
                const isSelected = selectedType === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border text-center transition ${
                      isSelected
                        ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium"
                    }`}
                  >
                    <div className="mb-1">{item.icon}</div>
                    <span className="text-[10px] leading-tight truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jarak Maksimal Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Jarak Maksimal
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {maxDistance} km
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>1 km</span>
              <span>5 km</span>
              <span>10 km</span>
              <span>20+ km</span>
            </div>
          </div>

          {/* Layanan Checkboxes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Layanan
              </label>
              <button
                onClick={() => {
                  availableServices.forEach((s) => {
                    if (!selectedServices.includes(s)) toggleService(s);
                  });
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Pilih Semua
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {availableServices.map((service) => {
                const checked = selectedServices.includes(service);
                return (
                  <label
                    key={service}
                    onClick={() => toggleService(service)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border border-slate-100 dark:border-slate-750 transition"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                        checked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate">
                      {service}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Status Buka */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Status Buka
            </label>
            <div className="flex gap-2">
              {[
                { val: "ALL", label: "Semua" },
                { val: "OPEN_NOW", label: "Buka Sekarang" },
                { val: "EMERGENCY_24H", label: "IGD 24 Jam" },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setOpenStatus(item.val as any)}
                  className={`flex-1 py-2 px-2 rounded-xl text-[11px] font-bold transition border ${
                    openStatus === item.val
                      ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Minimum */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Rating Minimum
            </label>
            <div className="flex gap-1.5">
              {[
                { val: 0, label: "Semua" },
                { val: 3, label: "3+ ★" },
                { val: 4, label: "4+ ★" },
                { val: 4.5, label: "4.5+ ★" },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setMinRating(item.val)}
                  className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition border ${
                    minRating === item.val
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filter
            </button>
            <button
              onClick={() => {
                refetch();
                setIsFilterDrawerOpen(false);
                toast.success("Filter fasilitas diterapkan!");
              }}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs text-center"
            >
              Terapkan Filter
            </button>
          </div>
        </aside>

        {/* Center / Right Map Area */}
        <main className="col-span-1 lg:col-span-8 space-y-4">
          {/* Top Search Bar & Quick Filter Chips */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Cari klinik, rumah sakit, atau layanan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-800 dark:text-slate-100"
                />
              </div>
              <button
                onClick={handleUseCurrentLocation}
                className="hidden sm:flex items-center gap-1.5 py-2.5 px-4 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs font-bold transition border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap shadow-2xs"
              >
                <Crosshair className="w-4 h-4 text-emerald-600" />
                <span>Gunakan Lokasi Saya</span>
              </button>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { label: "BPJS", value: "BPJS" },
                { label: "24 Jam", value: "24 Jam" },
                { label: "Telemedicine", value: "Telemedicine" },
                { label: "IGD Terdekat", value: "IGD 24 Jam" },
                { label: "Farmasi", value: "Farmasi" },
                { label: "Lainnya", value: "Parkir" },
              ].map((chip) => {
                const active = selectedServices.includes(chip.value);
                return (
                  <button
                    key={chip.label}
                    onClick={() => toggleService(chip.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${
                      active
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Container with Floating User Location Card */}
          <div className="relative">
            {/* User Location Info Card */}
            <div className="absolute top-4 left-4 z-400 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-md max-w-xs space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Lokasi Anda
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {userLocation.address}
              </p>
              <button
                onClick={handleUseCurrentLocation}
                className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline block pt-0.5"
              >
                Ubah Lokasi
              </button>
            </div>

            {/* Interactive Leaflet Map */}
            <FacilityMap
              facilities={facilities}
              selectedFacility={selectedFacility}
              userLocation={userLocation}
              routeAlgorithm={routeAlgorithm}
              onSelectFacility={(fac) => setSelectedFacilityId(fac.id)}
              onRecenter={handleUseCurrentLocation}
              sortBy={sortBy}
              onSortChange={(val) => setSortBy(val)}
            />
          </div>

          {/* 3. Facility Cards Carousel / List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Daftar Fasilitas Ditemukan ({facilities.length})
              </h3>
              <span className="text-xs text-slate-500">
                Klik kartu untuk melihat rute pada peta
              </span>
            </div>

            {/* Horizontal Scroll Cards Grid */}
            <div className="flex gap-3.5 overflow-x-auto pb-3 snap-x no-scrollbar">
              {facilities.map((fac, idx) => {
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacilityId(fac.id)}
                    className={`min-w-[280px] max-w-[320px] shrink-0 bg-white dark:bg-slate-900 rounded-3xl p-4 border transition cursor-pointer snap-start flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                        : "border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                              {fac.name}
                            </h4>
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                              {fac.distanceKm ?? 2.4} km • {fac.estimatedMinutes ?? 9} menit
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            fac.isOpenNow
                              ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                              : "bg-rose-50 text-rose-800"
                          }`}
                        >
                          {fac.isOpenNow ? "Buka" : "Tutup"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {fac.rating}
                        </span>
                        <span>({fac.reviewCount})</span>
                        <span>•</span>
                        <span className="truncate">{fac.operatingHours}</span>
                      </div>

                      <p className="text-[10px] text-slate-500 truncate">
                        {fac.services.slice(0, 3).join(" • ")}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFacilityDetailsModal(fac);
                      }}
                      className="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition text-center"
                    >
                      Lihat Detail
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Patient Support & Care Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            {/* Emergency Service */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Layanan Darurat 24 Jam
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Fasilitas berstatus IGD siap melayani penanganan kegawatdaruratan medis dan ambulans siaga 24 jam.
              </p>
              <span className="inline-block px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full text-[9px] font-bold">
                IGD Siaga
              </span>
            </div>

            {/* Travel Time Estimation */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Estimasi Perjalanan Presisi
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Waktu tempuh dan jarak dihitung secara akurat dari titik GPS Anda untuk efisiensi mobilitas perawatan.
              </p>
              <span className="inline-block px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full text-[9px] font-bold">
                Rute Cepat
              </span>
            </div>

            {/* Pharmacy & Prescriptions */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Apotek & Tebus Obat
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tersedia faskes apotek rekanan terdekat dengan persediaan obat resep lengkap dan konsultasi apoteker.
              </p>
              <span className="inline-block px-2.5 py-0.5 bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 rounded-full text-[9px] font-bold">
                Obat Resmi
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* 5. Detail Slide-over / Modal */}
      <FacilityDetailsModal
        facility={facilityDetailsModal}
        onClose={() => setFacilityDetailsModal(null)}
      />
    </div>
  );
}
