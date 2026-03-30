import { Link } from "react-router-dom";
import { MapPin, Mail, ChevronRight, AlertTriangle } from "lucide-react";

const footerLinks = {
  citizen: {
    title: "ใช้งาน CityZen",
    links: [
      { label: "หน้าแรก", href: "/" },
      { label: "แผนที่เมือง", href: "/city-map" },
      { label: "แจ้งปัญหา", href: "/report-problem" },
      { label: "ขอความช่วยเหลือ", href: "/help" },
      { label: "ข่าวสารสำคัญ", href: "/news" },
      { label: "ช่วยกัน / บริจาค", href: "/volunteer" },
    ],
  },
  agency: {
    title: "สำหรับหน่วยงาน",
    links: [
      { label: "เข้าสู่ระบบ อปท.", href: "#" },
      { label: "City Dashboard", href: "#" },
      { label: "สมัครเข้าร่วม CityZen", href: "#" },
      { label: "ขอ Demo ระบบ", href: "#" },
    ],
  },
  policy: {
    title: "นโยบาย",
    links: [
      { label: "นโยบายความเป็นส่วนตัว", href: "#" },
      { label: "เงื่อนไขการใช้งาน", href: "#" },
      { label: "การใช้ข้อมูล (Data Transparency)", href: "#" },
    ],
  },
  partnership: {
    title: "ความร่วมมือ",
    links: [
      { label: "เทศบาล / อบต.", href: "#" },
      { label: "ภาคเอกชน", href: "#" },
      { label: "อาสาสมัคร", href: "#" },
    ],
  },
};

const FooterLinkColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
  <div>
    <h3 className="text-base font-semibold text-white mb-4">{title}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors group"
          >
            <ChevronRight className="w-3.5 h-3.5 text-accent opacity-70 group-hover:opacity-100 transition-opacity" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[hsl(215,35%,15%)] text-white">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold">CityZen</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              แพลตฟอร์มจากประชาชน เพื่อประชาชน
              <br />
              เชื่อมโยงข้อมูลเมือง
              <br />
              เพื่อการช่วยเหลือและการตัดสินใจที่โปร่งใส
            </p>
            <div className="space-y-2 text-sm text-slate-300 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>ประเทศไทย</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href="mailto:contact@cityzen.asia" className="hover:text-white transition-colors">
                  contact@cityzen.asia
                </a>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent text-sm px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" />
              <span>นะโนาจกะปี กรุงเทพฯ</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 cursor-pointer hover:text-slate-300">เปลี่ยนพื้นที่</p>
          </div>

          {/* Link Columns */}
          <FooterLinkColumn {...footerLinks.citizen} />
          <FooterLinkColumn {...footerLinks.agency} />
          <FooterLinkColumn {...footerLinks.policy} />
          <FooterLinkColumn {...footerLinks.partnership} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-400">
            <span>© 2026 CityZen Platform</span>
            <span className="hidden md:inline">|</span>
            <span>
              Powered by <strong className="text-slate-200">ThunderOS</strong>
            </span>
            <span className="hidden md:inline">|</span>
            <span>Version 0.1 (Citizen Beta)</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Dots / social placeholder */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-slate-500" />
              ))}
            </div>

            {/* Emergency CTA */}
            <button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
              <AlertTriangle className="w-4 h-4" />
              แจ้งเหตุเร่งด่วน
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
