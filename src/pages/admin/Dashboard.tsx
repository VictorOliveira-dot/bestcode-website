
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import DashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Actual dashboard content component
const AdminDashboardComponent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("students");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Fetch dashboard stats using React Query
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        console.log("Fetching admin stats...");
        const [studentsData, teachersData, coursesData] = await Promise.all([
          supabase.rpc('admin_get_students_data'),
          supabase.rpc('admin_get_teachers'),
          supabase.from('classes').select('id', { count: 'exact' })
        ]);

        console.log("Students data:", studentsData);
        console.log("Teachers data:", teachersData);
        console.log("Courses data:", coursesData);

        if (studentsData.error) throw studentsData.error;
        if (teachersData.error) throw teachersData.error;
        if (coursesData.error) throw coursesData.error;

        // Calculate total revenue (this should be replaced with actual revenue calculation)
        const revenue = await supabase
          .from('enrollments')
          .select('id', { count: 'exact' });

        const revenueAmount = revenue.count ? revenue.count * 997 : 0; // Assuming R$ 997 per enrollment

        return {
          studentsCount: studentsData.data?.length || 0,
          teachersCount: teachersData.data?.length || 0,
          coursesCount: coursesData.count || 0,
          revenueAmount: `R$ ${revenueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        };
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
      }
    }
  });

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

  const handleTeacherAdded = () => {
    // Invalidate relevant queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['teachers'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const handleClassAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <DashboardActions 
          onTeacherAdded={handleTeacherAdded} 
          onClassAdded={handleClassAdded} 
        />

        <AdminDashboardCards 
          studentsCount={stats?.studentsCount || 0}
          teachersCount={stats?.teachersCount || 0}
          coursesCount={stats?.coursesCount || 0}
          revenueAmount={stats?.revenueAmount || "R$ 0,00"}
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

// Main component that wraps everything in QueryClientProvider
const AdminDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboardComponent />
    </QueryClientProvider>
  );
};

export default AdminDashboard;
