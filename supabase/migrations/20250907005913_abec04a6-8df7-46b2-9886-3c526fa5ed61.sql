-- 1. Verificar e adicionar colunas necessárias à user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student';

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS name text;

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS email text;

-- 2. Migrar dados existentes do users para user_profiles
INSERT INTO public.user_profiles (id, role, name, email, created_at)
SELECT id, role, name, email, created_at
FROM public.users
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- 3. Remover TODAS as policies problemáticas do users
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can select all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Teachers can view their students" ON public.users;

-- 4. Apenas service_role pode acessar users (necessário para Supabase Auth)
CREATE POLICY "Allow service role full access"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 5. Policies para user_profiles (sem recursão)
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Trigger para sincronizar novos usuários
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    name = EXCLUDED.name,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();