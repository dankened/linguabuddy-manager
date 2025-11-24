
import { useMemo, useState } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import ClassDetailsDialog from "./ClassDetailsDialog";

interface CalendarViewProps {
  viewType: "day" | "week" | "month";
  currentDate: Date;
}

// Dados de exemplo das turmas (em um caso real, viriam de uma API/banco de dados)
const classesSampleData = [
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
    color: "#D946EF",
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
    color: "#8B5CF6",
  },
];

export function CalendarView({ viewType, currentDate }: CalendarViewProps) {
  const [selectedClass, setSelectedClass] = useState<typeof classesSampleData[0] | null>(null);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      return {
        short: format(date, "EEE", { locale: ptBR }),
        full: format(date, "EEEE", { locale: ptBR }),
        date: format(date, "dd/MM"),
      };
    });
  }, [currentDate]);

  const hours = Array.from({ length: 24 }).map((_, i) => {
    return `${String(i).padStart(2, "0")}:00`;
  });

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const firstWeek = startOfWeek(start, { weekStartsOn: 0 });
    const days = [];

    let currentDay = firstWeek;

    while (currentDay <= end || days.length % 7 !== 0) {
      days.push({
        date: currentDay,
        isCurrentMonth: isSameMonth(currentDay, currentDate),
        dayNumber: format(currentDay, "d"),
      });
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [currentDate]);

  const dayHasClass = (date: Date, classItem: typeof classesSampleData[0]) => {
    const dayName = format(date, "EEEE", { locale: ptBR });
    return classItem.days.includes(dayName);
  };

  if (viewType === "month") {
    return (
      <>
        <div className="border rounded-lg">
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day) => (
              <div
                key={day.short}
                className="p-2 text-sm font-medium text-center bg-muted"
              >
                <div className="capitalize">{day.short}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 auto-rows-fr">
            {monthDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "border-r border-b p-2 h-24 relative",
                  !day.isCurrentMonth && "bg-muted/50"
                )}
              >
                <span className="text-sm block text-center mb-2">
                  {day.dayNumber}
                </span>
                <div className="space-y-1">
                  {classesSampleData.map((classItem) => (
                    dayHasClass(day.date, classItem) && (
                      <button
                        key={classItem.id}
                        onClick={() => setSelectedClass(classItem)}
                        className="w-full text-left px-2 py-1 rounded text-xs text-white truncate"
                        style={{ backgroundColor: classItem.color }}
                      >
                        {classItem.language} - {classItem.level}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedClass && (
          <ClassDetailsDialog
            open={!!selectedClass}
            onOpenChange={(open) => !open && setSelectedClass(null)}
            classData={selectedClass}
          />
        )}
      </>
    );
  }

  // Visão de Dia: mostrar apenas 1 coluna
  if (viewType === "day") {
    const dayInfo = {
      short: format(currentDate, "EEE", { locale: ptBR }),
      full: format(currentDate, "EEEE", { locale: ptBR }),
      date: format(currentDate, "dd/MM"),
    };

    return (
      <>
        <div className="border rounded-lg">
          <div className="grid grid-cols-[60px_1fr] border-b">
            <div className="p-2 text-sm font-medium text-center bg-muted" />
            <div className="p-2 text-sm font-medium text-center bg-muted">
              <div className="capitalize">{dayInfo.full}</div>
              <div className="text-muted-foreground">{dayInfo.date}</div>
            </div>
          </div>
          
          <ScrollArea className="h-[600px]">
            <div className="grid grid-cols-[60px_1fr]">
              <div className="grid grid-rows-[repeat(24,minmax(60px,1fr))] bg-muted">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="p-2 text-sm font-medium text-center border-r relative flex items-center justify-end pr-3"
                  >
                    {hour}
                  </div>
                ))}
              </div>
              <div className="grid grid-rows-[repeat(24,minmax(60px,1fr))] gap-px">
                {Array.from({ length: 24 }).map((_, hourIndex) => {
                  const currentHour = `${String(hourIndex).padStart(2, "0")}:00`;
                  
                  return (
                    <div
                      key={hourIndex}
                      className="p-1 border-r border-b bg-background relative"
                    >
                      {classesSampleData.map((classItem) => {
                        if (
                          classItem.time === currentHour &&
                          dayHasClass(currentDate, classItem)
                        ) {
                          return (
                            <button
                              key={classItem.id}
                              onClick={() => setSelectedClass(classItem)}
                              className="absolute inset-x-1 top-1 px-2 py-1 rounded text-xs text-white truncate"
                              style={{ backgroundColor: classItem.color }}
                            >
                              {classItem.language} - {classItem.level}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {selectedClass && (
          <ClassDetailsDialog
            open={!!selectedClass}
            onOpenChange={(open) => !open && setSelectedClass(null)}
            classData={selectedClass}
          />
        )}
      </>
    );
  }

  // Visão de Semana (padrão)
  return (
    <>
      <div className="border rounded-lg">
        <div className="grid grid-cols-[60px_1fr] border-b">
          <div className="p-2 text-sm font-medium text-center bg-muted" />
          <div className="grid grid-cols-7 gap-px">
            {weekDays.map((day) => (
              <div
                key={day.short}
                className="p-2 text-sm font-medium text-center bg-muted"
              >
                <div className="capitalize">{day.short}</div>
                <div className="text-muted-foreground">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
        
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-[60px_1fr]">
            <div className="grid grid-rows-[repeat(24,minmax(60px,1fr))] bg-muted">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="p-2 text-sm font-medium text-center border-r relative flex items-center justify-end pr-3"
                >
                  {hour}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-[repeat(24,minmax(60px,1fr))] gap-px">
              {Array.from({ length: 7 * 24 }).map((_, i) => {
                const dayIndex = Math.floor(i / 24);
                const hourIndex = i % 24;
                const currentHour = `${String(hourIndex).padStart(2, "0")}:00`;
                const currentDayDate = addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), dayIndex);
                
                return (
                  <div
                    key={i}
                    className="p-1 border-r border-b bg-background relative"
                  >
                    {classesSampleData.map((classItem) => {
                      if (
                        classItem.time === currentHour &&
                        dayHasClass(currentDayDate, classItem)
                      ) {
                        return (
                          <button
                            key={classItem.id}
                            onClick={() => setSelectedClass(classItem)}
                            className="absolute inset-x-1 top-1 px-2 py-1 rounded text-xs text-white truncate"
                            style={{ backgroundColor: classItem.color }}
                          >
                            {classItem.language} - {classItem.level}
                          </button>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      {selectedClass && (
        <ClassDetailsDialog
          open={!!selectedClass}
          onOpenChange={(open) => !open && setSelectedClass(null)}
          classData={selectedClass}
        />
      )}
    </>
  );
}

