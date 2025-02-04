import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados mockados para exemplo
const mockClasses = [
  {
    id: 1,
    language: "Inglês",
    level: "Intermediário",
    type: "Turma",
    days: ["Segunda", "Quarta"],
    time: "19:00",
    students: 8,
    active: true,
  },
  {
    id: 2,
    language: "Espanhol",
    level: "Iniciante",
    type: "Particular",
    days: ["Terça", "Quinta"],
    time: "10:00",
    students: 1,
    active: true,
  },
  {
    id: 3,
    language: "Inglês",
    level: "Avançado",
    type: "Turma",
    days: ["Segunda", "Quarta", "Sexta"],
    time: "18:00",
    students: 6,
    active: false,
  },
];

interface ActiveClassesProps {
  showInactive: boolean;
}

const ActiveClasses = ({ showInactive }: ActiveClassesProps) => {
  const filteredClasses = mockClasses.filter(
    (c) => c.active !== showInactive
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClasses.map((classItem) => (
        <Card key={classItem.id}>
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
              <span className="font-medium">{classItem.students}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActiveClasses;