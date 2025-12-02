import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AuthUser } from "@/hooks/useAuthState";

// Serviço de autenticação e sincronização de dados de usuário

export const fetchUserData = async (authUser: User) => {
  try {
    // 1) Buscar dados básicos da tabela users
    const { data: userData, error: selectError } = await supabase
      .from("users")
      .select("id, email, name, is_active")
      .eq("id", authUser.id)
      .maybeSingle();

    if (selectError) {
      return null;
    }

    // 2) Se o usuário já existe na tabela users, buscar a role na user_roles
    if (userData) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authUser.id)
        .maybeSingle();

      const role = (roleData as any)?.role || "student";

      return {
        ...userData,
        role,
      };
    }

    // 3) Se não encontrou, criar novo registro apenas em users
    const metaName =
      authUser.user_metadata?.name ||
      authUser.email?.split("@")[0] ||
      "Usuário";

    try {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          id: authUser.id,
          email: authUser.email,
          name: metaName,
          // Novos usuários começam como inativos por padrão;
          // a ativação é feita via fluxos administrativos.
          is_active: false,
        })
        .select("id, email, name, is_active")
        .maybeSingle();

      if (insertError || !newUser) {
        return null;
      }

      // A role com privilégios (admin/teacher) deve ser atribuída
      // apenas via fluxos seguros no backend (user_roles).
      return {
        ...newUser,
        role: "student",
      };
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: AuthUser }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    if (data?.user) {
      // Buscar dados estendidos do usuário após login
      const userData = await fetchUserData(data.user);

      if (!userData) {
        return {
          success: false,
          message:
            "Não foi possível carregar os dados do usuário. Tente novamente.",
        };
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email || "",
          name: userData.name,
          role: userData.role as "admin" | "teacher" | "student",
          is_active: userData.is_active,
        },
      };
    }

    return {
      success: false,
      message: "Authentication failed. Please try again.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

export const logoutUser = async () => {
  try {
    // Limpar dados locais de autenticação imediatamente
    localStorage.removeItem("supabase.auth.token");
    localStorage.removeItem("sb-jqnarznabyiyngcdqcff-auth-token");
    sessionStorage.clear();

    // Encerrar sessão global no Supabase
    const { error } = await supabase.auth.signOut({
      scope: "global",
    });

    if (error) {
      // Silenciar erro, pois o estado local já foi limpo
    }

    // Best-effort de limpeza adicional (mantido por compatibilidade)
    try {
      supabase.auth.admin?.deleteUser;
    } catch (e) {
      // Ignorar erros de limpeza
    }

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: string;
}) => {
  try {
    // Verificar se já existe perfil com este e-mail
    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("email", data.email)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        message: "Este email já está em uso",
      };
    }

    // Registrar usuário no Supabase Auth
    const authResponse = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: data.role,
        },
      },
    });

    if (authResponse.error) {
      return {
        success: false,
        message: authResponse.error.message,
      };
    }

    return {
      success: true,
      message: "Registration successful",
      user: authResponse.data.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred during registration",
    };
  }
};
