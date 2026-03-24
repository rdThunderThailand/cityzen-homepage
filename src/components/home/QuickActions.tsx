import { Camera, Heart, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: Camera,
    label: "แจ้งปัญหา",
    desc: "ถ่ายรูป ส่งไลน์เลย",
    path: "/report",
    bg: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  {
    icon: HelpCircle,
    label: "ขอความช่วยเหลือ",
    desc: "ส่องการก้าวข่วยเหลือ",
    path: "/help",
    bg: "bg-gradient-to-r from-amber-500 to-orange-500",
  },
  {
    icon: Heart,
    label: "ร่วมด้วยช่วยกัน",
    desc: "ช่วยเหลือนสังคม",
    path: "/volunteer",
    bg: "bg-gradient-to-r from-emerald-500 to-green-600",
  },
];

const QuickActions = () => {
  return (
    <section className="container">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className={`${action.bg} rounded-2xl p-4 text-white text-center shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold">{action.label}</h3>
            <p className="mt-0.5 text-[11px] opacity-80">{action.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
