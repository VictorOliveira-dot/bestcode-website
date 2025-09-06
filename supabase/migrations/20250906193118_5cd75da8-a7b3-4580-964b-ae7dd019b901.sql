-- Função para testar admin_update_student_data
SELECT admin_update_student_data(
  p_student_id := (SELECT id FROM users WHERE role = 'student' LIMIT 1),
  p_name := 'Teste'
) LIMIT 1;