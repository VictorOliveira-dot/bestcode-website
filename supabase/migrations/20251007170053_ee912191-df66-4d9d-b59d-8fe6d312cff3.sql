-- Ensure pgcrypto extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recreate the function using a more reliable token generation method
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid;
  v_token text;
BEGIN
  -- Check auth.users first (primary source)
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(p_email);

  -- Fallback to public.users
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;

  -- Generate secure token using md5 + gen_random_uuid (more compatible)
  v_token := md5(random()::text || clock_timestamp()::text || v_user_id::text);

  -- Invalidate previous tokens
  UPDATE public.password_resets
  SET used_at = NOW()
  WHERE user_id = v_user_id AND used_at IS NULL;

  -- Create new token (valid for 1 hour)
  INSERT INTO public.password_resets (user_id, token, expires_at)
  VALUES (v_user_id, v_token, NOW() + INTERVAL '1 hour');

  RETURN v_token;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_password_reset_token(text) TO anon, authenticated;