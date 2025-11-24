-- Function to generate recurring events for a class
-- Generates events for the next 6 months based on class schedule
CREATE OR REPLACE FUNCTION generate_class_events(p_class_id uuid)
RETURNS void AS $$
DECLARE
  v_class RECORD;
  v_day text;
  v_current_date date;
  v_end_date date;
  v_day_of_week int;
  v_event_start timestamp with time zone;
  v_event_end timestamp with time zone;
  v_event_duration interval := '1 hour'::interval; -- Default 1 hour duration
BEGIN
  -- Get class details
  SELECT * INTO v_class FROM classes WHERE id = p_class_id AND active = true;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Set date range: from today to 6 months in the future
  v_current_date := CURRENT_DATE;
  v_end_date := CURRENT_DATE + interval '6 months';
  
  -- Delete any existing future events for this class
  DELETE FROM events 
  WHERE class_id = p_class_id 
    AND start_time >= NOW();
  
  -- Loop through each day in the date range
  WHILE v_current_date <= v_end_date LOOP
    -- Get day of week (0 = Sunday, 6 = Saturday)
    v_day_of_week := EXTRACT(DOW FROM v_current_date);
    
    -- Convert day of week number to Portuguese day name
    v_day := CASE v_day_of_week
      WHEN 0 THEN 'Domingo'
      WHEN 1 THEN 'Segunda'
      WHEN 2 THEN 'Terça'
      WHEN 3 THEN 'Quarta'
      WHEN 4 THEN 'Quinta'
      WHEN 5 THEN 'Sexta'
      WHEN 6 THEN 'Sábado'
    END;
    
    -- Check if this day is in the class schedule
    IF v_day = ANY(v_class.days) THEN
      -- Create timestamp for event start (date + time)
      v_event_start := v_current_date + v_class.time::time;
      v_event_end := v_event_start + v_event_duration;
      
      -- Only create events in the future
      IF v_event_start >= NOW() THEN
        -- Insert event
        INSERT INTO events (
          teacher_id,
          class_id,
          title,
          description,
          start_time,
          end_time,
          type
        ) VALUES (
          v_class.teacher_id,
          v_class.id,
          v_class.name,
          v_class.description,
          v_event_start,
          v_event_end,
          'class'
        );
      END IF;
    END IF;
    
    -- Move to next day
    v_current_date := v_current_date + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to delete future events when class is deactivated
CREATE OR REPLACE FUNCTION delete_future_class_events(p_class_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM events 
  WHERE class_id = p_class_id 
    AND start_time >= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger function to manage class events on insert/update
CREATE OR REPLACE FUNCTION handle_class_events()
RETURNS TRIGGER AS $$
BEGIN
  -- If class is being activated or updated
  IF (TG_OP = 'INSERT' AND NEW.active = true) OR 
     (TG_OP = 'UPDATE' AND NEW.active = true AND (OLD.active = false OR OLD.days != NEW.days OR OLD.time != NEW.time)) THEN
    -- Generate/regenerate events
    PERFORM generate_class_events(NEW.id);
  END IF;
  
  -- If class is being deactivated
  IF TG_OP = 'UPDATE' AND NEW.active = false AND OLD.active = true THEN
    -- Delete only future events
    PERFORM delete_future_class_events(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on classes table
DROP TRIGGER IF EXISTS trigger_manage_class_events ON classes;
CREATE TRIGGER trigger_manage_class_events
  AFTER INSERT OR UPDATE OF active, days, time ON classes
  FOR EACH ROW
  EXECUTE FUNCTION handle_class_events();

-- Generate events for all existing active classes
DO $$
DECLARE
  v_class RECORD;
BEGIN
  FOR v_class IN SELECT id FROM classes WHERE active = true LOOP
    PERFORM generate_class_events(v_class.id);
  END LOOP;
END $$;