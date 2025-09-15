
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import DashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";
import { useAdminData } from "@/hooks/admin/useAdminData";
import { ResponsiveDashboardLayout, ResponsiveDashboardMain } from "@/components/ui/responsive-dashboard";

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
    <ResponsiveDashboardLayout>
      <AdminDashboardHeader 
        userName={user?.name || 'Admin'} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <ResponsiveDashboardMain>
        <DashboardActions 
          onTeacherAdded={handleTeacherAdded}
          onClassAdded={handleClassAdded}
          onAdminAdded={() => {
            // Recarregar dados após criar admin
            refetchTeachers();
          }}
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
      </ResponsiveDashboardMain>
    </ResponsiveDashboardLayout>
  );
};

export default AdminDashboard;
