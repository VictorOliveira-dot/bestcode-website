
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function useLoginSessionRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Verificando sessão existente...");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          return;
        }
        
        if (data?.session) {
          console.log("Sessão existente encontrada:", data.session.user.id);
          
          // Buscar detalhes do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .maybeSingle();
            
          if (userError) {
            console.error("Erro ao buscar dados do usuário:", userError);
            return;
          }
          
          if (userData?.role) {
            console.log("Redirecionando usuário com papel:", userData.role);
            
            if (userData.role === "teacher") {
              navigate("/teacher/dashboard", { replace: true });
            } else if (userData.role === "admin") {
              navigate("/admin/dashboard", { replace: true });
            } else {
              navigate("/student/dashboard", { replace: true });
            }
          } else {
            console.log("Papel do usuário não encontrado");
          }
        } else {
          console.log("Nenhuma sessão ativa encontrada");
        }
      } catch (err) {
        console.error("Erro ao verificar sessão:", err);
      }
    };
    
    checkSession();
  }, [navigate]);
}
