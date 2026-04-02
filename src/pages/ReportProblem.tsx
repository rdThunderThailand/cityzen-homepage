import PublicLayout from "@/components/layout/PublicLayout";
import { Camera, MapPin, Send, Zap, Droplets, ShieldAlert, Construction, HelpCircle, Loader2, CheckCircle, X } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProvince } from "@/contexts/ProvinceContext";
import { useDistricts, useSubdistricts } from "@/hooks/useLocationData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const problemTypes = [
  { icon: Construction, label: "ถนน / ทางเท้า", value: "road" as const },
  { icon: Zap, label: "ไฟฟ้า", value: "electric" as const },
  { icon: Droplets, label: "น้ำ / ท่อ", value: "water" as const },
  { icon: ShieldAlert, label: "ความปลอดภัย", value: "safety" as const },
  { icon: HelpCircle, label: "อื่นๆ", value: "other" as const },
];

const ReportProblem = () => {
  const { selectedProvince } = useProvince();
  const [reportType, setReportType] = useState<string | null>(null);
  const [districtId, setDistrictId] = useState<string | undefined>();
  const [subdistrictId, setSubdistrictId] = useState<string | undefined>();
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: districts = [], isLoading: loadingDistricts } = useDistricts(selectedProvince?.id);
  const { data: subdistricts = [], isLoading: loadingSubdistricts } = useSubdistricts(districtId);

  const handleDistrictChange = (value: string) => {
    setDistrictId(value);
    setSubdistrictId(undefined);
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 5;
    const remaining = maxFiles - selectedFiles.length;
    if (remaining <= 0) {
      toast({ title: "แนบรูปได้สูงสุด 5 รูป", variant: "destructive" });
      return;
    }
    const newFiles = files.slice(0, remaining);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((f) => {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("report-images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("report-images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!reportType || !description.trim() || !selectedProvince) {
      toast({ title: "กรุณากรอกข้อมูลให้ครบ", description: "เลือกประเภทปัญหาและอธิบายรายละเอียด", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = selectedFiles.length > 0 ? await uploadImages() : [];

      const { error } = await supabase.from("reports").insert({
        province_id: selectedProvince.id,
        district_id: districtId || null,
        subdistrict_id: subdistrictId || null,
        report_type: reportType as any,
        description: description.trim(),
        image_urls: imageUrls.length > 0 ? imageUrls : null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "ส่งเรื่องสำเร็จ!", description: "เราได้รับแจ้งปัญหาของคุณแล้ว" });
    } catch (err) {
      console.error(err);
      toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถส่งเรื่องได้ กรุณาลองใหม่", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-foreground">ส่งเรื่องสำเร็จ!</h1>
          <p className="text-sm text-muted-foreground">เราได้รับแจ้งปัญหาของคุณแล้ว<br />หน่วยงานจะดำเนินการตรวจสอบ</p>
          <Button onClick={() => { setSubmitted(false); setReportType(null); setDescription(""); setDistrictId(undefined); setSubdistrictId(undefined); setSelectedFiles([]); setPreviews([]); }} variant="outline">
            แจ้งปัญหาเพิ่มเติม
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container py-4 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">แจ้งปัญหา</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            แจ้งเหตุ / ปัญหาในพื้นที่{selectedProvince?.name_th ? ` จ.${selectedProvince.name_th}` : ""} เพื่อให้หน่วยงานดำเนินการ
          </p>
        </div>

        {/* Problem type */}
        <div>
          <label className="mb-2 block text-sm font-medium">ประเภทปัญหา</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {problemTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all ${
                  reportType === type.value
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

        {/* Location: Cascading dropdowns */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">พื้นที่</label>
          
          {/* Province (read-only from context) */}
          <div className="flex items-center gap-2 rounded-lg border bg-secondary/30 p-3 text-sm">
            <MapPin className="h-4 w-4 text-accent shrink-0" />
            <span className="font-medium">{selectedProvince?.name_th || "เลือกจังหวัดจากเมนูด้านบน"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* District */}
            <Select value={districtId} onValueChange={handleDistrictChange} disabled={loadingDistricts}>
              <SelectTrigger>
                <SelectValue placeholder={loadingDistricts ? "กำลังโหลด..." : "เลือกอำเภอ / เขต"} />
              </SelectTrigger>
              <SelectContent className="max-h-[250px]">
                {districts.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name_th}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subdistrict */}
            <Select value={subdistrictId} onValueChange={setSubdistrictId} disabled={!districtId || loadingSubdistricts}>
              <SelectTrigger>
                <SelectValue placeholder={loadingSubdistricts ? "กำลังโหลด..." : "เลือกตำบล / แขวง"} />
              </SelectTrigger>
              <SelectContent className="max-h-[250px]">
                {subdistricts.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name_th} {s.zip_code ? `(${s.zip_code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">รายละเอียด</label>
          <Textarea
            placeholder="อธิบายปัญหาที่พบ..."
            className="min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
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
        <Button
          className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          size="lg"
          onClick={handleSubmit}
          disabled={submitting || !reportType || !description.trim()}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {submitting ? "กำลังส่ง..." : "ส่งเรื่อง"}
        </Button>
      </div>
    </PublicLayout>
  );
};

export default ReportProblem;
