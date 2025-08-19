-- Políticas básicas de RLS para as tabelas

-- Políticas para estudantes
CREATE POLICY "Users can view own student data" ON public.students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can view all students" ON public.students
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'
  ));

-- Políticas para turmas
CREATE POLICY "Teachers can manage own classes" ON public.classes
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view enrolled classes" ON public.classes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    WHERE ce.class_id = id AND ce.student_id = auth.uid() AND ce.active = true
  ));

-- Políticas para matrículas
CREATE POLICY "Teachers can view class enrollments" ON public.class_enrollments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.classes c WHERE c.id = class_id AND c.teacher_id = auth.uid()
  ));

CREATE POLICY "Students can view own enrollments" ON public.class_enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Políticas para materiais
CREATE POLICY "Teachers can manage own materials" ON public.materials
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view class materials" ON public.materials
  FOR SELECT USING (
    class_id IS NULL OR EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = materials.class_id AND ce.student_id = auth.uid() AND ce.active = true
    )
  );

-- Políticas para eventos
CREATE POLICY "Teachers can manage own events" ON public.events
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view class events" ON public.events
  FOR SELECT USING (
    class_id IS NULL OR EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      WHERE ce.class_id = events.class_id AND ce.student_id = auth.uid() AND ce.active = true
    )
  );

-- Políticas para avaliações
CREATE POLICY "Teachers can manage own assessments" ON public.assessments
  FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view class assessments" ON public.assessments
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.class_enrollments ce
    WHERE ce.class_id = assessments.class_id AND ce.student_id = auth.uid() AND ce.active = true
  ));

-- Políticas para resultados de avaliações
CREATE POLICY "Teachers can manage assessment results" ON public.assessment_results
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.assessments a
    WHERE a.id = assessment_id AND a.teacher_id = auth.uid()
  ));

CREATE POLICY "Students can view own results" ON public.assessment_results
  FOR SELECT USING (student_id = auth.uid());

-- Políticas para notificações
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());