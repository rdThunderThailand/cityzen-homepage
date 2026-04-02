import { ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const CommunityEvents = () => {
  const { selectedProvince } = useProvince();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events-home", selectedProvince?.id],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("province_id", selectedProvince.id)
        .eq("is_active", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true })
        .limit(2);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProvince,
  });

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMM yyyy HH:mm น.", { locale: th });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">กิจกรรมเพื่อชุมชน</h2>
        <Link to="/events" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
          ดูทั้งหมด <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">ไม่มีกิจกรรมในจังหวัดนี้</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="p-3.5">
                <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent mb-2">
                  {event.event_type === "volunteer" ? "กิจกรรมอาสา" : "กิจกรรมชุมชน"}
                </span>
                <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
                {event.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(event.event_date)}</span>
                </div>
                {event.location && (
                  <p className="mt-1 text-xs text-muted-foreground">📍 {event.location}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  {event.max_participants && (
                    <span className="text-xs text-muted-foreground">
                      {event.current_participants}/{event.max_participants} คนเข้าร่วม
                    </span>
                  )}
                  <Link
                    to="/events"
                    className="flex items-center gap-0.5 rounded-full border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    ลงชื่อเข้าร่วม <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityEvents;
