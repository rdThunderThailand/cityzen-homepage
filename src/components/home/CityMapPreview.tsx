import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Megaphone, HeartHandshake, HelpCircle, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import type { MapFilter } from "@/components/home/CityStatusBanner";

// ─── Mapbox token ────────────────────────────────────────────────────────────
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

// ─── Thailand GeoJSON (province boundaries) ──────────────────────────────────
const THAILAND_GEOJSON_URL =
  "https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json";

// ─── Province code → English name (matches thailand.json "name" property) ───
const provinceCodeToName: Record<string, string> = {
  "10": "Bangkok Metropolis",
  "11": "Samut Prakan",
  "12": "Nonthaburi",
  "13": "Pathum Thani",
  "14": "Phra Nakhon Si Ayutthaya",
  "15": "Ang Thong",
  "16": "Lop Buri",
  "17": "Sing Buri",
  "18": "Chai Nat",
  "19": "Saraburi",
  "20": "Chon Buri",
  "21": "Rayong",
  "22": "Chanthaburi",
  "23": "Trat",
  "24": "Chachoengsao",
  "25": "Prachin Buri",
  "26": "Nakhon Nayok",
  "27": "Sa Kaeo",
  "30": "Nakhon Ratchasima",
  "31": "Buri Ram",
  "32": "Surin",
  "33": "Si Sa Ket",
  "34": "Ubon Ratchathani",
  "35": "Yasothon",
  "36": "Chaiyaphum",
  "37": "Amnat Charoen",
  "38": "Bueng Kan",
  "39": "Nong Bua Lam Phu",
  "40": "Khon Kaen",
  "41": "Udon Thani",
  "42": "Loei",
  "43": "Nong Khai",
  "44": "Maha Sarakham",
  "45": "Roi Et",
  "46": "Kalasin",
  "47": "Sakon Nakhon",
  "48": "Nakhon Phanom",
  "49": "Mukdahan",
  "50": "Chiang Mai",
  "51": "Lamphun",
  "52": "Lampang",
  "53": "Uttaradit",
  "54": "Phrae",
  "55": "Nan",
  "56": "Phayao",
  "57": "Chiang Rai",
  "58": "Mae Hong Son",
  "60": "Nakhon Sawan",
  "61": "Uthai Thani",
  "62": "Kamphaeng Phet",
  "63": "Tak",
  "64": "Sukhothai",
  "65": "Phitsanulok",
  "66": "Phichit",
  "67": "Phetchabun",
  "70": "Ratchaburi",
  "71": "Kanchanaburi",
  "72": "Suphan Buri",
  "73": "Nakhon Pathom",
  "74": "Samut Sakhon",
  "75": "Samut Songkhram",
  "76": "Phetchaburi",
  "77": "Prachuap Khiri Khan",
  "80": "Nakhon Si Thammarat",
  "81": "Krabi",
  "82": "Phangnga",
  "83": "Phuket",
  "84": "Surat Thani",
  "85": "Ranong",
  "86": "Chumphon",
  "90": "Songkhla",
  "91": "Satun",
  "92": "Trang",
  "93": "Phatthalung",
  "94": "Pattani",
  "95": "Yala",
  "96": "Narathiwat",
};

// ─── Province coordinates ────────────────────────────────────────────────────
const provinceCoords: Record<string, { lat: number; lng: number }> = {
  "10": { lat: 13.7563, lng: 100.5018 },
  "11": { lat: 13.5991, lng: 100.5998 },
  "12": { lat: 13.8621, lng: 100.5144 },
  "13": { lat: 14.0208, lng: 100.5253 },
  "14": { lat: 14.3532, lng: 100.5685 },
  "15": { lat: 14.5896, lng: 100.4555 },
  "16": { lat: 15.6930, lng: 100.1221 },
  "17": { lat: 14.7930, lng: 100.6534 },
  "18": { lat: 15.1580, lng: 100.1260 },
  "19": { lat: 14.5344, lng: 100.9105 },
  "20": { lat: 13.3611, lng: 100.9847 },
  "21": { lat: 12.6814, lng: 101.2810 },
  "22": { lat: 12.6078, lng: 102.1048 },
  "23": { lat: 12.2396, lng: 102.5150 },
  "24": { lat: 13.6904, lng: 101.0779 },
  "25": { lat: 14.0509, lng: 101.3685 },
  "26": { lat: 13.8134, lng: 101.2150 },
  "27": { lat: 13.8240, lng: 102.0645 },
  "30": { lat: 14.9799, lng: 102.0978 },
  "31": { lat: 14.9951, lng: 103.1029 },
  "32": { lat: 14.8818, lng: 103.4936 },
  "33": { lat: 15.1186, lng: 104.3220 },
  "34": { lat: 15.2448, lng: 104.8473 },
  "35": { lat: 15.5727, lng: 104.0651 },
  "36": { lat: 15.8068, lng: 102.0313 },
  "37": { lat: 15.8585, lng: 104.6261 },
  "38": { lat: 17.4138, lng: 102.7874 },
  "39": { lat: 16.9920, lng: 101.1135 },
  "40": { lat: 16.4322, lng: 102.8236 },
  "41": { lat: 17.4138, lng: 102.7874 },
  "42": { lat: 17.4860, lng: 101.7223 },
  "43": { lat: 17.8782, lng: 102.7413 },
  "44": { lat: 16.1862, lng: 103.3006 },
  "45": { lat: 15.9780, lng: 103.6520 },
  "46": { lat: 16.4322, lng: 103.5060 },
  "47": { lat: 17.1545, lng: 104.1348 },
  "48": { lat: 17.3927, lng: 104.7784 },
  "49": { lat: 16.5436, lng: 104.7235 },
  "50": { lat: 18.7883, lng: 98.9853 },
  "51": { lat: 18.5912, lng: 98.6863 },
  "52": { lat: 18.2888, lng: 99.5048 },
  "53": { lat: 17.6256, lng: 100.0993 },
  "54": { lat: 18.1445, lng: 100.1447 },
  "55": { lat: 18.7756, lng: 100.7730 },
  "56": { lat: 19.1664, lng: 99.9019 },
  "57": { lat: 19.9105, lng: 99.8406 },
  "58": { lat: 19.2990, lng: 97.9685 },
  "60": { lat: 15.6930, lng: 100.1221 },
  "61": { lat: 15.3835, lng: 99.5318 },
  "62": { lat: 16.7144, lng: 99.0087 },
  "63": { lat: 16.8840, lng: 99.1258 },
  "64": { lat: 17.0055, lng: 99.8265 },
  "65": { lat: 16.8211, lng: 100.2659 },
  "66": { lat: 16.4322, lng: 100.3489 },
  "67": { lat: 16.4419, lng: 101.1592 },
  "70": { lat: 13.5282, lng: 99.8134 },
  "71": { lat: 14.0227, lng: 99.5328 },
  "72": { lat: 14.4744, lng: 100.1177 },
  "73": { lat: 13.8196, lng: 100.0613 },
  "74": { lat: 13.5475, lng: 100.2744 },
  "75": { lat: 13.4097, lng: 100.0024 },
  "76": { lat: 13.1059, lng: 99.9412 },
  "77": { lat: 11.8118, lng: 99.7972 },
  "80": { lat: 8.4304, lng: 99.9631 },
  "81": { lat: 8.0863, lng: 98.9063 },
  "82": { lat: 8.4511, lng: 98.5260 },
  "83": { lat: 7.8804, lng: 98.3923 },
  "84": { lat: 9.1382, lng: 99.3217 },
  "85": { lat: 9.8138, lng: 98.7583 },
  "86": { lat: 10.4930, lng: 99.1800 },
  "90": { lat: 7.1896, lng: 100.5945 },
  "91": { lat: 6.6238, lng: 100.0673 },
  "92": { lat: 7.5593, lng: 99.6114 },
  "93": { lat: 7.6160, lng: 100.0741 },
  "94": { lat: 6.8700, lng: 101.2500 },
  "95": { lat: 6.5414, lng: 101.2812 },
  "96": { lat: 6.4254, lng: 101.8190 },
};

const DEFAULT_COORDS = { lat: 13.7563, lng: 100.5018 };

const filterLabels: Record<string, string> = {
  fuel:      "🛢️ แสดงปั๊มน้ำมันใกล้เคียง",
  weather:   "🌤️ แสดงสภาพอากาศ",
  water:     "💧 แสดงจุดบริการน้ำประปา",
  emergency: "🚨 แสดงจุดฉุกเฉิน",
};

const filterMarkerEmoji: Record<string, string[]> = {
  fuel:      ["⛽", "🛢️", "⛽"],
  weather:   ["🌤️", "⛅", "🌧️"],
  water:     ["💧", "🚿", "💧"],
  emergency: ["🏥", "🚑", "🔴"],
};

function jitter(base: number, idx: number, scale = 0.025): number {
  const offsets = [-1, 0.4, 1.1, -0.6, 0.9];
  return base + offsets[idx % offsets.length] * scale;
}

interface CityMapPreviewProps {
  activeFilter?: MapFilter;
}

const SOURCE_ID = "province-boundary";
const FILL_LAYER_ID = "province-fill";
const LINE_LAYER_ID = "province-line";

const CityMapPreview = ({ activeFilter }: CityMapPreviewProps) => {
  const { selectedProvince } = useProvince();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapLoadedRef = useRef(false);
  const geojsonLoadedRef = useRef(false);

  const coords = selectedProvince?.code
    ? provinceCoords[selectedProvince.code] || DEFAULT_COORDS
    : DEFAULT_COORDS;

  // ── Apply province filter on line/fill layers ────────────────────────────
  const applyProvinceFilter = useCallback((provinceName: string | null) => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current || !geojsonLoadedRef.current) return;

    const filter = provinceName
      ? ["==", ["get", "name"], provinceName]
      : ["==", "name", "__none__"]; // show nothing if no match

    if (map.getLayer(FILL_LAYER_ID)) map.setFilter(FILL_LAYER_ID, filter);
    if (map.getLayer(LINE_LAYER_ID)) map.setFilter(LINE_LAYER_ID, filter);
  }, []);

  // ── Initialise map (once) ────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [coords.lng, coords.lat],
      zoom: 11,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", async () => {
      mapLoadedRef.current = true;

      // ── Add Thailand province GeoJSON source ─────────────────────────────
      try {
        const res = await fetch(THAILAND_GEOJSON_URL);
        const geojson = await res.json();

        map.addSource(SOURCE_ID, { type: "geojson", data: geojson });

        // Semi-transparent yellow fill
        map.addLayer({
          id: FILL_LAYER_ID,
          type: "fill",
          source: SOURCE_ID,
          paint: {
            "fill-color": "#FACC15",
            "fill-opacity": 0.12,
          },
          filter: ["==", "name", "__none__"], // hidden until province selected
        });

        // Yellow border line
        map.addLayer({
          id: LINE_LAYER_ID,
          type: "line",
          source: SOURCE_ID,
          paint: {
            "line-color": "#FACC15",
            "line-width": 3,
            "line-opacity": 0.95,
          },
          filter: ["==", "name", "__none__"],
        });

        geojsonLoadedRef.current = true;

        // Apply current province immediately
        const code = selectedProvince?.code ?? null;
        const name = code ? provinceCodeToName[code] ?? null : null;
        applyProvinceFilter(name);
      } catch (e) {
        console.warn("Province GeoJSON failed to load", e);
      }
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapLoadedRef.current = false;
      geojsonLoadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fly & update border when province changes ────────────────────────────
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 11, speed: 1.4, curve: 1.4 });

    const code = selectedProvince?.code ?? null;
    const name = code ? provinceCodeToName[code] ?? null : null;
    applyProvinceFilter(name);
  }, [coords.lat, coords.lng, selectedProvince?.code, applyProvinceFilter]);

  // ── Update markers when filter changes ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (!activeFilter) return;

    const emojis = filterMarkerEmoji[activeFilter] ?? [];
    emojis.forEach((emoji, idx) => {
      const el = document.createElement("div");
      el.style.cssText = `
        font-size: 26px; line-height: 1; cursor: pointer;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
        transition: transform 0.15s ease;
      `;
      el.textContent = emoji;
      el.addEventListener("mouseenter", () => { el.style.transform = "scale(1.25)"; });
      el.addEventListener("mouseleave", () => { el.style.transform = "scale(1)"; });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([jitter(coords.lng, idx), jitter(coords.lat, idx + 2)])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [activeFilter, coords.lat, coords.lng]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-secondary shadow-sm">
      {/* Filter indicator */}
      {activeFilter && filterLabels[activeFilter] && (
        <div className="absolute top-14 left-0 right-0 z-10 flex justify-center px-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium text-foreground shadow-lg border border-border">
            {filterLabels[activeFilter]}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-2 lg:gap-3 px-4">
        <Link
          to="/report"
          className="flex items-center gap-1.5 rounded-full bg-accent px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          <Megaphone className="h-4 w-4" />
          แจ้งปัญหา
        </Link>
        <Link
          to="/help"
          className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-card px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent shadow-lg hover:bg-accent/5 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          ขอความช่วยเหลือ
        </Link>
        <Link
          to="/volunteer"
          className="flex items-center gap-1.5 rounded-full border-2 border-accent bg-card px-4 lg:px-5 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-accent shadow-lg hover:bg-accent/5 transition-colors"
        >
          <HeartHandshake className="h-4 w-4" />
          ร่วมด้วยช่วยกัน
        </Link>
      </div>

      {/* Mapbox GL container */}
      <div className="aspect-[16/7] w-full relative">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* ดูแผนที่ button */}
        <Link
          to="/map"
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 text-xs font-medium text-foreground shadow hover:bg-card transition-colors"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          ดูแผนที่
        </Link>
      </div>
    </div>
  );
};

export default CityMapPreview;
