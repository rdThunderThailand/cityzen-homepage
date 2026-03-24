import { Activity, CloudRain, Thermometer, Wind } from "lucide-react";

const statusItems = [
  { icon: Thermometer, label: "อุณหภูมิ", value: "34°C", color: "text-warning" },
  { icon: CloudRain, label: "ฝน", value: "20%", color: "text-accent" },
  { icon: Wind, label: "AQI", value: "52", color: "text-success" },
  { icon: Activity, label: "เหตุการณ์", value: "3 รายการ", color: "text-destructive" },
];

const CityStatusBanner = () => {
  return (
    <div className="container">
      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold opacity-90">สถานการณ์เมือง</h2>
          <span className="flex items-center gap-1 text-xs opacity-75">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse-soft" />
            อัปเดตล่าสุด 5 นาทีที่แล้ว
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {statusItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1 text-center">
              <item.icon className="h-5 w-5 opacity-80" />
              <span className="text-lg font-bold">{item.value}</span>
              <span className="text-[10px] opacity-70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityStatusBanner;
