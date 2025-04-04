
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import AdminDashboardHeader from "@/components/admin/DashboardHeader";
import AdminDashboardCards from "@/components/admin/DashboardCards";
import AdminDashboardContent from "@/components/admin/DashboardContent";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");

  // Redirect if not authenticated or not an admin
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboardHeader userName={user.name} />

      <main className="container-custom py-4 md:py-8 px-2 md:px-0">
        <AdminDashboardCards 
          studentsCount={28}
          teachersCount={5}
          coursesCount={12}
          revenueAmount="R$ 24.850,00"
          onChangeTab={setActiveTab}
        />

        <AdminDashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
