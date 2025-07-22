
-- Criar tabela para recuperação de senhas
CREATE TABLE IF NOT EXISTS public.password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE NULL
);

-- Índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON public.password_resets(token);

-- Política RLS para password_resets
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Função para criar token de recuperação
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
BEGIN
  -- Verificar se o usuário existe
  SELECT id INTO v_user_id FROM public.users WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;
  
  -- Gerar token único
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Invalidar tokens anteriores do usuário
  UPDATE public.password_resets 
  SET used_at = NOW() 
  WHERE user_id = v_user_id AND used_at IS NULL;
  
  -- Criar novo token (válido por 1 hora)
  INSERT INTO public.password_resets (user_id, token, expires_at)
  VALUES (v_user_id, v_token, NOW() + INTERVAL '1 hour');
  
  RETURN v_token;
END;
$$;

-- Função para resetar senha com token
CREATE OR REPLACE FUNCTION public.reset_password_with_token(p_token TEXT, p_new_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reset_record RECORD;
  v_hashed_password TEXT;
BEGIN
  -- Buscar token válido
  SELECT pr.*, u.email INTO v_reset_record
  FROM public.password_resets pr
  JOIN public.users u ON pr.user_id = u.id
  WHERE pr.token = p_token 
    AND pr.expires_at > NOW() 
    AND pr.used_at IS NULL;
  
  IF v_reset_record IS NULL THEN
    RAISE EXCEPTION 'Token inválido ou expirado';
  END IF;
  
  -- Gerar hash da nova senha
  v_hashed_password := crypt(p_new_password, gen_salt('bf', 8));
  
  -- Atualizar senha no auth.users via função administrativa
  UPDATE auth.users 
  SET encrypted_password = v_hashed_password,
      updated_at = NOW()
  WHERE email = v_reset_record.email;
  
  -- Marcar token como usado
  UPDATE public.password_resets 
  SET used_at = NOW() 
  WHERE id = v_reset_record.id;
  
  RETURN TRUE;
END;
$$;

-- Melhorar política RLS para classes (permitir DELETE para professores)
DROP POLICY IF EXISTS "Teachers can delete their own classes" ON public.classes;
CREATE POLICY "Teachers can delete their own classes" 
ON public.classes 
FOR DELETE 
USING (teacher_id = auth.uid() OR get_user_role_safe(auth.uid()) = 'admin');

-- Função para buscar aulas com timezone do Brasil
CREATE OR REPLACE FUNCTION public.get_student_lessons_brazil_timezone()
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  youtube_url TEXT,
  date DATE,
  class_id UUID,
  class_name TEXT,
  visibility TEXT,
  scheduled_at_brazil TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.youtube_url,
    l.date,
    l.class_id,
    c.name as class_name,
    l.visibility,
    (l.date::timestamp AT TIME ZONE 'America/Sao_Paulo') as scheduled_at_brazil
  FROM public.lessons l
  JOIN public.classes c ON l.class_id = c.id
  JOIN public.enrollments e ON c.id = e.class_id
  WHERE e.student_id = auth.uid()
    AND (l.date::timestamp AT TIME ZONE 'America/Sao_Paulo') >= NOW() AT TIME ZONE 'America/Sao_Paulo'
  ORDER BY l.date ASC;
END;
$$;

-- Limpar tokens expirados (função de limpeza)
CREATE OR REPLACE FUNCTION public.cleanup_expired_password_tokens()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_resets 
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$;
