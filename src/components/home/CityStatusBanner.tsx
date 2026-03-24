import { Droplets, Wind, Droplet, AlertTriangle } from "lucide-react";

const statusCards = [
  {
    icon: Droplets,
    label: "น้ำฝน",
    value: "5",
    unit: "มม.",
    bg: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    icon: Wind,
    label: "PM 2.5",
    value: "85",
    unit: "μg/m³",
    badge: "อากาศแย่",
    badgeColor: "bg-orange-400",
    bg: "bg-gradient-to-br from-amber-400 to-orange-500",
  },
  {
    icon: Droplet,
    label: "น้ำประปา",
    value: "ปกติ",
    unit: "",
    badge: "ปกติ",
    badgeColor: "bg-green-500",
    bg: "bg-gradient-to-br from-emerald-400 to-green-600",
  },
  {
    icon: AlertTriangle,
    label: "เหตุฉุกเฉิน",
    value: "",
    unit: "",
    badge: "กำลังดำเนินการ",
    badgeColor: "bg-red-500",
    bg: "bg-gradient-to-br from-red-400 to-rose-600",
  },
];

const CityStatusBanner = () => {
  return (
    <section className="container">
      <h2 className="mb-3 text-lg font-bold text-foreground">สถานการณ์ตอนนี้</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className={`relative rounded-2xl ${card.bg} p-4 text-white overflow-hidden shadow-md`}
          >
            {/* Wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-8 opacity-20">
              <svg viewBox="0 0 200 30" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15 T200,15 V30 H0 Z" fill="white" />
              </svg>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <card.icon className="h-5 w-5 opacity-90" />
              <span className="text-sm font-medium opacity-90">{card.label}</span>
            </div>

            {card.value && (
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{card.value}</span>
                {card.unit && <span className="text-sm opacity-80">{card.unit}</span>}
              </div>
            )}

            {card.badge && (
              <span className={`inline-block mt-1 rounded-full ${card.badgeColor} px-2.5 py-0.5 text-xs font-semibold`}>
                {card.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CityStatusBanner;
