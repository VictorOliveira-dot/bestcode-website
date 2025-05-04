
-- Função para verificar se um email já existe na tabela auth.users
CREATE OR REPLACE FUNCTION public.check_user_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_exists BOOLEAN;
BEGIN
  -- Verificar na tabela auth.users
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = p_email
  ) INTO user_exists;
  
  RETURN user_exists;
END;
$$;
