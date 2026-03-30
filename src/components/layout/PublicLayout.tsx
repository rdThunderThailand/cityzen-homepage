import { ReactNode } from "react";
import MobileBottomNav from "./MobileBottomNav";
import PublicHeader from "./PublicHeader";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicHeader />
      <main className="flex-1 pb-20 lg:pb-8">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default PublicLayout;
