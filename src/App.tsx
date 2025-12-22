import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loading de páginas para code splitting
const Index = lazy(() => import("./pages/Index"));
const Reviews = lazy(() => import("./pages/Reviews"));
const ReviewDetail = lazy(() => import("./pages/ReviewDetail"));
const Comments = lazy(() => import("./pages/Comments"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Legal = lazy(() => import("./pages/Legal"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/review/:id" element={<ReviewDetail />} />
            <Route path="/review/:id/comments" element={<Comments />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
