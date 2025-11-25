-- Fix infinite recursion in classes RLS policy
-- The problem is that the student policy tries to check class_enrollments which checks classes again
DROP POLICY IF EXISTS "Students can view enrolled classes" ON public.classes;

-- Create a simpler policy for students viewing classes
CREATE POLICY "Students can view enrolled classes"
ON public.classes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM class_enrollments ce
    WHERE ce.class_id = classes.id 
    AND ce.student_id = auth.uid() 
    AND ce.active = true
  )
);