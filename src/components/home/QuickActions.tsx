import { AlertTriangle, HelpCircle, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const actions = [
  {
    icon: AlertTriangle,
    label: "แจ้งปัญหา",
    desc: "แจ้งเหตุในพื้นที่",
    path: "/report",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: HelpCircle,
    label: "ขอความช่วยเหลือ",
    desc: "ขอสนับสนุนเร่งด่วน",
    path: "/help",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Heart,
    label: "ร่วมช่วยกัน",
    desc: "บริจาค / อาสา",
    path: "/volunteer",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: MapPin,
    label: "แผนที่เมือง",
    desc: "ดูสถานที่สำคัญ",
    path: "/map",
    gradient: "from-blue-500 to-cyan-500",
  },
];

const QuickActions = () => {
  return (
    <div className="container">
      <h2 className="mb-3 text-base font-semibold text-foreground">บริการด่วน</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group relative overflow-hidden rounded-xl bg-card p-4 shadow-sm border transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${action.gradient} p-2.5`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{action.label}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
