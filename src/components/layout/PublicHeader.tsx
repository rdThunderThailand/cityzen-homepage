import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, MapPin } from "lucide-react";
import { useState } from "react";
import cityzenLogo from "@/assets/cityzen-logo.png";
import { useProvince } from "@/contexts/ProvinceContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { label: "หน้าหลัก", path: "/" },
  { label: "แผนที่เมือง", path: "/map" },
  { label: "แจ้งปัญหา", path: "/report" },
  { label: "ขอความช่วยเหลือ", path: "/help" },
  { label: "ร่วมด้วยช่วยกัน", path: "/volunteer" },
  { label: "ข่าวสารและกิจกรรมชุมชน", path: "/news" },
];

const PublicHeader = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { provinces, selectedProvince, setSelectedProvince, loading } = useProvince();

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.id === value);
    if (province) setSelectedProvince(province);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 lg:h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={cityzenLogo} alt="Cityzen" className="h-9 w-9 lg:h-10 lg:w-10 object-contain" />
          <span className="text-lg lg:text-xl font-extrabold text-primary">CityZen</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Province selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={selectedProvince?.id ?? ""}
            onValueChange={handleProvinceChange}
            disabled={loading}
          >
            <SelectTrigger className="w-auto gap-2 rounded-full border-border bg-secondary/50 px-3 py-1.5 h-9 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
              <SelectValue placeholder={loading ? "กำลังโหลด..." : "เลือกจังหวัด"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name_th}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-secondary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="lg:hidden border-t bg-card px-4 pb-4 pt-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
};

export default PublicHeader;
