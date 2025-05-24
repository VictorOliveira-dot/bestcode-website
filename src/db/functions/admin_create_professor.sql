

-- Função para criar professores no sistema
CREATE OR REPLACE FUNCTION public.admin_create_teacher(p_email TEXT, p_name TEXT, p_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  v_role text;
  hashed_password text;
BEGIN
  -- Verifica se quem chama é um administrador
  SELECT role INTO v_role FROM public.users WHERE id = auth.uid();

  IF v_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem criar professores.';
  END IF;

  -- Verificar se o email já existe
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'Email já está em uso: %', p_email;
  END IF;

  -- Gerar hash da senha usando crypt e gen_salt (agora funcionará)
  hashed_password := crypt(p_password, gen_salt('bf'));

  -- Insere na auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    p_email,
    hashed_password,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('name', p_name, 'role', 'teacher'),
    now(),
    now()
  );

  -- Insere na public.users
  INSERT INTO public.users (
    id,
    email,
    name,
    role,
    is_active
  ) VALUES (
    new_user_id,
    p_email,
    p_name,
    'teacher',
    true
  );

  RETURN new_user_id;

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Erro ao criar professor: email já está em uso';
  WHEN others THEN
    RAISE EXCEPTION 'Erro ao criar professor: %. Detalhes: %', SQLERRM, SQLSTATE;
END;
$$;

-- Alias para compatibilidade
CREATE OR REPLACE FUNCTION public.admin_create_professor(p_email TEXT, p_name TEXT, p_password TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN public.admin_create_teacher(p_email, p_name, p_password);
END;
$$;

