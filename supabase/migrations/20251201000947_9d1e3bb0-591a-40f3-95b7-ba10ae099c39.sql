-- Corrigir funções sem dropar (usar CREATE OR REPLACE)
-- Apenas para funções que não mudam assinatura ou não são usadas em políticas

-- Atualizar get_user_role mantendo mesma assinatura
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role::TEXT INTO user_role 
  FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role.user_id 
  LIMIT 1;
  RETURN user_role;
END;
$$;

-- Atualizar get_user_role_safe mantendo mesma assinatura
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role::TEXT 
    FROM public.user_roles 
    WHERE user_roles.user_id = get_user_role_safe.user_id 
    LIMIT 1
  );
END;
$$;

-- Atualizar get_user_role_for_policy mantendo mesma assinatura
CREATE OR REPLACE FUNCTION public.get_user_role_for_policy(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::TEXT 
  FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role_for_policy.user_id 
  LIMIT 1;
$$;

-- Para funções com mudança de assinatura, dropar e recriar
DROP FUNCTION IF EXISTS public.get_teacher_student_progress(uuid);

CREATE OR REPLACE FUNCTION public.get_teacher_student_progress(p_teacher_id uuid)
RETURNS TABLE(
  student_id uuid,
  student_name text,
  student_email text,
  class_name text,
  total_lessons bigint,
  completed_lessons bigint,
  progress_percentage numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id as student_id,
    u.name as student_name,
    u.email as student_email,
    c.name as class_name,
    COUNT(DISTINCT l.id) as total_lessons,
    COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN lp.lesson_id END) as completed_lessons,
    CASE 
      WHEN COUNT(DISTINCT l.id) > 0 THEN
        ROUND((COUNT(DISTINCT CASE WHEN lp.status = 'completed' THEN lp.lesson_id END)::numeric / COUNT(DISTINCT l.id)::numeric) * 100, 2)
      ELSE 0
    END as progress_percentage
  FROM users u
  JOIN enrollments e ON u.id = e.student_id
  JOIN classes c ON e.class_id = c.id
  LEFT JOIN lessons l ON l.class_id = c.id
  LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = u.id
  WHERE c.teacher_id = p_teacher_id
  GROUP BY u.id, u.name, u.email, c.name
  ORDER BY u.name;
END;
$$;

-- Atualizar get_all_classes_for_teachers com search_path
DROP FUNCTION IF EXISTS public.get_all_classes_for_teachers();

CREATE OR REPLACE FUNCTION public.get_all_classes_for_teachers()
RETURNS TABLE(id uuid, name text, description text, start_date date)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.description, c.start_date
  FROM classes c
  WHERE c.is_active = true
  ORDER BY c.name;
END;
$$;

-- Atualizar get_my_class_enrollments com search_path
DROP FUNCTION IF EXISTS public.get_my_class_enrollments();

CREATE OR REPLACE FUNCTION public.get_my_class_enrollments()
RETURNS TABLE(
  enrollment_id uuid,
  class_id uuid,
  class_name text,
  teacher_id uuid,
  student_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    enrollment_id,
    class_id,
    class_name,
    teacher_id,
    student_id
  FROM public.class_enrollments_view
  WHERE teacher_id = auth.uid();
$$;