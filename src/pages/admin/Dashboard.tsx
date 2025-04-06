
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import AdminDashboardContent from "@/components/admin/DashboardContent";

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

  // Redirect if not authenticated or not an admin
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fetch data when component mounts
  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoading(true);
      try {
        // Count students (users with role 'student')
        const { count: studentsCount, error: studentsError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'student');
          
        if (studentsError) throw studentsError;
        
        // Count teachers (users with role 'teacher')
        const { count: teachersCount, error: teachersError } = await supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'teacher');
          
        if (teachersError) throw teachersError;
        
        // Count classes (as courses)
        const { count: coursesCount, error: coursesError } = await supabase
          .from('classes')
          .select('id', { count: 'exact', head: true });
          
        if (coursesError) throw coursesError;
        
        // For now, we'll use a placeholder for revenue
        // In a real app, this would come from a payments table
        
        setStats({
          studentsCount: studentsCount || 0,
          teachersCount: teachersCount || 0,
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
    
    fetchAdminData();
  }, []);

  // Determine active tab based on route
  useEffect(() => {
    // Extract the last part of the pathname
    const path = location.pathname.split('/').pop();
    
    // Map path to tab
    if (path === "dashboard" || path === "admin") {
      setActiveTab("students");
    } else if (path === "students" || path === "teachers" || 
               path === "courses" || path === "payments" || 
               path === "reports" || path === "enrollments") {
      setActiveTab(path);
    }
  }, [location.pathname]);

  // Show welcome toast on load
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
