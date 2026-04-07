import { useScenario, type ScenarioLevel } from "@/contexts/ScenarioContext";
import { AlertTriangle, ShieldAlert, Lock, X } from "lucide-react";
import { useState } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const SCENARIO_CONFIG: Record<
  Exclude<ScenarioLevel, "normal">,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ElementType;
    iconColor: string;
    defaultMessage: string;
    pulse: boolean;
  }
> = {
  watch: {
    bg: "bg-amber-400",
    border: "border-amber-500",
    text: "text-amber-950",
    icon: AlertTriangle,
    iconColor: "text-amber-800",
    defaultMessage: "เฝ้าระวัง — โปรดติดตามสถานการณ์อย่างใกล้ชิด",
    pulse: false,
  },
  crisis: {
    bg: "bg-red-600",
    border: "border-red-700",
    text: "text-white",
    icon: ShieldAlert,
    iconColor: "text-red-100",
    defaultMessage: "⚠️ วิกฤต — สถานการณ์ฉุกเฉิน กรุณาปฏิบัติตามคำแนะนำ",
    pulse: true,
  },
  lockdown: {
    bg: "bg-slate-950",
    border: "border-slate-800",
    text: "text-slate-100",
    icon: Lock,
    iconColor: "text-slate-300",
    defaultMessage: "🔒 ล็อกดาวน์ — ประกาศสถานการณ์ฉุกเฉินสูงสุด",
    pulse: true,
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ScenarioBanner = () => {
  const { level, metadata, isLoading } = useScenario();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || level === "normal" || dismissed) return null;

  const config = SCENARIO_CONFIG[level as Exclude<ScenarioLevel, "normal">];
  if (!config) return null;

  const Icon = config.icon;
  const message = metadata.message ?? config.defaultMessage;

  return (
    <div
      className={`w-full ${config.bg} ${config.border} border-b relative overflow-hidden`}
      role="alert"
      aria-live="assertive"
    >
      {/* Animated shimmer for crisis/lockdown */}
      {config.pulse && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 80px)",
            animation: "scenarioShimmer 2s linear infinite",
          }}
        />
      )}

      <div className="container relative flex items-center gap-3 py-2.5 px-4">
        {/* Icon */}
        <div className={`shrink-0 ${config.pulse ? "animate-pulse" : ""}`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} strokeWidth={2.5} />
        </div>

        {/* Message */}
        <div className={`flex-1 text-sm font-semibold ${config.text} leading-tight`}>
          {message}
          {metadata.affected_areas && metadata.affected_areas.length > 0 && (
            <span className="ml-2 opacity-75 font-normal">
              พื้นที่: {metadata.affected_areas.join(", ")}
            </span>
          )}
        </div>

        {/* Level badge */}
        <span
          className={`hidden sm:inline-flex shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${config.text} border-current opacity-60`}
        >
          {level}
        </span>

        {/* Dismiss (only for watch level, crisis/lockdown cannot be dismissed) */}
        {level === "watch" && (
          <button
            onClick={() => setDismissed(true)}
            className={`shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors ${config.text}`}
            aria-label="ปิดการแจ้งเตือน"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <style>{`
        @keyframes scenarioShimmer {
          from { transform: translateX(-80px); }
          to   { transform: translateX(80px); }
        }
      `}</style>
    </div>
  );
};

export default ScenarioBanner;
