import { useState } from "react";
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
          <div className="rounded-2xl border-2 border-warning bg-warning/10 px-4 py-3 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-warning-foreground font-bold text-lg">!</span>
            <div>
              <p className="text-sm font-bold text-foreground">สถานะ: เฝ้าระวัง (ALERT)</p>
              <p className="text-xs text-muted-foreground">ระบบตรวจพบสถานการณ์ที่ต้องเฝ้าระวังในพื้นที่</p>
            </div>
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
