import { Fuel, Wind, Droplet, AlertTriangle, CheckCircle2 } from "lucide-react";

export type MapFilter = "fuel" | "weather" | "water" | "emergency" | null;

const statusCards: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  bgClass: string;
  activeBgClass: string;
  iconColor: string;
  filter: MapFilter;
}[] = [
  {
    icon: Fuel,
    label: "น้ำมัน",
    value: "35.5",
    unit: "บาท/ลิตร",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-amber-50 to-white border border-amber-100",
    activeBgClass: "bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-400 ring-2 ring-amber-200",
    iconColor: "text-amber-500",
    filter: "fuel",
  },
  {
    icon: Wind,
    label: "สภาพอากาศ",
    value: "3",
    unit: "pg/m8.",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-green-50 to-white border border-green-100",
    activeBgClass: "bg-gradient-to-b from-green-100 to-green-50 border-2 border-green-400 ring-2 ring-green-200",
    iconColor: "text-green-500",
    filter: "weather",
  },
  {
    icon: Droplet,
    label: "น้ำประปา",
    value: "5",
    unit: "pg/m8",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-cyan-50 to-white border border-cyan-100",
    activeBgClass: "bg-gradient-to-b from-cyan-100 to-cyan-50 border-2 border-cyan-400 ring-2 ring-cyan-200",
    iconColor: "text-cyan-500",
    filter: "water",
  },
  {
    icon: AlertTriangle,
    label: "เหตุฉุกเฉิน",
    value: "1",
    unit: "รายการ",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-red-50 to-white border border-red-100",
    activeBgClass: "bg-gradient-to-b from-red-100 to-red-50 border-2 border-red-400 ring-2 ring-red-200",
    iconColor: "text-red-400",
    filter: "emergency",
  },
];

interface CityStatusBannerProps {
  activeFilter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
}

const CityStatusBanner = ({ activeFilter, onFilterChange }: CityStatusBannerProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {statusCards.map((card) => {
        const isActive = activeFilter === card.filter;
        return (
          <button
            key={card.label}
            onClick={() => onFilterChange(isActive ? null : card.filter)}
            className={`relative rounded-2xl ${isActive ? card.activeBgClass : card.bgClass} p-4 lg:p-5 overflow-hidden text-left transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-md`}
          >
            {/* Wave decoration at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-6 opacity-30">
              <svg viewBox="0 0 200 20" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10 T200,10 V20 H0 Z" fill="hsl(210, 80%, 80%)" />
              </svg>
            </div>

            <div className="flex items-start justify-between mb-2">
              <card.icon className={`h-8 w-8 lg:h-10 lg:w-10 ${card.iconColor}`} />
              <div className="text-right">
                <span className="text-2xl lg:text-4xl font-extrabold text-foreground">{card.value}</span>
                <span className="text-xs lg:text-sm font-medium text-muted-foreground ml-0.5">{card.unit}</span>
              </div>
            </div>

            <p className="text-sm lg:text-base font-semibold text-foreground">{card.label}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <CheckCircle2 className={`h-3.5 w-3.5 ${card.statusColor}`} />
              <span className={`text-xs font-medium ${card.statusColor}`}>{card.status}</span>
            </div>

            {isActive && (
              <div className="absolute top-2 right-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CityStatusBanner;
