import { Cloud, Wind, Droplet, AlertTriangle, CheckCircle2 } from "lucide-react";

const statusCards = [
  {
    icon: Cloud,
    label: "น้ำฝน",
    value: "5",
    unit: "มม.",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-blue-50 to-white border border-blue-100",
    iconColor: "text-blue-400",
  },
  {
    icon: Wind,
    label: "สภาพอากาศ",
    value: "3",
    unit: "pg/m8.",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-green-50 to-white border border-green-100",
    iconColor: "text-green-500",
  },
  {
    icon: Droplet,
    label: "น้ำประปา",
    value: "5",
    unit: "pg/m8",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-cyan-50 to-white border border-cyan-100",
    iconColor: "text-cyan-500",
  },
  {
    icon: AlertTriangle,
    label: "เหตุฉุกเฉิน",
    value: "1",
    unit: "รายการ",
    status: "ปกติ",
    statusColor: "text-success",
    bgClass: "bg-gradient-to-b from-red-50 to-white border border-red-100",
    iconColor: "text-red-400",
  },
];

const CityStatusBanner = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {statusCards.map((card) => (
        <div
          key={card.label}
          className={`relative rounded-2xl ${card.bgClass} p-4 lg:p-5 overflow-hidden`}
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
        </div>
      ))}
    </div>
  );
};

export default CityStatusBanner;
