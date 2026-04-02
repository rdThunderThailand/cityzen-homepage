import { ChevronRight, Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const eventTypeConfig: Record<string, { label: string; gradient: string }> = {
  volunteer: { label: "กิจกรรมอาสา", gradient: "from-accent/90 to-sky-600/70" },
  community: { label: "กิจกรรมชุมชน", gradient: "from-emerald-700/80 to-teal-600/60" },
  education: { label: "อบรม/สัมมนา", gradient: "from-violet-800/80 to-purple-600/60" },
};

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
      return format(new Date(dateStr), "d MMM yyyy", { locale: th });
    } catch {
      return dateStr;
    }
  };

  const config = (type: string) => eventTypeConfig[type] || eventTypeConfig.community;

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
              <div key={i} className="aspect-[16/9] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">ไม่มีกิจกรรมในจังหวัดนี้</p>
        ) : (
          events.map((event) => {
            const cfg = config(event.event_type);
            const progress = event.max_participants
              ? Math.round((event.current_participants / event.max_participants) * 100)
              : 0;

            return (
              <Link
                key={event.id}
                to="/events"
                className="group relative block overflow-hidden rounded-2xl shadow-md aspect-[16/9] bg-muted"
              >
                {/* Background image or gradient */}
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="absolute inset-0 h-full w-full object-cover" />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white">
                    <Users className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-base font-bold leading-tight">{event.title}</h3>
                  {event.description && (
                    <p className="mt-0.5 text-sm opacity-90 line-clamp-1">{event.description}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs opacity-90">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(event.event_date)}
                    </span>
                    {event.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.max_participants && (
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">
                        {event.current_participants}/{event.max_participants} คน
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityEvents;
