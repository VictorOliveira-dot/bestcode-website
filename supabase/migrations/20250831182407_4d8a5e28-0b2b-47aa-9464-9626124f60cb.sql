-- Habilitar RLS apenas para tabelas reais (não views)
-- class_enrollments_view é uma view, então não pode ter RLS

-- Verificar e habilitar RLS onde necessário
DO $$
BEGIN
  -- Habilitar RLS para password_resets se não estiver habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'password_resets' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Habilitar RLS para student_applications se não estiver habilitado  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'student_applications' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Habilitar RLS para student_documents se não estiver habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'student_documents' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Habilitar RLS para user_payments se não estiver habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_payments' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_payments ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Habilitar RLS para user_profiles se não estiver habilitado
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;