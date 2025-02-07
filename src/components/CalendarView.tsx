
import { useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "./ui/scroll-area";

interface CalendarViewProps {
  viewType: "week" | "month";
}

export function CalendarView({ viewType }: CalendarViewProps) {
  const weekDays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = addDays(start, i);
      return {
        short: format(date, "EEE", { locale: ptBR }),
        full: format(date, "EEEE", { locale: ptBR }),
        date: format(date, "dd/MM"),
      };
    });
  }, []);

  const hours = Array.from({ length: 24 }).map((_, i) => {
    return `${String(i).padStart(2, "0")}:00`;
  });

  return (
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
          <div className="grid grid-rows-[repeat(24,minmax(60px,1fr))]">
            {hours.map((hour) => (
              <div
                key={hour}
                className="p-2 text-xs text-right pr-4 text-muted-foreground border-r relative"
              >
                {hour}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-[repeat(24,minmax(60px,1fr))] gap-px">
            {Array.from({ length: 7 * 24 }).map((_, i) => (
              <div
                key={i}
                className="p-1 border-r border-b bg-background relative"
              />
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
