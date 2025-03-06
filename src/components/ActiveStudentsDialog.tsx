
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  class: string;
  monthlyFee?: number; // New field
  paymentDay?: number; // New field
}

interface ActiveStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

const StudentProfileCard = ({ student, onClose }: { student: Student, onClose: () => void }) => {
  return (
    <Card className="border rounded-lg shadow-md w-full">
      <div className="relative p-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <h3 className="text-xl font-semibold mb-4">{student.name}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Telefone</p>
            <p className="font-medium">{student.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-mail</p>
            <p className="font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
            <p className="font-medium">{format(new Date(student.birthday), "dd/MM/yyyy")}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Turma</p>
            <p className="font-medium">{student.class}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mensalidade</p>
            <p className="font-medium text-primary">R$ {(student.monthlyFee || 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dia de Pagamento</p>
            <p className="font-medium">Dia {student.paymentDay || "-"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

const ActiveStudentsDialog = ({
  open,
  onOpenChange,
  students,
}: ActiveStudentsDialogProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alunos Ativos</DialogTitle>
          <DialogDescription>
            Visualize informações dos alunos ativos na plataforma
          </DialogDescription>
        </DialogHeader>

        {selectedStudent ? (
          <StudentProfileCard 
            student={selectedStudent} 
            onClose={() => setSelectedStudent(null)} 
          />
        ) : (
          <>
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar aluno..."
                  className="pl-8"
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as turmas</SelectItem>
                  <SelectItem value="english-advanced">Inglês Avançado</SelectItem>
                  <SelectItem value="spanish-beginner">Espanhol Iniciante</SelectItem>
                  <SelectItem value="french-intermediate">
                    Francês Intermediário
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os meses</SelectItem>
                  <SelectItem value="1">Janeiro</SelectItem>
                  <SelectItem value="2">Fevereiro</SelectItem>
                  <SelectItem value="3">Março</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maio</SelectItem>
                  <SelectItem value="6">Junho</SelectItem>
                  <SelectItem value="7">Julho</SelectItem>
                  <SelectItem value="8">Agosto</SelectItem>
                  <SelectItem value="9">Setembro</SelectItem>
                  <SelectItem value="10">Outubro</SelectItem>
                  <SelectItem value="11">Novembro</SelectItem>
                  <SelectItem value="12">Dezembro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg">
              <div className="grid grid-cols-6 gap-4 p-4 font-medium bg-muted">
                <div>Nome</div>
                <div>Telefone</div>
                <div>E-mail</div>
                <div>Aniversário</div>
                <div>Turma</div>
                <div>Mensalidade</div>
              </div>
              <div className="divide-y">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="grid grid-cols-6 gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div>{student.name}</div>
                    <div>{student.phone}</div>
                    <div>{student.email}</div>
                    <div>{format(new Date(student.birthday), "dd/MM/yyyy")}</div>
                    <div>{student.class}</div>
                    <div className="text-primary">R$ {(student.monthlyFee || 0).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ActiveStudentsDialog;
