import { Link } from "react-router-dom";
import cityzenLogo from "@/assets/cityzen-logo.png";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={cityzenLogo} alt="Cityzen" className="h-9 w-9 object-contain" />
            <span className="text-lg font-extrabold text-primary">CityZen</span>
          </Link>
          <span className="hidden sm:inline-block text-sm text-muted-foreground border-l pl-3">
            สวัสดี, คุณสมชาย
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">อัพเดทชีวิตเมืองของคุณ</span>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold text-primary">ส</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
