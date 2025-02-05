import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClassDetailsDialog from "./ClassDetailsDialog";

// Expanded mock data to include student information
const mockClasses = [
  {
    id: 1,
    language: "Inglês",
    level: "Intermediário",
    type: "Turma",
    days: ["Segunda", "Quarta"],
    time: "19:00",
    students: [
      {
        id: 1,
        name: "João Silva",
        phone: "(11) 99999-9999",
        email: "joao@email.com",
        birthday: "1990-01-01",
      },
      {
        id: 2,
        name: "Maria Santos",
        phone: "(11) 88888-8888",
        email: "maria@email.com",
        birthday: "1992-05-15",
      },
    ],
    active: true,
  },
  {
    id: 2,
    language: "Espanhol",
    level: "Iniciante",
    type: "Particular",
    days: ["Terça", "Quinta"],
    time: "10:00",
    students: [
      {
        id: 3,
        name: "Pedro Souza",
        phone: "(11) 77777-7777",
        email: "pedro@email.com",
        birthday: "1988-12-20",
      },
    ],
    active: true,
  },
  {
    id: 3,
    language: "Inglês",
    level: "Avançado",
    type: "Turma",
    days: ["Segunda", "Quarta", "Sexta"],
    time: "18:00",
    students: [
      {
        id: 4,
        name: "Ana Costa",
        phone: "(11) 66666-6666",
        email: "ana@email.com",
        birthday: "1995-07-10",
      },
    ],
    active: false,
  },
];

interface ActiveClassesProps {
  showInactive: boolean;
}

const ActiveClasses = ({ showInactive }: ActiveClassesProps) => {
  const [selectedClass, setSelectedClass] = useState<(typeof mockClasses)[0] | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredClasses = mockClasses.filter(
    (c) => c.active !== showInactive
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <Card
            key={classItem.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              setSelectedClass(classItem);
              setDialogOpen(true);
            }}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{classItem.language}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {classItem.type}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nível:</span>
                <span className="font-medium">{classItem.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dias:</span>
                <span className="font-medium">{classItem.days.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Horário:</span>
                <span className="font-medium">{classItem.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Alunos:</span>
                <span className="font-medium">{classItem.students.length}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <ClassDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          classData={selectedClass}
        />
      )}
    </>
  );
};

export default ActiveClasses;