import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner, { type MapFilter } from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import CommunityEvents from "@/components/home/CommunityEvents";
import NewsSection from "@/components/home/NewsSection";

const DemoAlert = () => {
  const [activeFilter, setActiveFilter] = useState<MapFilter>(null);

  return (
    <div className="theme-alert">
      <PublicLayout>
        <div className="container py-4 lg:py-6 space-y-4 lg:space-y-6">
          {/* Alert Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 px-6 py-4 flex items-center justify-center gap-3 shadow-sm">
            <AlertTriangle className="h-7 w-7 text-warning flex-shrink-0" />
            <p className="text-base lg:text-lg text-foreground text-center">
              <span className="font-bold">เมืองเริ่มมีข้อจำกัดพลังงาน</span>{" "}
              <span className="font-normal">ปรอดางแผนการใช้งาน</span>
            </p>
          </div>

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
