-- Ensure RPC is executable by authenticated users so PostgREST exposes it
GRANT EXECUTE ON FUNCTION public.admin_update_student_data(
  uuid,
  text, text, text, text, text, text, text,
  date,
  text, text, text, text, text, text
) TO authenticated;

-- Optional: also allow service_role (already superuser, but explicit for clarity)
GRANT EXECUTE ON FUNCTION public.admin_update_student_data(
  uuid,
  text, text, text, text, text, text, text,
  date,
  text, text, text, text, text, text
) TO service_role;

-- Reload PostgREST schema cache to reflect permission changes immediately
NOTIFY pgrst, 'reload schema';