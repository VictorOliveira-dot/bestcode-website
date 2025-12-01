-- Corrigir funções restantes adicionando SET search_path = public

-- Funções de classe
CREATE OR REPLACE FUNCTION public.check_class_has_students(p_class_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE class_id = p_class_id AND status = 'active'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_student_class_enrollments(p_student_id uuid, p_teacher_id uuid)
RETURNS TABLE(enrollment_id uuid, class_id uuid, class_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.create_class(p_name text, p_description text, p_start_date date, p_teacher_id uuid)
RETURNS TABLE(id uuid, name text, description text, start_date date)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.classes (name, description, start_date, teacher_id)
  VALUES (p_name, p_description, p_start_date, p_teacher_id)
  RETURNING id INTO v_id;
  
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.description,
    c.start_date
  FROM 
    public.classes c
  WHERE 
    c.id = v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_class(class_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.classes
    WHERE id = class_id AND teacher_id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_class(p_class_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.classes
  WHERE id = p_class_id AND teacher_id = p_teacher_id;
END;
$$;

-- Funções de aula
CREATE OR REPLACE FUNCTION public.delete_lesson(p_lesson_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM lessons l
    JOIN classes c ON l.class_id = c.id
    WHERE l.id = p_lesson_id AND c.teacher_id = p_teacher_id
  ) THEN
    RAISE EXCEPTION 'Não autorizado: você só pode excluir suas próprias aulas';
  END IF;

  DELETE FROM lessons WHERE id = p_lesson_id;
END;
$$;

-- Funções de curso complementar
CREATE OR REPLACE FUNCTION public.delete_complementary_course(p_course_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.complementary_courses 
    WHERE id = p_course_id AND created_by = p_teacher_id
  ) THEN
    RAISE EXCEPTION 'Você só pode excluir seus próprios cursos';
  END IF;

  DELETE FROM public.complementary_courses WHERE id = p_course_id;
END;
$$;

-- Funções de matrícula
CREATE OR REPLACE FUNCTION public.enroll_student_to_class(p_student_id uuid, p_class_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO enrollments(student_id, class_id, user_id, status)
    VALUES (p_student_id, p_class_id, auth.uid(), 'active');
END;
$$;

CREATE OR REPLACE FUNCTION public.unenroll_student_from_class(p_student_id uuid, p_class_id uuid, p_teacher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.classes 
    WHERE id = p_class_id AND teacher_id = p_teacher_id
  ) AND NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = p_teacher_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Você não tem permissão para desvincular alunos desta turma';
  END IF;

  DELETE FROM public.enrollments
  WHERE student_id = p_student_id AND class_id = p_class_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Matrícula não encontrada';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_student_enrollment(p_student_id uuid, p_class_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can update student enrollments';
    END IF;

    UPDATE enrollments
    SET status = p_status,
        updated_at = NOW()
    WHERE student_id = p_student_id
    AND class_id = p_class_id;
END;
$$;

-- Funções de progresso
CREATE OR REPLACE FUNCTION public.upsert_lesson_progress(p_lesson_id uuid, p_student_id uuid, p_watch_time_minutes integer, p_progress integer, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.lesson_progress (
    lesson_id,
    student_id,
    watch_time_minutes,
    progress,
    status,
    last_watched
  )
  VALUES (
    p_lesson_id,
    p_student_id,
    p_watch_time_minutes,
    p_progress,
    p_status,
    NOW()
  )
  ON CONFLICT (lesson_id, student_id)
  DO UPDATE SET
    watch_time_minutes = EXCLUDED.watch_time_minutes,
    progress = EXCLUDED.progress,
    status = EXCLUDED.status,
    last_watched = NOW(),
    updated_at = NOW();
END;
$$;

-- Funções de notificação
CREATE OR REPLACE FUNCTION public.mark_notification_as_read(p_notification_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.notifications
  SET read = true
  WHERE id = p_notification_id
    AND user_id = auth.uid();
  RETURN FOUND;
END;
$$;

-- Funções de perfil
CREATE OR REPLACE FUNCTION public.update_user_profile(p_user_id uuid, p_name text DEFAULT NULL::text, p_bio text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Você só pode atualizar seu próprio perfil';
  END IF;

  UPDATE public.users
  SET 
    name = COALESCE(p_name, name),
    bio = COALESCE(p_bio, bio),
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$;

-- Funções auxiliares
CREATE OR REPLACE FUNCTION public.user_can_access_class(class_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RETURN TRUE;
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.classes 
        WHERE id = class_id AND teacher_id = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    IF EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE class_id = class_id AND student_id = auth.uid()
    ) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_teacher_student_count(p_teacher_id uuid)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  student_count bigint;
BEGIN
  SELECT COUNT(DISTINCT e.student_id) INTO student_count
  FROM public.enrollments e
  JOIN public.classes c ON e.class_id = c.id
  WHERE c.teacher_id = p_teacher_id;
  
  RETURN student_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_teacher_classes_simple(teacher_id uuid)
RETURNS TABLE(id uuid, name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name
  FROM 
    public.classes c
  WHERE 
    c.teacher_id = teacher_id;
END;
$$;