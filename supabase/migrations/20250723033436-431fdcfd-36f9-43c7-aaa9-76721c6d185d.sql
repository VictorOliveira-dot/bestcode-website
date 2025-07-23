-- Criar função para redefinir senha enviando nova senha por email
CREATE OR REPLACE FUNCTION public.reset_password_send_email(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
  v_new_password TEXT;
  v_hashed_password TEXT;
BEGIN
  -- Verificar se o usuário existe (case insensitive)
  SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;
  
  -- Gerar nova senha aleatória (8 caracteres)
  v_new_password := array_to_string(
    ARRAY(
      SELECT chr((97 + floor(random() * 26))::int) 
      FROM generate_series(1, 4)
    ), ''
  ) || array_to_string(
    ARRAY(
      SELECT chr((48 + floor(random() * 10))::int) 
      FROM generate_series(1, 4)
    ), ''
  );
  
  -- Gerar hash da nova senha
  v_hashed_password := crypt(v_new_password, gen_salt('bf', 8));
  
  -- Atualizar senha no auth.users
  UPDATE auth.users 
  SET encrypted_password = v_hashed_password,
      updated_at = NOW()
  WHERE email = p_email;
  
  -- Log da nova senha (REMOVER EM PRODUÇÃO - apenas para desenvolvimento)
  RAISE NOTICE 'Nova senha para %: %', p_email, v_new_password;
  
  RETURN TRUE;
END;
$$;