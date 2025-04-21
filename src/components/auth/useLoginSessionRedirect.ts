
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useLoginSessionRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error checking session:", error);
          return;
        }
        if (data.session) {
          console.log("Session exists:", data.session.user.id);
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .maybeSingle();
          if (userData && userData.role) {
            if (userData.role === "teacher") {
              navigate("/teacher/dashboard");
            } else if (userData.role === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/student/dashboard");
            }
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      }
    };
    checkSession();
    // Only run at mount
    // eslint-disable-next-line
  }, [navigate]);
}
