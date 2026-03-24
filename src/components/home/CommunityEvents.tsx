import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import eventDonation from "@/assets/event-donation.jpg";
import eventCleanup from "@/assets/event-cleanup.jpg";

const events = [
  {
    id: 1,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์นี้ 10.00 น.",
    image: eventDonation,
    hasRegister: false,
  },
  {
    id: 2,
    title: "อาสาสมัครทำความสะอาดสวน",
    date: "26 เม.ย.",
    image: eventCleanup,
    hasRegister: true,
  },
];

const CommunityEvents = () => {
  return (
    <section className="container">
      <h2 className="mb-3 text-lg font-bold text-foreground">กิจกรรมเพื่อชุมชน</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="overflow-hidden rounded-2xl border bg-card shadow-sm"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-3.5">
              <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{event.date}</span>
                {event.hasRegister && (
                  <Link
                    to="/events"
                    className="flex items-center gap-0.5 rounded-full border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    ลงชื่อเข้าร่วม <ChevronRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunityEvents;
