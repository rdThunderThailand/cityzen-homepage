import { useEffect, useRef, useCallback, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Megaphone, HeartHandshake, HelpCircle, Maximize2,
  Loader2, Fuel, X, AlertTriangle, ChevronRight, Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import type { MapFilter } from "@/components/home/CityStatusBanner";

import { getMapboxToken } from "@/lib/mapbox";

// ─── Thunder Core API (proxied via Vite to avoid CORS) ───────────────────────
const THUNDER_BASE = "/thunder-api";

// ─── Thailand GeoJSON ─────────────────────────────────────────────────────────
const THAILAND_GEOJSON_URL =
  "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

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

// ─── Province coordinates ────────────────────────────────────────────────────
const provinceCoords: Record<string, { lat: number; lng: number }> = {
  "10": { lat: 13.7563, lng: 100.5018 }, "11": { lat: 13.5991, lng: 100.5998 },
  "12": { lat: 13.8621, lng: 100.5144 }, "13": { lat: 14.0208, lng: 100.5253 },
  "14": { lat: 14.3532, lng: 100.5685 }, "15": { lat: 14.5896, lng: 100.4555 },
  "16": { lat: 15.6930, lng: 100.1221 }, "17": { lat: 14.7930, lng: 100.6534 },
  "18": { lat: 15.1580, lng: 100.1260 }, "19": { lat: 14.5344, lng: 100.9105 },
  "20": { lat: 13.3611, lng: 100.9847 }, "21": { lat: 12.6814, lng: 101.2810 },
  "22": { lat: 12.6078, lng: 102.1048 }, "23": { lat: 12.2396, lng: 102.5150 },
  "24": { lat: 13.6904, lng: 101.0779 }, "25": { lat: 14.0509, lng: 101.3685 },
  "26": { lat: 13.8134, lng: 101.2150 }, "27": { lat: 13.8240, lng: 102.0645 },
  "30": { lat: 14.9799, lng: 102.0978 }, "31": { lat: 14.9951, lng: 103.1029 },
  "32": { lat: 14.8818, lng: 103.4936 }, "33": { lat: 15.1186, lng: 104.3220 },
  "34": { lat: 15.2448, lng: 104.8473 }, "35": { lat: 15.5727, lng: 104.0651 },
  "36": { lat: 15.8068, lng: 102.0313 }, "37": { lat: 15.8585, lng: 104.6261 },
  "38": { lat: 17.4138, lng: 102.7874 }, "39": { lat: 16.9920, lng: 101.1135 },
  "40": { lat: 16.4322, lng: 102.8236 }, "41": { lat: 17.4138, lng: 102.7874 },
  "42": { lat: 17.4860, lng: 101.7223 }, "43": { lat: 17.8782, lng: 102.7413 },
  "44": { lat: 16.1862, lng: 103.3006 }, "45": { lat: 15.9780, lng: 103.6520 },
  "46": { lat: 16.4322, lng: 103.5060 }, "47": { lat: 17.1545, lng: 104.1348 },
  "48": { lat: 17.3927, lng: 104.7784 }, "49": { lat: 16.5436, lng: 104.7235 },
  "50": { lat: 18.7883, lng: 98.9853 }, "51": { lat: 18.5912, lng: 98.6863 },
  "52": { lat: 18.2888, lng: 99.5048 }, "53": { lat: 17.6256, lng: 100.0993 },
  "54": { lat: 18.1445, lng: 100.1447 }, "55": { lat: 18.7756, lng: 100.7730 },
  "56": { lat: 19.1664, lng: 99.9019 }, "57": { lat: 19.9105, lng: 99.8406 },
  "58": { lat: 19.2990, lng: 97.9685 }, "60": { lat: 15.6930, lng: 100.1221 },
  "61": { lat: 15.3835, lng: 99.5318 }, "62": { lat: 16.7144, lng: 99.0087 },
  "63": { lat: 16.8840, lng: 99.1258 }, "64": { lat: 17.0055, lng: 99.8265 },
  "65": { lat: 16.8211, lng: 100.2659 }, "66": { lat: 16.4322, lng: 100.3489 },
  "67": { lat: 16.4419, lng: 101.1592 }, "70": { lat: 13.5282, lng: 99.8134 },
  "71": { lat: 14.0227, lng: 99.5328 }, "72": { lat: 14.4744, lng: 100.1177 },
  "73": { lat: 13.8196, lng: 100.0613 }, "74": { lat: 13.5475, lng: 100.2744 },
  "75": { lat: 13.4097, lng: 100.0024 }, "76": { lat: 13.1059, lng: 99.9412 },
  "77": { lat: 11.8118, lng: 99.7972 }, "80": { lat: 8.4304, lng: 99.9631 },
  "81": { lat: 8.0863, lng: 98.9063 }, "82": { lat: 8.4511, lng: 98.5260 },
  "83": { lat: 7.8804, lng: 98.3923 }, "84": { lat: 9.1382, lng: 99.3217 },
  "85": { lat: 9.8138, lng: 98.7583 }, "86": { lat: 10.4930, lng: 99.1800 },
  "90": { lat: 7.1896, lng: 100.5945 }, "91": { lat: 6.6238, lng: 100.0673 },
  "92": { lat: 7.5593, lng: 99.6114 }, "93": { lat: 7.6160, lng: 100.0741 },
  "94": { lat: 6.8700, lng: 101.2500 }, "95": { lat: 6.5414, lng: 101.2812 },
  "96": { lat: 6.4254, lng: 101.8190 },
};

const DEFAULT_COORDS = { lat: 13.7563, lng: 100.5018 };

// ─── Brand styles ─────────────────────────────────────────────────────────────
const brandStyle: Record<string, { bg: string; text: string; dot: string }> = {
  PTT:      { bg: "#E31837", text: "#fff",    dot: "#E31837" },
  Shell:    { bg: "#FFD100", text: "#111",    dot: "#FFD100" },
  Esso:     { bg: "#0062A3", text: "#fff",    dot: "#0062A3" },
  Caltex:   { bg: "#E31837", text: "#fff",    dot: "#E31837" },
  Bangchak: { bg: "#2E7D32", text: "#fff",    dot: "#2E7D32" },
  Susco:    { bg: "#0082C8", text: "#fff",    dot: "#0082C8" },
};
const defaultBrand = { bg: "#475569", text: "#fff", dot: "#475569" };

// ─── Types ────────────────────────────────────────────────────────────────────
interface FuelType { id: string; code: string; name: string; color_code: string; sort_order: number; }
interface FuelStatus { is_available: boolean; price: number; updated_at: string; fuel_type: FuelType; }
interface FuelStation {
  id: string; name: string; brand: string;
  latitude: number; longitude: number;
  province: string; district?: string; address?: string;
  is_active: boolean; fuel_status: FuelStatus[];
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
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

// ─── Map marker element ───────────────────────────────────────────────────────
function buildMarkerEl(station: FuelStation): HTMLElement {
  const style = brandStyle[station.brand] ?? defaultBrand;
  const hasAvail = (station.fuel_status ?? []).some((f) => f.is_available);

  // Root el: DO NOT set transform here — Mapbox owns it for positioning
  const el = document.createElement("div");
  el.style.cssText = "display:flex; align-items:center; justify-content:center; cursor:pointer;";

  // Inner wrapper: safe to animate scale without breaking Mapbox translate
  const inner = document.createElement("div");
  inner.style.cssText = `
    display:flex; flex-direction:column; align-items:center;
    transition:transform 0.15s ease;
    filter:drop-shadow(0 3px 8px rgba(0,0,0,0.28));
  `;
  inner.innerHTML = `
    <div style="
      width:36px; height:36px; border-radius:50%;
      background:${style.bg}; color:${style.text};
      display:flex; align-items:center; justify-content:center;
      border:3px solid rgba(255,255,255,0.95);
      font-size:17px; font-weight:800;
      position:relative;
    ">
      ⛽
      <div style="
        position:absolute; bottom:-3px; right:-3px;
        width:11px; height:11px; border-radius:50%;
        background:${hasAvail ? "#22C55E" : "#EF4444"};
        border:2px solid #fff;
      "></div>
    </div>
    <div style="
      width:7px; height:7px; background:${style.bg};
      clip-path:polygon(0 0,100% 0,50% 100%);
      margin-top:-1px;
    "></div>
  `;

  inner.addEventListener("mouseenter", () => { inner.style.transform = "scale(1.2)"; });
  inner.addEventListener("mouseleave", () => { inner.style.transform = "scale(1)"; });

  el.appendChild(inner);
  return el;
}

// ─── Station Modal ────────────────────────────────────────────────────────────
function StationModal({ station, onClose }: { station: FuelStation; onClose: () => void }) {
  const style = brandStyle[station.brand] ?? defaultBrand;
  const fuels = (station.fuel_status ?? []).sort((a, b) => a.fuel_type.sort_order - b.fuel_type.sort_order);
  const available = fuels.filter((f) => f.is_available);
  const unavailable = fuels.filter((f) => !f.is_available);

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-20"
        style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(1px)" }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="absolute z-30 w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          animation: "modalPop 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Header */}
        <div style={{ background: style.bg, padding: "14px 16px 12px" }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div style={{ color: style.text, fontWeight: 700, fontSize: 17, lineHeight: 1.2 }}>
                {station.name}
              </div>
              <div style={{ color: style.text, opacity: 0.77, fontSize: 12, marginTop: 3 }}>
                {station.brand}
                {station.district ? ` · ${station.district}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 8, padding: "6px 7px",
                  color: style.text, fontSize: 18,
                }}
              >
                ⛽
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none", borderRadius: 8, padding: "6px 8px",
                  color: style.text, cursor: "pointer", lineHeight: 1,
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Traffic & Wait row */}
        <div className="grid grid-cols-2 gap-px bg-gray-100" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <div className="bg-white px-4 py-3">
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>
              TRAFFIC
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              No Data
            </div>
          </div>
          <div className="bg-white px-4 py-3">
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>
              WAIT TIME
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
              ? min
            </div>
          </div>
        </div>

        {/* Fuel availability chips */}
        <div className="px-4 pt-3 pb-2">
          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 8 }}>
            FUEL AVAILABILITY
          </div>
          <div className="flex flex-wrap gap-1.5">
            {available.map((f) => (
              <span
                key={f.fuel_type.id}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 99, padding: "3px 9px",
                  fontSize: 11, fontWeight: 600, color: "#15803d",
                }}
              >
                <Check size={11} strokeWidth={3} />
                {f.fuel_type.name}
              </span>
            ))}
            {unavailable.map((f) => (
              <span
                key={f.fuel_type.id}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: "#fff1f2", border: "1px solid #fecdd3",
                  borderRadius: 99, padding: "3px 9px",
                  fontSize: 11, fontWeight: 600, color: "#be123c",
                }}
              >
                <X size={11} strokeWidth={3} />
                {f.fuel_type.name}
              </span>
            ))}
            {fuels.length === 0 && (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>ไม่มีข้อมูล</span>
            )}
          </div>
        </div>

        {/* Price list */}
        {fuels.length > 0 && (
          <div className="px-4 pt-1 pb-3">
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
              {fuels.map((f) => (
                <div key={f.fuel_type.id} className="flex justify-between items-center py-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: f.fuel_type.color_code, flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <span style={{ fontSize: 13, color: "#374151" }}>{f.fuel_type.name}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                    {f.price != null ? `฿${f.price.toFixed(2)}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 px-4 pb-4 pt-1">
          <button
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: style.bg, color: style.text,
              border: "none", borderRadius: 10, padding: "10px 0",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
          >
            Details
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
          <button
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "#1e293b", color: "#fff",
              border: "none", borderRadius: 10, padding: "10px 0",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
            onClick={() => window.location.href = "/report"}
          >
            <AlertTriangle size={14} />
            Report
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity:0; transform:translateX(-50%) scale(0.92); }
          to   { opacity:1; transform:translateX(-50%) scale(1); }
        }
      `}</style>
    </>
  );
}

// ─── Filter labels ────────────────────────────────────────────────────────────
const filterLabels: Record<string, string> = {
  fuel:      "⛽ แสดงปั๊มน้ำมันในจังหวัด",
  weather:   "🌤️ แสดงสภาพอากาศ",
  water:     "💧 แสดงจุดบริการน้ำประปา",
  emergency: "🚨 แสดงจุดฉุกเฉิน",
};

const SOURCE_ID   = "province-boundary";
const FILL_LAYER  = "province-fill";
const LINE_LAYER  = "province-line";

interface CityMapPreviewProps { activeFilter?: MapFilter; }

// ─── Main Component ───────────────────────────────────────────────────────────
const CityMapPreview = ({ activeFilter }: CityMapPreviewProps) => {
  const { selectedProvince } = useProvince();
  const mapContainerRef  = useRef<HTMLDivElement>(null);
  const mapRef           = useRef<mapboxgl.Map | null>(null);
  const markersRef       = useRef<mapboxgl.Marker[]>([]);
  const mapLoadedRef     = useRef(false);
  const geojsonLoadedRef = useRef(false);

  const [loadingStations, setLoadingStations] = useState(false);
  const [stationCount, setStationCount]       = useState<number | null>(null);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);

  const coords = selectedProvince?.code
    ? provinceCoords[selectedProvince.code] || DEFAULT_COORDS
    : DEFAULT_COORDS;

  // ── Province border filter ───────────────────────────────────────────────
  const applyProvinceFilter = useCallback((name: string | null) => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current || !geojsonLoadedRef.current) return;
    const f = name ? ["==", ["get", "name"], name] : ["==", "name", "__none__"];
    if (map.getLayer(FILL_LAYER)) map.setFilter(FILL_LAYER, f);
    if (map.getLayer(LINE_LAYER)) map.setFilter(LINE_LAYER, f);
  }, []);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let cancelled = false;

    getMapboxToken().then((token) => {
      if (cancelled || !mapContainerRef.current) return;
      mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [coords.lng, coords.lat],
      zoom: 7,
      pitch: 40,
      bearing: -10,
      attributionControl: false,
    });

    // Enable 3D objects (buildings)
    map.on("style.load", () => {
      try {
        map.setConfigProperty("basemap", "lightPreset", "day");
        map.setConfigProperty("basemap", "show3dObjects", true);
      } catch { /* older style versions may not support this */ }
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", async () => {
      mapLoadedRef.current = true;
      try {
        const res = await fetch(THAILAND_GEOJSON_URL);
        const geojson = await res.json();
        map.addSource(SOURCE_ID, { type: "geojson", data: geojson });
        map.addLayer({
          id: FILL_LAYER, type: "fill", source: SOURCE_ID,
          paint: { "fill-color": "#FACC15", "fill-opacity": 0.12 },
          filter: ["==", "name", "__none__"],
        });
        map.addLayer({
          id: LINE_LAYER, type: "line", source: SOURCE_ID,
          paint: { "line-color": "#FACC15", "line-width": 3, "line-opacity": 0.95 },
          filter: ["==", "name", "__none__"],
        });
        geojsonLoadedRef.current = true;
        const code = selectedProvince?.code ?? null;
        const geoName = code ? provinceCodeToName[code] ?? null : null;
        applyProvinceFilter(geoName);
      } catch { /* ignore */ }
    });

    mapRef.current = map;
    }).catch((err) => console.error("[CityMapPreview] Mapbox token error:", err));

    return () => {
      cancelled = true;
      clearMarkers();
      mapLoadedRef.current = false;
      geojsonLoadedRef.current = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fly + border on province change ─────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 14,
      pitch: 50,
      bearing: -10,
      speed: 1.2,
      curve: 2.5, // สูงกว่าปกติเพื่อให้ซูมออกเยอะๆ (zoom out then in)
      essential: true,
    });
    const code = selectedProvince?.code ?? null;
    applyProvinceFilter(code ? provinceCodeToName[code] ?? null : null);
  }, [coords.lat, coords.lng, selectedProvince?.code, applyProvinceFilter]);

  // ── Fetch & plot fuel markers ────────────────────────────────────────────
  useEffect(() => {
    clearMarkers();
    setStationCount(null);
    setSelectedStation(null);
    const map = mapRef.current;
    if (!activeFilter || activeFilter !== "fuel" || !map) return;

    const provinceName = selectedProvince?.name_th ?? "กรุงเทพมหานคร";
    setLoadingStations(true);

    fetchFuelStations(provinceName).then((stations) => {
      setLoadingStations(false);
      const valid = stations.filter(
        (s) => s.latitude && s.longitude && Math.abs(s.latitude) < 90 && Math.abs(s.longitude) < 180
      );
      setStationCount(valid.length);

      valid.forEach((station) => {
        const el = buildMarkerEl(station);
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedStation(station);
        });
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([station.longitude, station.latitude])
          .addTo(map);
        markersRef.current.push(marker);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, selectedProvince?.name_th]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-secondary shadow-sm">
      {/* Filter status bar */}
      {activeFilter && filterLabels[activeFilter] && (
        <div className="absolute top-14 left-0 right-0 z-10 flex justify-center px-4">
          <div className="flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-foreground shadow-lg border border-border">
            {loadingStations && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
            <span>{filterLabels[activeFilter]}</span>
            {activeFilter === "fuel" && stationCount !== null && !loadingStations && (
              <span className="bg-primary/15 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {stationCount} สาขา
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2 lg:gap-3 px-4">
        <Link to="/report" className="flex items-center gap-1.5 rounded-full bg-accent px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity">
          <Megaphone className="h-4 w-4" />แจ้งปัญหา
        </Link>
        <Link to="/help" className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-card px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent shadow-lg hover:bg-accent/5 transition-colors">
          <HelpCircle className="h-4 w-4" />ขอความช่วยเหลือ
        </Link>
        <Link to="/volunteer" className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-card px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent shadow-lg hover:bg-accent/5 transition-colors">
          <HeartHandshake className="h-4 w-4" />ร่วมด้วยช่วยกัน
        </Link>
      </div>

      {/* Map container */}
      <div className="aspect-[16/7] w-full relative">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Station modal (React overlay, not Mapbox popup) */}
        {selectedStation && (
          <StationModal
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />
        )}

        <Link
          to="/map"
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 text-xs font-medium text-foreground shadow hover:bg-card transition-colors"
        >
          <Maximize2 className="h-3.5 w-3.5" />ดูแผนที่
        </Link>
      </div>
    </div>
  );
};

export default CityMapPreview;
