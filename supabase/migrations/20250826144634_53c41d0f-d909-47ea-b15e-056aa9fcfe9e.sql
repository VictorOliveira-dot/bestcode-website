-- Corrigir e aprimorar funções existentes

-- Função corrigida para desvincular aluno de turma
CREATE OR REPLACE FUNCTION public.unenroll_student_from_class(p_student_id uuid, p_class_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o professor é dono da turma OU é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.classes 
    WHERE id = p_class_id AND teacher_id = p_teacher_id
  ) AND NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_teacher_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Você não tem permissão para desvincular alunos desta turma';
  END IF;

  -- Desvincular aluno removendo a matrícula
  DELETE FROM public.enrollments
  WHERE student_id = p_student_id AND class_id = p_class_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Matrícula não encontrada';
  END IF;
END;
$$;

-- Função para obter detalhes do professor com turmas
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
AS $$
BEGIN
  -- Verificar se é admin
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

-- Função para validar CPF
CREATE OR REPLACE FUNCTION public.validate_cpf(p_cpf text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  cpf_clean text;
  sum_1 integer := 0;
  sum_2 integer := 0;
  digit_1 integer;
  digit_2 integer;
  i integer;
BEGIN
  -- Remove caracteres não numéricos
  cpf_clean := regexp_replace(p_cpf, '\D', '', 'g');
  
  -- Verifica se tem 11 dígitos
  IF length(cpf_clean) != 11 THEN
    RETURN false;
  END IF;
  
  -- Verifica se todos os dígitos são iguais
  IF cpf_clean ~ '^(\d)\1{10}$' THEN
    RETURN false;
  END IF;
  
  -- Calcula primeiro dígito verificador
  FOR i IN 1..9 LOOP
    sum_1 := sum_1 + (substring(cpf_clean, i, 1)::integer * (11 - i));
  END LOOP;
  
  digit_1 := 11 - (sum_1 % 11);
  IF digit_1 >= 10 THEN
    digit_1 := 0;
  END IF;
  
  -- Calcula segundo dígito verificador
  FOR i IN 1..10 LOOP
    sum_2 := sum_2 + (substring(cpf_clean, i, 1)::integer * (12 - i));
  END LOOP;
  
  digit_2 := 11 - (sum_2 % 11);
  IF digit_2 >= 10 THEN
    digit_2 := 0;
  END IF;
  
  -- Verifica se os dígitos calculados conferem
  RETURN digit_1 = substring(cpf_clean, 10, 1)::integer 
     AND digit_2 = substring(cpf_clean, 11, 1)::integer;
END;
$$;

-- Atualizar função de atualização de dados do aluno para incluir validações
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
  ON CONFLICT (id) DO UPDATE SET
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