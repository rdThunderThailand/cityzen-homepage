import PublicLayout from "@/components/layout/PublicLayout";
import CityStatusBanner from "@/components/home/CityStatusBanner";
import CityMapPreview from "@/components/home/CityMapPreview";
import NewsCommunitySection from "@/components/home/NewsCommunitySection";

const Index = () => {
  return (
    <PublicLayout>
      <div className="container py-4 lg:py-6 space-y-4 lg:space-y-6">
        {/* Status cards row */}
        <CityStatusBanner />

        {/* Full-width map with overlay action buttons */}
        <CityMapPreview />

        {/* Combined news & community events */}
        <NewsCommunitySection />
      </div>
    </PublicLayout>
  );
};

export default Index;
