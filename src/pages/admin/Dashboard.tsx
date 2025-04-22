
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import DashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";
import { useAdminData } from "@/hooks/admin/useAdminData";

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("students");
  
  const {
    students,
    teachers,
    isLoading,
    refetchStudents,
    refetchTeachers
  } = useAdminData();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Garantir que os dados são do tipo esperado
  const formattedStudents = Array.isArray(students) ? students : [];
  const formattedTeachers = Array.isArray(teachers) ? teachers : [];

  const stats = {
    studentsCount: formattedStudents.length,
    teachersCount: formattedTeachers.length,
    coursesCount: 0, // Implementar depois
    revenueAmount: "R$ 0,00" // Implementar depois
  };

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === "students" || path === "teachers" || 
        path === "courses" || path === "payments" || 
        path === "enrollments" || path === "reports") {
      setActiveTab(path);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      toast({
        title: "Bem-vindo ao painel de administração",
        description: `Olá, ${user.name}!`,
      });
    }
  }, [user]);

  const handleTeacherAdded = () => {
    refetchTeachers();
  };

  const handleClassAdded = () => {
    refetchStudents();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader userName={user?.name || 'Admin'} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardActions 
          onTeacherAdded={handleTeacherAdded} 
          onClassAdded={handleClassAdded} 
        />

        <AdminDashboardCards 
          {...stats}
          onChangeTab={setActiveTab}
        />

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
