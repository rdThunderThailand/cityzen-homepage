import { MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CityMapPreview = () => {
  return (
    <section className="container">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">แผนที่เมืองของคุณ</h2>
        <Link
          to="/map"
          className="flex items-center gap-1 rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
        >
          ดูเมนูทั้งหมด <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-secondary shadow-sm">
        {/* Map placeholder with styled pins */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a0aec0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          {/* Simulated road lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
            <path d="M0,200 Q200,180 400,225 T800,200" stroke="hsl(var(--warning))" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M100,0 Q150,150 300,250 T500,450" stroke="hsl(var(--warning))" strokeWidth="3" fill="none" opacity="0.4" />
            <path d="M400,0 Q420,200 600,300 T800,350" stroke="hsl(var(--warning))" strokeWidth="2" fill="none" opacity="0.3" />
          </svg>

          {/* Map pins */}
          <div className="absolute top-[25%] left-[20%] flex flex-col items-center">
            <div className="rounded-lg bg-blue-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
          </div>
          <div className="absolute top-[35%] left-[45%] flex flex-col items-center">
            <div className="rounded-lg bg-green-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
          </div>
          <div className="absolute top-[20%] right-[25%] flex flex-col items-center">
            <div className="rounded-lg bg-red-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
          </div>
          <div className="absolute bottom-[30%] left-[35%] flex flex-col items-center">
            <div className="rounded-lg bg-red-500 p-1.5 shadow-md"><MapPin className="h-4 w-4 text-white" /></div>
          </div>
          <div className="absolute top-[45%] right-[35%] flex flex-col items-center">
            <div className="rounded-full bg-amber-500 p-1.5 shadow-md">
              <span className="text-[10px] font-bold text-white">!</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityMapPreview;
