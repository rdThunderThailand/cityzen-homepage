import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import {
  Fuel, Wind, Droplet, AlertTriangle, CheckCircle2, ChevronRight,
  Search, MapPin, Megaphone, Share2, Maximize2,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Alert Banner ─────────────────────────────────────────────────────────────
const AlertBanner = () => (
  <div className="rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 border border-amber-200 px-6 py-4 flex items-center gap-3">
    <AlertTriangle className="h-7 w-7 text-amber-500 flex-shrink-0" />
    <p className="text-base lg:text-lg font-bold text-amber-900">
      เมืองเริ่มมีข้อจำกัดพลังงาน{" "}
      <span className="font-medium text-amber-700">ปรดอดาแผนการใช้งาน</span>
    </p>
  </div>
);

// ─── Status Cards (Alert theme) ───────────────────────────────────────────────
type StatusItem = {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: string;
  statusColor: string;
  statusLabel: string;
  bgClass: string;
  iconColor: string;
};

const statusCards: StatusItem[] = [
  {
    icon: Fuel,
    label: "น้ำมัน",
    value: "35.5",
    unit: "บาท/ลิตร",
    status: "warning",
    statusColor: "text-amber-600",
    statusLabel: "เจิ่มวิกฤต",
    bgClass: "bg-gradient-to-b from-amber-50 to-white border border-amber-200",
    iconColor: "text-amber-500",
  },
  {
    icon: Wind,
    label: "สภาพอากาศ",
    value: "3",
    unit: "pg/m8.",
    status: "normal",
    statusColor: "text-green-600",
    statusLabel: "แจ้มกด",
    bgClass: "bg-gradient-to-b from-green-50 to-white border border-green-100",
    iconColor: "text-green-500",
  },
  {
    icon: Droplet,
    label: "น้ำประปา",
    value: "5",
    unit: "pg/m8",
    status: "normal",
    statusColor: "text-cyan-600",
    statusLabel: "แจ้มกด",
    bgClass: "bg-gradient-to-b from-cyan-50 to-white border border-cyan-100",
    iconColor: "text-cyan-500",
  },
  {
    icon: AlertTriangle,
    label: "เหตุฉุกเฉิน",
    value: "2",
    unit: "รายการ",
    status: "normal",
    statusColor: "text-green-600",
    statusLabel: "เจิ่มกด",
    bgClass: "bg-gradient-to-b from-red-50 to-white border border-red-100",
    iconColor: "text-red-400",
  },
];

const StatusCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
    {statusCards.map((card) => (
      <div
        key={card.label}
        className={`relative rounded-2xl ${card.bgClass} p-4 lg:p-5 overflow-hidden`}
      >
        <div className="flex items-start justify-between mb-2">
          <card.icon className={`h-8 w-8 lg:h-10 lg:w-10 ${card.iconColor}`} />
          <div className="text-right">
            <span className="text-2xl lg:text-4xl font-extrabold text-foreground">{card.value}</span>
            <span className="text-xs lg:text-sm font-medium text-muted-foreground ml-0.5">{card.unit}</span>
          </div>
        </div>
        <p className="text-sm lg:text-base font-semibold text-foreground">{card.label}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {card.status === "warning" ? (
            <AlertTriangle className={`h-3.5 w-3.5 ${card.statusColor}`} />
          ) : (
            <CheckCircle2 className={`h-3.5 w-3.5 ${card.statusColor}`} />
          )}
          <span className={`text-xs font-medium ${card.statusColor}`}>{card.statusLabel}</span>
          {card.status === "warning" && (
            <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
      </div>
    ))}
  </div>
);

// ─── CTA & Action Buttons ────────────────────────────────────────────────────
const ActionBar = () => (
  <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
    {/* Primary CTA */}
    <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-amber-950 shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all">
      <Fuel className="h-5 w-5" />
      เช็กสิทธิ์น้ำมันของฉิน
      <ChevronRight className="h-4 w-4" />
    </button>

    {/* Secondary actions */}
    <div className="flex flex-wrap gap-2">
      <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors">
        <Search className="h-3.5 w-3.5" /> แผนที่เมือง
      </button>
      <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors">
        <MapPin className="h-3.5 w-3.5" /> ค้นหาบ่วยหวั่นใกล้คุน
      </button>
      <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors">
        <MapPin className="h-3.5 w-3.5" /> แผนที่เมือง
        <ChevronRight className="h-3 w-3 rotate-90" />
      </button>
      <button className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted transition-colors">
        <Share2 className="h-3.5 w-3.5" /> รายงานถังวัลมเหลือ
        <ChevronRight className="h-3 w-3 rotate-90" />
      </button>
    </div>
  </div>
);

// ─── Helper text ──────────────────────────────────────────────────────────────
const HelperText = () => (
  <p className="text-sm text-muted-foreground">
    ตรวจสอบสิทธิ์และวางแผนการนำในลิอกว่าให้ดีกิน
  </p>
);

// ─── Mock fuel station markers on map ─────────────────────────────────────────
const fuelStations = [
  { id: 1, brand: "PTT", label: "PTT", detail: "ปำมัน 40%", pct: "40%", x: 62, y: 42, color: "#E31837" },
  { id: 2, brand: "PTT", label: "PTT", detail: "ที่เหิน 40%", pct: "40%", x: 38, y: 58, color: "#E31837" },
  { id: 3, brand: "Bangchak", label: "Bangchak", detail: "เนทง 20%", pct: "20%", x: 55, y: 55, color: "#2E7D32" },
  { id: 4, brand: "Shell", label: "Shell", detail: "เหลือกำมัน", pct: "เลิน\nวอบาามัน", x: 48, y: 68, color: "#FFD100", textColor: "#111" },
];

const MapMockup = () => (
  <div className="relative w-full overflow-hidden rounded-2xl border bg-secondary shadow-sm">
    {/* Static map placeholder */}
    <div className="aspect-[16/7] w-full relative bg-gradient-to-br from-green-100 via-blue-50 to-amber-50">
      {/* Grid pattern to simulate map */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Mock roads */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M10,30 Q30,20 50,50 T90,70" fill="none" stroke="#d4d4d8" strokeWidth="0.8" />
        <path d="M20,80 Q40,60 60,40 T95,20" fill="none" stroke="#d4d4d8" strokeWidth="0.6" />
        <path d="M0,50 Q25,45 50,50 T100,55" fill="none" stroke="#e4e4e7" strokeWidth="1.2" />
        {/* River */}
        <path d="M35,0 Q40,30 45,50 Q50,70 55,100" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
      </svg>

      {/* Place labels */}
      {["TATING", "LANG KORRA", "BSRGNY", "SIIUNAITRAN", "PHRA BOROM", "SANNA"].map((name, i) => (
        <span key={name} className="absolute text-[8px] lg:text-[10px] text-muted-foreground/60 font-medium" style={{
          left: `${15 + i * 14}%`,
          top: `${20 + (i % 3) * 25}%`,
        }}>
          {name}
        </span>
      ))}

      {/* Fuel station markers */}
      {fuelStations.map((s) => (
        <div key={s.id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-100%)" }}>
          {/* Pin */}
          <div className="flex flex-col items-center">
            <div
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 shadow-lg border border-white/80"
              style={{ background: "#fff" }}
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: s.color, color: s.textColor || "#fff" }}>
                ⛽
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground leading-tight">{s.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{s.detail}</p>
              </div>
              <span className="text-lg font-extrabold text-foreground ml-1">{s.pct}</span>
            </div>
            {/* Triangle */}
            <div className="w-3 h-2" style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "#fff",
              marginTop: "-1px",
            }} />
          </div>
        </div>
      ))}

      {/* Announcement overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-amber-900/95 via-amber-900/90 to-amber-900/70 backdrop-blur-sm px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Megaphone className="h-5 w-5 text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm lg:text-base font-bold text-white">ประกาศสถานการณ์ ระดับ 2</h4>
            <p className="text-xs lg:text-sm text-amber-100/90 mt-0.5 leading-relaxed">
              จำกดน้ำมันที่ลุ่มประทงนกวิ่น (วัน.-คน.) หลอลงสุด 20 ลิตร / ลิปตาที่ และ ผู้เมีกอ่าน 1-2 จะได้รับ Priority ในการเติมน้ำมัน
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                🟢 เริ่องสิทธิ์
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                📍 นปริทำ
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-200 font-medium">
                📧 อิออะกลง
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-200 font-medium">ดีก็หมด →</span>
              <button className="flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1.5 text-[11px] font-medium text-white hover:bg-white/25 transition-colors">
                <Share2 className="h-3 w-3" /> ดูมันหมด
              </button>
            </div>
            <button className="flex items-center gap-1 rounded-full bg-amber-400 px-4 py-2 text-xs font-bold text-amber-950 hover:bg-amber-300 transition-colors">
              เช็กสิทธิ์น้ำมันของฉิน
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expand button */}
      <Link
        to="/map"
        className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-lg border bg-card/90 backdrop-blur-sm px-3 py-2 text-xs font-medium text-foreground shadow hover:bg-card transition-colors"
      >
        <Maximize2 className="h-3.5 w-3.5" />ดูแผนที่
      </Link>
    </div>
  </div>
);

// ─── Mock Events ──────────────────────────────────────────────────────────────
const MockEvents = () => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">กิจกรรมเพื่อชุมชน</h2>
      <Link to="/events" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
        ดูทั้งหมด <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
    <div className="space-y-4">
      {[
        { title: "อาสาแจกน้ำดื่มชุมชน", type: "กิจกรรมอาสา", gradient: "from-accent/90 to-sky-600/70" },
        { title: "ซ่อมแซมบ้านผู้สูงอายุ", type: "กิจกรรมชุมชน", gradient: "from-emerald-700/80 to-teal-600/60" },
      ].map((e) => (
        <div key={e.title} className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] bg-muted">
          <div className={`absolute inset-0 bg-gradient-to-br ${e.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
              {e.type}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-base font-bold leading-tight">{e.title}</h3>
            <p className="mt-0.5 text-sm opacity-90">25 เม.ย. 2568 · สวนลุมพินี</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Mock News ────────────────────────────────────────────────────────────────
const MockNews = () => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-foreground">ข่าวสารสำคัญ</h2>
      <Link to="/news" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
        ดูทั้งหมด <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
    <div className="space-y-4">
      {[
        { title: "เตือนภัยน้ำมันขาดแคลนในพื้นที่กรุงเทพ", cat: "ประกาศฉุกเฉิน", badge: "bg-red-500/80" },
        { title: "แผนรับมือสถานการณ์พลังงาน ระดับ 2", cat: "ข่าวสำคัญ", badge: "bg-amber-500/80" },
      ].map((n) => (
        <div key={n.title} className="relative rounded-2xl overflow-hidden shadow-md aspect-[16/9] bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 rounded-full ${n.badge} backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white`}>
              <AlertTriangle className="h-3 w-3" /> {n.cat}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-base font-bold leading-tight">{n.title}</h3>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium">
              อ่านเพิ่มเติม <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
const AlertMockup = () => {
  return (
    <PublicLayout>
      <div className="container py-4 lg:py-6 space-y-4 lg:space-y-6">
        <AlertBanner />
        <StatusCards />
        <ActionBar />
        <HelperText />
        <MapMockup />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MockEvents />
          <MockNews />
        </div>
      </div>
    </PublicLayout>
  );
};

export default AlertMockup;
