-- Confirmar apenas o email_confirmed_at para os usuários de demonstração
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email IN ('professor@demo.com', 'estudante@demo.com');