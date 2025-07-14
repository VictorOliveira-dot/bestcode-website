
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import DashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";
import { useAdminData } from "@/hooks/admin/useAdminData";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  
  const {
    students,
    teachers,
    courses,
    payments,
    activeStudentsCount,
    totalRevenue,
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
  const formattedCourses = Array.isArray(courses) ? courses : [];
  const formattedPayments = Array.isArray(payments) ? payments : [];

  // Calcular receita total formatada
  const formattedRevenue = `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const stats = {
    studentsCount: activeStudentsCount,
    teachersCount: formattedTeachers.length,
    coursesCount: formattedCourses.length, 
    revenueAmount: formattedRevenue
  };

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
    refetchTeachers();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader 
        userName={user?.name || 'Admin'} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container-custom py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
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
