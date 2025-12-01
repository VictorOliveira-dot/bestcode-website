-- Corrigir funções restantes adicionando SET search_path = public

-- Funções de progresso do aluno
CREATE OR REPLACE FUNCTION public.get_student_progress()
RETURNS TABLE(lesson_id uuid, watch_time_minutes integer, progress integer, last_watched timestamp with time zone, status text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lp.lesson_id,
    lp.watch_time_minutes,
    lp.progress,
    lp.last_watched,
    lp.status
  FROM public.lesson_progress lp
  WHERE lp.student_id = auth.uid();
END;
$$;

-- Funções de turmas do professor
CREATE OR REPLACE FUNCTION public.get_teacher_classes(p_teacher_id uuid)
RETURNS TABLE(id uuid, name text, description text, start_date date, students_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.start_date,
    COUNT(e.id)::bigint as students_count
  FROM public.classes c
  LEFT JOIN public.enrollments e ON c.id = e.class_id
  WHERE c.teacher_id = p_teacher_id
  GROUP BY c.id, c.name, c.description, c.start_date;
END;
$$;

-- Funções de cursos complementares
CREATE OR REPLACE FUNCTION public.get_teacher_complementary_courses(p_teacher_id uuid)
RETURNS TABLE(id uuid, title text, description text, youtube_url text, created_at timestamp with time zone, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id,
    cc.title,
    cc.description,
    cc.youtube_url,
    cc.created_at,
    cc.is_active
  FROM public.complementary_courses cc
  WHERE cc.created_by = p_teacher_id
  ORDER BY cc.created_at DESC;
END;
$$;

-- Funções de aulas
CREATE OR REPLACE FUNCTION public.get_teacher_lessons(teacher_id uuid)
RETURNS TABLE(id uuid, title text, description text, youtube_url text, date date, class_id uuid, class_name text, visibility text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.youtube_url,
    l.date,
    l.class_id,
    c.name AS class_name,
    l.visibility
  FROM lessons l
  JOIN classes c ON l.class_id = c.id
  WHERE c.teacher_id = $1
  ORDER BY l.date DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_student_lessons_brazil_timezone()
RETURNS TABLE(id uuid, title text, description text, youtube_url text, date date, class_id uuid, class_name text, visibility text, scheduled_at_brazil timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.youtube_url,
    l.date,
    l.class_id,
    c.name as class_name,
    l.visibility,
    (l.date::timestamp AT TIME ZONE 'America/Sao_Paulo') as scheduled_at_brazil
  FROM public.lessons l
  JOIN public.classes c ON l.class_id = c.id
  JOIN public.enrollments e ON c.id = e.class_id
  WHERE e.student_id = auth.uid()
  ORDER BY l.date ASC;
END;
$$;

-- Funções de notificações
CREATE OR REPLACE FUNCTION public.get_student_notifications(p_user_id uuid)
RETURNS TABLE(id uuid, title text, message text, date timestamp with time zone, read boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.id,
    n.title,
    n.message,
    n.date,
    n.read
  FROM public.notifications n
  WHERE n.user_id = p_user_id
  ORDER BY n.date DESC;
END;
$$;

-- Funções de matrículas
CREATE OR REPLACE FUNCTION public.get_student_enrollments()
RETURNS TABLE(enrollment_id uuid, class_id uuid, class_name text, class_description text, start_date date, enrollment_status text, teacher_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    c.id,
    c.name,
    c.description,
    c.start_date,
    e.status,
    u.name
  FROM public.enrollments e
  JOIN public.classes    c ON e.class_id     = c.id
  LEFT JOIN public.users u ON c.teacher_id    = u.id
  WHERE e.student_id = auth.uid();
END;
$$;

-- Funções de professores
CREATE OR REPLACE FUNCTION public.get_teacher_students(p_teacher_id uuid)
RETURNS TABLE(student_id uuid, name text, email text, class_name text, enrollment_date date, progress_percentage numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id AS student_id,
    u.name,
    u.email,
    c.name AS class_name,
    e.enrollment_date,
    COALESCE(
      (SELECT (COUNT(CASE WHEN lp.status = 'completed' THEN 1 END)::NUMERIC / 
              NULLIF(COUNT(*), 0) * 100)
       FROM lessons l
       LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.student_id = u.id
       WHERE l.class_id = c.id),
      0
    ) AS progress_percentage
  FROM users u
  JOIN enrollments e ON u.id = e.student_id
  JOIN classes c ON e.class_id = c.id
  WHERE c.teacher_id = p_teacher_id
  AND u.role = 'student'
  ORDER BY u.name;
END;
$$;

-- Funções auxiliares
CREATE OR REPLACE FUNCTION public.get_all_students_for_teachers()
RETURNS TABLE(id uuid, name text, email text, created_at timestamp with time zone, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.get_user_role_safe(auth.uid()) NOT IN ('teacher', 'admin') THEN
    RAISE EXCEPTION 'Acesso negado. Apenas professores e administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    u.is_active
  FROM public.users u
  WHERE u.role = 'student'
  ORDER BY u.name;
END;
$$;

-- Funções de criação
CREATE OR REPLACE FUNCTION public.create_complementary_course(p_title text, p_description text, p_youtube_url text, p_teacher_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_teacher_id AND role = 'teacher'
  ) THEN
    RAISE EXCEPTION 'Apenas professores podem criar cursos complementares';
  END IF;

  INSERT INTO public.complementary_courses (
    title,
    description,
    youtube_url,
    created_by
  )
  VALUES (
    p_title,
    p_description,
    p_youtube_url,
    p_teacher_id
  )
  RETURNING id INTO v_course_id;

  RETURN v_course_id;
END;
$$;

-- Funções de triggers e handlers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Novo usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_user_type_for_activation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.users
    WHERE id = NEW.id AND role = 'student'
  ) THEN
    RETURN NEW;
  ELSE
    NEW.is_active = FALSE;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Funções de verificação
CREATE OR REPLACE FUNCTION public.check_user_exists(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$;