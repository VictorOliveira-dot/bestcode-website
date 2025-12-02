-- FASE 2: Correções de Alta Prioridade

-- 1. Adicionar RLS na view class_enrollments_view
-- Criar políticas para proteger a view

-- Primeiro, habilitar RLS na view (views não suportam RLS diretamente, então vamos recriar como tabela materializada ou adicionar políticas nas tabelas base)
-- Como a view não pode ter RLS diretamente, vamos garantir que as tabelas base (enrollments, classes, users) estejam protegidas

-- Verificar e reforçar RLS em enrollments
DROP POLICY IF EXISTS "View class enrollments" ON enrollments;

CREATE POLICY "View class enrollments security"
ON enrollments
FOR SELECT
USING (
  -- Estudante pode ver suas próprias matrículas
  student_id = auth.uid()
  OR
  -- Professor pode ver matrículas de suas turmas
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = enrollments.class_id
    AND classes.teacher_id = auth.uid()
  )
  OR
  -- Admin pode ver todas
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 2. Configurar proteção adicional para dados sensíveis (CPF)
-- Adicionar função para mascarar CPF em consultas não-autorizadas

CREATE OR REPLACE FUNCTION public.mask_cpf(cpf text, user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin pode ver CPF completo
  IF EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN cpf;
  END IF;
  
  -- Usuário pode ver seu próprio CPF
  IF auth.uid() = user_id THEN
    RETURN cpf;
  END IF;
  
  -- Outros veem mascarado
  IF cpf IS NULL OR cpf = '' THEN
    RETURN NULL;
  END IF;
  
  -- Mascara: ***.***.XXX-XX
  RETURN '***.' || substring(cpf from 5 for 3) || '.' || substring(cpf from 8 for 3) || '-**';
END;
$$;

-- 3. Adicionar política RLS mais restritiva para user_profiles
-- Garantir que dados sensíveis como CPF só sejam acessíveis pelo próprio usuário ou admin

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;

CREATE POLICY "View own profile with sensitive data"
ON user_profiles
FOR SELECT
USING (
  -- Usuário pode ver seu próprio perfil completo
  id = auth.uid()
  OR
  -- Admin pode ver todos os perfis
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Adicionar comentários explicativos sobre segurança
COMMENT ON FUNCTION public.mask_cpf IS 'Mascara CPF para proteger dados sensíveis. Apenas o próprio usuário e admins podem ver o CPF completo.';

COMMENT ON TABLE user_profiles IS 'Armazena dados de perfil dos usuários. CPF e outros dados sensíveis devem ser acessados apenas pelo próprio usuário ou administradores.';

-- 4. Adicionar índices para melhorar performance de consultas com RLS
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_cpf ON user_profiles(cpf) WHERE cpf IS NOT NULL;

-- 5. Adicionar validação adicional de CPF na inserção/atualização
CREATE OR REPLACE FUNCTION public.validate_cpf_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se CPF foi fornecido, validar
  IF NEW.cpf IS NOT NULL AND NEW.cpf != '' THEN
    IF NOT public.validate_cpf(NEW.cpf) THEN
      RAISE EXCEPTION 'CPF inválido: %', NEW.cpf;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para validação de CPF
DROP TRIGGER IF EXISTS validate_cpf_on_insert_update ON user_profiles;

CREATE TRIGGER validate_cpf_on_insert_update
BEFORE INSERT OR UPDATE OF cpf ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_cpf_trigger();

-- 6. Adicionar log de auditoria para acesso a dados sensíveis (opcional mas recomendado)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Habilitar RLS na tabela de auditoria
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admins can view audit logs"
ON public.audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Sistema pode inserir logs
CREATE POLICY "System can insert audit logs"
ON public.audit_log
FOR INSERT
WITH CHECK (true);

COMMENT ON TABLE public.audit_log IS 'Registro de auditoria para rastrear acesso a dados sensíveis e ações críticas.';

-- 7. Atualizar admin_get_student_details para usar CPF mascarado quando apropriado
CREATE OR REPLACE FUNCTION public.admin_get_student_details_secure(p_student_id uuid)
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
  cpf_masked text,
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
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
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
    public.mask_cpf(up.cpf, u.id) as cpf_masked,
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
  WHERE u.id = p_student_id;
END;
$$;