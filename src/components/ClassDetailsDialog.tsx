
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, PencilLine, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
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
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null);
  const [newStudent, setNewStudent] = React.useState({
    name: "",
    phone: "",
    email: "",
    birthday: "",
  });

  const handleAddStudent = () => {
    // Here you would typically make an API call to add the student
    console.log("Adding student:", newStudent);
    // Reset form and hide it
    setNewStudent({ name: "", phone: "", email: "", birthday: "" });
    setShowAddForm(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
  };

  const handleDeleteStudent = (studentId: number) => {
    console.log("Deleting student:", studentId);
    // Here you would typically make an API call to delete the student
  };

  const handleSaveEdit = () => {
    if (!editingStudent) return;
    console.log("Saving edited student:", editingStudent);
    // Here you would typically make an API call to update the student
    setEditingStudent(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Turma</DialogTitle>
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

          {classData.active && (
            <div>
              {!showAddForm ? (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowAddForm(true)}
                  className="mb-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Adicionar Novo Aluno</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowAddForm(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-4 items-end">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                      <Input
                        placeholder="Nome"
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Telefone"
                        value={newStudent.phone}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, phone: e.target.value })
                        }
                      />
                      <Input
                        placeholder="E-mail"
                        type="email"
                        value={newStudent.email}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, email: e.target.value })
                        }
                      />
                      <Input
                        placeholder="Data de Aniversário"
                        type="date"
                        value={newStudent.birthday}
                        onChange={(e) =>
                          setNewStudent({
                            ...newStudent,
                            birthday: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Button onClick={handleAddStudent}>Adicionar Aluno</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Nome</TableHead>
                <TableHead className="w-[25%]">Telefone</TableHead>
                <TableHead className="w-[25%]">E-mail</TableHead>
                <TableHead className="w-[25%]">Data de Aniversário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classData.students.map((student) => (
                <ContextMenu key={student.id}>
                  <ContextMenuTrigger>
                    <TableRow>
                      <TableCell className="font-medium">
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
                          <div className="flex gap-2">
                            <Input
                              type="date"
                              value={editingStudent.birthday}
                              onChange={(e) =>
                                setEditingStudent({
                                  ...editingStudent,
                                  birthday: e.target.value,
                                })
                              }
                            />
                            <Button onClick={handleSaveEdit}>Salvar</Button>
                          </div>
                        ) : (
                          format(new Date(student.birthday), "dd/MM/yyyy")
                        )}
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={() => handleEditStudent(student)}
                      className="flex gap-2 items-center"
                    >
                      <PencilLine className="h-4 w-4" />
                      Editar
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleDeleteStudent(student.id)}
                      className="flex gap-2 items-center text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Excluir
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;

