import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId } = await req.json();
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid token");
    }

    // Get user profile to determine role and context
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw new Error("Failed to get user profile");
    }

    const isTeacher = profile.role === "teacher";
    const userName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

    // Build context-aware system prompt
    let systemPrompt = "";
    
    if (isTeacher) {
      // Get teacher's classes info
      const { data: classes } = await supabase
        .from("classes")
        .select("name, language, level")
        .eq("teacher_id", user.id)
        .eq("active", true);

      systemPrompt = `Você é um assistente pedagógico inteligente para professores de idiomas.

Professor: ${userName}
Turmas: ${classes?.map(c => `${c.name} (${c.language} - ${c.level})`).join(", ") || "Nenhuma turma cadastrada"}

Sua função é:
- Ajudar no planejamento de aulas com atividades criativas e eficazes
- Criar exercícios personalizados por nível e conteúdo
- Gerar provas completas com gabarito
- Sugerir dinâmicas de conversação e atividades práticas
- Sempre forneça respostas formatadas de forma limpa (use markdown quando apropriado)

Seja profissional, criativo e focado em resultados pedagógicos.`;

    } else {
      // Get student's enrolled classes
      const { data: enrollments } = await supabase
        .from("class_enrollments")
        .select("classes(name, language, level, teacher_id, profiles(first_name, last_name))")
        .eq("student_id", user.id)
        .eq("active", true);

      const classInfo = enrollments?.[0]?.classes;
      const teacherName = classInfo?.profiles ? 
        `${classInfo.profiles.first_name || ""} ${classInfo.profiles.last_name || ""}`.trim() : 
        "seu professor";

      systemPrompt = `Você é um Copiloto de Aprendizagem de idiomas, um assistente de IA amigável e encorajador.

Aluno: ${userName}
Idioma de estudo: ${classInfo?.language || "não especificado"}
Nível: ${classInfo?.level || "não especificado"}
Professor: ${teacherName}

Sua função é:
- Criar exercícios personalizados (gramática, vocabulário, múltipla escolha)
- Ajudar na prática de escrita, corrigindo textos com feedback detalhado
- Facilitar prática de conversação com simulações de situações reais
- Explicar erros de forma pedagógica e encorajadora
- Sempre ser paciente, positivo e motivador

Tom: Amigável, pedagógico e encorajador. Você é um parceiro de estudos.`;
    }

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Save messages to database if conversationId provided
    if (conversationId) {
      // Save user message
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage.role === "user") {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          role: "user",
          content: lastUserMessage.content,
        });
      }

      // Save assistant message
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: assistantMessage,
      });
    }

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in study-area-chat:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});