import { ChevronRight, AlertTriangle, Megaphone, RefreshCw, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useProvince } from "@/contexts/ProvinceContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const categoryConfig: Record<string, { icon: typeof AlertTriangle; badge: string }> = {
  emergency: { icon: AlertTriangle, badge: "bg-red-500/80" },
  announcement: { icon: Megaphone, badge: "bg-amber-500/80" },
  update: { icon: RefreshCw, badge: "bg-blue-500/80" },
  general: { icon: Newspaper, badge: "bg-emerald-500/80" },
};

const NewsSection = () => {
  const { selectedProvince } = useProvince();

  const { data: news = [], isLoading } = useQuery({
    queryKey: ["news-home", selectedProvince?.id],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("province_id", selectedProvince.id)
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .limit(2);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedProvince,
  });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">ข่าวสารสำคัญ</h2>
        <Link to="/news" className="flex items-center gap-1 text-xs font-medium text-accent hover:underline">
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
        ) : news.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">ไม่มีข่าวสารในจังหวัดนี้</p>
        ) : (
          news.map((item) => {
            const config = categoryConfig[item.category] || categoryConfig.general;
            const Icon = config.icon;
            return (
              <Link
                key={item.id}
                to="/news"
                className="group relative overflow-hidden rounded-2xl shadow-md block aspect-[16/9] bg-muted"
              >
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 rounded-full ${config.badge} backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-white`}>
                    <Icon className="h-3 w-3" />
                    {item.category === "emergency" ? "ประกาศฉุกเฉิน" : item.category === "announcement" ? "ข่าวสำคัญ" : item.category === "update" ? "อัปเดต" : "ทั่วไป"}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-base font-bold leading-tight">{item.title}</h3>
                  <p className="mt-0.5 text-sm opacity-90">{item.subtitle}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium">
                    อ่านเพิ่มเติม <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NewsSection;
