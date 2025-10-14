
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Video, FileText, ChevronDown, Book, Headphones, FolderPlus, CheckCircle, Upload, Edit, Eye, Settings } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Materials = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("videos");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonSheetOpen, setLessonSheetOpen] = useState(false);
  const [questionType, setQuestionType] = useState("multiple-choice");

  // Dados de exemplo das turmas
  const classesSampleData = [
    {
      id: 1,
      language: "Inglês",
      level: "Intermediário",
      type: "Turma",
      days: ["Segunda", "Quarta"],
      time: "19:00",
    },
    {
      id: 2,
      language: "Espanhol",
      level: "Iniciante",
      type: "Particular",
      days: ["Terça", "Quinta"],
      time: "10:00",
    },
  ];

  // Dados de exemplo dos módulos
  const modulesSampleData = [
    {
      id: 1,
      title: "Inglês Básico para Iniciantes",
      description: "Aulas introdutórias para alunos sem conhecimento prévio",
      lessons: [
        { id: 1, title: "Apresentações", duration: "15:30", description: "Como se apresentar em inglês" },
        { id: 2, title: "Verbos no Presente", duration: "20:45", description: "Conjugação de verbos no presente" },
      ],
      classes: [1],
    },
    {
      id: 2,
      title: "Espanhol - Conversação",
      description: "Módulo focado em prática de conversação",
      lessons: [
        { id: 3, title: "Situações do Cotidiano", duration: "18:20", description: "Conversas do dia a dia" },
        { id: 4, title: "Viagens", duration: "22:10", description: "Como se comunicar em viagens" },
      ],
      classes: [2],
    },
  ];

  // Dados de exemplo dos materiais complementares
  const materialsSampleData = [
    {
      id: 1,
      title: "Apostila de Gramática - Inglês",
      type: "pdf",
      icon: <Book className="h-6 w-6" />,
      classes: [1],
    },
    {
      id: 2,
      title: "Exercícios de Conjugação - Espanhol",
      type: "pdf",
      icon: <Book className="h-6 w-6" />,
      classes: [2],
    },
    {
      id: 3,
      title: "Áudio - Listening Practice",
      type: "audio",
      icon: <Headphones className="h-6 w-6" />,
      classes: [1],
    },
  ];

  // Dados de exemplo das avaliações
  const assessmentsSampleData = [
    {
      id: 1,
      title: "Prova Trimestral - Inglês Intermediário",
      description: "Avaliação cobrindo os tópicos do trimestre",
      classes: [1],
      status: "Disponível",
      dueDate: "2025-03-15",
      submissions: 5,
    },
    {
      id: 2,
      title: "Avaliação Oral - Espanhol Iniciante",
      description: "Avaliação de pronúncia e conversação",
      classes: [2],
      status: "Rascunho",
      dueDate: "2025-03-20",
      submissions: 0,
    },
  ];

  const handleCreateModule = () => {
    toast({
      title: "Módulo criado",
      description: "O módulo foi criado com sucesso.",
    });
    setShowModuleForm(false);
    setEditingModule(null);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    setShowModuleForm(true);
  };

  const handleEditLesson = (lesson: any, moduleId: number) => {
    setEditingLesson({ ...lesson, moduleId });
    setLessonSheetOpen(true);
  };

  const handleSaveLesson = () => {
    toast({
      title: "Aula atualizada",
      description: "As alterações na aula foram salvas com sucesso.",
    });
    setEditingLesson(null);
    setLessonSheetOpen(false);
  };

  const handleCreateMaterial = () => {
    toast({
      title: "Material adicionado",
      description: "O material complementar foi adicionado com sucesso.",
    });
    setShowMaterialForm(false);
  };

  const handleCreateAssessment = () => {
    toast({
      title: "Avaliação criada",
      description: "A avaliação foi criada com sucesso.",
    });
    setShowAssessmentForm(false);
  };

  // Componente de resposta baseado no tipo de questão
  const renderQuestionResponseField = () => {
    switch (questionType) {
      case "multiple-choice":
        return (
          <div className="space-y-2">
            <Label>Alternativas</Label>
            <div className="space-y-2">
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-start gap-2">
                  <div className="flex h-6 items-center">
                    <input
                      type="radio"
                      name="correct-answer"
                      className="h-4 w-4"
                    />
                  </div>
                  <Input placeholder={`Alternativa ${option}`} />
                </div>
              ))}
            </div>
          </div>
        );
      case "essay":
        return (
          <div className="space-y-2">
            <Label>Resposta Discursiva</Label>
            <div className="bg-muted/50 border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Os alunos terão um campo de texto para escrever sua resposta (até 500 palavras).
              </p>
              <div className="border border-dashed rounded-lg p-6 bg-background">
                <p className="text-center text-sm text-muted-foreground italic">
                  Espaço para resposta do aluno
                </p>
              </div>
            </div>
          </div>
        );
      case "fill-blanks":
        return (
          <div className="space-y-2">
            <Label>Frases para Completar</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Adicione frases com espaços a serem preenchidos usando [blank] onde o aluno deverá completar.
            </p>
            <div className="space-y-2">
              {[1, 2, 3].map((index) => (
                <div key={index} className="space-y-1">
                  <Input placeholder={`Exemplo: The capital of France is [blank].`} />
                  <Input placeholder="Resposta correta" className="w-1/2 ml-auto" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Frase
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Materiais</h1>

        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vídeos e Módulos
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Materiais Complementares
            </TabsTrigger>
            <TabsTrigger value="assessments" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Módulos de Aulas em Vídeo</h2>
              <Button onClick={() => { setEditingModule(null); setShowModuleForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Módulo
              </Button>
            </div>

            {showModuleForm && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingModule ? "Editar Módulo" : "Novo Módulo"}</CardTitle>
                  <CardDescription>
                    {editingModule ? "Edite as informações do módulo" : "Crie um novo módulo de aulas em vídeo"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="module-title">Título do Módulo</Label>
                    <Input 
                      id="module-title" 
                      placeholder="Ex: Inglês Básico para Iniciantes"
                      defaultValue={editingModule?.title} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-description">Descrição</Label>
                    <Textarea 
                      id="module-description" 
                      placeholder="Descreva o conteúdo deste módulo"
                      defaultValue={editingModule?.description}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status do Módulo</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="module-status"
                        defaultChecked={editingModule?.active !== false}
                      />
                      <Label htmlFor="module-status">Módulo Ativo</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quando inativo, os alunos não poderão acessar este módulo
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Turmas com Acesso</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {classesSampleData.map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`class-${classItem.id}`}
                            className="h-4 w-4 rounded border-gray-300"
                            defaultChecked={editingModule?.classes?.includes(classItem.id)}
                          />
                          <Label htmlFor={`class-${classItem.id}`}>
                            {classItem.language} - {classItem.level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => {
                    setShowModuleForm(false);
                    setEditingModule(null);
                  }}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateModule}>
                    {editingModule ? "Salvar Alterações" : "Criar Módulo"}
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
              {modulesSampleData.map((module) => (
                <Collapsible key={module.id} className="border rounded-lg">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(module);
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 pt-0 border-t">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Aulas</h4>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Aula
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Adicionar Nova Aula</SheetTitle>
                              <SheetDescription>
                                Adicione uma nova aula em vídeo a este módulo
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="new-lesson-title">Título da Aula</Label>
                                <Input 
                                  id="new-lesson-title" 
                                  placeholder="Ex: Introdução aos Verbos"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-lesson-description">Descrição</Label>
                                <Textarea 
                                  id="new-lesson-description" 
                                  placeholder="Descreva o conteúdo desta aula"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-lesson-video">Vídeo</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                                  <Upload className="h-8 w-8 mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Clique para fazer upload ou arraste o arquivo para cá
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">
                              <Button variant="outline">
                                Cancelar
                              </Button>
                              <Button onClick={() => {
                                toast({
                                  title: "Aula adicionada",
                                  description: "A nova aula foi adicionada com sucesso.",
                                });
                              }}>
                                Salvar Aula
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Duração</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {module.lessons.map((lesson) => (
                            <TableRow key={lesson.id}>
                              <TableCell className="font-medium">{lesson.title}</TableCell>
                              <TableCell>{lesson.duration}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleEditLesson(lesson, module.id)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Turmas com Acesso:</h4>
                        <div className="flex flex-wrap gap-2">
                          {module.classes.map((classId) => {
                            const classItem = classesSampleData.find(c => c.id === classId);
                            return classItem ? (
                              <div key={classId} className="px-2 py-1 bg-muted rounded-md text-sm">
                                {classItem.language} - {classItem.level}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Materiais Complementares</h2>
              <Button onClick={() => setShowMaterialForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </div>

            {showMaterialForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Novo Material Complementar</CardTitle>
                  <CardDescription>
                    Adicione um novo material complementar para suas turmas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="material-title">Título do Material</Label>
                    <Input id="material-title" placeholder="Ex: Apostila de Gramática" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material-description">Descrição</Label>
                    <Textarea id="material-description" placeholder="Descreva este material" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material-type">Tipo de Material</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="audio">Áudio</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="material-file">Arquivo</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Clique para fazer upload ou arraste o arquivo para cá
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Turmas com Acesso</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {classesSampleData.map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`material-class-${classItem.id}`}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`material-class-${classItem.id}`}>
                            {classItem.language} - {classItem.level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowMaterialForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateMaterial}>Adicionar Material</Button>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materialsSampleData.map((material) => (
                <Card key={material.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {material.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <CardDescription>
                        Tipo: {material.type.toUpperCase()}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Turmas:</span>
                      <div className="flex gap-1 mt-1">
                        {material.classes.map((classId) => {
                          const classItem = classesSampleData.find(c => c.id === classId);
                          return classItem ? (
                            <div key={classId} className="px-2 py-1 bg-muted rounded-md text-xs">
                              {classItem.language}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Avaliações</h2>
              <Button onClick={() => setShowAssessmentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Avaliação
              </Button>
            </div>

            {showAssessmentForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Nova Avaliação</CardTitle>
                  <CardDescription>
                    Crie uma nova avaliação para suas turmas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assessment-title">Título da Avaliação</Label>
                    <Input id="assessment-title" placeholder="Ex: Prova Trimestral" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment-description">Descrição</Label>
                    <Textarea id="assessment-description" placeholder="Descreva esta avaliação" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assessment-duedate">Data de Entrega</Label>
                    <Input id="assessment-duedate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Turmas com Acesso</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {classesSampleData.map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`assessment-class-${classItem.id}`}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`assessment-class-${classItem.id}`}>
                            {classItem.language} - {classItem.level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <Label>Questões</Label>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Questão
                      </Button>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Questão 1</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="q1-text">Enunciado</Label>
                          <Textarea id="q1-text" placeholder="Digite o enunciado da questão" />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo de Questão</Label>
                          <RadioGroup 
                            value={questionType} 
                            onValueChange={setQuestionType} 
                            defaultValue="multiple-choice"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="multiple-choice" id="multiple-choice" />
                              <Label htmlFor="multiple-choice">Múltipla Escolha</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="essay" id="essay" />
                              <Label htmlFor="essay">Discursiva</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fill-blanks" id="fill-blanks" />
                              <Label htmlFor="fill-blanks">Completar Frases</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {renderQuestionResponseField()}
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowAssessmentForm(false)}>
                    Cancelar
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">Salvar Rascunho</Button>
                    <Button onClick={handleCreateAssessment}>Publicar Avaliação</Button>
                  </div>
                </CardFooter>
              </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
              {assessmentsSampleData.map((assessment) => (
                <Card key={assessment.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{assessment.title}</CardTitle>
                        <CardDescription>{assessment.description}</CardDescription>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        assessment.status === "Disponível" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {assessment.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Data de Entrega:</span>
                        <span className="ml-1 font-medium">
                          {new Date(assessment.dueDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entregas:</span>
                        <span className="ml-1 font-medium">{assessment.submissions}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">Turmas:</span>
                      <div className="flex gap-1 mt-1">
                        {assessment.classes.map((classId) => {
                          const classItem = classesSampleData.find(c => c.id === classId);
                          return classItem ? (
                            <div key={classId} className="px-2 py-1 bg-muted rounded-md text-xs">
                              {classItem.language}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button size="sm">Ver Entregas</Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <div className="mx-auto w-full max-w-4xl">
                            <DrawerHeader className="text-left">
                              <DrawerTitle>Entregas - {assessment.title}</DrawerTitle>
                              <DrawerDescription>
                                Veja e avalie as entregas dos alunos
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Aluno</TableHead>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Data de Entrega</TableHead>
                                    <TableHead>Nota</TableHead>
                                    <TableHead>Ações</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {assessment.submissions > 0 ? (
                                    [...Array(assessment.submissions)].map((_, i) => (
                                      <TableRow key={i}>
                                        <TableCell className="font-medium">Aluno {i + 1}</TableCell>
                                        <TableCell>
                                          {classesSampleData.find(c => c.id === assessment.classes[0])?.language} - {classesSampleData.find(c => c.id === assessment.classes[0])?.level}
                                        </TableCell>
                                        <TableCell>
                                          {new Date().toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell>
                                          {i % 2 === 0 ? (
                                            "8.5"
                                          ) : (
                                            <Input className="w-16 h-8" placeholder="-" />
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <Button variant="ghost" size="sm">
                                            Ver Respostas
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        Nenhuma entrega encontrada
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Formulário de Edição de Aula (Sheet) */}
        <Sheet open={lessonSheetOpen} onOpenChange={setLessonSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar Aula</SheetTitle>
            <SheetDescription>
              Edite as informações da aula
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-title">Título da Aula</Label>
              <Input 
                id="edit-lesson-title" 
                placeholder="Ex: Introdução aos Verbos"
                defaultValue={editingLesson?.title}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-description">Descrição</Label>
              <Textarea 
                id="edit-lesson-description" 
                placeholder="Descreva o conteúdo desta aula"
                defaultValue={editingLesson?.description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-video">Vídeo</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Clique para trocar o vídeo ou arraste um novo arquivo
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setLessonSheetOpen(false);
                setEditingLesson(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveLesson}>
              Salvar Alterações
            </Button>
          </div>
        </SheetContent>
        </Sheet>
      </div>
  );
};

export default Materials;
