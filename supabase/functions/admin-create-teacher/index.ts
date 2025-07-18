import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreateTeacherRequest {
  email: string;
  name: string;
  password: string;
  classId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com service role para operações administrativas
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verificar se o usuário atual é admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autorização obrigatório");
    }

    // Verificar o token do usuário atual
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Token inválido");
    }

    // Verificar se o usuário é admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || userData?.role !== "admin") {
      throw new Error("Acesso negado. Apenas administradores podem criar professores.");
    }

    const { email, name, password, classId }: CreateTeacherRequest = await req.json();

    // Validações básicas
    if (!email || !name || !password) {
      throw new Error("Email, nome e senha são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    console.log("Criando professor:", { email, name, classId });

    // Criar usuário usando Supabase Admin SDK
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        role: "teacher"
      },
      email_confirm: true, // Confirmar email automaticamente
    });

    if (createUserError) {
      console.error("Erro ao criar usuário:", createUserError);
      throw new Error(`Erro ao criar usuário: ${createUserError.message}`);
    }

    if (!newUser.user) {
      throw new Error("Falha ao criar usuário");
    }

    console.log("Usuário criado na auth.users:", newUser.user.id);

    // Inserir dados adicionais na tabela public.users
    const { error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: newUser.user.id,
        email: email,
        name: name,
        role: "teacher",
        is_active: true,
      });

    if (insertError) {
      console.error("Erro ao inserir na public.users:", insertError);
      
      // Se falhar, tentar deletar o usuário criado na auth
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      
      throw new Error(`Erro ao criar perfil do professor: ${insertError.message}`);
    }

    console.log("Professor inserido na public.users");

    // Se uma turma foi especificada e não é "none", atribuir o professor à turma
    if (classId && classId !== "none") {
      console.log("Atribuindo professor à turma:", classId);
      
      const { error: classError } = await supabaseAdmin
        .from("classes")
        .update({ teacher_id: newUser.user.id })
        .eq("id", classId)
        .is("teacher_id", null); // Só atualizar se a turma não tiver professor

      if (classError) {
        console.error("Erro ao atribuir turma:", classError);
        // Não falhar aqui, apenas logar o erro
      } else {
        console.log("Professor atribuído à turma com sucesso");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Professor criado com sucesso",
        teacherId: newUser.user.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error: any) {
    console.error("Erro na função admin-create-teacher:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});