import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, AlertTriangle, Megaphone, RefreshCw, Newspaper, Calendar, MapPin, Users, Heart } from "lucide-react";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

type FilterType = "all" | "news" | "events";

const newsCategoryConfig: Record<string, { icon: typeof AlertTriangle; label: string; bg: string; text: string }> = {
  emergency: { icon: AlertTriangle, label: "ฉุกเฉิน", bg: "bg-red-500/10", text: "text-red-600" },
  announcement: { icon: Megaphone, label: "ประกาศ", bg: "bg-amber-500/10", text: "text-amber-600" },
  update: { icon: RefreshCw, label: "อัปเดต", bg: "bg-blue-500/10", text: "text-blue-600" },
  general: { icon: Newspaper, label: "ทั่วไป", bg: "bg-emerald-500/10", text: "text-emerald-600" },
};

const eventTypeConfig: Record<string, { icon: typeof Calendar; label: string; bg: string; text: string }> = {
  volunteer: { icon: Heart, label: "อาสา", bg: "bg-pink-500/10", text: "text-pink-600" },
  community: { icon: Users, label: "ชุมชน", bg: "bg-violet-500/10", text: "text-violet-600" },
};

const News = () => {
  const { selectedProvince } = useProvince();
  const [filter, setFilter] = useState<FilterType>("all");

  const { data: newsItems = [], isLoading: newsLoading } = useQuery({
    queryKey: ["news-page", selectedProvince?.id],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("province_id", selectedProvince.id)
        .eq("is_active", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProvince,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
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

  const isLoading = newsLoading || eventsLoading;

  // Merge and sort
  type CombinedItem = 
    | { type: "news"; date: string; data: (typeof newsItems)[number] }
    | { type: "event"; date: string; data: (typeof events)[number] };

  const combinedItems: CombinedItem[] = [];

  if (filter === "all" || filter === "news") {
    newsItems.forEach((item) =>
      combinedItems.push({ type: "news", date: item.published_at, data: item })
    );
  }
  if (filter === "all" || filter === "events") {
    events.forEach((item) =>
      combinedItems.push({ type: "event", date: item.event_date, data: item })
    );
  }

  combinedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "news", label: "ข่าวสาร" },
    { key: "events", label: "กิจกรรม" },
  ];

  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">ข่าวสารและกิจกรรม</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ข่าวสาร ประกาศ และกิจกรรมชุมชนในจังหวัด{selectedProvince?.name_th || ""}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : combinedItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">ยังไม่มีข้อมูลในจังหวัดนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {combinedItems.map((item) => {
              if (item.type === "news") {
                const news = item.data;
                const config = newsCategoryConfig[news.category] || newsCategoryConfig.general;
                const Icon = config.icon;

                return (
                  <article
                    key={`news-${news.id}`}
                    className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                      {news.image_url ? (
                        <img
                          src={news.image_url}
                          alt={news.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center">
                          <Icon className="h-12 w-12 text-primary/20" />
                        </div>
                      )}
                      {/* Category badge on image */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 rounded-full backdrop-blur-md ${config.bg} border border-white/20 px-2.5 py-1 text-[11px] font-semibold ${config.text}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-card/80 backdrop-blur-md text-[10px] border-0">
                          ข่าวสาร
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(news.published_at), "d MMM yyyy", { locale: th })}
                      </span>
                      <h2 className="text-base font-bold text-foreground leading-snug line-clamp-2">{news.title}</h2>
                      {news.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{news.subtitle}</p>
                      )}
                      <button className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                        อ่านต่อ <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                );
              } else {
                const event = item.data;
                const config = eventTypeConfig[event.event_type] || eventTypeConfig.community;
                const Icon = config.icon;

                return (
                  <article
                    key={`event-${event.id}`}
                    className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-accent/10 via-accent/5 to-primary/10 flex items-center justify-center">
                          <Calendar className="h-12 w-12 text-accent/20" />
                        </div>
                      )}
                      {/* Type badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 rounded-full backdrop-blur-md ${config.bg} border border-white/20 px-2.5 py-1 text-[11px] font-semibold ${config.text}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-card/80 backdrop-blur-md text-[10px] border-0">
                          กิจกรรม
                        </Badge>
                      </div>
                      {/* Date overlay */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg bg-card/90 backdrop-blur-md px-2.5 py-1.5 shadow-sm">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        <span className="text-xs font-semibold text-foreground">
                          {format(new Date(event.event_date), "d MMM yyyy", { locale: th })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h2 className="text-base font-bold text-foreground leading-snug line-clamp-2">{event.title}</h2>
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>{format(new Date(event.event_date), "d MMM yyyy เวลา HH:mm น.", { locale: th })}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}
                        {event.max_participants && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5 shrink-0" />
                            <div className="flex-1">
                              <div className="flex justify-between text-xs mb-1">
                                <span>{event.current_participants}/{event.max_participants} คน</span>
                                <span className="text-accent font-medium">
                                  {Math.round((event.current_participants / event.max_participants) * 100)}%
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-accent transition-all"
                                  style={{ width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button className="w-full inline-flex items-center justify-center gap-1 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                        ลงทะเบียนเข้าร่วม <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                );
              }
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default News;
