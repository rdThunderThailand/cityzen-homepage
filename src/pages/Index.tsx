import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner from "@/components/home/CityStatusBanner";
import QuickActions from "@/components/home/QuickActions";
import NewsSection from "@/components/home/NewsSection";
import CommunityEvents from "@/components/home/CommunityEvents";

const Index = () => {
  return (
    <PublicLayout>
      <div className="space-y-6 py-4">
        <CityStatusBanner />
        <QuickActions />
        <NewsSection />
        <CommunityEvents />
      </div>
    </PublicLayout>
  );
};

export default Index;
