-- Corrigir as últimas funções restantes

-- Funções de recuperação de senha
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_token text;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(p_email);

  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;

  v_token := md5(random()::text || clock_timestamp()::text || v_user_id::text);

  UPDATE public.password_resets
  SET used_at = NOW()
  WHERE user_id = v_user_id AND used_at IS NULL;

  INSERT INTO public.password_resets (user_id, token, expires_at)
  VALUES (v_user_id, v_token, NOW() + INTERVAL '1 hour');

  RETURN v_token;
END;
$$;

-- Funções de aulas
CREATE OR REPLACE FUNCTION public.create_lesson(p_title text, p_description text, p_youtube_url text, p_date date, p_class_id uuid, p_visibility text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_lesson_id UUID;
BEGIN
  IF p_title IS NULL OR LENGTH(TRIM(p_title)) = 0 THEN
    RAISE EXCEPTION 'Título da aula é obrigatório';
  END IF;
  
  IF p_description IS NULL OR LENGTH(TRIM(p_description)) = 0 THEN
    RAISE EXCEPTION 'Descrição da aula é obrigatória';
  END IF;
  
  IF p_youtube_url IS NULL OR LENGTH(TRIM(p_youtube_url)) = 0 THEN
    RAISE EXCEPTION 'URL do YouTube é obrigatória';
  END IF;
  
  IF p_visibility NOT IN ('all', 'class_only') THEN
    RAISE EXCEPTION 'Visibilidade deve ser "all" ou "class_only"';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM classes 
    WHERE id = p_class_id AND teacher_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Não autorizado: Você só pode criar aulas para suas próprias turmas';
  END IF;

  INSERT INTO lessons (
    title,
    description,
    youtube_url,
    date,
    class_id,
    visibility
  )
  VALUES (
    TRIM(p_title),
    TRIM(p_description),
    TRIM(p_youtube_url),
    p_date,
    p_class_id,
    p_visibility
  )
  RETURNING id INTO v_lesson_id;

  RETURN v_lesson_id;
END;
$$;

-- Funções de turma
CREATE OR REPLACE FUNCTION public.create_teacher_class(p_name text, p_description text, p_start_date date)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id UUID;
BEGIN
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'Nome da turma é obrigatório';
  END IF;
  
  IF p_description IS NULL OR LENGTH(TRIM(p_description)) = 0 THEN
    RAISE EXCEPTION 'Descrição da turma é obrigatória';
  END IF;
  
  IF p_start_date IS NULL THEN
    RAISE EXCEPTION 'Data de início é obrigatória';
  END IF;
  
  IF p_start_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de início não pode ser no passado';
  END IF;

  INSERT INTO classes (
    name,
    description,
    start_date,
    teacher_id
  )
  VALUES (
    TRIM(p_name),
    TRIM(p_description),
    p_start_date,
    auth.uid()
  )
  RETURNING id INTO v_class_id;

  RETURN v_class_id;
END;
$$;

-- Funções de deleção administrativa
CREATE OR REPLACE FUNCTION public.admin_delete_student(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can delete students';
    END IF;

    DELETE FROM public.lesson_progress WHERE student_id = p_student_id;
    DELETE FROM public.notifications WHERE user_id = p_student_id OR sender_id = p_student_id;
    DELETE FROM public.user_payments WHERE user_id = p_student_id;
    
    DELETE FROM public.student_documents sd
    USING public.student_applications sa
    WHERE sd.application_id = sa.id
      AND sa.user_id = p_student_id;

    DELETE FROM public.student_applications WHERE user_id = p_student_id;
    DELETE FROM public.enrollments WHERE student_id = p_student_id;
    DELETE FROM public.user_profiles WHERE id = p_student_id;
    DELETE FROM public.users WHERE id = p_student_id AND role = 'student';
END;
$$;

-- Funções admin adicionais
CREATE OR REPLACE FUNCTION public.admin_get_student_details(p_student_id uuid)
RETURNS TABLE(
  user_id uuid, 
  name text, 
  email text, 
  created_at timestamp with time zone, 
  current_classes json, 
  subscription_plan text, 
  progress_average numeric, 
  last_active timestamp with time zone, 
  first_name text, 
  last_name text, 
  phone text, 
  whatsapp text, 
  cpf text, 
  birth_date date, 
  address text, 
  education text, 
  professional_area text, 
  experience_level text, 
  goals text, 
  study_availability text, 
  is_profile_complete boolean
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
    u.id as user_id,
    u.name,
    u.email,
    u.created_at,
    COALESCE(
      (SELECT json_agg(json_build_object(
        'class_id', c.id,
        'class_name', c.name,
        'enrollment_date', e.enrollment_date,
        'status', e.status,
        'teacher_name', ut.name
      ))
      FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      LEFT JOIN users ut ON c.teacher_id = ut.id
      WHERE e.student_id = u.id), 
      '[]'::json
    ) as current_classes,
    'Standard'::TEXT as subscription_plan,
    COALESCE(
      (SELECT AVG(progress)::numeric 
       FROM lesson_progress 
       WHERE student_id = u.id),
      0
    ) as progress_average,
    (SELECT MAX(last_watched) 
     FROM lesson_progress 
     WHERE student_id = u.id) as last_active,
    up.first_name,
    up.last_name,
    up.phone,
    up.whatsapp,
    up.cpf,
    up.birth_date,
    up.address,
    up.education,
    up.professional_area,
    up.experience_level,
    up.goals,
    up.study_availability,
    up.is_profile_complete
  FROM users u
  LEFT JOIN user_profiles up ON u.id = up.id
  WHERE u.id = p_student_id AND u.role = 'student';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_teacher_details(p_teacher_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  created_at timestamp with time zone, 
  classes json, 
  classes_count bigint, 
  students_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem acessar estes dados.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    COALESCE(
      (SELECT json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name
        )
      )
      FROM public.classes c
      WHERE c.teacher_id = u.id),
      '[]'::json
    ) as classes,
    (SELECT COUNT(*) FROM public.classes WHERE teacher_id = u.id) as classes_count,
    (SELECT COUNT(DISTINCT e.student_id) 
     FROM public.classes c
     JOIN public.enrollments e ON c.id = e.class_id
     WHERE c.teacher_id = u.id) as students_count
  FROM public.users u
  WHERE u.id = p_teacher_id AND u.role = 'teacher';
END;
$$;

-- Função get_student_progress com parâmetro
CREATE OR REPLACE FUNCTION public.get_student_progress(student_id uuid)
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
  WHERE lp.student_id = student_id;
END;
$$;

-- Função get_all_students_optimized
CREATE OR REPLACE FUNCTION public.get_all_students_optimized(p_teacher_id uuid)
RETURNS TABLE(id uuid, name text, email text, created_at timestamp with time zone, is_active boolean, class_names text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at,
    u.is_active,
    COALESCE(
      string_agg(c.name, ', ' ORDER BY c.name),
      'Sem vínculo'
    ) as class_names
  FROM public.users u
  LEFT JOIN public.enrollments e ON u.id = e.student_id AND e.status = 'active'
  LEFT JOIN public.classes c ON e.class_id = c.id AND c.teacher_id = p_teacher_id
  WHERE u.role = 'student'
  GROUP BY u.id, u.name, u.email, u.created_at, u.is_active
  ORDER BY u.name;
END;
$$;