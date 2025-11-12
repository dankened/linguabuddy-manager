import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateStudentRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday?: string;
  phone?: string;
  monthlyFee?: number;
  paymentDay?: number;
  notes?: string;
  classIds?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify teacher role using anon client
    const supabaseAnon = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is teacher
    const { data: profile, error: profileError } = await supabaseAnon
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'teacher') {
      console.error('Not a teacher:', profileError);
      return new Response(
        JSON.stringify({ error: 'Only teachers can create students' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const body: CreateStudentRequest = await req.json();
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      birthday, 
      phone, 
      monthlyFee, 
      paymentDay, 
      notes,
      classIds = []
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, firstName, lastName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate that classes belong to the teacher
    if (classIds.length > 0) {
      const { data: teacherClasses, error: classError } = await supabaseAnon
        .from('classes')
        .select('id')
        .eq('teacher_id', user.id)
        .in('id', classIds);

      if (classError || !teacherClasses || teacherClasses.length !== classIds.length) {
        console.error('Invalid classes:', classError);
        return new Response(
          JSON.stringify({ error: 'Invalid class IDs or classes do not belong to teacher' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create user with service role (bypasses email confirmation)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (createError || !newUser.user) {
      console.error('Error creating user:', createError);
      return new Response(
        JSON.stringify({ error: createError?.message || 'Failed to create user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User created:', newUser.user.id);

    // The trigger handle_new_user() will automatically create the profile with role='student'
    // Wait a bit for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Insert additional student data
    const { error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        id: newUser.user.id,
        birthday: birthday || null,
        phone: phone || null,
        monthly_fee: monthlyFee || null,
        payment_day: paymentDay || null,
        notes: notes || null,
      });

    if (studentError) {
      console.error('Error creating student record:', studentError);
      // Don't fail completely, student can still login
    }

    // Enroll student in classes
    if (classIds.length > 0) {
      const enrollments = classIds.map(classId => ({
        class_id: classId,
        student_id: newUser.user.id,
        active: true,
      }));

      const { error: enrollError } = await supabaseAdmin
        .from('class_enrollments')
        .insert(enrollments);

      if (enrollError) {
        console.error('Error enrolling student:', enrollError);
        // Don't fail completely
      }
    }

    console.log('Student created successfully:', newUser.user.id);

    return new Response(
      JSON.stringify({
        success: true,
        student: {
          id: newUser.user.id,
          email: newUser.user.email,
          firstName,
          lastName,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in create-student function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

serve(handler);
