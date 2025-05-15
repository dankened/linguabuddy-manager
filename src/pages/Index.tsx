
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  const { user, isTeacher } = useAuth();
  
  return (
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          {isTeacher 
            ? "Bem-vindo(a) ao painel do professor! Gerencie suas turmas e alunos." 
            : "Bem-vindo(a) ao seu painel de estudante!"}
        </p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atualizações na plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-2">
              <p className="font-medium">Material adicionado</p>
              <p className="text-sm text-muted-foreground">Lições de gramática - Inglês Intermediário</p>
            </div>
            <div className="border-b pb-2">
              <p className="font-medium">Nova aula agendada</p>
              <p className="text-sm text-muted-foreground">Conversação em Inglês - Quinta-feira 19:00</p>
            </div>
            <div>
              <p className="font-medium">Avaliação disponível</p>
              <p className="text-sm text-muted-foreground">Prova mensal - Francês básico</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Informações importantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium">Pagamento Recebido</p>
                <p className="text-sm text-muted-foreground">Mensalidade de Maio processada com sucesso</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-lg border p-3">
              <div>
                <p className="font-medium">Lembrete de Aula</p>
                <p className="text-sm text-muted-foreground">Francês Básico - amanhã às 15:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isTeacher ? (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pagamentos</CardTitle>
              <CardDescription>Mensalidades a vencer nos próximos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">Inglês Avançado</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 250,00</p>
                  <p className="text-sm text-muted-foreground">Vence em 2 dias</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Maria Oliveira</p>
                  <p className="text-sm text-muted-foreground">Espanhol Intermediário</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 200,00</p>
                  <p className="text-sm text-muted-foreground">Vence em 3 dias</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Pedro Santos</p>
                  <p className="text-sm text-muted-foreground">Francês Básico</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 180,00</p>
                  <p className="text-sm text-muted-foreground">Vence em 5 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Seus Pagamentos</CardTitle>
              <CardDescription>Informações financeiras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="font-medium">Próxima mensalidade</p>
                <div className="text-right">
                  <p className="font-medium">R$ 220,00</p>
                  <p className="text-sm text-muted-foreground">Vence em 10 dias</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-medium">Status</p>
                <p className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Em dia</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
