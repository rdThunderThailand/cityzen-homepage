import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import newsStorm from "@/assets/news-storm.jpg";
import newsBus from "@/assets/news-bus.jpg";

const news = [
  {
    id: 1,
    title: "ด่วนค่ะ! พายุฝนเข้าคืนนี้",
    subtitle: "เตรียมรับมือ",
    cta: "อ่านเพิ่มเติม",
    image: newsStorm,
    gradient: "from-blue-900/80 to-blue-700/60",
  },
  {
    id: 2,
    title: "ปรับเส้นทางรถเมล์ใหม่",
    subtitle: "เริ่ม 1 พ.ค. นี้",
    cta: "ดูรายละเอียด",
    image: newsBus,
    gradient: "from-amber-900/80 to-orange-700/60",
  },
];

const NewsSection = () => {
  return (
    <section className="container">
      <h2 className="mb-3 text-lg font-bold text-foreground">ข่าวสารสำคัญ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {news.map((item) => (
          <Link
            key={item.id}
            to="/news"
            className="group relative overflow-hidden rounded-2xl shadow-md aspect-[16/9]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient}`} />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h3 className="text-base font-bold leading-tight">{item.title}</h3>
              <p className="mt-0.5 text-sm opacity-90">{item.subtitle}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                {item.cta} <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
