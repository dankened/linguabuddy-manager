
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
import { format } from "date-fns";

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
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    {format(new Date(student.birthday), "dd/MM/yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailsDialog;

