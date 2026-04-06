import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner, { type MapFilter } from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import CommunityEvents from "@/components/home/CommunityEvents";
import NewsSection from "@/components/home/NewsSection";

const alertBanner = (
  <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white">
    <div className="container py-4 lg:py-5 flex items-start gap-4">
      <AlertTriangle className="h-8 w-8 lg:h-10 lg:w-10 flex-shrink-0 mt-0.5 drop-shadow" />
      <div className="space-y-1">
        <h2 className="text-lg lg:text-xl font-extrabold tracking-tight drop-shadow-sm">
          เมืองอยู่ในโหมดเฝ้าระวังพลังงาน
        </h2>
        <p className="text-sm lg:text-base font-normal leading-relaxed opacity-95">
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
