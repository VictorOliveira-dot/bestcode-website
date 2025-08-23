-- Função para desvincular aluno de turma
CREATE OR REPLACE FUNCTION public.unenroll_student_from_class(p_student_id uuid, p_class_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o professor é dono da turma
  IF NOT EXISTS (
    SELECT 1 FROM public.classes 
    WHERE id = p_class_id AND teacher_id = p_teacher_id
  ) THEN
    RAISE EXCEPTION 'Você só pode desvincular alunos de suas próprias turmas';
  END IF;

  -- Desvincular o aluno
  DELETE FROM public.enrollments
  WHERE student_id = p_student_id AND class_id = p_class_id;
END;
$$;

-- Função para verificar se turma tem alunos antes de excluir
CREATE OR REPLACE FUNCTION public.check_class_has_students(p_class_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE class_id = p_class_id AND status = 'active'
  );
END;
$$;

-- Função para enviar notificações para turmas específicas
CREATE OR REPLACE FUNCTION public.send_notification_to_class(
  p_title text,
  p_message text,
  p_class_id uuid,
  p_sender_id uuid
)
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
  INSERT INTO public.notifications (title, message, user_id, date)
  SELECT 
    p_title,
    p_message,
    e.student_id,
    NOW()
  FROM public.enrollments e
  WHERE e.class_id = p_class_id AND e.status = 'active';
END;
$$;

-- Função para enviar notificações para todas as turmas
CREATE OR REPLACE FUNCTION public.send_notification_to_all_classes(
  p_title text,
  p_message text,
  p_sender_id uuid
)
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
    INSERT INTO public.notifications (title, message, user_id, date)
    SELECT 
      p_title,
      p_message,
      e.student_id,
      NOW()
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE c.teacher_id = p_sender_id AND e.status = 'active';
  ELSE
    -- Para admins, enviar para todos os alunos
    INSERT INTO public.notifications (title, message, user_id, date)
    SELECT 
      p_title,
      p_message,
      e.student_id,
      NOW()
    FROM public.enrollments e
    WHERE e.status = 'active';
  END IF;
END;
$$;

-- Função otimizada para listar todos os alunos para professores (com cache)
CREATE OR REPLACE FUNCTION public.get_all_students_optimized(p_teacher_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  email text, 
  created_at timestamp with time zone, 
  is_active boolean,
  class_names text
)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Função para atualizar perfil do usuário
CREATE OR REPLACE FUNCTION public.update_user_profile(
  p_user_id uuid,
  p_name text DEFAULT NULL,
  p_bio text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se é o próprio usuário
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Você só pode atualizar seu próprio perfil';
  END IF;

  -- Atualizar dados do usuário
  UPDATE public.users
  SET 
    name = COALESCE(p_name, name),
    bio = COALESCE(p_bio, bio),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;