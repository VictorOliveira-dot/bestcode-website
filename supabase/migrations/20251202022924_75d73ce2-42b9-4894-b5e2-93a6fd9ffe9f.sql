-- Corrigir as últimas 5 funções com Function Search Path Mutable

-- Funções admin de pagamentos e receita
CREATE OR REPLACE FUNCTION public.admin_get_payments()
RETURNS TABLE(
  id uuid, 
  student_name text, 
  student_email text, 
  course_name text, 
  amount numeric, 
  payment_date timestamp with time zone, 
  payment_method text, 
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    e.id as id,
    u.name as student_name,
    u.email as student_email,
    c.name as course_name,
    997.00::numeric as amount,
    e.created_at as payment_date,
    'credit_card'::text as payment_method,
    e.status
  FROM public.enrollments e
  JOIN public.users u ON e.student_id = u.id
  JOIN public.classes c ON e.class_id = c.id
  ORDER BY e.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_revenue_data(
  p_group_by text DEFAULT 'all'::text, 
  p_start_date date DEFAULT NULL::date, 
  p_end_date date DEFAULT NULL::date
)
RETURNS TABLE(
  class_id uuid, 
  class_name text, 
  total_revenue numeric, 
  total_students bigint, 
  month_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_start_date date;
  v_end_date date;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  v_start_date := COALESCE(p_start_date, date_trunc('month', current_date - interval '11 months')::date);
  v_end_date := COALESCE(p_end_date, current_date);
  
  IF p_group_by = 'month' THEN
    RETURN QUERY
    SELECT 
      NULL::uuid as class_id,
      'Todos os cursos'::text as class_name,
      COUNT(e.id) * 997.00 as total_revenue,
      COUNT(DISTINCT e.student_id)::bigint as total_students,
      date_trunc('month', e.enrollment_date)::date as month_date
    FROM public.enrollments e
    WHERE e.enrollment_date BETWEEN v_start_date AND v_end_date
    GROUP BY date_trunc('month', e.enrollment_date)::date
    ORDER BY month_date DESC;
  
  ELSIF p_group_by = 'class' THEN
    RETURN QUERY
    SELECT 
      c.id as class_id,
      c.name as class_name,
      COUNT(e.id) * 997.00 as total_revenue,
      COUNT(DISTINCT e.student_id)::bigint as total_students,
      NULL::date as month_date
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE e.enrollment_date BETWEEN v_start_date AND v_end_date
    GROUP BY c.id, c.name
    ORDER BY total_revenue DESC;
  
  ELSE
    RETURN QUERY
    SELECT 
      NULL::uuid as class_id,
      'Receita Total'::text as class_name,
      COUNT(e.id) * 997.00 as total_revenue,
      COUNT(DISTINCT e.student_id)::bigint as total_students,
      NULL::date as month_date
    FROM public.enrollments e
    WHERE e.enrollment_date BETWEEN v_start_date AND v_end_date;
  END IF;
END;
$$;

-- Funções de professores (admin)
CREATE OR REPLACE FUNCTION public.admin_get_teachers()
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  created_at timestamp with time zone, 
  classes_count bigint, 
  students_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    COUNT(DISTINCT c.id)::bigint as classes_count,
    COUNT(DISTINCT e.student_id)::bigint as students_count
  FROM public.users u
  LEFT JOIN public.classes c ON u.id = c.teacher_id
  LEFT JOIN public.enrollments e ON c.id = e.class_id
  WHERE EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = u.id AND role = 'teacher')
  GROUP BY u.id, u.name, u.email, u.created_at
  ORDER BY u.name;
END;
$$;

-- Função de criação de admin (apenas para completude)
CREATE OR REPLACE FUNCTION public.admin_create_admin(p_email text, p_name text, p_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  hashed_password TEXT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar outros administradores.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso: %', p_email;
  END IF;

  hashed_password := crypt(p_password, gen_salt('bf', 8));

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', p_email, hashed_password,
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_name, 'role', 'admin'),
    now(), now()
  );

  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (new_user_id, p_email, p_name, 'admin', true);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'admin');

  RETURN new_user_id;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Erro ao criar administrador: email já está em uso';
  WHEN others THEN
    RAISE EXCEPTION 'Erro ao criar administrador: %. Detalhes: %', SQLERRM, SQLSTATE;
END;
$$;

-- Função admin_create_student
CREATE OR REPLACE FUNCTION public.admin_create_student(p_email text, p_name text, p_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  hashed_password TEXT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar alunos.';
  END IF;

  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso: %', p_email;
  END IF;

  hashed_password := crypt(p_password, gen_salt('bf', 8));

  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) VALUES (
    new_user_id, '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', p_email, hashed_password,
    now(), '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_name, 'role', 'student'),
    now(), now()
  );

  INSERT INTO public.users (id, email, name, role, is_active)
  VALUES (new_user_id, p_email, p_name, 'student', false);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (new_user_id, 'student');

  RETURN new_user_id;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Erro ao criar aluno: email já está em uso';
  WHEN others THEN
    RAISE EXCEPTION 'Erro ao criar aluno: %. Detalhes: %', SQLERRM, SQLSTATE;
END;
$$;