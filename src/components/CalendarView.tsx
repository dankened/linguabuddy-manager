
import { useMemo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-7 gap-px border-b">
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
      <div className="grid grid-cols-7 grid-rows-[repeat(12,minmax(120px,1fr))] gap-px">
        {Array.from({ length: 7 * 12 }).map((_, i) => (
          <div
            key={i}
            className="p-1 border-r border-b bg-background relative min-h-[120px]"
          />
        ))}
      </div>
    </div>
  );
}
