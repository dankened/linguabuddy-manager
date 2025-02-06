
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Search, Filter } from "lucide-react";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  class: string;
}

interface ActiveStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  students: Student[];
}

const ActiveStudentsDialog = ({
  open,
  onOpenChange,
  students,
}: ActiveStudentsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alunos Ativos</DialogTitle>
        </DialogHeader>

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
          <div className="grid grid-cols-5 gap-4 p-4 font-medium bg-muted">
            <div>Nome</div>
            <div>Telefone</div>
            <div>E-mail</div>
            <div>Aniversário</div>
            <div>Turma</div>
          </div>
          <div className="divide-y">
            {students.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/50"
              >
                <div>{student.name}</div>
                <div>{student.phone}</div>
                <div>{student.email}</div>
                <div>{format(new Date(student.birthday), "dd/MM/yyyy")}</div>
                <div>{student.class}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActiveStudentsDialog;
