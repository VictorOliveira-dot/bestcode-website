-- Habilitar extensão pgcrypto para gen_random_bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar tabela password_resets se não existir
CREATE TABLE IF NOT EXISTS public.password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON public.password_resets(token);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON public.password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON public.password_resets(expires_at);

-- Habilitar RLS na tabela
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Política para permitir apenas inserções através da função
CREATE POLICY "Service role can manage password resets" ON public.password_resets
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Recriar função para criar token de reset
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_token TEXT;
BEGIN
  -- Verificar se o usuário existe (case insensitive)
  SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;
  
  -- Gerar token único usando gen_random_bytes da extensão pgcrypto
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

-- Recriar função para resetar senha com token
CREATE OR REPLACE FUNCTION public.reset_password_with_token(p_token text, p_new_password text)
RETURNS boolean
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
  
  -- Atualizar senha no auth.users
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

-- Criar função de limpeza de tokens expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_password_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.password_resets 
  WHERE expires_at < NOW() - INTERVAL '24 hours';
END;
$$;