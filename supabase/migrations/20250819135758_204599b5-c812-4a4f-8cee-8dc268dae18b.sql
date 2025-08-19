-- Confirmar os emails dos usuários de demonstração manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmed_at = NOW() 
WHERE email IN ('professor@demo.com', 'estudante@demo.com');