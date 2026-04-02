import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import { MapPin, Mail, ChevronRight, AlertTriangle, Facebook, MessageCircle } from "lucide-react";
import cityzenLogo from "@/assets/cityzen-logo.png";
import lineQr from "@/assets/line-qr.png";

const footerLinks = {
  citizen: {
    title: "ใช้งาน CityZen",
    links: [
      { label: "หน้าแรก", href: "/" },
      { label: "แผนที่เมือง", href: "/city-map" },
      { label: "แจ้งปัญหา", href: "/report-problem" },
      { label: "ขอความช่วยเหลือ", href: "/help" },
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
    <h3 className="text-base font-semibold text-primary mb-4">{title}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
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
  const { selectedProvince } = useProvince();
  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={cityzenLogo} alt="CityZen" className="h-9 w-9 object-contain" />
              <span className="text-xl font-bold text-primary">CityZen</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              แพลตฟอร์มจากประชาชน เพื่อประชาชน
              <br />
              เชื่อมโยงข้อมูลเมือง เพื่อการช่วยเหลือและการตัดสินใจที่โปร่งใส
            </p>
            <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-destructive" />
                <span>ประเทศไทย</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:contact@cityzen.asia" className="hover:text-primary transition-colors">
                  contact@cityzen.asia
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" />
                <span>{selectedProvince?.name_th || "กรุงเทพมหานคร"}</span>
              </div>
              <a
                href="https://facebook.com/cityzen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-xl border border-border">
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border">
                <img src={lineQr} alt="LINE QR Code" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-[hsl(145,63%,42%)] flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary">LINE OA</p>
                </div>
                <p className="text-xs text-muted-foreground">เพิ่มเพื่อนเพื่อรับแจ้งเตือน</p>
                <p className="text-xs text-muted-foreground">@cityzen</p>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          <FooterLinkColumn {...footerLinks.citizen} />
          <FooterLinkColumn {...footerLinks.agency} />
          <FooterLinkColumn {...footerLinks.policy} />
          <FooterLinkColumn {...footerLinks.partnership} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary">
        <div className="container py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-primary-foreground/70">
            <span>© 2026 CityZen Platform</span>
            <span className="hidden md:inline">|</span>
            <span>
              Powered by <strong className="text-primary-foreground">Thunder</strong>
            </span>
            <span className="hidden md:inline">|</span>
            <span>Version 0.1 (Citizen Beta)</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-primary-foreground/40" />
              ))}
            </div>

            <button className="flex items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors">
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
