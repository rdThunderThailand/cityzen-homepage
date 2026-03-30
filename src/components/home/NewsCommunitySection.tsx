import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import eventDonation from "@/assets/event-donation.jpg";
import eventCleanup from "@/assets/event-cleanup.jpg";
import newsStorm from "@/assets/news-storm.jpg";
import newsBus from "@/assets/news-bus.jpg";

const items = [
  {
    id: 1,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์นี้ 10.00 น.",
    image: eventDonation,
    link: "/events",
  },
  {
    id: 2,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์นี้ 10.00 น.",
    image: eventCleanup,
    link: "/events",
  },
  {
    id: 3,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์นี้ 10.00 น.",
    image: newsStorm,
    link: "/news",
  },
  {
    id: 4,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์นี้ 10.00 น.",
    image: newsBus,
    link: "/news",
  },
];

const NewsCommunitySection = () => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">ข่าวสารและกิจกรรมชุมชน</h2>
        <Link
          to="/news"
          className="flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          ทั้งหมด <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="group relative overflow-hidden rounded-2xl shadow-md block aspect-[4/3]"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 text-white">
              <h3 className="text-xs lg:text-sm font-bold leading-tight line-clamp-2">{item.title}</h3>
              <p className="mt-0.5 text-[11px] lg:text-xs opacity-80">{item.date}</p>
            </div>
            <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-accent px-2.5 py-1 text-[10px] lg:text-xs font-semibold text-accent-foreground shadow">
                อ่านต่อ
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsCommunitySection;
