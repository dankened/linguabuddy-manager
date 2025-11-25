import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  onUpdate?: () => void;
}

interface StudentData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  birthday: string | null;
  monthly_fee: number | null;
  payment_day: number | null;
  notes: string | null;
  created_at: string;
  active: boolean;
}

export default function StudentDetailsDialog({
  open,
  onOpenChange,
  studentId,
  onUpdate,
}: StudentDetailsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    birthday: "",
    monthly_fee: "",
    payment_day: "",
    notes: "",
  });

  useEffect(() => {
    if (open && studentId) {
      fetchStudentDetails();
    }
  }, [open, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, created_at')
        .eq('id', studentId)
        .single();

      if (profileError) throw profileError;

      // Fetch student details
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (studentError && studentError.code !== 'PGRST116') throw studentError;

      const combined = {
        ...profileData,
        phone: studentData?.phone || null,
        birthday: studentData?.birthday || null,
        monthly_fee: studentData?.monthly_fee || null,
        payment_day: studentData?.payment_day || null,
        notes: studentData?.notes || null,
        active: studentData?.active || false,
      };

      setStudent(combined);
      setFormData({
        first_name: combined.first_name || "",
        last_name: combined.last_name || "",
        phone: combined.phone || "",
        birthday: combined.birthday || "",
        monthly_fee: combined.monthly_fee?.toString() || "",
        payment_day: combined.payment_day?.toString() || "",
        notes: combined.notes || "",
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do estudante.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq('id', studentId);

      if (profileError) throw profileError;

      // Update student details
      const { error: studentError } = await supabase
        .from('students')
        .update({
          phone: formData.phone || null,
          birthday: formData.birthday || null,
          monthly_fee: formData.monthly_fee ? parseFloat(formData.monthly_fee) : null,
          payment_day: formData.payment_day ? parseInt(formData.payment_day) : null,
          notes: formData.notes || null,
        })
        .eq('id', studentId);

      if (studentError) throw studentError;

      toast({
        title: "Sucesso",
        description: "Dados do estudante atualizados com sucesso.",
      });

      onUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os dados do estudante.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Estudante</DialogTitle>
          <DialogDescription>
            Visualize e edite as informações do estudante
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : student ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Sobrenome</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={student.email} disabled />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center h-10 px-3 py-2 rounded-md border border-input bg-muted">
                <span className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  student.active 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {student.active ? "Ativo" : "Inativo"}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {student.active 
                    ? "Aluno matriculado em turma(s)" 
                    : "Aluno sem matrículas ativas"
                  }
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthday">Data de Nascimento</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_fee">Mensalidade (R$)</Label>
                <Input
                  id="monthly_fee"
                  type="number"
                  step="0.01"
                  value={formData.monthly_fee}
                  onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_day">Dia de Pagamento</Label>
                <Input
                  id="payment_day"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.payment_day}
                  onChange={(e) => setFormData({ ...formData, payment_day: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Data de Cadastro</Label>
              <Input
                value={new Date(student.created_at).toLocaleDateString('pt-BR')}
                disabled
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Estudante não encontrado
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
