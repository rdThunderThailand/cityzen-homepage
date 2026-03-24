import PublicLayout from "@/components/layout/PublicLayout";
import { ClipboardList, Bell, MapPin, Settings, User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: ClipboardList, label: "รายการที่แจ้งไว้", desc: "My Requests", path: "/me/requests" },
  { icon: MapPin, label: "พื้นที่ของฉัน", desc: "สถานการณ์ในพื้นที่", path: "/me/area" },
  { icon: Bell, label: "การแจ้งเตือน", desc: "แจ้งเตือนเหตุสำคัญ", path: "/me/notifications" },
  { icon: Settings, label: "การตั้งค่า", desc: "โปรไฟล์ & การเชื่อมต่อ", path: "/me/settings" },
];

const MyPage = () => {
  return (
    <PublicLayout>
      <div className="container py-4 space-y-5">
        {/* Profile card */}
        <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-base font-semibold text-foreground">ยังไม่ได้เข้าสู่ระบบ</h2>
          <p className="mt-1 text-xs text-muted-foreground">เข้าสู่ระบบเพื่อใช้งานได้ครบทุกฟีเจอร์</p>
          <Button className="mt-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            <LogIn className="h-4 w-4" />
            เข้าสู่ระบบ
          </Button>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:bg-secondary/50"
            >
              <div className="rounded-lg bg-secondary p-2">
                <item.icon className="h-4 w-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default MyPage;
