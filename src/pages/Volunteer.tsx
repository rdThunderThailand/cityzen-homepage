import PublicLayout from "@/components/layout/PublicLayout";
import { Heart, Users, Share2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
  {
    icon: Heart,
    title: "บริจาค",
    desc: "ร่วมบริจาคเงิน สิ่งของ หรืออาหารเพื่อช่วยเหลือผู้ประสบภัย",
    color: "bg-gradient-to-br from-rose-500 to-pink-600",
  },
  {
    icon: Users,
    title: "สมัครอาสาสมัคร",
    desc: "ลงทะเบียนเป็นอาสาสมัครเพื่อช่วยเหลือชุมชนของคุณ",
    color: "bg-gradient-to-br from-emerald-500 to-green-600",
  },
  {
    icon: Share2,
    title: "แชร์ข้อมูล / แจ้งข่าว",
    desc: "แบ่งปันข้อมูลสถานการณ์หรือแจ้งข่าวสารที่เป็นประโยชน์",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
];

const Volunteer = () => {
  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ร่วมด้วยช่วยกัน</h1>
          <p className="mt-1 text-sm text-muted-foreground">เลือกช่องทางที่คุณต้องการมีส่วนร่วม</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((s) => (
            <div key={s.title} className={`${s.color} rounded-2xl p-6 text-white shadow-md`}>
              <s.icon className="h-10 w-10 mb-4 opacity-90" />
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-2 text-sm opacity-90 leading-relaxed">{s.desc}</p>
              <button className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors">
                ดำเนินการ <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Volunteer;
