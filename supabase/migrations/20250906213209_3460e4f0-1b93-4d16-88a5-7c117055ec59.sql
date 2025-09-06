-- Drop and recreate the admin_update_student_data function to fix parameter issues
DROP FUNCTION IF EXISTS public.admin_update_student_data(uuid, text, text, text, text, text, text, text, date, text, text, text, text, text, text);

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
SET search_path TO 'public'
AS $function$
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
    -- Remove caracteres não numéricos e valida
    IF NOT (regexp_replace(p_phone, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'Telefone deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  -- Validar WhatsApp se fornecido
  IF p_whatsapp IS NOT NULL AND p_whatsapp != '' THEN
    -- Remove caracteres não numéricos e valida
    IF NOT (regexp_replace(p_whatsapp, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'WhatsApp deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  -- Atualizar tabela users apenas se há mudanças
  UPDATE public.users
  SET 
    name = CASE WHEN p_name IS NOT NULL THEN p_name ELSE name END,
    email = CASE WHEN p_email IS NOT NULL THEN p_email ELSE email END,
    updated_at = NOW()
  WHERE id = p_student_id AND role = 'student';

  -- Verificar se o usuário existe
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado ou não é um estudante';
  END IF;

  -- Atualizar ou inserir na tabela user_profiles
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
$function$;