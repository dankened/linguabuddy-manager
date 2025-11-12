import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Users, Calendar, Book } from "lucide-react";

const StudentClasses = () => {
  const [selectedClass, setSelectedClass] = useState<any>(null);

  // Dados de exemplo - será substituído por dados reais do Supabase
  const studentClasses = [
    {
      id: 1,
      name: "Inglês Intermediário",
      language: "Inglês",
      level: "Intermediário",
      type: "Turma",
      days: ["Segunda", "Quarta", "Sexta"],
      time: "19:00",
      classmates: [
        { id: 1, name: "João Silva" },
        { id: 2, name: "Maria Santos" },
        { id: 3, name: "Pedro Costa" },
      ],
      materials: [
        { id: 1, title: "Apostila de Gramática - Inglês", type: "PDF" },
        { id: 2, title: "Módulo: Verbos no Presente", type: "Vídeo" },
      ],
      assessments: [
        { id: 1, title: "Prova Trimestral", dueDate: "2025-03-15" },
      ],
    },
    {
      id: 2,
      name: "Espanhol Básico",
      language: "Espanhol",
      level: "Iniciante",
      type: "Particular",
      days: ["Terça", "Quinta"],
      time: "10:00",
      classmates: [],
      materials: [
        { id: 3, title: "Exercícios de Conjugação", type: "PDF" },
      ],
      assessments: [],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Minhas Turmas</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentClasses.map((classItem) => (
            <Card
              key={classItem.id}
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={() => setSelectedClass(classItem)}
            >
              <CardHeader>
                <CardTitle>{classItem.name}</CardTitle>
                <CardDescription>
                  {classItem.language} - {classItem.level}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">{classItem.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{classItem.days.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium">Horário:</span>
                  <span>{classItem.time}</span>
                </div>
                {classItem.classmates.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{classItem.classmates.length} colegas</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedClass && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedClass.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Idioma/Atividade</h3>
                      <p className="text-muted-foreground">{selectedClass.language}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Nível</h3>
                      <p className="text-muted-foreground">{selectedClass.level}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Tipo</h3>
                      <Badge variant="secondary">{selectedClass.type}</Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Horário</h3>
                      <p className="text-muted-foreground">{selectedClass.time}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-semibold mb-2">Dias</h3>
                      <p className="text-muted-foreground">{selectedClass.days.join(", ")}</p>
                    </div>
                  </div>

                  {selectedClass.classmates.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Colegas de Turma
                      </h3>
                      <div className="space-y-2">
                        {selectedClass.classmates.map((classmate: any) => (
                          <div
                            key={classmate.id}
                            className="p-3 rounded-lg bg-muted/50"
                          >
                            {classmate.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedClass.materials.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Book className="h-5 w-5" />
                        Materiais Vinculados
                      </h3>
                      <div className="space-y-2">
                        {selectedClass.materials.map((material: any) => (
                          <div
                            key={material.id}
                            className="p-3 rounded-lg bg-muted/50 flex justify-between items-center"
                          >
                            <span>{material.title}</span>
                            <Badge variant="outline">{material.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedClass.assessments.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Avaliações</h3>
                      <div className="space-y-2">
                        {selectedClass.assessments.map((assessment: any) => (
                          <div
                            key={assessment.id}
                            className="p-3 rounded-lg bg-muted/50 flex justify-between items-center"
                          >
                            <span>{assessment.title}</span>
                            <span className="text-sm text-muted-foreground">
                              Prazo: {new Date(assessment.dueDate).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default StudentClasses;
