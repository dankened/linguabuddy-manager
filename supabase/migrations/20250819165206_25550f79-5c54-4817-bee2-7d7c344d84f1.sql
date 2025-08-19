-- Alterar o role do professor de demonstração
UPDATE public.profiles 
SET role = 'teacher' 
WHERE email = 'professor@demo.com';