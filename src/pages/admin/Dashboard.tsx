import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import AdminDashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";

const AdminDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("students");
  const [stats, setStats] = useState({
    studentsCount: 0,
    teachersCount: 0,
    coursesCount: 0,
    revenueAmount: "R$ 0,00"
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const { data: studentsData, error: studentsError } = await supabase.rpc('admin_get_students_data');
      if (studentsError) throw studentsError;

      const { data: teachersData, error: teachersError } = await supabase.rpc('admin_get_teachers');
      if (teachersError) throw teachersError;

      const { count: coursesCount, error: coursesError } = await supabase
        .from('classes')
        .select('id', { count: 'exact', head: true });
        
      if (coursesError) throw coursesError;
        
      setStats({
        studentsCount: studentsData?.length || 0,
        teachersCount: teachersData?.length || 0,
        coursesCount: coursesCount || 0,
        revenueAmount: "R$ 24.850,00" // Placeholder value
      });
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: error.message || "Ocorreu um erro ao carregar os dados administrativos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    
    if (path === "dashboard" || path === "admin") {
      setActiveTab("students");
    } else if (path === "students" || path === "teachers" || 
               path === "courses" || path === "payments" || 
               path === "reports" || path === "enrollments") {
      setActiveTab(path);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    toast({
      title: "Bem-vindo ao painel de administração",
      description: `Olá, ${user.name}!`,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardActions 
          onTeacherAdded={fetchAdminData} 
          onClassAdded={fetchAdminData} 
        />

        <AdminDashboardCards 
          studentsCount={stats.studentsCount}
          teachersCount={stats.teachersCount}
          coursesCount={stats.coursesCount}
          revenueAmount={stats.revenueAmount}
          onChangeTab={setActiveTab}
        />

        <AdminDashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
