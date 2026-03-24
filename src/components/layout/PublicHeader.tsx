import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import cityzenLogo from "@/assets/cityzen-logo.png";

const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={cityzenLogo} alt="Cityzen" className="h-8 w-8 object-contain" />
          <span className="text-lg font-bold text-primary">CITYZEN</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
