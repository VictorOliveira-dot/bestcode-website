
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Enrollment from "./pages/Enrollment";
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourseList from "./pages/student/CourseList";
import StudentSchedule from "./pages/student/Schedule";
import StudentProgressDetails from "./pages/student/ProgressDetails";
import TeacherDashboard from "./pages/teacher/Dashboard";
import NotFound from "./pages/NotFound";

const App = () => {
  // Instancia o QueryClient dentro do componente
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/enrollment" element={<Enrollment />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/courses" element={<StudentCourseList />} />
              <Route path="/student/schedule" element={<StudentSchedule />} />
              <Route path="/student/progress" element={<StudentProgressDetails />} />
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              {/* ADICIONE TODAS AS ROTAS PERSONALIZADAS ACIMA DA ROTA CATCH-ALL "*" */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
