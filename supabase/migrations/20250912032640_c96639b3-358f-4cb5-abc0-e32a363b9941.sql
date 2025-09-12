-- Update admin_delete_student to cascade delete dependent records safely
CREATE OR REPLACE FUNCTION public.admin_delete_student(p_student_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Ensure only admins can execute
    IF NOT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can delete students';
    END IF;

    -- Remove dependent data first to avoid FK conflicts
    -- Lesson progress
    DELETE FROM public.lesson_progress WHERE student_id = p_student_id;

    -- Notifications (received and sent)
    DELETE FROM public.notifications WHERE user_id = p_student_id OR sender_id = p_student_id;

    -- Payments
    DELETE FROM public.user_payments WHERE user_id = p_student_id;

    -- Student documents linked through applications
    DELETE FROM public.student_documents sd
    USING public.student_applications sa
    WHERE sd.application_id = sa.id
      AND sa.user_id = p_student_id;

    -- Student applications
    DELETE FROM public.student_applications WHERE user_id = p_student_id;

    -- Enrollments
    DELETE FROM public.enrollments WHERE student_id = p_student_id;

    -- Profile
    DELETE FROM public.user_profiles WHERE id = p_student_id;

    -- Finally delete the user (only if it's a student)
    DELETE FROM public.users
    WHERE id = p_student_id AND role = 'student';
END;
$function$;