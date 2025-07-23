-- Criar função para excluir aluno (corrigir violação de foreign key)
CREATE OR REPLACE FUNCTION public.admin_delete_student(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can delete students';
    END IF;

    -- Delete user record
    DELETE FROM users
    WHERE id = p_student_id AND role = 'student';
END;
$$;