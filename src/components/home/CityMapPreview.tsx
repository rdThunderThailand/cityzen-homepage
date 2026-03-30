import { MapPin, Megaphone, HeartHandshake, HelpCircle, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";

const CityMapPreview = () => {
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

      {/* Map area */}
      <div className="aspect-[16/7] lg:aspect-[16/7] w-full bg-gradient-to-br from-blue-50 to-green-50 relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0aec0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Road lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 350" preserveAspectRatio="none">
          <path d="M0,150 Q200,130 400,175 T800,150" stroke="hsl(215, 50%, 70%)" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M100,0 Q150,120 300,200 T500,350" stroke="hsl(215, 50%, 70%)" strokeWidth="2" fill="none" opacity="0.5" />
          <path d="M500,0 Q520,150 650,220 T800,280" stroke="hsl(215, 50%, 70%)" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M200,350 Q350,250 500,200 T800,100" stroke="hsl(215, 50%, 70%)" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>

        {/* Map pins */}
        <div className="absolute top-[30%] left-[15%]">
          <div className="rounded-full bg-blue-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
        </div>
        <div className="absolute top-[40%] left-[35%]">
          <div className="rounded-full bg-green-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
        </div>
        <div className="absolute top-[25%] right-[30%]">
          <div className="rounded-full bg-red-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
        </div>
        <div className="absolute bottom-[25%] left-[55%]">
          <div className="rounded-full bg-amber-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
        </div>
        <div className="absolute top-[55%] right-[20%]">
          <div className="rounded-full bg-green-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
        </div>

        {/* ดูแผนที่ button */}
        <Link
          to="/map"
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 text-xs font-medium text-foreground shadow hover:bg-card transition-colors"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          ดูแผนที่
        </Link>
      </div>
    </div>
  );
};

export default CityMapPreview;
