
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "@/hooks/use-toast";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import DashboardContent from "@/components/admin/DashboardContent";
import DashboardActions from "@/components/admin/DashboardActions";
import { useQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Mock data
const ADMIN_STATS = {
  studentsCount: 35,
  teachersCount: 8,
  coursesCount: 5,
  revenueAmount: "R$ 34.895,00"
};

const AdminDashboardComponent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("students");
  
  if (!user) {
    console.log("No authenticated user found, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'admin') {
    console.log("User is not an admin, redirecting to home");
    return <Navigate to="/" />;
  }

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return ADMIN_STATS;
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

  useEffect(() => {
    if (user) {
      toast({
        title: "Welcome to the admin panel",
        description: `Hello, ${user.name}!`,
      });
    }
  }, [user]);

  const handleTeacherAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['teachers'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const handleClassAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
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

const AdminDashboard = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminDashboardComponent />
    </QueryClientProvider>
  );
};

export default AdminDashboard;
