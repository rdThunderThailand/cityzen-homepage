import { ChevronRight, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

const news = [
  {
    id: 1,
    title: "แจ้งปิดถนนเพชรบุรีตัดใหม่ ช่วง 25-30 มี.ค.",
    category: "ประกาศ",
    time: "2 ชม. ที่แล้ว",
    urgent: true,
  },
  {
    id: 2,
    title: "เปิดลงทะเบียนตรวจสุขภาพฟรี ประจำเดือนเมษายน",
    category: "สุขภาพ",
    time: "5 ชม. ที่แล้ว",
    urgent: false,
  },
  {
    id: 3,
    title: "ผลการซ่อมแซมท่อประปาในซอยสุขุมวิท 23 แล้วเสร็จ",
    category: "อัปเดต",
    time: "1 วัน ที่แล้ว",
    urgent: false,
  },
];

const NewsSection = () => {
  return (
    <div className="container">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">ข่าวสารและประกาศ</h2>
        <Link to="/news" className="flex items-center text-xs text-accent hover:underline">
          ดูทั้งหมด <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-2.5">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-secondary/50"
          >
            <div className={`mt-0.5 rounded-lg p-2 ${item.urgent ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"}`}>
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.urgent ? "bg-destructive/10 text-destructive" : "bg-secondary text-secondary-foreground"}`}>
                  {item.category}
                </span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
