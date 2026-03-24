import { Camera, Heart, HelpCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Camera,
    label: "แจ้งปัญหา",
    desc: "ถ่ายรูป ส่งเรื่องทันที",
    path: "/report",
    bg: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    icon: HelpCircle,
    label: "ขอความช่วยเหลือ",
    desc: "ส่งคำขอช่วยเหลือ",
    path: "/help",
    bg: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    icon: Heart,
    label: "ร่วมด้วยช่วยกัน",
    desc: "อาสาสมัคร / บริจาค",
    path: "/volunteer",
    bg: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
];

const QuickActions = () => {
  return (
    <div className="h-full">
      <h2 className="mb-3 text-lg font-bold text-foreground">ปุ่มด่วน</h2>
      <div className="grid grid-cols-1 gap-3 h-[calc(100%-2rem)]">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={`${action.bg} rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-4`}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20">
              <action.icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold">{action.label}</h3>
              <p className="mt-0.5 text-[12px] opacity-80">{action.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
