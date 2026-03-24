import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, AlertTriangle, Megaphone, RefreshCw } from "lucide-react";
import newsStorm from "@/assets/news-storm.jpg";
import newsBus from "@/assets/news-bus.jpg";

const newsItems = [
  {
    id: 1,
    title: "ด่วนค่ะ! พายุฝนเข้าคืนนี้",
    subtitle: "เตรียมรับมือ — ประกาศจากศูนย์อุตุนิยมวิทยา",
    category: "ประกาศฉุกเฉิน",
    categoryIcon: AlertTriangle,
    categoryColor: "bg-destructive text-destructive-foreground",
    image: newsStorm,
    date: "24 มี.ค. 2569",
  },
  {
    id: 2,
    title: "ปรับเส้นทางรถเมล์ใหม่",
    subtitle: "เริ่ม 1 พ.ค. นี้ — ดูเส้นทางใหม่ได้ที่นี่",
    category: "ข่าวสำคัญ",
    categoryIcon: Megaphone,
    categoryColor: "bg-accent text-accent-foreground",
    image: newsBus,
    date: "22 มี.ค. 2569",
  },
  {
    id: 3,
    title: "อัปเดตสถานการณ์น้ำท่วม",
    subtitle: "ระดับน้ำลดลงแล้ว — ยังคงเฝ้าระวัง",
    category: "อัปเดตสถานการณ์",
    categoryIcon: RefreshCw,
    categoryColor: "bg-warning text-warning-foreground",
    image: newsStorm,
    date: "21 มี.ค. 2569",
  },
];

const News = () => {
  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ข่าวสารและประกาศ</h1>
          <p className="mt-1 text-sm text-muted-foreground">ติดตามข่าวสำคัญ ประกาศฉุกเฉิน และอัปเดตสถานการณ์</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${item.categoryColor}`}>
                    <item.categoryIcon className="h-3 w-3" />
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <h2 className="text-base font-bold text-foreground leading-snug">{item.title}</h2>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                <button className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                  อ่านต่อ <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default News;
