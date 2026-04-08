/**
 * CityStatusBanner.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dynamic status cards that reflect the current Thunder Core scenario level.
 * Each card shows different values, colors and severity indicators depending on
 * whether the city is in normal / watch / crisis / lockdown state.
 *
 * Mock data is used until real APIs are wired up per card category.
 */

import { useMemo } from "react";
import { Fuel, Wind, Droplet, AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert } from "lucide-react";
import { useScenario, type ScenarioLevel } from "@/contexts/ScenarioContext";

export type MapFilter = "fuel" | "weather" | "water" | "emergency" | null;

// ─── Types ────────────────────────────────────────────────────────────────────
interface CardData {
  value: string;
  unit: string;
  status: string;
  severity: "ok" | "warn" | "danger" | "critical";
  trend?: "up" | "down" | "stable";
  highlight?: boolean; // pulse attention for this card
}

interface CardConfig {
  id: MapFilter;
  icon: React.ElementType;
  label: string;
  filter: MapFilter;
  accentClass: string;          // border/ring color when active
  iconColorClass: string;       // icon fill color (normal state)
  data: Record<ScenarioLevel, CardData>;
  /** Lower = shown first. Defined per scenario so urgency drives order. */
  priority: Record<ScenarioLevel, number>;
}

// ─── Severity → colour map ────────────────────────────────────────────────────
const SEVERITY_STYLES: Record<CardData["severity"], {
  text: string; icon: React.ElementType; indicator: string
}> = {
  ok:       { text: "text-emerald-600", icon: CheckCircle2,  indicator: "bg-emerald-500" },
  warn:     { text: "text-amber-600",   icon: TrendingUp,    indicator: "bg-amber-500"   },
  danger:   { text: "text-red-500",     icon: AlertTriangle, indicator: "bg-red-500"     },
  critical: { text: "text-red-700",     icon: ShieldAlert,   indicator: "bg-red-700"     },
};

// Gradient backgrounds per severity (card bg when inactive)
const CARD_BG: Record<CardData["severity"], string> = {
  ok:       "bg-gradient-to-b from-slate-50  to-white border border-slate-100",
  warn:     "bg-gradient-to-b from-amber-50  to-white border border-amber-200",
  danger:   "bg-gradient-to-b from-red-50    to-white border border-red-200",
  critical: "bg-gradient-to-b from-red-100   to-red-50  border-2 border-red-400",
};

// ─── Mock data per card × scenario ───────────────────────────────────────────
// priority: lower number = shown first (most urgent / most important right now)
const CARDS: CardConfig[] = [
  {
    id: "fuel",
    icon: Fuel,
    label: "น้ำมัน",
    filter: "fuel",
    accentClass: "border-2 border-amber-400 ring-2 ring-amber-200",
    iconColorClass: "text-amber-500",
    priority: {
      normal:   1, // ราคาน้ำมันคือสิ่งที่คนสนใจสูงสุดในภาวะปกติ
      watch:    2, // ราคาพุ่ง — ยังสำคัญแต่เหตุฉุกเฉินเริ่มมา
      crisis:   2, // น้ำมันขาดแคลน — สำคัญมาก รองจากเหตุฉุกเฉิน
      lockdown: 3, // ปิดบริการแล้ว — รู้แล้ว ไม่ต้องเน้น
    },
    data: {
      normal:   { value: "35.5", unit: "บาท/ลิตร",  status: "ราคาปกติ",        severity: "ok",       trend: "stable" },
      watch:    { value: "42.5", unit: "บาท/ลิตร",  status: "เฝ้าระวัง ราคาสูง", severity: "warn",   trend: "up",    highlight: true },
      crisis:   { value: "67%",  unit: "ขาดแคลน",   status: "วิกฤต! ขาดแคลน",   severity: "danger",  trend: "up",    highlight: true },
      lockdown: { value: "–",    unit: "ปิดบริการ",  status: "ระงับจำหน่าย",      severity: "critical",highlight: true },
    },
  },
  {
    id: "weather",
    icon: Wind,
    label: "คุณภาพอากาศ",
    filter: "weather",
    accentClass: "border-2 border-green-400 ring-2 ring-green-200",
    iconColorClass: "text-green-500",
    priority: {
      normal:   2, // AQI ดี — น้ำมันสำคัญกว่า
      watch:    4, // ยังพอสนใจ แต่มี 3 เรื่องเร่งด่วนกว่า
      crisis:   4, // อันตราย แต่เรื่องฉุกเฉิน น้ำมัน น้ำ เร่งกว่า
      lockdown: 4, // อันตรายมาก — แต่ประชาชนอยู่ใน lockdown แล้ว
    },
    data: {
      normal:   { value: "42",  unit: "AQI",   status: "คุณภาพดี",          severity: "ok"                         },
      watch:    { value: "85",  unit: "AQI",   status: "เริ่มมีผลต่อสุขภาพ",  severity: "warn",   trend: "up"        },
      crisis:   { value: "152", unit: "AQI",   status: "ไม่ดีต่อสุขภาพ",     severity: "danger", trend: "up",  highlight: true  },
      lockdown: { value: "215", unit: "AQI",   status: "อันตรายมาก",          severity: "critical", highlight: true  },
    },
  },
  {
    id: "water",
    icon: Droplet,
    label: "น้ำประปา",
    filter: "water",
    accentClass: "border-2 border-cyan-400 ring-2 ring-cyan-200",
    iconColorClass: "text-cyan-500",
    priority: {
      normal:   3, // ปกติ ไม่มีปัญหา
      watch:    3, // เริ่มลดแรงดัน — น่าติดตาม
      crisis:   3, // หยุดจ่ายหลายโซน — เร่งด่วนมาก รองจากฉุกเฉิน+น้ำมัน
      lockdown: 2, // น้ำสำรอง — สำคัญมากในภาวะ lockdown คนต้องรู้
    },
    data: {
      normal:   { value: "100%", unit: "พร้อมใช้",     status: "จ่ายน้ำปกติ",         severity: "ok"                         },
      watch:    { value: "78%",  unit: "พร้อมใช้",     status: "ลดแรงดัน บางพื้นที่",  severity: "warn",    trend: "down"       },
      crisis:   { value: "12",   unit: "โซนหยุดจ่าย",  status: "หยุดจ่าย หลายพื้นที่", severity: "danger",  trend: "down", highlight: true },
      lockdown: { value: "–",    unit: "สำรองเท่านั้น", status: "จ่ายเฉพาะจุดฉุกเฉิน", severity: "critical", highlight: true  },
    },
  },
  {
    id: "emergency",
    icon: AlertTriangle,
    label: "เหตุฉุกเฉิน",
    filter: "emergency",
    accentClass: "border-2 border-red-400 ring-2 ring-red-200",
    iconColorClass: "text-red-400",
    priority: {
      normal:   4, // ไม่มีเหตุ — ลำดับสุดท้าย
      watch:    1, // มีเหตุ 3 จุด — คนต้องรู้ก่อน
      crisis:   1, // เหตุฉุกเฉิน 24 จุด — สำคัญสุด
      lockdown: 1, // ประกาศฉุกเฉินสูงสุด — สำคัญสุดเสมอ
    },
    data: {
      normal:   { value: "0",  unit: "รายการ", status: "ไม่มีเหตุฉุกเฉิน",    severity: "ok"                         },
      watch:    { value: "3",  unit: "รายการ", status: "กำลังติดตาม",          severity: "warn",    trend: "up"        },
      crisis:   { value: "24", unit: "รายการ", status: "เหตุฉุกเฉินหลายจุด",   severity: "danger",  trend: "up", highlight: true },
      lockdown: { value: "!",  unit: "ประกาศ", status: "สถานการณ์ฉุกเฉินสูงสุด", severity: "critical", highlight: true },
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface CityStatusBannerProps {
  activeFilter: MapFilter;
  onFilterChange: (filter: MapFilter) => void;
}

const CityStatusBanner = ({ activeFilter, onFilterChange }: CityStatusBannerProps) => {
  const { level } = useScenario();

  // Sort cards by priority for the current scenario level.
  // Cards with lower priority number float to the front — most urgent first.
  const sortedCards = useMemo(
    () => [...CARDS].sort((a, b) => a.priority[level] - b.priority[level]),
    [level]
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {sortedCards.map((card) => {
        const isActive = activeFilter === card.filter;
        const data     = card.data[level];
        const severity = SEVERITY_STYLES[data.severity];
        const SeverityIcon = severity.icon;

        const bgClass = isActive
          ? `${CARD_BG[data.severity]} ${card.accentClass}`
          : CARD_BG[data.severity];

        return (
          <button
            key={card.id}
            id={`status-card-${card.id}`}
            onClick={() => onFilterChange(isActive ? null : card.filter)}
            className={`relative rounded-2xl ${bgClass} p-4 lg:p-5 overflow-hidden text-left
              transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:shadow-md`}
          >
            {/* Pulse ring when highlight (crisis/lockdown) */}
            {data.highlight && !isActive && (
              <span className={`absolute inset-0 rounded-2xl ${severity.indicator} opacity-10 animate-pulse`} />
            )}

            {/* Severity dot top-left */}
            <span className={`absolute top-2.5 left-2.5 w-2 h-2 rounded-full ${severity.indicator}
              ${data.severity !== "ok" ? "animate-pulse" : ""}`}
            />

            {/* Active indicator top-right */}
            {isActive && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            )}

            {/* Wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-6 opacity-20">
              <svg viewBox="0 0 200 20" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,10 Q50,0 100,10 T200,10 V20 H0 Z" fill="currentColor" className={severity.text} />
              </svg>
            </div>

            {/* Icon + value row */}
            <div className="flex items-start justify-between mb-2 mt-1">
              <card.icon className={`h-7 w-7 lg:h-9 lg:w-9 transition-colors duration-500 ${
                data.severity === "ok" ? card.iconColorClass : severity.text
              }`} />
              <div className="text-right">
                <span className={`text-2xl lg:text-3xl font-extrabold transition-colors duration-500 ${
                  data.severity !== "ok" ? severity.text : "text-foreground"
                }`}>
                  {data.value}
                </span>
                <span className="text-[10px] lg:text-xs font-medium text-muted-foreground ml-1 block leading-tight">
                  {data.unit}
                </span>
              </div>
            </div>

            {/* Label */}
            <p className="text-sm lg:text-sm font-semibold text-foreground leading-tight">
              {card.label}
            </p>

            {/* Status row */}
            <div className="flex items-center gap-1 mt-1">
              <SeverityIcon className={`h-3.5 w-3.5 shrink-0 ${severity.text}`} />
              <span className={`text-[11px] font-medium leading-tight ${severity.text}`}>
                {data.status}
              </span>
            </div>

            {/* Trend arrow */}
            {data.trend && data.trend !== "stable" && (
              <span className={`absolute bottom-8 right-3 text-xs font-bold ${severity.text}`}>
                {data.trend === "up" ? "↑" : "↓"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CityStatusBanner;


