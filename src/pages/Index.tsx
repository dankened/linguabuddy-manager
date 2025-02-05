
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Users, BookOpen, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ClassDetailsDialog from "@/components/ClassDetailsDialog";

// Mock data for the class that will be shown in the dialog
const mockClassData = {
  id: 1,
  language: "Inglês",
  level: "Avançado",
  type: "Turma",
  days: ["Segunda", "Quarta"],
  time: "14:00",
  students: [
    {
      id: 1,
      name: "João Silva",
      phone: "(11) 99999-9999",
      email: "joao@email.com",
      birthday: "1990-01-01",
    },
    {
      id: 2,
      name: "Maria Santos",
      phone: "(11) 88888-8888",
      email: "maria@email.com",
      birthday: "1992-05-15",
    },
  ],
  active: true,
};

const stats = [
  {
    title: "Alunos Ativos",
    value: "32",
    icon: Users,
    color: "bg-primary",
  },
  {
    title: "Turmas",
    value: "4",
    icon: BookOpen,
    color: "bg-secondary",
    link: "/classes",
  },
  {
    title: "Aulas Esta Semana",
    value: "12",
    icon: Calendar,
    color: "bg-primary-light",
  },
];

const Index = () => {
  const [selectedClass, setSelectedClass] = useState<typeof mockClassData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bem-vinda, Professora!</h1>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              {stat.link ? (
                <Link to={stat.link}>
                  <div className="flex items-start justify-between cursor-pointer">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Próximas Aulas</h2>
            <div className="space-y-4">
              {[
                {
                  turma: "Inglês Avançado",
                  horario: "14:00 - 15:30",
                  data: "Hoje",
                },
                {
                  turma: "Espanhol Iniciante",
                  horario: "16:00 - 17:30",
                  data: "Hoje",
                },
                {
                  turma: "Francês Intermediário",
                  horario: "09:00 - 10:30",
                  data: "Amanhã",
                },
              ].map((aula) => (
                <div
                  key={aula.turma}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setSelectedClass(mockClassData);
                    setDialogOpen(true);
                  }}
                >
                  <div>
                    <p className="font-medium">{aula.turma}</p>
                    <p className="text-sm text-gray-600">{aula.horario}</p>
                  </div>
                  <span className="text-sm text-primary font-medium">
                    {aula.data}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Avisos Importantes</h2>
            <div className="space-y-4">
              {[
                {
                  titulo: "Feriado Próxima Semana",
                  descricao:
                    "Não haverá aulas na próxima segunda-feira devido ao feriado.",
                },
                {
                  titulo: "Avaliação Bimestral",
                  descricao:
                    "Preparar material de avaliação para todas as turmas.",
                },
                {
                  titulo: "Novo Material Disponível",
                  descricao:
                    "Materiais de conversação atualizados na plataforma.",
                },
              ].map((aviso) => (
                <div
                  key={aviso.titulo}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <p className="font-medium">{aviso.titulo}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {aviso.descricao}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selectedClass && (
        <ClassDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          classData={selectedClass}
        />
      )}
    </Layout>
  );
};

export default Index;
