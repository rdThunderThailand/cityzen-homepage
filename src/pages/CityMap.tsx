import PublicLayout from "@/components/layout/PublicLayout";
import { MapPin, Hospital, Fuel, Zap, Droplets } from "lucide-react";

const categories = [
  { icon: Hospital, label: "โรงพยาบาล", count: 12, color: "bg-red-500" },
  { icon: Fuel, label: "ปั๊มน้ำมัน", count: 8, color: "bg-amber-500" },
  { icon: Zap, label: "จุดชาร์จ EV", count: 5, color: "bg-blue-500" },
  { icon: Droplets, label: "จุดจ่ายน้ำ", count: 3, color: "bg-cyan-500" },
];

const CityMap = () => {
  return (
    <PublicLayout>
      <div className="container py-4 space-y-4">
        <h1 className="text-xl font-bold text-foreground">แผนที่เมือง</h1>

        {/* Map placeholder */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-secondary">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-12 w-12 opacity-30" />
            <p className="text-sm">แผนที่จะแสดงที่นี่</p>
            <p className="text-xs opacity-60">เชื่อมต่อ API แผนที่เพื่อใช้งานจริง</p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="mb-3 text-base font-semibold">สถานที่สำคัญ</h2>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <div className={`rounded-lg ${cat.color} p-2`}>
                  <cat.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.count} แห่ง</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CityMap;
