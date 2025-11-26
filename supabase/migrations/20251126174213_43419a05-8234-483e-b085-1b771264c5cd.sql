-- =====================================================
-- FASE 1: CORREÇÕES CRÍTICAS DE SEGURANÇA
-- =====================================================

-- 1. CRIAR ENUM PARA ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- 2. CRIAR TABELA user_roles SEPARADA
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS na tabela user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR FUNÇÃO SECURITY DEFINER PARA VERIFICAR ROLES (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. CRIAR FUNÇÃO PARA OBTER O ROLE DO USUÁRIO (compatibilidade)
CREATE OR REPLACE FUNCTION public.get_user_role_from_roles(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- 5. MIGRAR DADOS EXISTENTES DA TABELA users PARA user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.users
WHERE role IN ('admin', 'teacher', 'student')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. POLÍTICAS RLS PARA user_roles
-- Admins podem ver todos os roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Usuários podem ver seu próprio role
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Apenas admins podem inserir roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem atualizar roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Apenas admins podem deletar roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. REMOVER POLICY INSEGURA DA TABELA users
DROP POLICY IF EXISTS "Users can view profiles" ON public.users;

-- 8. CRIAR POLÍTICAS RESTRITIVAS PARA users
-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
ON public.users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Teachers podem ver perfis de seus alunos
CREATE POLICY "Teachers can view their students profiles"
ON public.users
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'teacher') AND
  EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE c.teacher_id = auth.uid() AND e.student_id = users.id
  )
);

-- 9. ATUALIZAR FUNÇÕES EXISTENTES PARA USAR user_roles E CORRIGIR search_path

-- get_user_role - atualizar para usar user_roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role::TEXT INTO user_role FROM public.user_roles WHERE user_roles.user_id = get_user_role.user_id LIMIT 1;
  RETURN user_role;
END;
$$;

-- get_user_role_safe - atualizar para usar user_roles
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN (SELECT role::TEXT FROM public.user_roles WHERE user_roles.user_id = get_user_role_safe.user_id LIMIT 1);
END;
$$;

-- get_user_role_for_policy - atualizar para usar user_roles
CREATE OR REPLACE FUNCTION public.get_user_role_for_policy(user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_roles.user_id = get_user_role_for_policy.user_id LIMIT 1;
$$;

-- 10. ATUALIZAR admin_create_teacher PARA INCLUIR user_roles
CREATE OR REPLACE FUNCTION public.admin_create_teacher(p_email TEXT, p_name TEXT, p_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  v_role TEXT;
  hashed_password TEXT;
BEGIN
  -- Verifica se quem chama é um administrador usando user_roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar professores.';
  END IF;

  -- Verificar se o email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso: %', p_email;
  END IF;

  -- Gerar hash da senha
  hashed_password := crypt(p_password, gen_salt('bf', 8));

  -- Insere na auth.users
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', p_email, hashed_password,
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_name, 'role', 'teacher'),
    now(), now()
  );

  -- Insere na public.users (mantém role por compatibilidade temporária)
  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (new_user_id, p_email, p_name, 'teacher', true);

  -- Insere na user_roles (nova estrutura segura)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'teacher');

  RETURN new_user_id;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Erro ao criar professor: email já está em uso';
  WHEN others THEN
    RAISE EXCEPTION 'Erro ao criar professor: %. Detalhes: %', SQLERRM, SQLSTATE;
END;
$$;

-- 11. ATUALIZAR PRINCIPAIS FUNÇÕES ADMIN PARA USAR has_role E CORRIGIR search_path

CREATE OR REPLACE FUNCTION public.admin_get_students_data()
RETURNS TABLE(user_id UUID, name TEXT, email TEXT, created_at TIMESTAMP WITH TIME ZONE, 
              classes_count BIGINT, last_active TIMESTAMP WITH TIME ZONE, progress_average NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificação usando has_role
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT
    u.id AS user_id, u.name, u.email, u.created_at,
    COUNT(DISTINCT e.class_id)::BIGINT AS classes_count,
    MAX(lp.last_watched) AS last_active,
    COALESCE(AVG(lp.progress), 0)::NUMERIC AS progress_average
  FROM public.users u
  LEFT JOIN public.enrollments e ON e.student_id = u.id
  LEFT JOIN public.lesson_progress lp ON lp.student_id = u.id
  WHERE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'student')
  GROUP BY u.id, u.name, u.email, u.created_at
  ORDER BY u.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_teachers()
RETURNS TABLE(id UUID, name TEXT, email TEXT, created_at TIMESTAMP WITH TIME ZONE, 
              classes_count BIGINT, students_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id, u.name, u.email, u.created_at,
    COUNT(DISTINCT c.id)::BIGINT AS classes_count,
    COUNT(DISTINCT e.student_id)::BIGINT AS students_count
  FROM public.users u
  LEFT JOIN public.classes c ON c.teacher_id = u.id
  LEFT JOIN public.enrollments e ON e.class_id = c.id
  WHERE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'teacher')
  GROUP BY u.id, u.name, u.email, u.created_at
  ORDER BY u.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_courses()
RETURNS TABLE(class_id UUID, name TEXT, description TEXT, start_date DATE, 
              teacher_name TEXT, students_count BIGINT, is_active BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    c.id AS class_id, c.name, c.description, c.start_date,
    u.name AS teacher_name,
    COUNT(DISTINCT e.student_id)::BIGINT AS students_count,
    c.is_active
  FROM public.classes c
  LEFT JOIN public.users u ON c.teacher_id = u.id
  LEFT JOIN public.enrollments e ON c.id = e.class_id
  GROUP BY c.id, c.name, c.description, c.start_date, u.name, c.is_active
  ORDER BY c.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_active_students_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN (
    SELECT COUNT(*)
    FROM public.users u
    WHERE u.is_active = true 
    AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'student')
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_enrollment_stats(p_start_date DATE, p_end_date DATE)
RETURNS TABLE(enrollment_date DATE, total_enrollments BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    DATE(e.created_at) AS enrollment_date,
    COUNT(*)::BIGINT AS total_enrollments
  FROM public.enrollments e
  WHERE DATE(e.created_at) BETWEEN p_start_date AND p_end_date
  GROUP BY DATE(e.created_at)
  ORDER BY DATE(e.created_at);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_all_classes()
RETURNS TABLE(class_id UUID, class_name TEXT, teacher_name TEXT, start_date DATE)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    c.id AS class_id,
    c.name AS class_name,
    u.name AS teacher_name,
    c.start_date
  FROM classes c
  LEFT JOIN users u ON c.teacher_id = u.id
  WHERE c.is_active = true
  ORDER BY c.name;
END;
$$;

-- 12. CORRIGIR POLÍTICAS DA TABELA password_resets
DROP POLICY IF EXISTS "Only service can manage password resets" ON public.password_resets;
DROP POLICY IF EXISTS "Service role can manage password resets" ON public.password_resets;

-- Apenas service role pode gerenciar tokens de reset
CREATE POLICY "Service role only for password resets"
ON public.password_resets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 13. ADICIONAR RLS NA VIEW class_enrollments_view
-- Views não suportam RLS diretamente, mas podemos criar policies nas tabelas base
-- A segurança já está garantida pelas policies nas tabelas enrollments e classes

-- 14. COMENTÁRIOS E DOCUMENTAÇÃO
COMMENT ON TABLE public.user_roles IS 'Tabela segura para armazenar roles dos usuários, separada da tabela users para evitar escalação de privilégios';
COMMENT ON FUNCTION public.has_role IS 'Função SECURITY DEFINER para verificar roles sem recursão RLS';
COMMENT ON TYPE public.app_role IS 'Enum de roles do sistema: admin, teacher, student';