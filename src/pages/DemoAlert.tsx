import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner, { type MapFilter } from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import CommunityEvents from "@/components/home/CommunityEvents";
import NewsSection from "@/components/home/NewsSection";

const alertBanner = (
  <div className="w-full bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-b border-amber-200">
    <div className="container py-3 lg:py-4 flex items-start gap-3">
      <AlertTriangle className="h-6 w-6 lg:h-7 lg:w-7 flex-shrink-0 mt-0.5 text-amber-500" />
      <div className="space-y-0.5">
        <h2 className="text-base lg:text-lg font-bold text-amber-800 tracking-tight">
          เมืองอยู่ในโหมดเฝ้าระวังพลังงาน
        </h2>
        <p className="text-xs lg:text-sm font-normal leading-relaxed text-amber-700/80">
          ขณะนี้สถานการณ์พลังงานและทรัพยากรในบางพื้นที่เริ่มมีความตึงตัว
          เมืองจึงเข้าสู่โหมดเฝ้าระวัง เพื่อให้ประชาชนได้รับข้อมูลที่ถูกต้อง
          และสามารถวางแผนการใช้งานได้อย่างเหมาะสม
        </p>
      </div>
    </div>
  </div>
);

const DemoAlert = () => {
  const [activeFilter, setActiveFilter] = useState<MapFilter>(null);

  return (
    <div className="theme-alert">
      <PublicLayout topBanner={alertBanner}>
        <div className="container py-4 lg:py-6 space-y-4 lg:space-y-6">
          <CityStatusBanner activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          <CityMapPreview activeFilter={activeFilter} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommunityEvents />
            <NewsSection />
          </div>
        </div>
      </PublicLayout>
    </div>
  );
};

export default DemoAlert;
