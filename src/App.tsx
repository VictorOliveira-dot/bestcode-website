import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
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
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";

// Novas páginas importadas
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import QATraining from "./pages/courses/QATraining";
import Complementary from "./pages/courses/Complementary"; 
import AllCourses from "./pages/courses/AllCourses";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";

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
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminDashboard />} />
              <Route path="/admin/teachers" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminDashboard />} />
              <Route path="/admin/payments" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AdminDashboard />} />
              <Route path="/admin/enrollments" element={<AdminDashboard />} />
              
              {/* Novas rotas */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/courses/qa-training" element={<QATraining />} />
              <Route path="/courses/complementary" element={<Complementary />} />
              <Route path="/courses" element={<AllCourses />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<Index />} /> {/* Usando a página Index que já contém o componente FAQ */}
              
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
