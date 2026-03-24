import { ReactNode } from "react";
import MobileBottomNav from "./MobileBottomNav";
import PublicHeader from "./PublicHeader";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="pb-20 lg:pb-8">{children}</main>
      <MobileBottomNav />
    </div>
  );
};

export default PublicLayout;
