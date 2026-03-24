import PublicLayout from "@/components/layout/PublicLayout";
import { Camera, MapPin, Send, Zap, Droplets, ShieldAlert, Construction } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const problemTypes = [
  { icon: Construction, label: "ถนน / ทางเท้า", value: "road" },
  { icon: Zap, label: "ไฟฟ้า", value: "electric" },
  { icon: Droplets, label: "น้ำ / ท่อ", value: "water" },
  { icon: ShieldAlert, label: "ความปลอดภัย", value: "safety" },
];

const ReportProblem = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <PublicLayout>
      <div className="container py-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">แจ้งปัญหา</h1>
          <p className="mt-1 text-sm text-muted-foreground">แจ้งเหตุ / ปัญหาในพื้นที่เพื่อให้หน่วยงานดำเนินการ</p>
        </div>

        {/* Problem type */}
        <div>
          <label className="mb-2 block text-sm font-medium">ประเภทปัญหา</label>
          <div className="grid grid-cols-2 gap-2">
            {problemTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelected(type.value)}
                className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all ${
                  selected === type.value
                    ? "border-accent bg-accent/10 text-accent"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                <type.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">รายละเอียด</label>
          <Textarea placeholder="อธิบายปัญหาที่พบ..." className="min-h-[100px]" />
        </div>

        {/* Photo & Location */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">แนบรูปภาพ</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
            <MapPin className="h-6 w-6" />
            <span className="text-xs font-medium">ปักพิกัด</span>
          </button>
        </div>

        {/* Submit */}
        <Button className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
          <Send className="h-4 w-4" />
          ส่งเรื่อง
        </Button>
      </div>
    </PublicLayout>
  );
};

export default ReportProblem;
