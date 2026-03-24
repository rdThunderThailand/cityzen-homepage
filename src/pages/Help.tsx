import PublicLayout from "@/components/layout/PublicLayout";
import { AlertCircle, HeartHandshake, Search } from "lucide-react";
import { Link } from "react-router-dom";

const helpOptions = [
  {
    icon: AlertCircle,
    title: "ขอความช่วยเหลือเร่งด่วน",
    desc: "กรณีฉุกเฉิน ภัยพิบัติ อุบัติเหตุ",
    path: "/help/urgent",
    color: "bg-destructive text-destructive-foreground",
  },
  {
    icon: HeartHandshake,
    title: "ขอสนับสนุนทั่วไป",
    desc: "ร้องขอความช่วยเหลือทั่วไป",
    path: "/help/general",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Search,
    title: "ติดตามสถานะคำขอ",
    desc: "ตรวจสอบสถานะคำร้องที่ยื่นไว้",
    path: "/help/track",
    color: "bg-primary text-primary-foreground",
  },
];

const Help = () => {
  return (
    <PublicLayout>
      <div className="container py-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">ขอความช่วยเหลือ</h1>
          <p className="mt-1 text-sm text-muted-foreground">เลือกประเภทความช่วยเหลือที่ต้องการ</p>
        </div>

        <div className="space-y-3">
          {helpOptions.map((opt) => (
            <Link
              key={opt.path}
              to={opt.path}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`rounded-xl p-3 ${opt.color}`}>
                <opt.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{opt.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Help;
