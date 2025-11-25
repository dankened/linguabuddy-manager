import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Search, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import StudentDetailsDialog from "@/components/StudentDetailsDialog";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  active?: boolean;
}

interface StudentDetails extends Student {
  birthday: string | null;
  phone: string | null;
  monthly_fee: number | null;
  payment_day: number | null;
  notes: string | null;
  active: boolean;
}

interface ClassData {
  id: string;
  name: string;
}

export default function AdminStudents() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthday: "",
    phone: "",
    monthlyFee: "",
    paymentDay: "",
    notes: "",
    selectedClasses: [] as string[],
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch student details including active status
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('id, active')
        .in('id', profilesData?.map(p => p.id) || []);

      if (studentsError) throw studentsError;

      // Combine data
      const combined = profilesData?.map(profile => {
        const studentDetails = studentsData?.find(s => s.id === profile.id);
        return {
          ...profile,
          active: studentDetails?.active || false,
        };
      }) || [];

      setStudents(combined);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar estudantes",
        description: "Não foi possível carregar a lista de estudantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', user?.id)
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleCreateStudent = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios.",
          variant: "destructive",
        });
        return;
      }

      // Call edge function to create student
      const { data, error } = await supabase.functions.invoke('create-student', {
        body: {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          birthday: formData.birthday || null,
          phone: formData.phone || null,
          monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : null,
          paymentDay: formData.paymentDay ? parseInt(formData.paymentDay) : null,
          notes: formData.notes || null,
          classIds: formData.selectedClasses,
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao criar estudante');
      }

      toast({
        title: "Estudante criado com sucesso",
        description: `${formData.firstName} ${formData.lastName} foi adicionado.`,
      });

      // Reset form and close dialog
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        birthday: "",
        phone: "",
        monthlyFee: "",
        paymentDay: "",
        notes: "",
        selectedClasses: [],
      });
      setIsDialogOpen(false);
      fetchStudents();
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast({
        title: "Erro ao criar estudante",
        description: error.message || "Não foi possível criar o estudante.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleClassSelection = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId]
    }));
  };

  const handleDeleteStudent = async () => {
    try {
      setLoading(true);

      // Call edge function to delete student
      const { error } = await supabase.functions.invoke('delete-student', {
        body: { studentId: studentToDelete }
      });

      if (error) throw error;

      toast({
        title: "Estudante excluído",
        description: "O estudante foi removido com sucesso.",
      });

      setDeleteDialogOpen(false);
      setStudentToDelete("");
      fetchStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast({
        title: "Erro ao excluir estudante",
        description: error.message || "Não foi possível excluir o estudante.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (studentId: string) => {
    setSelectedStudentId(studentId);
    setDetailsDialogOpen(true);
  };

  const filteredStudents = students.filter(student =>
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Estudantes</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie contas de estudantes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Estudante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Estudante</DialogTitle>
              <DialogDescription>
                Preencha os dados do estudante. Email, senha, nome e sobrenome são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="João"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Silva"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao.silva@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha Inicial *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthday">Data de Nascimento</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee">Mensalidade (R$)</Label>
                  <Input
                    id="monthlyFee"
                    type="number"
                    step="0.01"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    placeholder="150.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDay">Dia de Pagamento</Label>
                  <Input
                    id="paymentDay"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.paymentDay}
                    onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value })}
                    placeholder="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações sobre o estudante..."
                  rows={3}
                />
              </div>

              {classes.length > 0 && (
                <div className="space-y-2">
                  <Label>Turmas</Label>
                  <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${classItem.id}`}
                          checked={formData.selectedClasses.includes(classItem.id)}
                          onCheckedChange={() => toggleClassSelection(classItem.id)}
                        />
                        <Label
                          htmlFor={`class-${classItem.id}`}
                          className="cursor-pointer flex-1"
                        >
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateStudent} disabled={loading}>
                {loading ? "Criando..." : "Criar Estudante"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estudantes Cadastrados</CardTitle>
          <CardDescription>
            {students.length} estudante(s) no total
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando estudantes...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Nenhum estudante encontrado com esse termo." : "Nenhum estudante cadastrado ainda."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow 
                    key={student.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(student.id)}
                  >
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        student.active 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      )}>
                        {student.active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(student.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudentId(student.id);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStudentToDelete(student.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <StudentDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        studentId={selectedStudentId}
        onUpdate={fetchStudents}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este estudante? Esta ação não pode ser desfeita.
              Todos os dados relacionados ao estudante serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

