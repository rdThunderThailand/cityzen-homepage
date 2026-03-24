import { Calendar, ChevronRight, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "Big Cleaning Day ชุมชนสะอาด",
    date: "29 มี.ค. 2569",
    location: "สวนลุมพินี",
    participants: 45,
  },
  {
    id: 2,
    title: "อบรมการป้องกันภัยพิบัติ",
    date: "2 เม.ย. 2569",
    location: "ศาลาประชาคม",
    participants: 30,
  },
];

const CommunityEvents = () => {
  return (
    <div className="container">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">กิจกรรมชุมชน</h2>
        <Link to="/events" className="flex items-center text-xs text-accent hover:underline">
          ดูทั้งหมด <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {events.map((event) => (
          <div
            key={event.id}
            className="min-w-[260px] snap-start rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="mb-2 inline-flex rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
              กิจกรรม
            </div>
            <h3 className="text-sm font-semibold text-foreground line-clamp-2">{event.title}</h3>
            <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                <span>{event.participants} คนเข้าร่วม</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityEvents;
