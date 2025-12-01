-- Corrigir últimas funções restantes adicionando SET search_path = public

-- Funções admin
CREATE OR REPLACE FUNCTION public.admin_create_class(p_name text, p_description text, p_start_date date, p_teacher_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id UUID;
  v_user_role TEXT;
BEGIN
  SELECT role INTO v_user_role FROM public.users WHERE id = auth.uid();
  
  IF v_user_role != 'admin' THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar turmas.';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = p_teacher_id AND role = 'teacher'
  ) THEN
    RAISE EXCEPTION 'Professor não encontrado.';
  END IF;

  INSERT INTO public.classes (
    name,
    description,
    start_date,
    teacher_id
  )
  VALUES (
    p_name,
    p_description,
    p_start_date,
    p_teacher_id
  )
  RETURNING id INTO v_class_id;
  
  RETURN v_class_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_get_dashboard_stats()
RETURNS TABLE(total_students bigint, total_teachers bigint, total_classes bigint, active_students_last_week bigint, total_lessons bigint, average_completion_rate numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      (SELECT COUNT(*) FROM public.users WHERE role = 'student') as students,
      (SELECT COUNT(*) FROM public.users WHERE role = 'teacher') as teachers,
      (SELECT COUNT(*) FROM public.classes WHERE is_active = true) as classes,
      (SELECT COUNT(DISTINCT student_id) 
       FROM public.lesson_progress 
       WHERE last_watched >= NOW() - INTERVAL '7 days') as active_students,
      (SELECT COUNT(*) FROM public.lessons) as lessons,
      (SELECT COALESCE(AVG(progress), 0) 
       FROM public.lesson_progress) as avg_completion
  )
  SELECT 
    students as total_students,
    teachers as total_teachers,
    classes as total_classes,
    active_students as active_students_last_week,
    lessons as total_lessons,
    ROUND(avg_completion, 2) as average_completion_rate
  FROM stats;
END;
$$;

-- Funções de senha
CREATE OR REPLACE FUNCTION public.reset_password_with_token(p_token text, p_new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reset_record RECORD;
  v_hashed_password TEXT;
BEGIN
  SELECT pr.*, u.email INTO v_reset_record
  FROM public.password_resets pr
  JOIN public.users u ON pr.user_id = u.id
  WHERE pr.token = p_token 
    AND pr.expires_at > NOW() 
    AND pr.used_at IS NULL;
  
  IF v_reset_record IS NULL THEN
    RAISE EXCEPTION 'Token inválido ou expirado';
  END IF;
  
  v_hashed_password := crypt(p_new_password, gen_salt('bf', 8));
  
  UPDATE auth.users 
  SET encrypted_password = v_hashed_password,
      updated_at = NOW()
  WHERE email = v_reset_record.email;
  
  UPDATE public.password_resets 
  SET used_at = NOW() 
  WHERE id = v_reset_record.id;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_password_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.password_resets 
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_password_send_email(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_new_password TEXT;
  v_hashed_password TEXT;
BEGIN
  SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;
  
  v_new_password := array_to_string(
    ARRAY(
      SELECT chr((97 + floor(random() * 26))::int) 
      FROM generate_series(1, 4)
    ), ''
  ) || array_to_string(
    ARRAY(
      SELECT chr((48 + floor(random() * 10))::int) 
      FROM generate_series(1, 4)
    ), ''
  );
  
  v_hashed_password := crypt(v_new_password, gen_salt('bf', 8));
  
  UPDATE auth.users 
  SET encrypted_password = v_hashed_password,
      updated_at = NOW()
  WHERE email = p_email;
  
  RAISE NOTICE 'Nova senha para %: %', p_email, v_new_password;
  
  RETURN TRUE;
END;
$$;

-- Funções de notificação
CREATE OR REPLACE FUNCTION public.send_notification_to_class(p_title text, p_message text, p_class_id uuid, p_sender_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role IN ('teacher', 'admin')
  ) THEN
    RAISE EXCEPTION 'Apenas professores e administradores podem enviar notificações';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role = 'teacher'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = p_class_id AND teacher_id = p_sender_id
  ) THEN
    RAISE EXCEPTION 'Você só pode enviar notificações para suas próprias turmas';
  END IF;

  INSERT INTO public.notifications (title, message, user_id, date, sender_id)
  SELECT 
    p_title,
    p_message,
    e.student_id,
    NOW(),
    p_sender_id
  FROM public.enrollments e
  WHERE e.class_id = p_class_id AND e.status = 'active';
END;
$$;

CREATE OR REPLACE FUNCTION public.send_notification_to_all_classes(p_title text, p_message text, p_sender_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role IN ('teacher', 'admin')
  ) THEN
    RAISE EXCEPTION 'Apenas professores e administradores podem enviar notificações';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role = 'teacher'
  ) THEN
    INSERT INTO public.notifications (title, message, user_id, date, sender_id)
    SELECT 
      p_title,
      p_message,
      e.student_id,
      NOW(),
      p_sender_id
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE c.teacher_id = p_sender_id AND e.status = 'active';
  ELSE
    INSERT INTO public.notifications (title, message, user_id, date, sender_id)
    SELECT 
      p_title,
      p_message,
      e.student_id,
      NOW(),
      p_sender_id
    FROM public.enrollments e
    WHERE e.status = 'active';
  END IF;
END;
$$;

-- Funções de administração de dados de estudante
CREATE OR REPLACE FUNCTION public.admin_update_student_data(
  p_student_id uuid, 
  p_name text DEFAULT NULL::text, 
  p_email text DEFAULT NULL::text, 
  p_first_name text DEFAULT NULL::text, 
  p_last_name text DEFAULT NULL::text, 
  p_phone text DEFAULT NULL::text, 
  p_whatsapp text DEFAULT NULL::text, 
  p_cpf text DEFAULT NULL::text, 
  p_birth_date date DEFAULT NULL::date, 
  p_address text DEFAULT NULL::text, 
  p_education text DEFAULT NULL::text, 
  p_professional_area text DEFAULT NULL::text, 
  p_experience_level text DEFAULT NULL::text, 
  p_goals text DEFAULT NULL::text, 
  p_study_availability text DEFAULT NULL::text
)
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
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem atualizar dados de alunos.';
  END IF;

  IF p_cpf IS NOT NULL AND p_cpf != '' THEN
    IF NOT public.validate_cpf(p_cpf) THEN
      RAISE EXCEPTION 'CPF inválido';
    END IF;
  END IF;

  IF p_phone IS NOT NULL AND p_phone != '' THEN
    IF NOT (regexp_replace(p_phone, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'Telefone deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  IF p_whatsapp IS NOT NULL AND p_whatsapp != '' THEN
    IF NOT (regexp_replace(p_whatsapp, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'WhatsApp deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  UPDATE public.users
  SET 
    name = CASE WHEN p_name IS NOT NULL THEN p_name ELSE name END,
    email = CASE WHEN p_email IS NOT NULL THEN p_email ELSE email END,
    updated_at = NOW()
  WHERE id = p_student_id AND role = 'student';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado ou não é um estudante';
  END IF;

  INSERT INTO public.user_profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    whatsapp, 
    cpf, 
    birth_date, 
    address, 
    education, 
    professional_area, 
    experience_level, 
    goals, 
    study_availability,
    updated_at
  )
  VALUES (
    p_student_id,
    p_first_name,
    p_last_name,
    p_phone,
    p_whatsapp,
    p_cpf,
    p_birth_date,
    p_address,
    p_education,
    p_professional_area,
    p_experience_level,
    p_goals,
    p_study_availability,
    NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    first_name = CASE WHEN p_first_name IS NOT NULL THEN p_first_name ELSE user_profiles.first_name END,
    last_name = CASE WHEN p_last_name IS NOT NULL THEN p_last_name ELSE user_profiles.last_name END,
    phone = CASE WHEN p_phone IS NOT NULL THEN p_phone ELSE user_profiles.phone END,
    whatsapp = CASE WHEN p_whatsapp IS NOT NULL THEN p_whatsapp ELSE user_profiles.whatsapp END,
    cpf = CASE WHEN p_cpf IS NOT NULL THEN p_cpf ELSE user_profiles.cpf END,
    birth_date = CASE WHEN p_birth_date IS NOT NULL THEN p_birth_date ELSE user_profiles.birth_date END,
    address = CASE WHEN p_address IS NOT NULL THEN p_address ELSE user_profiles.address END,
    education = CASE WHEN p_education IS NOT NULL THEN p_education ELSE user_profiles.education END,
    professional_area = CASE WHEN p_professional_area IS NOT NULL THEN p_professional_area ELSE user_profiles.professional_area END,
    experience_level = CASE WHEN p_experience_level IS NOT NULL THEN p_experience_level ELSE user_profiles.experience_level END,
    goals = CASE WHEN p_goals IS NOT NULL THEN p_goals ELSE user_profiles.goals END,
    study_availability = CASE WHEN p_study_availability IS NOT NULL THEN p_study_availability ELSE user_profiles.study_availability END,
    updated_at = NOW();
END;
$$;

-- Função de validação de CPF
CREATE OR REPLACE FUNCTION public.validate_cpf(p_cpf text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  cpf_clean text;
  sum_1 integer := 0;
  sum_2 integer := 0;
  digit_1 integer;
  digit_2 integer;
  i integer;
BEGIN
  cpf_clean := regexp_replace(p_cpf, '\D', '', 'g');
  
  IF length(cpf_clean) != 11 THEN
    RETURN false;
  END IF;
  
  IF cpf_clean ~ '^(\d)\1{10}$' THEN
    RETURN false;
  END IF;
  
  FOR i IN 1..9 LOOP
    sum_1 := sum_1 + (substring(cpf_clean, i, 1)::integer * (11 - i));
  END LOOP;
  
  digit_1 := 11 - (sum_1 % 11);
  IF digit_1 >= 10 THEN
    digit_1 := 0;
  END IF;
  
  FOR i IN 1..10 LOOP
    sum_2 := sum_2 + (substring(cpf_clean, i, 1)::integer * (12 - i));
  END LOOP;
  
  digit_2 := 11 - (sum_2 % 11);
  IF digit_2 >= 10 THEN
    digit_2 := 0;
  END IF;
  
  RETURN digit_1 = substring(cpf_clean, 10, 1)::integer 
     AND digit_2 = substring(cpf_clean, 11, 1)::integer;
END;
$$;

-- Função activate_student_account
CREATE OR REPLACE FUNCTION public.activate_student_account(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET 
    is_active = TRUE,
    updated_at = NOW()
  WHERE 
    id = user_id 
    AND role = 'student';
    
  RETURN FOUND;
END;
$$;