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

    // Parse and validate payload
    const { email, name, password, classId }: CreateStudentRequest = await req.json();

    // Basic validation with clear messages
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Email é obrigatório e deve ser válido" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!name || name.trim().length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "Nome é obrigatório e deve ter ao menos 2 caracteres" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!password || password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: "A senha deve ter pelo menos 6 caracteres" }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If classId provided, verify class exists (gives a clearer error than FK failure)
    if (classId && classId !== "no-class") {
      const { data: classRow, error: classErr } = await supabaseAdmin
        .from("classes")
        .select("id")
        .eq("id", classId)
        .maybeSingle();

      if (classErr) {
        console.error("Erro ao verificar turma:", classErr);
        return new Response(
          JSON.stringify({ success: false, error: "Erro ao verificar turma" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!classRow) {
        return new Response(
          JSON.stringify({ success: false, error: "Turma não encontrada" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Try to create auth user (student)
    let studentId: string | null = null;
    let createdNewUser = false;

    const { data: created, error: createErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: "student" },
      });

    if (createErr) {
      // If email already exists, try to find existing user in public.users and continue with enrollment
      const duplicate = /already been registered|email.*exists|Email já está em uso/i.test(createErr.message);
      if (duplicate) {
        const { data: existingUser, error: findErr } = await supabaseAdmin
          .from("users")
          .select("id, role")
          .eq("email", email)
          .maybeSingle();

        if (findErr) {
          console.error("Erro ao buscar usuário existente:", findErr);
          return new Response(
            JSON.stringify({ success: false, error: "Email já cadastrado. Erro ao recuperar usuário existente." }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (!existingUser) {
          // Email existe no auth, mas não em public.users – não é seguro prosseguir sem o id
          return new Response(
            JSON.stringify({ success: false, error: "Email já cadastrado. Associe o aluno existente ou use outro email." }),
            { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        studentId = existingUser.id;
      } else {
        return new Response(
          JSON.stringify({ success: false, error: `Erro ao criar usuário: ${createErr.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      if (!created.user) {
        return new Response(
          JSON.stringify({ success: false, error: "Falha ao criar usuário" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      studentId = created.user.id;
      createdNewUser = true;
    }

    // Upsert into public.users and user_profiles to ensure consistency
    if (studentId) {
      const { error: upsertUserErr } = await supabaseAdmin
        .from("users")
        .upsert({
          id: studentId,
          email,
          name,
          role: "student",
          is_active: true,
        }, { onConflict: "id" });

      if (upsertUserErr) {
        // Cleanup: delete auth user if we created it now
        if (createdNewUser) {
          await supabaseAdmin.auth.admin.deleteUser(studentId);
        }
        return new Response(
          JSON.stringify({ success: false, error: `Erro ao salvar perfil do aluno: ${upsertUserErr.message}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Ensure user_profiles exists (idempotent)
      const { error: upsertProfileErr } = await supabaseAdmin
        .from("user_profiles")
        .upsert({ id: studentId, name, email, role: "student" }, { onConflict: "id" });

      if (upsertProfileErr) {
        console.error("Erro ao salvar user_profiles:", upsertProfileErr);
        // Non-fatal: we can continue, but inform the client
      }
    }

    let enrolled = false;
    if (studentId && classId && classId !== "no-class") {
      const { error: enrollErr } = await supabaseAdmin
        .from("enrollments")
        .insert({
          student_id: studentId,
          class_id: classId,
          user_id: caller.id, // admin who created
          status: "active",
        });
      if (!enrollErr) enrolled = true;
      else {
        console.error("Erro ao matricular aluno:", enrollErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, studentId, created: createdNewUser, enrolled }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

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
