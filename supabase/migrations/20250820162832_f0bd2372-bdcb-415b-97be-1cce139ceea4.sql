-- Criar função security definer para obter o role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Remover a política problemática
DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.profiles;

-- Criar nova política usando a função security definer
CREATE POLICY "Teachers can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_role() = 'teacher'::user_role);