
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Plus, X, Pencil } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  monthlyFee?: number; // New field
  paymentDay?: number; // New field
}

interface ClassDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: {
    id: number;
    language: string;
    level: string;
    type: string;
    days: string[];
    time: string;
    students: Student[];
    active: boolean;
  };
}

const ClassDetailsDialog = ({
  open,
  onOpenChange,
  classData,
}: ClassDetailsDialogProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    phone: "",
    email: "",
    birthday: "",
    monthlyFee: 0,
    paymentDay: 1,
  });

  // Calculate the total monthly revenue for this class
  const totalMonthlyRevenue = classData.students.reduce(
    (sum, student) => sum + (student.monthlyFee || 0),
    0
  );

  const handleAddStudent = () => {
    // Em um caso real, isso seria uma chamada à API
    toast({
      title: "Aluno adicionado",
      description: "O aluno foi adicionado com sucesso à turma.",
    });
    setShowAddForm(false);
    setNewStudent({
      name: "",
      phone: "",
      email: "",
      birthday: "",
      monthlyFee: 0,
      paymentDay: 1,
    });
  };

  const handleEditStudent = (student: Student) => {
    // Em um caso real, isso seria uma chamada à API
    toast({
      title: "Aluno atualizado",
      description: "Os dados do aluno foram atualizados com sucesso.",
    });
    setEditingStudent(null);
  };

  const handleRemoveStudent = (studentId: number) => {
    // Em um caso real, isso seria uma chamada à API
    toast({
      title: "Aluno removido",
      description: "O aluno foi removido da turma com sucesso.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes da Turma</DialogTitle>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Receita Mensal:</span>
              <span className="font-medium text-primary">
                R$ {totalMonthlyRevenue.toFixed(2)}
              </span>
            </div>
          </div>
          <DialogDescription>
            Informações completas sobre a turma e seus alunos
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Idioma:</span>
              <span className="ml-2 font-medium">{classData.language}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Nível:</span>
              <span className="ml-2 font-medium">{classData.level}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <span className="ml-2 font-medium">{classData.type}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Dias:</span>
              <span className="ml-2 font-medium">
                {classData.days.join(", ")}
              </span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Horário:</span>
              <span className="ml-2 font-medium">{classData.time}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Aluno
              </Button>
            </div>

            {showAddForm && (
              <div className="border rounded-lg p-4 relative space-y-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setShowAddForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={newStudent.name}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-mail</label>
                    <Input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Data de Aniversário</label>
                    <Input
                      type="date"
                      value={newStudent.birthday}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, birthday: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Valor da Mensalidade (R$)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newStudent.monthlyFee}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, monthlyFee: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dia de Pagamento</label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={newStudent.paymentDay}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, paymentDay: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleAddStudent}>Adicionar</Button>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Nome</TableHead>
                  <TableHead className="w-[15%]">Telefone</TableHead>
                  <TableHead className="w-[20%]">E-mail</TableHead>
                  <TableHead className="w-[15%]">Data de Aniversário</TableHead>
                  <TableHead className="w-[15%]">Mensalidade</TableHead>
                  <TableHead className="w-[5%]">Dia Pagto</TableHead>
                  <TableHead className="w-[10%]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classData.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          value={editingStudent.name}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        student.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          value={editingStudent.phone}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              phone: e.target.value,
                            })
                          }
                        />
                      ) : (
                        student.phone
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          type="email"
                          value={editingStudent.email}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        student.email
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          type="date"
                          value={editingStudent.birthday.split("T")[0]}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              birthday: e.target.value,
                            })
                          }
                        />
                      ) : (
                        format(new Date(student.birthday), "dd/MM/yyyy")
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingStudent.monthlyFee || 0}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              monthlyFee: parseFloat(e.target.value),
                            })
                          }
                        />
                      ) : (
                        `R$ ${(student.monthlyFee || 0).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingStudent?.id === student.id ? (
                        <Input
                          type="number"
                          min="1"
                          max="31"
                          value={editingStudent.paymentDay || 1}
                          onChange={(e) =>
                            setEditingStudent({
                              ...editingStudent,
                              paymentDay: parseInt(e.target.value),
                            })
                          }
                        />
                      ) : (
                        student.paymentDay || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingStudent?.id === student.id ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditStudent(editingStudent)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingStudent(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;
