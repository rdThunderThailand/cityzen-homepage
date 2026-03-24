import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import QuickActions from "@/components/home/QuickActions";
import NewsSection from "@/components/home/NewsSection";
import CommunityEvents from "@/components/home/CommunityEvents";

const Index = () => {
  return (
    <PublicLayout>
      <div className="space-y-6 py-5">
        <CityStatusBanner />
        <CityMapPreview />
        <QuickActions />
        <CommunityEvents />
        <NewsSection />
      </div>
    </PublicLayout>
  );
};

export default Index;
