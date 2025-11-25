
import React, { useState, useEffect } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Plus, X, Pencil, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  monthlyFee?: number;
  paymentDay?: number;
}

interface AvailableStudent {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  birthday: string | null;
  monthly_fee: number | null;
  payment_day: number | null;
}

interface ClassDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData: {
    id: string;
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
  const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isNewStudent, setIsNewStudent] = useState(true);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    phone: "",
    email: "",
    birthday: "",
    monthlyFee: 0,
    paymentDay: 1,
  });

  useEffect(() => {
    if (open && showAddForm) {
      fetchAvailableStudents();
    }
  }, [open, showAddForm]);

  const fetchAvailableStudents = async () => {
    try {
      // Get current enrolled student IDs
      const enrolledIds = classData.students.map(s => s.id);

      // Fetch students not in this class
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'student');

      if (studentsError) throw studentsError;

      // Filter out already enrolled students
      const notEnrolled = studentsData?.filter(s => !enrolledIds.includes(s.id)) || [];

      // Get additional details for these students
      const { data: detailsData, error: detailsError } = await supabase
        .from('students')
        .select('*')
        .in('id', notEnrolled.map(s => s.id));

      if (detailsError) throw detailsError;

      // Combine data
      const combined = notEnrolled.map(profile => {
        const details = detailsData?.find(d => d.id === profile.id);
        return {
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          phone: details?.phone || null,
          birthday: details?.birthday || null,
          monthly_fee: details?.monthly_fee || null,
          payment_day: details?.payment_day || null,
        };
      });

      setAvailableStudents(combined);
    } catch (error) {
      console.error('Error fetching available students:', error);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    setComboboxOpen(false);
    setIsNewStudent(false);
    
    const student = availableStudents.find(s => s.id === studentId);
    if (student) {
      setNewStudent({
        name: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        email: student.email,
        phone: student.phone || "",
        birthday: student.birthday || "",
        monthlyFee: student.monthly_fee || 0,
        paymentDay: student.payment_day || 1,
      });
    }
  };

  // Calculate the total monthly revenue for this class
  const totalMonthlyRevenue = classData.students.reduce(
    (sum, student) => sum + (student.monthlyFee || 0),
    0
  );

  const handleAddStudent = async () => {
    try {
      if (isNewStudent) {
        // Create new student via edge function
        if (!newStudent.name || !newStudent.email) {
          toast({
            title: "Erro",
            description: "Nome e e-mail são obrigatórios.",
            variant: "destructive",
          });
          return;
        }

        // Split name into first and last name
        const nameParts = newStudent.name.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        // Generate a temporary password
        const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

        const { error } = await supabase.functions.invoke('create-student', {
          body: {
            email: newStudent.email,
            password: tempPassword,
            firstName,
            lastName,
            birthday: newStudent.birthday || null,
            phone: newStudent.phone || null,
            monthlyFee: newStudent.monthlyFee || 0,
            paymentDay: newStudent.paymentDay || 1,
            classIds: [classData.id],
          }
        });

        if (error) throw error;

        toast({
          title: "Aluno criado",
          description: `O aluno foi criado com sucesso. Senha temporária: ${tempPassword}`,
        });
        
        setShowAddForm(false);
        setSelectedStudentId("");
        setNewStudent({
          name: "",
          phone: "",
          email: "",
          birthday: "",
          monthlyFee: 0,
          paymentDay: 1,
        });
        
        // Refresh the page
        window.location.reload();
      } else {
        // Enroll existing student in class
        const { error } = await supabase
          .from('class_enrollments')
          .insert({
            class_id: classData.id,
            student_id: selectedStudentId,
            active: true,
          });

        if (error) throw error;

        toast({
          title: "Aluno adicionado",
          description: "O aluno foi adicionado com sucesso à turma.",
        });
        
        setShowAddForm(false);
        setSelectedStudentId("");
        setNewStudent({
          name: "",
          phone: "",
          email: "",
          birthday: "",
          monthlyFee: 0,
          paymentDay: 1,
        });
        
        // Refresh the page or update students list
        window.location.reload();
      }
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o aluno à turma.",
        variant: "destructive",
      });
    }
  };

  const handleEditStudent = (student: Student) => {
    // Em um caso real, isso seria uma chamada à API
    toast({
      title: "Aluno atualizado",
      description: "Os dados do aluno foram atualizados com sucesso.",
    });
    setEditingStudent(null);
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      const { error } = await supabase
        .from('class_enrollments')
        .update({ active: false })
        .eq('class_id', classData.id)
        .eq('student_id', studentId);

      if (error) throw error;

      toast({
        title: "Aluno removido",
        description: "O aluno foi removido da turma com sucesso.",
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error removing student:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o aluno da turma.",
        variant: "destructive",
      });
    }
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
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedStudentId("");
                    setIsNewStudent(true);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome</label>
                    {isNewStudent ? (
                      <Input
                        value={newStudent.name}
                        onChange={(e) =>
                          setNewStudent({ ...newStudent, name: e.target.value })
                        }
                        placeholder="Digite o nome completo do aluno"
                      />
                    ) : (
                      <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={comboboxOpen}
                            className="w-full justify-between"
                          >
                            {selectedStudentId
                              ? availableStudents.find((s) => s.id === selectedStudentId)
                                ? `${availableStudents.find((s) => s.id === selectedStudentId)?.first_name} ${availableStudents.find((s) => s.id === selectedStudentId)?.last_name}`
                                : "Selecione um aluno..."
                              : "Selecione um aluno..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar aluno..." />
                            <CommandList>
                              <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value="new"
                                  onSelect={() => {
                                    setIsNewStudent(true);
                                    setSelectedStudentId("");
                                    setComboboxOpen(false);
                                    setNewStudent({
                                      name: "",
                                      phone: "",
                                      email: "",
                                      birthday: "",
                                      monthlyFee: 0,
                                      paymentDay: 1,
                                    });
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Criar novo aluno
                                </CommandItem>
                                {availableStudents.map((student) => (
                                  <CommandItem
                                    key={student.id}
                                    value={`${student.first_name} ${student.last_name} ${student.email}`}
                                    onSelect={() => handleStudentSelect(student.id)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedStudentId === student.id ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {student.first_name} {student.last_name}
                                    <span className="ml-2 text-sm text-muted-foreground">
                                      ({student.email})
                                    </span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      value={newStudent.phone}
                      onChange={(e) =>
                        setNewStudent({ ...newStudent, phone: e.target.value })
                      }
                      disabled={!isNewStudent}
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
                      disabled={!isNewStudent}
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
                      disabled={!isNewStudent}
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
                      disabled={!isNewStudent}
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
                      disabled={!isNewStudent}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddStudent}
                    disabled={isNewStudent ? !newStudent.name || !newStudent.email : !selectedStudentId}
                  >
                    {isNewStudent ? "Criar e Adicionar" : "Adicionar à Turma"}
                  </Button>
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
