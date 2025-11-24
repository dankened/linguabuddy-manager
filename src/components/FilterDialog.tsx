import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: {
    classId: string | null;
    language: string | null;
    level: string | null;
  }) => void;
  currentFilters: {
    classId: string | null;
    language: string | null;
    level: string | null;
  };
}

export function FilterDialog({
  open,
  onOpenChange,
  onApplyFilters,
  currentFilters,
}: FilterDialogProps) {
  const { user } = useAuth();
  const [classId, setClassId] = useState<string | null>(currentFilters.classId);
  const [language, setLanguage] = useState<string | null>(currentFilters.language);
  const [level, setLevel] = useState<string | null>(currentFilters.level);
  const [classes, setClasses] = useState<Array<{ id: string; name: string; language: string; level: string }>>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  useEffect(() => {
    if (open && user?.id) {
      loadClasses();
    }
  }, [open, user?.id]);

  const loadClasses = async () => {
    const { data } = await supabase
      .from("classes")
      .select("id, name, language, level")
      .eq("teacher_id", user?.id)
      .eq("active", true);

    if (data) {
      setClasses(data);
      
      // Extract unique languages and levels
      const uniqueLanguages = Array.from(new Set(data.map(c => c.language)));
      const uniqueLevels = Array.from(new Set(data.map(c => c.level)));
      
      setLanguages(uniqueLanguages);
      setLevels(uniqueLevels);
    }
  };

  const handleApply = () => {
    onApplyFilters({ classId, language, level });
    onOpenChange(false);
  };

  const handleClear = () => {
    setClassId(null);
    setLanguage(null);
    setLevel(null);
    onApplyFilters({ classId: null, language: null, level: null });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtrar Eventos</DialogTitle>
          <DialogDescription>
            Filtre os eventos por turma, idioma ou nível
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="class">Turma</Label>
            <Select value={classId || "all"} onValueChange={(value) => setClassId(value === "all" ? null : value)}>
              <SelectTrigger id="class">
                <SelectValue placeholder="Todas as turmas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as turmas</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language || "all"} onValueChange={(value) => setLanguage(value === "all" ? null : value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Todos os idiomas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os idiomas</SelectItem>
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nível</Label>
            <Select value={level || "all"} onValueChange={(value) => setLevel(value === "all" ? null : value)}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Todos os níveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os níveis</SelectItem>
                {levels.map((lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Limpar Filtros
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
