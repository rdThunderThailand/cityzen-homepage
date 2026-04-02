import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner, { type MapFilter } from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import CommunityEvents from "@/components/home/CommunityEvents";
import NewsSection from "@/components/home/NewsSection";

const Index = () => {
  const [activeFilter, setActiveFilter] = useState<MapFilter>(null);

  return (
    <PublicLayout>
      <div className="container py-4 lg:py-6 space-y-4 lg:space-y-6">
        <CityStatusBanner activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        <CityMapPreview activeFilter={activeFilter} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CommunityEvents />
          <NewsSection />
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
