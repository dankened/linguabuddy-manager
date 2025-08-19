-- Inserir um usuário professor de demonstração
-- Como não podemos inserir diretamente na tabela auth.users, vamos criar um perfil para um usuário existente
-- Primeiro, vamos inserir um perfil de professor de demonstração
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
  'b8c4a2e0-7f3d-4e6b-9c1a-2d5e8f7b9a4c'::uuid,
  'professor@demo.com',
  'João',
  'Silva',
  'teacher'
);

-- Inserir um perfil de estudante de demonstração
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid,
  'estudante@demo.com',
  'Maria',
  'Santos',
  'student'
);

-- Inserir dados adicionais do estudante
INSERT INTO public.students (id, phone, monthly_fee, payment_day, notes)
VALUES (
  'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid,
  '(11) 99999-9999',
  150.00,
  10,
  'Estudante de demonstração - muito dedicada'
);

-- Criar uma turma de demonstração
INSERT INTO public.classes (id, teacher_id, name, description, language, level, type, days, time)
VALUES (
  'c1a2s3s4-5d6e-7m8o-9012-3456789abcde'::uuid,
  'b8c4a2e0-7f3d-4e6b-9c1a-2d5e8f7b9a4c'::uuid,
  'Inglês Intermediário',
  'Turma de inglês nível intermediário com foco em conversação',
  'Inglês',
  'Intermediário',
  'Presencial',
  ARRAY['segunda', 'quarta', 'sexta'],
  '19:00'
);

-- Matricular o estudante na turma
INSERT INTO public.class_enrollments (class_id, student_id)
VALUES (
  'c1a2s3s4-5d6e-7m8o-9012-3456789abcde'::uuid,
  'a1b2c3d4-e5f6-7890-1234-567890abcdef'::uuid
);