import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import PublicLayout from "@/components/layout/PublicLayout";
import { useProvince } from "@/contexts/ProvinceContext";
import { useScenario } from "@/contexts/ScenarioContext";
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
  Check,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

// ─── Thunder Core API ────────────────────────────────────────────────────────
const THUNDER_BASE = "/thunder-api";

interface FuelType { id: string; code: string; name: string; color_code: string; sort_order: number; }
interface FuelStatus { is_available: boolean; price: number; updated_at: string; fuel_type: FuelType; }
interface FuelStation {
  id: string; name: string; brand: string;
  latitude: number; longitude: number;
  province: string; district?: string; address?: string;
  is_active: boolean; fuel_status: FuelStatus[];
}

const brandStyle: Record<string, { bg: string; text: string }> = {
  PTT:      { bg: "#E31837", text: "#fff" },
  Shell:    { bg: "#FFD100", text: "#111" },
  Esso:     { bg: "#0062A3", text: "#fff" },
  Caltex:   { bg: "#E31837", text: "#fff" },
  Bangchak: { bg: "#2E7D32", text: "#fff" },
  Susco:    { bg: "#0082C8", text: "#fff" },
};
const defaultBrand = { bg: "#475569", text: "#fff" };

async function fetchFuelStations(provinceName: string): Promise<FuelStation[]> {
  try {
    const url = `${THUNDER_BASE}/api/fuel/stations?province=${encodeURIComponent(provinceName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = await res.json();
    return (json.data ?? json) as FuelStation[];
  } catch (e) {
    console.warn("[CityMap] fetchFuelStations failed:", e);
    return [];
  }
}

import { getMapboxToken } from "@/lib/mapbox";

// ─── Thailand GeoJSON ────────────────────────────────────────────────────────
const THAILAND_GEOJSON_URL =
  "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

const DISTRICT_GEOJSON_URL =
  "https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/districts.geojson";

const SUBDISTRICT_GEOJSON_URL =
  "https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/subdistricts.geojson";


// ─── Province code → GeoJSON name ────────────────────────────────────────────
const provinceCodeToName: Record<string, string> = {
  "10": "Bangkok Metropolis", "11": "Samut Prakan", "12": "Nonthaburi",
  "13": "Pathum Thani", "14": "Phra Nakhon Si Ayutthaya", "15": "Ang Thong",
  "16": "Lop Buri", "17": "Sing Buri", "18": "Chai Nat", "19": "Saraburi",
  "20": "Chon Buri", "21": "Rayong", "22": "Chanthaburi", "23": "Trat",
  "24": "Chachoengsao", "25": "Prachin Buri", "26": "Nakhon Nayok", "27": "Sa Kaeo",
  "30": "Nakhon Ratchasima", "31": "Buri Ram", "32": "Surin", "33": "Si Sa Ket",
  "34": "Ubon Ratchathani", "35": "Yasothon", "36": "Chaiyaphum", "37": "Amnat Charoen",
  "38": "Bueng Kan", "39": "Nong Bua Lam Phu", "40": "Khon Kaen", "41": "Udon Thani",
  "42": "Loei", "43": "Nong Khai", "44": "Maha Sarakham", "45": "Roi Et",
  "46": "Kalasin", "47": "Sakon Nakhon", "48": "Nakhon Phanom", "49": "Mukdahan",
  "50": "Chiang Mai", "51": "Lamphun", "52": "Lampang", "53": "Uttaradit",
  "54": "Phrae", "55": "Nan", "56": "Phayao", "57": "Chiang Rai", "58": "Mae Hong Son",
  "60": "Nakhon Sawan", "61": "Uthai Thani", "62": "Kamphaeng Phet", "63": "Tak",
  "64": "Sukhothai", "65": "Phitsanulok", "66": "Phichit", "67": "Phetchabun",
  "70": "Ratchaburi", "71": "Kanchanaburi", "72": "Suphan Buri", "73": "Nakhon Pathom",
  "74": "Samut Sakhon", "75": "Samut Songkhram", "76": "Phetchaburi",
  "77": "Prachuap Khiri Khan", "80": "Nakhon Si Thammarat", "81": "Krabi",
  "82": "Phangnga", "83": "Phuket", "84": "Surat Thani", "85": "Ranong",
  "86": "Chumphon", "90": "Songkhla", "91": "Satun", "92": "Trang",
  "93": "Phatthalung", "94": "Pattani", "95": "Yala", "96": "Narathiwat",
};

const GEO_SOURCE  = "province-boundary";
const GEO_FILL   = "province-fill";
const GEO_LINE   = "province-line";

const GEO_DISTRICT_SOURCE = "district-boundary";
const GEO_DISTRICT_FILL = "district-fill";
const GEO_DISTRICT_LINE = "district-line";

const GEO_SUBDISTRICT_SOURCE = "subdistrict-boundary";
const GEO_SUBDISTRICT_FILL = "subdistrict-fill";
const GEO_SUBDISTRICT_LINE = "subdistrict-line";


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
    places: [], // ← ดึงจาก Thunder Core API จริง (ดู renderFuelMarkers)
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
  const { selectedProvince, selectedDistrict, selectedSubdistrict } = useProvince();
  const { level: scenarioLevel } = useScenario();
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
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);
  const [fuelStationCount, setFuelStationCount] = useState<number>(0);
  
  const provinceGeoJsonRef = useRef<any>(null);
  const districtGeoJsonRef = useRef<any>(null);
  const subdistrictGeoJsonRef = useRef<any>(null);

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
        // Root el: Mapbox owns transform (translate for positioning) — do NOT set transform here
        const el = document.createElement("div");
        el.style.cssText = "display:flex; align-items:center; justify-content:center; cursor:pointer;";

        // Inner wrapper: safe to animate scale
        const inner = document.createElement("div");
        inner.style.cssText = `
          width: 36px; height: 36px;
          border-radius: 50%;
          background: ${cat.markerColor};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        `;
        inner.textContent = cat.emoji;
        inner.addEventListener("mouseenter", () => {
          inner.style.transform = "scale(1.2)";
          inner.style.boxShadow = "0 4px 16px rgba(0,0,0,0.45)";
        });
        inner.addEventListener("mouseleave", () => {
          inner.style.transform = "scale(1)";
          inner.style.boxShadow = "0 2px 8px rgba(0,0,0,0.35)";
        });
        el.appendChild(inner);


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

// ── Initialise map ──────────────────────────────────────────
useEffect(() => {
  if (!mapContainerRef.current) return;
  let cancelled = false;

  getMapboxToken().then((token) => {
    if (cancelled || !mapContainerRef.current) return;
    mapboxgl.accessToken = token;

  // Start directly at the target position — no animation needed on init
  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/standard",
    center: [coords.lng, coords.lat],
    zoom: 14,
    pitch: 45,
    bearing: -10,
    attributionControl: false,
    transformRequest: (url, resourceType) => {
      // Suppress ad-blocker ERR_CONNECTION_REFUSED console logs for Mapbox telemetry
      if (url.includes("events.mapbox.com")) {
        return { url: 'data:application/json,{"status":"ignored"}' };
      }
      return { url };
    },
  });

  map.on("style.load", () => {
    try {
      map.setConfigProperty("basemap", "lightPreset", "day");
      map.setConfigProperty("basemap", "show3dObjects", true);
    } catch { /* ignore */ }
  });

  map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");
  map.addControl(new mapboxgl.ScaleControl({ unit: "metric" }), "bottom-right");

  map.on("load", async () => {
    // ── Load Thailand GeoJSON for province, district and subdistrict borders ─────────────
    try {
      const [resProv, resDist, resSubDist] = await Promise.all([
        fetch(THAILAND_GEOJSON_URL),
        fetch(DISTRICT_GEOJSON_URL),
        fetch(SUBDISTRICT_GEOJSON_URL)
      ]);
      const geojson = await resProv.json();
      const distGeojson = await resDist.json();
      const subDistGeojson = await resSubDist.json();
      
      provinceGeoJsonRef.current = geojson;
      districtGeoJsonRef.current = distGeojson;
      subdistrictGeoJsonRef.current = subDistGeojson;

      map.addSource(GEO_SOURCE, { type: "geojson", data: geojson });
      map.addLayer({
        id: GEO_FILL, type: "fill", source: GEO_SOURCE,
        paint: { "fill-color": "#FACC15", "fill-opacity": 0.12 },
        filter: ["==", "name", "__none__"],
      });
      map.addLayer({
        id: GEO_LINE, type: "line", source: GEO_SOURCE,
        paint: { "line-color": "#FACC15", "line-width": 3, "line-opacity": 0.95 },
        filter: ["==", "name", "__none__"],
      });

      map.addSource(GEO_DISTRICT_SOURCE, { type: "geojson", data: distGeojson });
      map.addLayer({
        id: GEO_DISTRICT_FILL, type: "fill", source: GEO_DISTRICT_SOURCE,
        paint: { "fill-color": "#3B82F6", "fill-opacity": 0.15 },
        filter: ["==", "name", "__none__"],
      });
      map.addLayer({
        id: GEO_DISTRICT_LINE, type: "line", source: GEO_DISTRICT_SOURCE,
        paint: { "line-color": "#3B82F6", "line-width": 3, "line-opacity": 0.95 },
        filter: ["==", "name", "__none__"],
      });

      map.addSource(GEO_SUBDISTRICT_SOURCE, { type: "geojson", data: subDistGeojson });
      map.addLayer({
        id: GEO_SUBDISTRICT_FILL, type: "fill", source: GEO_SUBDISTRICT_SOURCE,
        paint: { "fill-color": "#10B981", "fill-opacity": 0.15 },
        filter: ["==", "name", "__none__"],
      });
      map.addLayer({
        id: GEO_SUBDISTRICT_LINE, type: "line", source: GEO_SUBDISTRICT_SOURCE,
        paint: { "line-color": "#10B981", "line-width": 3, "line-opacity": 0.95 },
        filter: ["==", "name", "__none__"],
      });
    } catch (e) {
      console.warn("[CityMap] GeoJSON failed:", e);
    }

    setMapLoaded(true);
  });

  mapRef.current = map;
  }).catch((err) => console.error("[CityMap] Mapbox token error:", err));

  return () => {
    cancelled = true;
    Object.values(markersRef.current).flat().forEach((m) => m.remove());
    markersRef.current = {};
    userMarkerRef.current?.remove();
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    setMapLoaded(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

// ── Apply border & Animation ─────────────────────────────────────────────────
const getBBox = (geometry: any): [number, number, number, number] => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const update = (coord: any) => {
    if (coord[0] < minX) minX = coord[0];
    if (coord[0] > maxX) maxX = coord[0];
    if (coord[1] < minY) minY = coord[1];
    if (coord[1] > maxY) maxY = coord[1];
  };
  const flat = (arr: any[]) => {
    if (typeof arr[0] === 'number') update(arr);
    else arr.forEach(flat);
  };
  flat(geometry.coordinates);
  return [minX, minY, maxX, maxY];
};

const matchRegionName = (geoName: string, dbName: string) => {
  if (!geoName || !dbName) return false;
  const cleanGeo = geoName.replace(/^(เขต|อำเภอ|แขวง|ตำบล|\s+)+/g, '').trim();
  const cleanDb = dbName.replace(/^(เขต|อำเภอ|แขวง|ตำบล|\s+)+/g, '').trim();
  return cleanGeo === cleanDb;
};

useEffect(() => {
  const map = mapRef.current;
  if (!map || !mapLoaded) return;
  const code = selectedProvince?.code ?? null;
  const geoName = code ? provinceCodeToName[code] ?? null : null;

  // 1. Borders
  let featureToFit = null;

  // Reset all filters first
  if (map.getLayer(GEO_FILL)) map.setFilter(GEO_FILL, ["==", "name", "__none__"]);
  if (map.getLayer(GEO_LINE)) map.setFilter(GEO_LINE, ["==", "name", "__none__"]);
  if (map.getLayer(GEO_DISTRICT_FILL)) map.setFilter(GEO_DISTRICT_FILL, ["==", "name", "__none__"]);
  if (map.getLayer(GEO_DISTRICT_LINE)) map.setFilter(GEO_DISTRICT_LINE, ["==", "name", "__none__"]);
  if (map.getLayer(GEO_SUBDISTRICT_FILL)) map.setFilter(GEO_SUBDISTRICT_FILL, ["==", "name", "__none__"]);
  if (map.getLayer(GEO_SUBDISTRICT_LINE)) map.setFilter(GEO_SUBDISTRICT_LINE, ["==", "name", "__none__"]);

  if (selectedSubdistrict && selectedDistrict && selectedProvince) {
    if (subdistrictGeoJsonRef.current) {
      featureToFit = subdistrictGeoJsonRef.current.features.find(
        (f: any) => 
          matchRegionName(f.properties.tam_th, selectedSubdistrict.name_th) && 
          matchRegionName(f.properties.amp_th, selectedDistrict.name_th) && 
          f.properties.pro_code === selectedProvince.code
      );
    }

    if (featureToFit) {
      const subDistFilter = [
        "all",
        ["==", ["get", "tam_th"], featureToFit.properties.tam_th],
        ["==", ["get", "amp_th"], featureToFit.properties.amp_th],
        ["==", ["get", "pro_code"], featureToFit.properties.pro_code]
      ];
      if (map.getLayer(GEO_SUBDISTRICT_FILL)) map.setFilter(GEO_SUBDISTRICT_FILL, subDistFilter);
      if (map.getLayer(GEO_SUBDISTRICT_LINE)) map.setFilter(GEO_SUBDISTRICT_LINE, subDistFilter);
    }
  } else if (selectedDistrict && selectedProvince) {
    if (districtGeoJsonRef.current) {
      featureToFit = districtGeoJsonRef.current.features.find(
        (f: any) => 
          matchRegionName(f.properties.amp_th, selectedDistrict.name_th) && 
          f.properties.pro_code === selectedProvince.code
      );
    }

    if (featureToFit) {
      const distFilter = [
        "all", 
        ["==", ["get", "amp_th"], featureToFit.properties.amp_th],
        ["==", ["get", "pro_code"], featureToFit.properties.pro_code]
      ];
      if (map.getLayer(GEO_DISTRICT_FILL)) map.setFilter(GEO_DISTRICT_FILL, distFilter);
      if (map.getLayer(GEO_DISTRICT_LINE)) map.setFilter(GEO_DISTRICT_LINE, distFilter);
    }
  } else {
    const provFilter = geoName ? ["==", ["get", "name"], geoName] : ["==", "name", "__none__"];
    if (map.getLayer(GEO_FILL)) map.setFilter(GEO_FILL, provFilter);
    if (map.getLayer(GEO_LINE)) map.setFilter(GEO_LINE, provFilter);

    if (geoName && provinceGeoJsonRef.current) {
      featureToFit = provinceGeoJsonRef.current.features.find(
        (f: any) => f.properties.name === geoName
      );
    }
  }

  // 2. Camera movement
  const resolvedCoords = { ...coords };
  if (featureToFit) {
    const bbox = getBBox(featureToFit.geometry);
    resolvedCoords.lng = (bbox[0] + bbox[2]) / 2;
    resolvedCoords.lat = (bbox[1] + bbox[3]) / 2;
    
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.fitBounds(bbox, {
        padding: 60,
        pitch: 45,
        bearing: -10,
        speed: 1.2,
        curve: 2.5,
        essential: true,
        easing: (t) => t * (2 - t)
      });
    }, 200);
  } else {
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [resolvedCoords.lng, resolvedCoords.lat],
        zoom: 14,
        pitch: 45,
        bearing: -10,
        speed: 1.2,
        curve: 2.5,
        essential: true,
      });
    }, 200);
  }

  // 3. Render markers based on active layer
  CATEGORIES.forEach((cat) => {
    if (cat.id === "fuel") {
      renderFuelMarkers(activeLayers.has(cat.id));
    } else {
      renderMarkers(cat.id, activeLayers.has(cat.id), resolvedCoords);
    }
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [mapLoaded, selectedDistrict, selectedProvince, selectedSubdistrict]);

// ── Apply Mapbox light preset based on scenario level ────────────────────────
useEffect(() => {
  const map = mapRef.current;
  if (!map || !mapLoaded) return;

  const preset =
    scenarioLevel === "watch"    ? "dusk" :
    scenarioLevel === "crisis"   ? "night" :
    scenarioLevel === "lockdown" ? "night" :
    "day";

  try {
    map.setConfigProperty("basemap", "lightPreset", preset);
  } catch {
    // style might not be loaded yet — ignore
  }
}, [mapLoaded, scenarioLevel]);


  // ── Real fuel markers from Thunder Core ──────────────────────────────────
  const renderFuelMarkers = useCallback(async (active: boolean) => {
    const map = mapRef.current;
    (markersRef.current["fuel"] || []).forEach((m) => m.remove());
    markersRef.current["fuel"] = [];
    if (!active || !map) return;

    const provinceName = selectedProvince?.name_th ?? "กรุงเทพมหานคร";
    const stations = await fetchFuelStations(provinceName);
    const valid = stations.filter(
      (s) => s.latitude && s.longitude && Math.abs(s.latitude) < 90 && Math.abs(s.longitude) < 180
    );
    setFuelStationCount(valid.length);

    valid.forEach((station) => {
      const style = brandStyle[station.brand] ?? defaultBrand;
      const hasAvail = (station.fuel_status ?? []).some((f) => f.is_available);

      const el = document.createElement("div");
      el.style.cssText = "display:flex;align-items:center;justify-content:center;cursor:pointer;";

      const inner = document.createElement("div");
      inner.style.cssText = `
        display:flex;flex-direction:column;align-items:center;
        transition:transform 0.15s ease;
        filter:drop-shadow(0 3px 8px rgba(0,0,0,0.28));
      `;
      inner.innerHTML = `
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:${style.bg};color:${style.text};
          display:flex;align-items:center;justify-content:center;
          border:3px solid rgba(255,255,255,0.95);font-size:17px;
          position:relative;
        ">
          ⛽
          <div style="
            position:absolute;bottom:-3px;right:-3px;
            width:11px;height:11px;border-radius:50%;
            background:${hasAvail ? "#22C55E" : "#EF4444"};
            border:2px solid #fff;
          "></div>
        </div>
        <div style="
          width:7px;height:7px;background:${style.bg};
          clip-path:polygon(0 0,100% 0,50% 100%);margin-top:-1px;
        "></div>
      `;
      inner.addEventListener("mouseenter", () => { inner.style.transform = "scale(1.2)"; });
      inner.addEventListener("mouseleave", () => { inner.style.transform = "scale(1)"; });
      inner.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedStation(station);
      });
      el.appendChild(inner);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map);
      markersRef.current["fuel"].push(marker);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince?.name_th]);

  // ── Re-fetch fuel when province or mapLoaded changes ───────────────────────
  useEffect(() => {
    if (!mapLoaded) return;
    if (activeLayers.has("fuel")) {
      renderFuelMarkers(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvince?.name_th, mapLoaded]);

  // ── Toggle layer ─────────────────────────────────────────────────────────
  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      const isActive = next.has(id);
      const nowActive = !isActive;
      isActive ? next.delete(id) : next.add(id);
      if (id === "fuel") {
        renderFuelMarkers(nowActive);
      } else {
        renderMarkers(id, nowActive, coords);
      }
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
                      {cat.id === "fuel" ? fuelStationCount : cat.places.length}
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

        {/* ── Dev Camera Panel ──────────────────────────────────────────── */}
        <CameraDevPanel mapRef={mapRef} />

        {/* ── Station Modal ─────────────────────────────────────────────── */}
        {selectedStation && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
            }}
            onClick={() => setSelectedStation(null)}
          >
            <div
              style={{
                background: "#fff", borderRadius: 20, width: 340, maxWidth: "90vw",
                boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
                overflow: "hidden", fontFamily: "system-ui,sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(() => {
                const bStyle = brandStyle[selectedStation.brand] ?? defaultBrand;
                return (
                  <div style={{ background: bStyle.bg, color: bStyle.text, padding: "16px 18px 14px", position: "relative" }}>
                    <div style={{ fontWeight: 800, fontSize: 17 }}>{selectedStation.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.82, marginTop: 3 }}>
                      {selectedStation.brand} &middot; {selectedStation.district ?? selectedStation.province}
                    </div>
                    <button
                      onClick={() => setSelectedStation(null)}
                      style={{
                        position: "absolute", top: 12, right: 12,
                        background: "rgba(255,255,255,0.25)", border: "none",
                        borderRadius: 8, width: 28, height: 28,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: bStyle.text, fontSize: 16,
                      }}
                    >×</button>
                  </div>
                );
              })()}

              <div style={{ padding: "16px 18px" }}>
                {/* Availability chips */}
                {(selectedStation.fuel_status?.length ?? 0) > 0 && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 8 }}>FUEL AVAILABILITY</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {selectedStation.fuel_status.map((f, i) => (
                        <span
                          key={f.fuel_type?.id ?? i}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "4px 10px", borderRadius: 20,
                            background: f.is_available ? "#f0fdf4" : "#fef2f2",
                            border: `1px solid ${f.is_available ? "#bbf7d0" : "#fecaca"}`,
                            fontSize: 12, color: f.is_available ? "#166534" : "#991b1b",
                          }}
                        >
                          {f.is_available
                            ? <Check style={{ width: 12, height: 12 }} strokeWidth={3} />
                            : <X style={{ width: 12, height: 12 }} strokeWidth={3} />
                          }
                          {f.fuel_type?.name ?? f.fuel_type?.code}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Price list */}
                {selectedStation.fuel_status?.some((f) => f.price > 0) && (
                  <div style={{ marginBottom: 16 }}>
                    {selectedStation.fuel_status
                      .filter((f) => f.price > 0)
                      .sort((a, b) => (a.fuel_type?.sort_order ?? 0) - (b.fuel_type?.sort_order ?? 0))
                      .map((f, i) => (
                        <div
                          key={f.fuel_type?.id ?? i}
                          style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "7px 0",
                            borderBottom: "1px solid #f1f5f9",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 8, height: 8, borderRadius: "50%",
                              background: f.fuel_type?.color_code ?? "#94a3b8",
                            }} />
                            <span style={{ fontSize: 13, color: "#374151" }}>
                              {f.fuel_type?.name ?? f.fuel_type?.code}
                            </span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>
                            ฿{f.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button
                    style={{
                      flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                      background: (brandStyle[selectedStation.brand] ?? defaultBrand).bg,
                      color: (brandStyle[selectedStation.brand] ?? defaultBrand).text,
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onClick={() => {
                      mapRef.current?.easeTo({
                        center: [selectedStation.longitude, selectedStation.latitude],
                        zoom: 17, pitch: 45, duration: 800,
                      });
                      setSelectedStation(null);
                    }}
                  >
                    นำทาง <ChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                  <button
                    style={{
                      flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                      background: "#1e293b", color: "#fff",
                      fontWeight: 700, fontSize: 14, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <AlertTriangle style={{ width: 14, height: 14 }} /> Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </PublicLayout>
  );
};

// ─── Camera Dev Panel (ใช้ตอน dev เท่านั้น) ─────────────────────────────────
function CameraDevPanel({ mapRef }: { mapRef: React.RefObject<mapboxgl.Map | null> }) {
  const [open, setOpen] = useState(false);
  const [cam, setCam] = useState({ zoom: 16, pitch: 45, bearing: -10 });
  const [light, setLight] = useState<"day" | "dusk" | "dawn" | "night">("day");
  const [copied, setCopied] = useState(false);

  // ── sync sliders FROM map (drag, scroll, etc.) ──────────────────────────
  useEffect(() => {
    if (!open) return;
    const onMove = () => {
      const m = mapRef.current;
      if (!m) return;
      setCam({
        zoom:    +m.getZoom().toFixed(1),
        pitch:   +m.getPitch().toFixed(0),
        bearing: +m.getBearing().toFixed(0),
      });
    };
    const m = mapRef.current;
    m?.on("move", onMove);
    return () => { m?.off("move", onMove); };
  }, [open, mapRef]);

  // ── apply sliders TO map ─────────────────────────────────────────────────
  const apply = (next: typeof cam) => {
    setCam(next);
    mapRef.current?.easeTo({ zoom: next.zoom, pitch: next.pitch, bearing: next.bearing, duration: 300 });
  };

  const applyLight = (preset: typeof light) => {
    setLight(preset);
    try { mapRef.current?.setConfigProperty("basemap", "lightPreset", preset); } catch {}
  };

  const copyCode = () => {
    const code = `zoom: ${cam.zoom}, pitch: ${cam.pitch}, bearing: ${cam.bearing}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const LIGHTS: (typeof light)[] = ["day", "dawn", "dusk", "night"];
  const lightEmoji = { day: "☀️", dawn: "🌅", dusk: "🌆", night: "🌙" };

  return (
    <>
      {/* toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Camera controls"
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 40,
          background: open ? "#1e293b" : "rgba(255,255,255,0.92)",
          color: open ? "#fff" : "#1e293b",
          border: "none", borderRadius: 10, padding: "8px 12px",
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        🎛️ Camera
      </button>

      {/* panel */}
      {open && (
        <div style={{
          position: "absolute", top: 52, right: 12, zIndex: 40,
          width: 260, background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)",
          borderRadius: 16, padding: "16px", color: "#fff",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          fontFamily: "system-ui,sans-serif",
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: "#94a3b8", letterSpacing: "0.06em" }}>
            CAMERA CONTROLS
          </div>

          {/* Sliders */}
          {([
            { key: "zoom",    label: "Zoom",    min: 0,    max: 22,  step: 0.1 },
            { key: "pitch",   label: "Pitch",   min: 0,    max: 85,  step: 1   },
            { key: "bearing", label: "Bearing", min: -180, max: 180, step: 1   },
          ] as const).map(({ key, label, min, max, step }) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", minWidth: 36, textAlign: "right" }}>
                  {cam[key]}
                </span>
              </div>
              <input
                type="range" min={min} max={max} step={step}
                value={cam[key]}
                onChange={(e) => apply({ ...cam, [key]: +e.target.value })}
                style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }}
              />
            </div>
          ))}

          {/* Light preset */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 6 }}>LIGHT PRESET</div>
            <div style={{ display: "flex", gap: 6 }}>
              {LIGHTS.map((l) => (
                <button
                  key={l}
                  onClick={() => applyLight(l)}
                  title={l}
                  style={{
                    flex: 1, padding: "6px 0",
                    borderRadius: 8, border: "2px solid",
                    borderColor: light === l ? "#6366f1" : "transparent",
                    background: light === l ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.08)",
                    cursor: "pointer", fontSize: 16,
                  }}
                >
                  {lightEmoji[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Current code */}
          <div style={{
            background: "rgba(0,0,0,0.35)", borderRadius: 8, padding: "8px 10px",
            fontFamily: "monospace", fontSize: 10, color: "#7dd3fc",
            marginBottom: 10, lineHeight: 1.8,
          }}>
            zoom: {cam.zoom}<br />
            pitch: {cam.pitch}<br />
            bearing: {cam.bearing}<br />
            lightPreset: "{light}"
          </div>

          <button
            onClick={copyCode}
            style={{
              width: "100%", padding: "9px 0",
              borderRadius: 9, border: "none",
              background: copied ? "#22c55e" : "#6366f1",
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            {copied ? "✅ Copied!" : "📋 Copy code"}
          </button>
        </div>
      )}
    </>
  );
}

export default CityMap;
