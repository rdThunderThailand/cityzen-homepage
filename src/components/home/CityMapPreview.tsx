import { Megaphone, HeartHandshake, HelpCircle, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";

// Approximate center coordinates for Thai provinces by code
const provinceCoords: Record<string, { lat: number; lng: number }> = {
  "10": { lat: 13.7563, lng: 100.5018 },  // กรุงเทพ
  "11": { lat: 13.5991, lng: 100.5998 },  // สมุทรปราการ
  "12": { lat: 13.8621, lng: 100.5144 },  // นนทบุรี
  "13": { lat: 14.0208, lng: 100.5253 },  // ปทุมธานี
  "14": { lat: 14.3532, lng: 100.5685 },  // พระนครศรีอยุธยา
  "20": { lat: 13.3611, lng: 100.9847 },  // ชลบุรี
  "50": { lat: 18.7883, lng: 98.9853 },   // เชียงใหม่
  "57": { lat: 19.9105, lng: 99.8406 },   // เชียงราย
  "40": { lat: 16.4322, lng: 102.8236 },  // ขอนแก่น
  "30": { lat: 14.9799, lng: 102.0978 },  // นครราชสีมา
  "83": { lat: 7.8804, lng: 98.3923 },    // ภูเก็ต
  "90": { lat: 7.1896, lng: 100.5945 },   // สงขลา
  "80": { lat: 8.4304, lng: 99.9631 },    // นครศรีธรรมราช
};

const DEFAULT_COORDS = { lat: 13.7563, lng: 100.5018 };

const CityMapPreview = () => {
  const { selectedProvince } = useProvince();

  const coords = selectedProvince?.code
    ? provinceCoords[selectedProvince.code] || DEFAULT_COORDS
    : DEFAULT_COORDS;

  const mapSrc = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=11&output=embed&hl=th`;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border bg-secondary shadow-sm">
      {/* Action buttons overlaid on top */}
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

      {/* Google Maps Embed */}
      <div className="aspect-[16/7] lg:aspect-[16/7] w-full relative">
        <iframe
          src={mapSrc}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          title={`แผนที่ ${selectedProvince?.name_th || "กรุงเทพมหานคร"}`}
        />

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
