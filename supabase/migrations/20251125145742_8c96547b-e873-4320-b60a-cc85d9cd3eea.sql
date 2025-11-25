-- Add active status column to students table
ALTER TABLE public.students ADD COLUMN active boolean NOT NULL DEFAULT true;

-- Create function to update student active status based on enrollments
CREATE OR REPLACE FUNCTION public.update_student_active_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Update the student's active status
  -- A student is active if they have at least one active enrollment
  UPDATE students
  SET active = EXISTS (
    SELECT 1
    FROM class_enrollments
    WHERE student_id = COALESCE(NEW.student_id, OLD.student_id)
      AND active = true
  )
  WHERE id = COALESCE(NEW.student_id, OLD.student_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on class_enrollments to update student status
DROP TRIGGER IF EXISTS trigger_update_student_status ON public.class_enrollments;
CREATE TRIGGER trigger_update_student_status
  AFTER INSERT OR UPDATE OR DELETE ON public.class_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_active_status();

-- Initial update: Set all students' active status based on current enrollments
UPDATE public.students
SET active = EXISTS (
  SELECT 1
  FROM class_enrollments
  WHERE student_id = students.id
    AND active = true
);