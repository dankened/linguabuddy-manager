
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
import StudyArea from "./pages/StudyArea";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminStudents from "./pages/AdminStudents";
import ProtectedRoute from "./components/ProtectedRoute";


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
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/materials" element={<Materials />} />
                <Route path="/classes" element={<StudentClasses />} />
                <Route path="/study-area" element={<StudyArea />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Teacher-only routes */}
              <Route element={<ProtectedRoute requireTeacher={true} />}>
                <Route path="/teacher/classes" element={<Classes />} />
                <Route path="/admin/students" element={<AdminStudents />} />
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
