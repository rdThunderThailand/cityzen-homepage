import PublicLayout from "@/components/layout/PublicLayout";
import { Calendar, ChevronRight, MapPin, Users } from "lucide-react";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const Events = () => {
  const { selectedProvince } = useProvince();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events-page", selectedProvince?.id],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("province_id", selectedProvince.id)
        .eq("is_active", true)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProvince,
  });

  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">กิจกรรมชุมชน</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            กิจกรรมในจังหวัด{selectedProvince?.name_th || ""} — ปฏิทินกิจกรรม กิจกรรมอาสา และลงทะเบียนเข้าร่วม
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">ยังไม่มีกิจกรรมในจังหวัดนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div key={event.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  <div className={`h-full w-full bg-gradient-to-br ${event.event_type === "volunteer" ? "from-emerald-500/20 to-green-600/30" : "from-violet-500/20 to-purple-600/30"}`} />
                </div>
                <div className="p-4 space-y-3">
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                    {event.event_type === "volunteer" ? "กิจกรรมอาสา" : "ปฏิทินกิจกรรม"}
                  </span>
                  <h2 className="text-base font-bold text-foreground leading-snug">{event.title}</h2>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{format(new Date(event.event_date), "d MMM yyyy เวลา HH:mm น.", { locale: th })}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>{event.current_participants}/{event.max_participants} คนเข้าร่วม</span>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-2 inline-flex items-center justify-center gap-1 rounded-xl border border-accent bg-accent/5 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                    ลงทะเบียนเข้าร่วม <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default Events;
