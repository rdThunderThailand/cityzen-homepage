import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, MapPin } from "lucide-react";
import { useState } from "react";
import cityzenLogo from "@/assets/cityzen-logo.png";
import { useProvince } from "@/contexts/ProvinceContext";
import { useDistricts, useSubdistricts } from "@/hooks/useLocationData";
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
  const {
    provinces,
    selectedProvince,
    setSelectedProvince,
    selectedDistrict,
    setSelectedDistrict,
    selectedSubdistrict,
    setSelectedSubdistrict,
    loading,
  } = useProvince();

  const { data: districts = [], isLoading: districtsLoading } = useDistricts(selectedProvince?.id);
  const { data: subdistricts = [], isLoading: subdistrictsLoading } = useSubdistricts(selectedDistrict?.id);

  const ALLOWED_CODES = ["10", "20", "66"];
  const visibleProvinces = provinces.filter((p) => ALLOWED_CODES.includes(p.code ?? ""));

  const handleProvinceChange = (value: string) => {
    const province = provinces.find((p) => p.id === value);
    if (province) setSelectedProvince(province);
  };

  const handleDistrictChange = (value: string) => {
    const district = districts.find((d) => d.id === value);
    if (district) setSelectedDistrict(district);
  };

  const handleSubdistrictChange = (value: string) => {
    const sub = subdistricts.find((s) => s.id === value);
    if (sub) setSelectedSubdistrict(sub);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 lg:h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-0.5 shrink-0">
          <img src={cityzenLogo} alt="Cityzen" className="h-20 w-20 lg:h-[90px] lg:w-[90px] object-contain self-center translate-y-1" />
          <span className="text-lg lg:text-xl font-extrabold text-primary -ml-3 -translate-y-0.5">CityZen</span>
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

        {/* Location selectors + actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Province */}
          <Select
            value={selectedProvince?.id ?? ""}
            onValueChange={handleProvinceChange}
            disabled={loading}
          >
            <SelectTrigger className="w-auto gap-1.5 rounded-full border-border bg-secondary/50 px-3 py-1.5 h-9 text-sm font-medium">
              <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
              <SelectValue placeholder={loading ? "กำลังโหลด..." : "จังหวัด"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {visibleProvinces.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name_th}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District */}
          <Select
            value={selectedDistrict?.id ?? ""}
            onValueChange={handleDistrictChange}
            disabled={!selectedProvince || districtsLoading}
          >
            <SelectTrigger className="w-auto gap-1.5 rounded-full border-border bg-secondary/50 px-2.5 py-1.5 h-9 text-sm font-medium hidden lg:flex">
              <SelectValue placeholder={districtsLoading ? "โหลด..." : "อำเภอ/เขต"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name_th}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Subdistrict */}
          <Select
            value={selectedSubdistrict?.id ?? ""}
            onValueChange={handleSubdistrictChange}
            disabled={!selectedDistrict || subdistrictsLoading}
          >
            <SelectTrigger className="w-auto gap-1.5 rounded-full border-border bg-secondary/50 px-2.5 py-1.5 h-9 text-sm font-medium hidden lg:flex">
              <SelectValue placeholder={subdistrictsLoading ? "โหลด..." : "ตำบล/แขวง"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {subdistricts.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name_th}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Testing banner */}
          <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full hidden lg:inline-block">
            อยู่ระหว่างทดสอบระบบ
          </span>

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
          {/* Mobile location selectors */}
          <div className="flex gap-2 pb-2 border-b border-border mb-2">
            <Select
              value={selectedDistrict?.id ?? ""}
              onValueChange={handleDistrictChange}
              disabled={!selectedProvince || districtsLoading}
            >
              <SelectTrigger className="flex-1 h-9 text-sm rounded-lg">
                <SelectValue placeholder="อำเภอ/เขต" />
              </SelectTrigger>
              <SelectContent className="max-h-[250px]">
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name_th}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedSubdistrict?.id ?? ""}
              onValueChange={handleSubdistrictChange}
              disabled={!selectedDistrict || subdistrictsLoading}
            >
              <SelectTrigger className="flex-1 h-9 text-sm rounded-lg">
                <SelectValue placeholder="ตำบล/แขวง" />
              </SelectTrigger>
              <SelectContent className="max-h-[250px]">
                {subdistricts.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name_th}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
