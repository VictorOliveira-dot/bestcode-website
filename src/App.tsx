
import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import ProfileCompletion from "./pages/ProfileCompletion";
import Enrollment from "./pages/Enrollment";
import PaymentPix from "./pages/PaymentPix";
import PaymentBoleto from "./pages/PaymentBoleto";
import ScrollToTop from "./components/ScrollToTop";

// Páginas de Cursos
import AllCourses from "./pages/courses/AllCourses";
import Complementary from "./pages/courses/Complementary";
import QATraining from "./pages/courses/QATraining";

// Páginas de Admin
import AdminDashboard from "./pages/admin/Dashboard";

// Páginas de Estudante
import StudentDashboard from "./pages/student/Dashboard";
import StudentCourseList from "./pages/student/CourseList";
import StudentProgressDetails from "./pages/student/ProgressDetails";
import StudentSchedule from "./pages/student/Schedule";

// Páginas de Professor
import TeacherDashboard from "./pages/teacher/Dashboard";

// Protected Routes
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ActiveUserRoute from "./components/auth/ActiveUserRoute";

// Tema global
import "./App.css";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/pix" element={<PaymentPix />} />
        <Route path="/payment/boleto" element={<PaymentBoleto />} />

        {/* Mapeando o antigo /profile-completion para /enrollment para quem ainda usa links antigos */}
        <Route path="/profile-completion" element={<Enrollment />} />

        {/* Páginas de cursos */}
        <Route path="/courses" element={<AllCourses />} />
        <Route path="/courses/complementary" element={<Complementary />} />
        <Route path="/courses/qa-training" element={<QATraining />} />

        {/* Rotas protegidas para admin */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Rotas protegidas para estudantes (requer ativação) */}
        <Route path="/student" element={
          <ActiveUserRoute>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          </ActiveUserRoute>
        } />
        <Route path="/student/dashboard" element={
          <ActiveUserRoute>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          </ActiveUserRoute>
        } />
        <Route path="/student/courses" element={
          <ActiveUserRoute>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentCourseList />
            </ProtectedRoute>
          </ActiveUserRoute>
        } />
        <Route path="/student/progress" element={
          <ActiveUserRoute>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProgressDetails />
            </ProtectedRoute>
          </ActiveUserRoute>
        } />
        <Route path="/student/schedule" element={
          <ActiveUserRoute>
            <ProtectedRoute allowedRoles={['student']}>
              <StudentSchedule />
            </ProtectedRoute>
          </ActiveUserRoute>
        } />

        {/* Rotas protegidas para professores */}
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Rota de matrícula - agora é a página para completar perfil (sem requisito de ativação) */}
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/inscricao" element={<Enrollment />} />

        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
