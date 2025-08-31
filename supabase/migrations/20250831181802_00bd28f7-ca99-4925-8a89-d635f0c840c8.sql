-- Criar função admin_update_student_data que estava faltando
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

  -- Validar WhatsApp se fornecido
  IF p_whatsapp IS NOT NULL AND p_whatsapp != '' THEN
    -- Remove caracteres não numéricos
    IF NOT (regexp_replace(p_whatsapp, '\D', '', 'g') ~ '^\d{10,11}$') THEN
      RAISE EXCEPTION 'WhatsApp deve ter 10 ou 11 dígitos';
    END IF;
  END IF;

  -- Atualizar tabela users
  UPDATE public.users
  SET 
    name = COALESCE(p_name, name),
    email = COALESCE(p_email, email),
    updated_at = NOW()
  WHERE id = p_student_id AND role = 'student';

  -- Atualizar tabela user_profiles (inserir se não existir)
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

  -- Verificar se alterações foram feitas
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Aluno não encontrado ou não é um estudante';
  END IF;
END;
$$;

-- Adicionar coluna sender_id na tabela notifications para rastrear quem enviou
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS sender_id uuid REFERENCES public.users(id);

-- Atualizar RLS para permitir que professores vejam suas próprias notificações enviadas
DROP POLICY IF EXISTS "Teachers can view sent notifications" ON public.notifications;
CREATE POLICY "Teachers can view sent notifications" 
ON public.notifications 
FOR SELECT 
USING (
  sender_id = auth.uid() OR user_id = auth.uid()
);

-- Permitir que professores editem/deletem suas próprias notificações
DROP POLICY IF EXISTS "Teachers can edit their sent notifications" ON public.notifications;
CREATE POLICY "Teachers can edit their sent notifications" 
ON public.notifications 
FOR UPDATE 
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "Teachers can delete their sent notifications" ON public.notifications;
CREATE POLICY "Teachers can delete their sent notifications" 
ON public.notifications 
FOR DELETE 
USING (sender_id = auth.uid());

-- Atualizar as funções de notificação para incluir sender_id
CREATE OR REPLACE FUNCTION public.send_notification_to_class(p_title text, p_message text, p_class_id uuid, p_sender_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se é professor ou admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role IN ('teacher', 'admin')
  ) THEN
    RAISE EXCEPTION 'Apenas professores e administradores podem enviar notificações';
  END IF;

  -- Se é professor, verificar se é dono da turma
  IF EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role = 'teacher'
  ) AND NOT EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = p_class_id AND teacher_id = p_sender_id
  ) THEN
    RAISE EXCEPTION 'Você só pode enviar notificações para suas próprias turmas';
  END IF;

  -- Inserir notificações para todos os alunos da turma
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
AS $$
BEGIN
  -- Verificar se é professor ou admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_sender_id AND role IN ('teacher', 'admin')
  ) THEN
    RAISE EXCEPTION 'Apenas professores e administradores podem enviar notificações';
  END IF;

  -- Para professores, enviar apenas para suas turmas
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
    -- Para admins, enviar para todos os alunos
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