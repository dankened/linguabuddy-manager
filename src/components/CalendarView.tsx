
import { useMemo } from "react";
import { format, startOfWeek, addDays, addWeeks, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarViewProps {
  viewType: "week" | "month";
  currentDate: Date;
}

export function CalendarView({ viewType, currentDate }: CalendarViewProps) {
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

  const timeSlots = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const hour = i + 8; // Starting from 8 AM
      return `${hour.toString().padStart(2, "0")}:00`;
    });
  }, []);

  const monthDays = useMemo(() => {
    if (viewType === "month") {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const firstWeekStart = startOfWeek(start, { weekStartsOn: 0 });
      const lastWeekEnd = addWeeks(endOfMonth(currentDate), 1);

      return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
    }
    return [];
  }, [currentDate, viewType]);

  return (
    <div className="border rounded-lg">
      <div className="grid grid-cols-[auto_1fr] gap-px">
        <div className="w-16" /> {/* Empty space for time labels */}
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
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-px">
        <div className="space-y-px">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-[120px] w-16 flex items-start justify-end p-2 text-sm text-muted-foreground"
            >
              {time}
            </div>
          ))}
        </div>

        {viewType === "week" ? (
          <div className="grid grid-cols-7 grid-rows-[repeat(12,minmax(120px,1fr))] gap-px">
            {Array.from({ length: 7 * 12 }).map((_, i) => (
              <div
                key={i}
                className="p-1 border-r border-b bg-background relative min-h-[120px]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 auto-rows-fr gap-px">
            {monthDays.map((day, i) => (
              <div
                key={i}
                className="p-1 border-r border-b bg-background relative min-h-[120px]"
              >
                <span className="text-sm text-muted-foreground">
                  {format(day, "d")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
