import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Users, BookOpen, Calendar, BellDot, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ClassDetailsDialog from "@/components/ClassDetailsDialog";
import ActiveStudentsDialog from "@/components/ActiveStudentsDialog";

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
      monthlyFee: 250.00,
      paymentDay: 5,
    },
    {
      id: 2,
      name: "Maria Santos",
      phone: "(11) 88888-8888",
      email: "maria@email.com",
      birthday: "1992-05-15",
      monthlyFee: 300.00,
      paymentDay: 10,
    },
  ],
  active: true,
};

// Mock data for active students
const mockActiveStudents = [
  {
    id: 1,
    name: "João Silva",
    phone: "(11) 99999-9999",
    email: "joao@email.com",
    birthday: "1990-01-01",
    class: "Inglês Avançado",
    monthlyFee: 250.00,
    paymentDay: 5,
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "(11) 88888-8888",
    email: "maria@email.com",
    birthday: "1992-05-15",
    class: "Espanhol Iniciante",
    monthlyFee: 300.00,
    paymentDay: 10,
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    phone: "(11) 77777-7777",
    email: "pedro@email.com",
    birthday: "1988-12-20",
    class: "Francês Intermediário",
    monthlyFee: 280.00,
    paymentDay: 15,
  },
  {
    id: 4,
    name: "Ana Costa",
    phone: "(11) 66666-6666",
    email: "ana@email.com",
    birthday: "1995-08-25",
    class: "Inglês Avançado",
    monthlyFee: 250.00,
    paymentDay: 20,
  },
];

// Calculate total monthly revenue from all active students
const totalMonthlyRevenue = mockActiveStudents.reduce(
  (sum, student) => sum + (student.monthlyFee || 0),
  0
);

const stats = [
  {
    title: "Alunos Ativos",
    value: "32",
    icon: Users,
    color: "bg-primary",
    onClick: () => {},
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
  {
    title: "Receita Mensal",
    value: `R$ ${totalMonthlyRevenue.toFixed(2)}`,
    icon: DollarSign,
    color: "bg-green-600",
  },
];

// Function to get payment reminders for the current week
const getWeeklyPaymentReminders = (students) => {
  const today = new Date();
  const todayDate = today.getDate();
  
  // Get the start and end of the current week (Sunday to Saturday)
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startDate = startOfWeek.getDate();
  const endDate = endOfWeek.getDate();
  
  // Filter students whose payment days fall within this week
  return students.map(student => ({
    ...student,
    isToday: student.paymentDay === todayDate,
    isThisWeek: (student.paymentDay >= startDate && student.paymentDay <= endDate) || 
                (endDate < startDate && (student.paymentDay >= startDate || student.paymentDay <= endDate))
  })).filter(student => student.isThisWeek);
};

const Index = () => {
  const [selectedClass, setSelectedClass] = useState<typeof mockClassData | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeStudentsDialogOpen, setActiveStudentsDialogOpen] = useState(false);
  const [paymentReminders, setPaymentReminders] = useState([]);
  
  useEffect(() => {
    // Get payment reminders for this week
    const reminders = getWeeklyPaymentReminders(mockActiveStudents);
    setPaymentReminders(reminders);
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bem-vinda, Professora!</h1>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => {
                    if (stat.title === "Alunos Ativos") {
                      setActiveStudentsDialogOpen(true);
                    }
                  }}
                >
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
            <h2 className="text-xl font-semibold mb-4">Lembretes</h2>
            <div className="space-y-4">
              {/* Payment reminders */}
              {paymentReminders.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center">
                    <BellDot className="h-4 w-4 mr-1 text-primary" />
                    Pagamentos da Semana
                  </h3>
                  {paymentReminders.map((student) => (
                    <div
                      key={student.id}
                      className={`p-3 border rounded-lg ${
                        student.isToday
                          ? "border-primary bg-primary/10"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.class} - Dia {student.paymentDay}
                          </p>
                        </div>
                        <div className="text-primary font-medium">
                          R$ {student.monthlyFee.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other reminders */}
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

      <ActiveStudentsDialog
        open={activeStudentsDialogOpen}
        onOpenChange={setActiveStudentsDialogOpen}
        students={mockActiveStudents}
      />
    </Layout>
  );
};

export default Index;
