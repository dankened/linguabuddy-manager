
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Classes from "./pages/Classes";
import StudentClasses from "./pages/StudentClasses";
import Calendar from "./pages/Calendar";
import Materials from "./pages/Materials";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes (require authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
                <Route path="/materials" element={<Layout><Materials /></Layout>} />
                <Route path="/classes" element={<Layout><StudentClasses /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
              </Route>
              
              {/* Teacher-only routes */}
              <Route element={<ProtectedRoute requireTeacher={true} />}>
                <Route path="/teacher/classes" element={<Layout><Classes /></Layout>} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
