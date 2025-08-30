-- Enable RLS on tables that don't have it enabled
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy for password_resets (only admin access)
CREATE POLICY "Only service can manage password resets"
ON public.password_resets
FOR ALL
USING (false);  -- Block all user access, only service can use

-- Fix search path for newly created functions
CREATE OR REPLACE FUNCTION public.get_student_class_enrollments(p_student_id uuid, p_teacher_id uuid)
RETURNS TABLE(enrollment_id uuid, class_id uuid, class_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as enrollment_id,
    c.id as class_id,
    c.name as class_name
  FROM public.enrollments e
  JOIN public.classes c ON e.class_id = c.id
  WHERE e.student_id = p_student_id 
  AND c.teacher_id = p_teacher_id
  AND e.status = 'active';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_student_data(
  p_student_id uuid,
  p_name text DEFAULT NULL,
  p_email text DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_whatsapp text DEFAULT NULL,
  p_cpf text DEFAULT NULL,
  p_birth_date date DEFAULT NULL,
  p_address text DEFAULT NULL,
  p_education text DEFAULT NULL,
  p_professional_area text DEFAULT NULL,
  p_experience_level text DEFAULT NULL,
  p_goals text DEFAULT NULL,
  p_study_availability text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Verificar se é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem atualizar dados de alunos.';
  END IF;

  -- Validar CPF se fornecido
  IF p_cpf IS NOT NULL AND p_cpf != '' THEN
    IF NOT public.validate_cpf(p_cpf) THEN
      RAISE EXCEPTION 'CPF inválido';
    END IF;
  END IF;

  -- Validar telefone brasileiro se fornecido
  IF p_phone IS NOT NULL AND p_phone != '' THEN
    -- Remove caracteres não numéricos
    IF NOT (regexp_replace(p_phone, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'Telefone deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  -- Atualizar dados básicos do usuário se fornecidos
  IF p_name IS NOT NULL OR p_email IS NOT NULL THEN
    UPDATE public.users
    SET 
      name = COALESCE(p_name, name),
      email = COALESCE(p_email, email),
      updated_at = NOW()
    WHERE id = p_student_id AND role = 'student';
  END IF;

  -- Atualizar dados do perfil
  INSERT INTO public.user_profiles (
    id, first_name, last_name, phone, whatsapp, cpf, birth_date,
    address, education, professional_area, experience_level, goals, study_availability, updated_at
  )
  VALUES (
    p_student_id, p_first_name, p_last_name, p_phone, p_whatsapp, p_cpf, p_birth_date,
    p_address, p_education, p_professional_area, p_experience_level, p_goals, p_study_availability, NOW()
  )
  ON CONFLICT (id) 
  DO UPDATE SET
    first_name = COALESCE(EXCLUDED.first_name, user_profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, user_profiles.last_name),
    phone = COALESCE(EXCLUDED.phone, user_profiles.phone),
    whatsapp = COALESCE(EXCLUDED.whatsapp, user_profiles.whatsapp),
    cpf = COALESCE(EXCLUDED.cpf, user_profiles.cpf),
    birth_date = COALESCE(EXCLUDED.birth_date, user_profiles.birth_date),
    address = COALESCE(EXCLUDED.address, user_profiles.address),
    education = COALESCE(EXCLUDED.education, user_profiles.education),
    professional_area = COALESCE(EXCLUDED.professional_area, user_profiles.professional_area),
    experience_level = COALESCE(EXCLUDED.experience_level, user_profiles.experience_level),
    goals = COALESCE(EXCLUDED.goals, user_profiles.goals),
    study_availability = COALESCE(EXCLUDED.study_availability, user_profiles.study_availability),
    updated_at = NOW();
END;
$$;