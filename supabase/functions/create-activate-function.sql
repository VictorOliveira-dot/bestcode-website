
-- Create a function to activate student accounts that ensures the update always happens
CREATE OR REPLACE FUNCTION public.activate_student_account(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = PUBLIC
AS $$
BEGIN
  -- Update the user to active status (only for students)
  UPDATE public.users
  SET 
    is_active = TRUE,
    updated_at = NOW()
  WHERE 
    id = user_id 
    AND role = 'student';
    
  -- Return true if the update affected any rows
  RETURN FOUND;
END;
$$;
