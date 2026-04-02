import PublicLayout from "@/components/layout/PublicLayout";
import { ChevronRight, AlertTriangle, Megaphone, RefreshCw, Newspaper } from "lucide-react";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const categoryConfig: Record<string, { icon: typeof AlertTriangle; label: string; color: string }> = {
  emergency: { icon: AlertTriangle, label: "ประกาศฉุกเฉิน", color: "bg-destructive text-destructive-foreground" },
  announcement: { icon: Megaphone, label: "ข่าวสำคัญ", color: "bg-accent text-accent-foreground" },
  update: { icon: RefreshCw, label: "อัปเดตสถานการณ์", color: "bg-yellow-500 text-white" },
  general: { icon: Newspaper, label: "ทั่วไป", color: "bg-secondary text-secondary-foreground" },
};

const News = () => {
  const { selectedProvince } = useProvince();

  const { data: newsItems = [], isLoading } = useQuery({
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

  return (
    <PublicLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ข่าวสารและประกาศ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ข่าวสารจังหวัด{selectedProvince?.name_th || ""} — ติดตามข่าวสำคัญ ประกาศฉุกเฉิน และอัปเดตสถานการณ์
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : newsItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">ยังไม่มีข่าวสารในจังหวัดนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsItems.map((item) => {
              const config = categoryConfig[item.category] || categoryConfig.general;
              const Icon = config.icon;
              return (
                <article key={item.id} className="group overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <div className={`h-full w-full bg-gradient-to-br ${item.category === "emergency" ? "from-red-500/20 to-red-600/30" : item.category === "announcement" ? "from-amber-500/20 to-orange-600/30" : "from-blue-500/20 to-blue-600/30"}`} />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.color}`}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.published_at), "d MMM yyyy", { locale: th })}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-foreground leading-snug">{item.title}</h2>
                    {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                    <button className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                      อ่านต่อ <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default News;
