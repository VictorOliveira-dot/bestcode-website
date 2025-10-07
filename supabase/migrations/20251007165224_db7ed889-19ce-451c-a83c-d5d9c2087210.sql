-- Ensure required extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Recreate RPC to ensure visibility and correct lookup
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
  -- Prefer auth.users (source of truth for authentication)
  SELECT id INTO v_user_id FROM auth.users WHERE LOWER(email) = LOWER(p_email);

  -- Fallback to public.users for legacy records
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.users WHERE LOWER(email) = LOWER(p_email);
  END IF;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Email não encontrado';
  END IF;

  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');

  -- Invalidate previous tokens for this user
  UPDATE public.password_resets
  SET used_at = NOW()
  WHERE user_id = v_user_id AND used_at IS NULL;

  -- Create new token (valid for 1 hour)
  INSERT INTO public.password_resets (user_id, token, expires_at)
  VALUES (v_user_id, v_token, NOW() + INTERVAL '1 hour');

  RETURN v_token;
END;
$$;

-- Critical: expose RPC to PostgREST for anon/authenticated roles
GRANT EXECUTE ON FUNCTION public.create_password_reset_token(text) TO anon, authenticated;
