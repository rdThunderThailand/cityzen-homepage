import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PublicLayout from "@/components/layout/PublicLayout";
import { useProvince } from "@/contexts/ProvinceContext";
import {
  Hospital,
  Fuel,
  Zap,
  Droplets,
  Megaphone,
  Search,
  Layers,
  X,
  MapPin,
  Navigation2,
} from "lucide-react";

// ─── Token ──────────────────────────────────────────────────────────────────
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

// ─── Province coordinates ───────────────────────────────────────────────────
const provinceCoords: Record<string, { lat: number; lng: number }> = {
  "10": { lat: 13.7563, lng: 100.5018 },
  "11": { lat: 13.5991, lng: 100.5998 },
  "12": { lat: 13.8621, lng: 100.5144 },
  "13": { lat: 14.0208, lng: 100.5253 },
  "14": { lat: 14.3532, lng: 100.5685 },
  "15": { lat: 14.5896, lng: 100.4555 },
  "16": { lat: 15.6930, lng: 100.1221 },
  "17": { lat: 14.7930, lng: 100.6534 },
  "20": { lat: 13.3611, lng: 100.9847 },
  "40": { lat: 16.4322, lng: 102.8236 },
  "50": { lat: 18.7883, lng: 98.9853 },
  "80": { lat: 8.4304, lng: 99.9631 },
  "83": { lat: 7.8804, lng: 98.3923 },
  "90": { lat: 7.1896, lng: 100.5945 },
};
const DEFAULT_COORDS = { lat: 13.7563, lng: 100.5018 };

// ─── Category config ────────────────────────────────────────────────────────
interface Category {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  markerColor: string;
  emoji: string;
  places: Array<{ name: string; latOffset: number; lngOffset: number; detail: string }>;
}

const CATEGORIES: Category[] = [
  {
    id: "hospital",
    icon: Hospital,
    label: "โรงพยาบาล",
    color: "bg-red-500",
    markerColor: "#ef4444",
    emoji: "🏥",
    places: [
      { name: "โรงพยาบาลในเขต", latOffset: 0.02, lngOffset: -0.01, detail: "เปิด 24 ชั่วโมง" },
      { name: "คลินิกชุมชน", latOffset: -0.03, lngOffset: 0.025, detail: "จ-ศ 08:00-17:00" },
      { name: "ศูนย์สุขภาพ", latOffset: 0.015, lngOffset: 0.04, detail: "เปิดทุกวัน 08:00-20:00" },
    ],
  },
  {
    id: "fuel",
    icon: Fuel,
    label: "ปั๊มน้ำมัน",
    color: "bg-amber-500",
    markerColor: "#f59e0b",
    emoji: "⛽",
    places: [
      { name: "ปั๊ม PTT", latOffset: -0.01, lngOffset: -0.02, detail: "เปิด 24 ชั่วโมง" },
      { name: "ปั๊ม Shell", latOffset: 0.025, lngOffset: 0.01, detail: "เปิด 06:00-22:00" },
      { name: "ปั๊ม Bangchak", latOffset: -0.02, lngOffset: 0.03, detail: "เปิด 06:00-22:00" },
    ],
  },
  {
    id: "ev",
    icon: Zap,
    label: "จุดชาร์จ EV",
    color: "bg-blue-500",
    markerColor: "#3b82f6",
    emoji: "⚡",
    places: [
      { name: "EV Charger ห้างสรรพสินค้า", latOffset: 0.01, lngOffset: -0.03, detail: "Type 2 / CCS" },
      { name: "EV Station ที่จอดรถ", latOffset: -0.015, lngOffset: 0.02, detail: "CHAdeMO / CCS" },
    ],
  },
  {
    id: "water",
    icon: Droplets,
    label: "จุดจ่ายน้ำ",
    color: "bg-cyan-500",
    markerColor: "#06b6d4",
    emoji: "💧",
    places: [
      { name: "ประปาชุมชน", latOffset: 0.03, lngOffset: 0.015, detail: "น้ำสะอาด ฟรี" },
      { name: "จุดแจกน้ำดื่ม", latOffset: -0.025, lngOffset: -0.01, detail: "เปิด 07:00-19:00" },
    ],
  },
  {
    id: "report",
    icon: Megaphone,
    label: "จุดแจ้งปัญหา",
    color: "bg-purple-500",
    markerColor: "#8b5cf6",
    emoji: "📢",
    places: [
      { name: "ศูนย์รับเรื่องราวร้องทุกข์", latOffset: 0.005, lngOffset: 0.025, detail: "จ-ศ 08:30-16:30" },
      { name: "สำนักงานเขต", latOffset: -0.022, lngOffset: -0.015, detail: "จ-ศ 08:30-16:30" },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const CityMap = () => {
  const { selectedProvince } = useProvince();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Record<string, mapboxgl.Marker[]>>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["hospital", "fuel"]));
  const [showPanel, setShowPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const coords = selectedProvince?.code
    ? provinceCoords[selectedProvince.code] || DEFAULT_COORDS
    : DEFAULT_COORDS;

  // ── render markers for a category ───────────────────────────────────────
  const renderMarkers = useCallback(
    (categoryId: string, active: boolean, center: { lat: number; lng: number }) => {
      const map = mapRef.current;
      if (!map) return;

      // Remove existing markers for this category
      (markersRef.current[categoryId] || []).forEach((m) => m.remove());
      markersRef.current[categoryId] = [];

      if (!active) return;

      const cat = CATEGORIES.find((c) => c.id === categoryId);
      if (!cat) return;

      cat.places.forEach((place) => {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 36px; height: 36px;
          border-radius: 50%;
          background: ${cat.markerColor};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        `;
        el.textContent = cat.emoji;
        el.addEventListener("mouseenter", () => {
          el.style.transform = "scale(1.2)";
          el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.45)";
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = "scale(1)";
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
        });

        const lngLat: [number, number] = [
          center.lng + place.lngOffset,
          center.lat + place.latOffset,
        ];

        const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, maxWidth: "200px" })
          .setHTML(`
            <div style="font-family: system-ui, sans-serif; padding: 4px 2px;">
              <p style="font-weight: 700; font-size: 13px; margin: 0 0 4px 0; color: #1a1a1a;">${place.name}</p>
              <p style="font-size: 12px; color: #666; margin: 0;">${cat.emoji} ${cat.label}</p>
              <p style="font-size: 11px; color: #999; margin: 4px 0 0 0;">${place.detail}</p>
            </div>
          `);

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(lngLat)
          .setPopup(popup)
          .addTo(map);

        markersRef.current[categoryId].push(marker);
      });
    },
    []
  );

  // ── Initialise map ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [coords.lng, coords.lat],
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
    map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-right");

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      Object.values(markersRef.current).flat().forEach((m) => m.remove());
      markersRef.current = {};
      userMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render all active layers when map loads ───────────────────────────────
  useEffect(() => {
    if (!mapLoaded) return;
    CATEGORIES.forEach((cat) => {
      renderMarkers(cat.id, activeLayers.has(cat.id), coords);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLoaded]);

  // ── Fly to province when it changes ─────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 13, speed: 1.4 });
    if (mapLoaded) {
      CATEGORIES.forEach((cat) => {
        renderMarkers(cat.id, activeLayers.has(cat.id), coords);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lng]);

  // ── Toggle layer ─────────────────────────────────────────────────────────
  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      const isActive = next.has(id);
      isActive ? next.delete(id) : next.add(id);
      renderMarkers(id, !isActive, coords);
      return next;
    });
  };

  // ── Locate me ────────────────────────────────────────────────────────────
  const locateMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;
    navigator.geolocation.getCurrentPosition(({ coords: geo }) => {
      const lngLat: [number, number] = [geo.longitude, geo.latitude];
      setUserLocation(lngLat);

      userMarkerRef.current?.remove();
      const el = document.createElement("div");
      el.style.cssText = `
        width: 18px; height: 18px; border-radius: 50%;
        background: #3b82f6; border: 3px solid white;
        box-shadow: 0 0 0 6px rgba(59,130,246,0.25);
      `;
      userMarkerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(mapRef.current!);

      mapRef.current!.flyTo({ center: lngLat, zoom: 14, speed: 1.6 });
    });
  };

  // ── Mapbox search (Geocoding API) ────────────────────────────────────────
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    const query = encodeURIComponent(`${searchQuery} ประเทศไทย`);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&language=th&country=TH&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const feature = data.features?.[0];
      if (!feature) return;

      const [lng, lat] = feature.center as [number, number];
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, speed: 1.4 });

      popupRef.current?.remove();
      popupRef.current = new mapboxgl.Popup({ offset: 10, closeButton: true })
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="font-family: system-ui; padding: 4px 2px;">
            <p style="font-weight: 700; font-size: 13px; margin: 0; color: #1a1a1a;">📍 ${feature.place_name}</p>
          </div>
        `)
        .addTo(mapRef.current);
    } catch {
      // silent fail — no result
    }
  };

  const filteredCategories = CATEGORIES.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    searchQuery === ""
  );

  return (
    <PublicLayout>
      <div className="relative w-full" style={{ height: "calc(100vh - 57px)" }}>

        {/* ── Full-screen map ───────────────────────────────────────────── */}
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* ── Search bar ───────────────────────────────────────────────── */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-xl px-3 py-2"
          >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสถานที่..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </form>
        </div>

        {/* ── Locate-me button ─────────────────────────────────────────── */}
        <button
          onClick={locateMe}
          className="absolute bottom-10 right-4 z-20 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-xl p-3 hover:bg-accent/10 transition-colors"
          title="ใช้ตำแหน่งของฉัน"
        >
          <Navigation2 className={`h-5 w-5 ${userLocation ? "text-blue-500" : "text-foreground"}`} />
        </button>

        {/* ── Layer toggle button ───────────────────────────────────────── */}
        <button
          onClick={() => setShowPanel((v) => !v)}
          className="absolute top-4 right-4 z-20 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-xl p-3 hover:bg-accent/10 transition-colors"
          title="เลเยอร์แผนที่"
        >
          <Layers className="h-5 w-5 text-foreground" />
        </button>

        {/* ── Layer panel ──────────────────────────────────────────────── */}
        <div
          className={`absolute top-16 right-4 z-20 w-56 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-2xl overflow-hidden transition-all duration-300 ${
            showPanel ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">สถานที่สำคัญ</p>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-2 space-y-1">
            {filteredCategories.map((cat) => {
              const isActive = activeLayers.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleLayer(cat.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                    isActive
                      ? "bg-accent/15 border border-accent/30"
                      : "hover:bg-secondary border border-transparent"
                  }`}
                >
                  <div className={`rounded-lg ${cat.color} p-1.5 shrink-0`}>
                    <cat.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {cat.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {cat.places.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active layer chips ────────────────────────────────────────── */}
        {activeLayers.size > 0 && (
          <div className="absolute bottom-10 left-4 z-20 flex flex-wrap gap-1.5 max-w-xs">
            {Array.from(activeLayers).map((id) => {
              const cat = CATEGORIES.find((c) => c.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => toggleLayer(id)}
                  className="flex items-center gap-1 rounded-full bg-card/95 backdrop-blur-md border border-border shadow px-2.5 py-1 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <X className="h-3 w-3 ml-0.5 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default CityMap;
