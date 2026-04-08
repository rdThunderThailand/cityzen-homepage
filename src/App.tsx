import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProvinceProvider } from "./contexts/ProvinceContext";
import { ScenarioProvider } from "./contexts/ScenarioContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary }   from "./components/ErrorBoundary";

// ─── Lazy-loaded pages (code-split per route) ─────────────────────────────────
const Index        = lazy(() => import("./pages/Index"));
const CityMap      = lazy(() => import("./pages/CityMap"));
const ReportProblem= lazy(() => import("./pages/ReportProblem"));
const Help         = lazy(() => import("./pages/Help"));
const MyPage       = lazy(() => import("./pages/MyPage"));
const Volunteer    = lazy(() => import("./pages/Volunteer"));
const News         = lazy(() => import("./pages/News"));
const NotFound     = lazy(() => import("./pages/NotFound"));
const DemoAlert    = lazy(() => import("./pages/DemoAlert"));

// ─── Page loading fallback ────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">กำลังโหลด…</span>
    </div>
  </div>
);

// ─── React Query — global defaults optimised for 100k users ──────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        5 * 60 * 1000,   // 5 min: data stays "fresh" — no background refetch
      gcTime:           30 * 60 * 1000,  // 30 min: keep unused data in memory (reduces re-fetches on navigation)
      retry:            2,               // Retry failed requests max 2 times
      refetchOnWindowFocus: false,       // Don't refetch just because user switched tabs
    },
  },
});

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter(
  [
    { path: "/",        element: <Index /> },
    { path: "/map",     element: <CityMap /> },
    { path: "/report",  element: <ReportProblem /> },
    { path: "/help",    element: <Help /> },
    { path: "/me",      element: <MyPage /> },
    { path: "/volunteer", element: <Volunteer /> },
    { path: "/news",    element: <News /> },
    { path: "/demo-alert", element: <DemoAlert /> },
    { path: "/events",  element: <Navigate to="/news" replace /> },
    { path: "*",        element: <NotFound /> },
  ],
  {
    future: {
      v7_relativeSplatPath:          true,
      v7_fetcherPersist:             true,
      v7_normalizeFormMethod:        true,
      v7_partialHydration:           true,
      v7_skipActionErrorRevalidation:true,
    },
  }
);

// ─── App ──────────────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ScenarioProvider>
        <ProvinceProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <RouterProvider router={router} future={{ v7_startTransition: true }} />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </ProvinceProvider>
      </ScenarioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

