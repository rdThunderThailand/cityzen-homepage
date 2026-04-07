import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import DemoAlert from "./pages/DemoAlert";
import { ProvinceProvider } from "./contexts/ProvinceContext";
import { ScenarioProvider } from "./contexts/ScenarioContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/map", element: <CityMap /> },
  { path: "/report", element: <ReportProblem /> },
  { path: "/help", element: <Help /> },
  { path: "/me", element: <MyPage /> },
  { path: "/volunteer", element: <Volunteer /> },
  { path: "/news", element: <News /> },
  { path: "/demo-alert", element: <DemoAlert /> },
  { path: "/events", element: <Navigate to="/news" replace /> },
  { path: "*", element: <NotFound /> },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScenarioProvider>
        <ProvinceProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </ProvinceProvider>
      </ScenarioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
