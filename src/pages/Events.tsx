import PublicLayout from "@/components/layout/PublicLayout";
import { Calendar, ChevronRight, MapPin, Users } from "lucide-react";
import eventDonation from "@/assets/event-donation.jpg";
import eventCleanup from "@/assets/event-cleanup.jpg";

const events = [
  {
    id: 1,
    title: "รับบริจาคของใช้ให้ผู้ประสบภัย",
    date: "วันเสาร์ที่ 29 มี.ค. 2569 เวลา 10:00 น.",
    location: "ศาลากลางจังหวัด",
    type: "กิจกรรมอาสา",
    image: eventDonation,
    participants: 42,
  },
  {
    id: 2,
    title: "อาสาสมัครทำความสะอาดสวนสาธารณะ",
    date: "26 เม.ย. 2569 เวลา 08:00 น.",
    location: "สวนสาธารณะเทศบาล",
    type: "กิจกรรมอาสา",
    image: eventCleanup,
    participants: 28,
  },
  {
    id: 3,
    title: "ตลาดนัดชุมชน ครั้งที่ 5",
    date: "3 พ.ค. 2569 เวลา 09:00 น.",
    location: "ลานหน้าเทศบาล",
    type: "ปฏิทินกิจกรรม",
    image: eventDonation,
    participants: 120,
  },
];

const Events = () => {
  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">กิจกรรมชุมชน</h1>
          <p className="mt-1 text-sm text-muted-foreground">ปฏิทินกิจกรรม กิจกรรมอาสา และลงทะเบียนเข้าร่วม</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div key={event.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-3">
                <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                  {event.type}
                </span>
                <h2 className="text-base font-bold text-foreground leading-snug">{event.title}</h2>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>{event.participants} คนเข้าร่วม</span>
                  </div>
                </div>
                <button className="w-full mt-2 inline-flex items-center justify-center gap-1 rounded-xl border border-accent bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                  ลงทะเบียนเข้าร่วม <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Events;
