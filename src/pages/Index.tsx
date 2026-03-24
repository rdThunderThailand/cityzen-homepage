import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import QuickActions from "@/components/home/QuickActions";
import NewsSection from "@/components/home/NewsSection";
import CommunityEvents from "@/components/home/CommunityEvents";

const Index = () => {
  return (
    <PublicLayout>
      <div className="container py-6 space-y-8">
        {/* Hero status row */}
        <CityStatusBanner />

        {/* Two-column: map + quick actions on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CityMapPreview />
          </div>
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>

        {/* Two-column: events + news */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CommunityEvents />
          <NewsSection />
        </div>
      </div>
    </PublicLayout>
  );
};

export default Index;
