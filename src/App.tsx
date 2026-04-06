import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import CityMap from "./pages/CityMap";
import ReportProblem from "./pages/ReportProblem";
import Help from "./pages/Help";
import MyPage from "./pages/MyPage";
import Volunteer from "./pages/Volunteer";
import News from "./pages/News";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DemoAlert from "./pages/DemoAlert";
import { ProvinceProvider } from "./contexts/ProvinceContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProvinceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/map" element={<CityMap />} />
            <Route path="/report" element={<ReportProblem />} />
            <Route path="/help" element={<Help />} />
            <Route path="/me" element={<MyPage />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Navigate to="/news" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProvinceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
