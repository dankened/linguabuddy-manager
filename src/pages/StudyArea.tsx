import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Mic, Send, Copy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export default function StudyArea() {
  const { user, isTeacher } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Welcome messages based on role
  const welcomeMessage = isTeacher
    ? "Olá, Professor! Bem-vindo à sua Área de Estudo. Posso ajudar a planejar alguma atividade ou criar exercícios?"
    : "Olá! Bem-vindo à sua Área de Estudo. Pronto para praticar? Você pode me pedir exercícios de gramática, praticar seu speaking ou pedir ajuda para escrever um texto.";

  const suggestions = isTeacher
    ? ["Planejar uma aula", "Criar exercícios para uma turma", "Criar uma prova"]
    : ["Me crie exercícios", "Vamos praticar speaking", "Corrija este texto"];

  // Initialize or load conversation
  useEffect(() => {
    const initConversation = async () => {
      if (!user) return;

      // Try to load the most recent conversation
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      if (conversations && conversations.length > 0) {
        const convId = conversations[0].id;
        setConversationId(convId);

        // Load messages from this conversation
        const { data: loadedMessages } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", convId)
          .order("created_at", { ascending: true });

        if (loadedMessages) {
          setMessages(loadedMessages as Message[]);
        }
      } else {
        // Create new conversation
        const { data: newConv } = await supabase
          .from("conversations")
          .insert({ user_id: user.id, title: "Nova Conversa" })
          .select()
          .single();

        if (newConv) {
          setConversationId(newConv.id);
        }
      }
    };

    initConversation();
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content?: string) => {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading || !conversationId) return;

    setIsLoading(true);
    setInput("");

    // Add user message to UI
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Call edge function
      const { data, error } = await supabase.functions.invoke("study-area-chat", {
        body: {
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          conversationId,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      // Add assistant message to UI
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Conteúdo copiado para área de transferência",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Área de Estudo</h1>
        <p className="text-muted-foreground">
          Seu assistente de IA para {isTeacher ? "ensino" : "aprendizado"} de idiomas
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="space-y-6">
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="text-lg">{welcomeMessage}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    onClick={() => sendMessage(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                      {isTeacher && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="resize-none"
              rows={3}
              disabled={isLoading}
            />
            <div className="flex flex-col gap-2">
              {!isTeacher && (
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isLoading}
                  title="Gravar áudio (em breve)"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}