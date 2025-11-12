-- Garantir que a função is_teacher existe (já existe mas vamos garantir)
CREATE OR REPLACE FUNCTION public.is_teacher(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'teacher'
  );
END;
$$;

-- Policies explícitas de negação para estudantes em materials
DROP POLICY IF EXISTS "Students cannot insert materials" ON public.materials;
CREATE POLICY "Students cannot insert materials"
ON public.materials
FOR INSERT
TO authenticated
WITH CHECK (is_teacher(auth.uid()));

DROP POLICY IF EXISTS "Students cannot update materials" ON public.materials;
CREATE POLICY "Students cannot update materials"
ON public.materials
FOR UPDATE
TO authenticated
USING (is_teacher(auth.uid()));

DROP POLICY IF EXISTS "Students cannot delete materials" ON public.materials;
CREATE POLICY "Students cannot delete materials"
ON public.materials
FOR DELETE
TO authenticated
USING (is_teacher(auth.uid()));

-- Policies explícitas de negação para estudantes em assessments
DROP POLICY IF EXISTS "Students cannot insert assessments" ON public.assessments;
CREATE POLICY "Students cannot insert assessments"
ON public.assessments
FOR INSERT
TO authenticated
WITH CHECK (is_teacher(auth.uid()));

DROP POLICY IF EXISTS "Students cannot update assessments" ON public.assessments;
CREATE POLICY "Students cannot update assessments"
ON public.assessments
FOR UPDATE
TO authenticated
USING (is_teacher(auth.uid()));

DROP POLICY IF EXISTS "Students cannot delete assessments" ON public.assessments;
CREATE POLICY "Students cannot delete assessments"
ON public.assessments
FOR DELETE
TO authenticated
USING (is_teacher(auth.uid()));