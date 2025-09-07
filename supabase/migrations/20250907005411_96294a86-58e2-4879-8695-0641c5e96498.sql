-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remover policies antigas para evitar conflitos
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Service role can select all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Teachers can view their students" ON public.users;

-- 🔑 1. Policies para Supabase Auth (service role)
-- Service role pode inserir usuários (registro/login)
CREATE POLICY "Service role can insert users" 
ON public.users 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Service role pode consultar usuários (necessário para login)
CREATE POLICY "Service role can select all users" 
ON public.users 
FOR SELECT 
TO service_role
USING (true);

-- 🔒 2. Policies para usuários autenticados
-- Cada usuário só pode visualizar seu próprio perfil
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Cada usuário só pode atualizar seu próprio perfil
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 👨‍🏫 3. Policies para professores
-- Professores podem visualizar apenas seus alunos
CREATE POLICY "Teachers can view their students" 
ON public.users 
FOR SELECT 
USING (
  role = 'student'
  AND EXISTS (
    SELECT 1
    FROM public.enrollments e
    JOIN public.classes c ON e.class_id = c.id
    WHERE e.student_id = users.id 
      AND c.teacher_id = auth.uid()
  )
);

-- 👑 4. Policies para administradores
-- Admins podem visualizar qualquer usuário
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins podem atualizar qualquer usuário
CREATE POLICY "Admins can update all users" 
ON public.users 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admins podem deletar qualquer usuário
CREATE POLICY "Admins can delete users" 
ON public.users 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);