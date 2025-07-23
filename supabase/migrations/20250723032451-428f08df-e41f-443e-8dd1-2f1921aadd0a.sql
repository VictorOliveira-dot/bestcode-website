-- Habilitar RLS na tabela password_resets
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Corrigir função para evitar erro de email case-sensitive
CREATE OR REPLACE FUNCTION public.create_password_reset_token(p_email TEXT)
RETURNS TEXT
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

-- Melhorar a função de aulas com timezone brasileiro
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
  ORDER BY l.date ASC;
END;
$$;