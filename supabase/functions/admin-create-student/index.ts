import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CreateStudentRequest {
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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    // Validate auth header and resolve current user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Token de autorização obrigatório");

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user: caller },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !caller) throw new Error("Token inválido");

    // Ensure caller is admin
    const { data: callerData, error: callerErr } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (callerErr || callerData?.role !== "admin") {
      throw new Error(
        "Acesso negado. Apenas administradores podem criar alunos."
      );
    }

    const { email, name, password, classId }: CreateStudentRequest = await req.json();

    if (!email || !name || !password) {
      throw new Error("Email, nome e senha são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres");
    }

    // Create auth user (student)
    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: "student" },
      });

    if (createErr) throw new Error(`Erro ao criar usuário: ${createErr.message}`);
    if (!created.user) throw new Error("Falha ao criar usuário");

    const studentId = created.user.id;

    // Insert into public.users
    const { error: insertUserErr } = await supabaseAdmin
      .from("users")
      .insert({
        id: studentId,
        email,
        name,
        role: "student",
        is_active: true,
      });

    if (insertUserErr) {
      // Cleanup: delete auth user if public insert fails
      await supabaseAdmin.auth.admin.deleteUser(studentId);
      throw new Error(
        `Erro ao criar perfil do aluno: ${insertUserErr.message}`
      );
    }

    let enrolled = false;
    if (classId && classId !== "no-class") {
      const { error: enrollErr } = await supabaseAdmin
        .from("enrollments")
        .insert({
          student_id: studentId,
          class_id: classId,
          user_id: caller.id, // quem criou (admin)
          status: "active",
        });
      if (!enrollErr) enrolled = true;
    }

    return new Response(
      JSON.stringify({ success: true, studentId, enrolled }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Erro em admin-create-student:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Erro interno" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
