import { useMemo, useState } from "react";
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth, isSameDay, differenceInMinutes, addMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Event } from "@/hooks/useEvents";
import { EventCard } from "./EventCard";
import { Skeleton } from "./ui/skeleton";

interface CalendarViewProps {
  viewType: "day" | "week" | "month";
  currentDate: Date;
  events: Event[];
  isLoading: boolean;
  onEventUpdate: (params: { eventId: string; start_time: string; end_time: string }) => void;
  isUpdating: boolean;
}

export function CalendarView({ viewType, currentDate, events, isLoading, onEventUpdate, isUpdating }: CalendarViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null);

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

  const detectConflicts = (dayEvents: Event[]) => {
    const conflicts: Map<string, { position: number; total: number }> = new Map();
    
    for (let i = 0; i < dayEvents.length; i++) {
      const event1 = dayEvents[i];
      const start1 = new Date(event1.start_time);
      const end1 = new Date(event1.end_time);
      
      let conflictGroup = [event1];
      
      for (let j = i + 1; j < dayEvents.length; j++) {
        const event2 = dayEvents[j];
        const start2 = new Date(event2.start_time);
        const end2 = new Date(event2.end_time);
        
        // Check if events overlap
        if (start1 < end2 && start2 < end1) {
          if (!conflictGroup.includes(event2)) {
            conflictGroup.push(event2);
          }
        }
      }
      
      if (conflictGroup.length > 1) {
        conflictGroup.forEach((event, index) => {
          conflicts.set(event.id, { position: index, total: conflictGroup.length });
        });
      }
    }
    
    return conflicts;
  };

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const handleDragStart = (event: Event) => (e: React.DragEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
  };

  const handleDrop = (targetDate: Date, targetHour: number) => (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedEvent) return;

    const originalStart = new Date(draggedEvent.start_time);
    const originalEnd = new Date(draggedEvent.end_time);
    const duration = differenceInMinutes(originalEnd, originalStart);

    const newStart = new Date(targetDate);
    newStart.setHours(targetHour, 0, 0, 0);
    const newEnd = addMinutes(newStart, duration);

    onEventUpdate({
      eventId: draggedEvent.id,
      start_time: newStart.toISOString(),
      end_time: newEnd.toISOString(),
    });

    setDraggedEvent(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

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
                  {getEventsForDay(day.date).map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left px-2 py-1 rounded text-xs text-white truncate"
                      style={{ backgroundColor: event.class ? "#8B5CF6" : "#D946EF" }}
                    >
                      {event.class ? `${event.class.language} - ${event.class.level}` : event.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details dialog can be added later for event details */}
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
                  const dayEvents = getEventsForDay(currentDate);
                  const conflicts = detectConflicts(dayEvents);
                  
                  return (
                    <div
                      key={hourIndex}
                      className="p-1 border-r border-b bg-background relative"
                      onDrop={handleDrop(currentDate, hourIndex)}
                      onDragOver={handleDragOver}
                    >
                      {dayEvents.map((event) => {
                        const eventStart = new Date(event.start_time);
                        const eventHour = eventStart.getHours();
                        const eventMinute = eventStart.getMinutes();
                        
                        if (eventHour !== hourIndex) return null;

                        const eventEnd = new Date(event.end_time);
                        const durationMinutes = differenceInMinutes(eventEnd, eventStart);
                        const heightInPixels = (durationMinutes / 60) * 60;
                        const topOffset = (eventMinute / 60) * 60;

                        const conflict = conflicts.get(event.id);

                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            onClick={() => setSelectedEvent(event)}
                            style={{
                              height: `${heightInPixels}px`,
                              top: `${topOffset}px`,
                            }}
                            hasConflict={!!conflict}
                            conflictPosition={conflict?.position}
                            totalConflicts={conflict?.total}
                            draggable={!isUpdating}
                            onDragStart={handleDragStart(event)}
                            onDragEnd={handleDragEnd}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Details dialog can be added later for event details */}
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
                const currentDayDate = addDays(startOfWeek(currentDate, { weekStartsOn: 0 }), dayIndex);
                const dayEvents = getEventsForDay(currentDayDate);
                const conflicts = detectConflicts(dayEvents);
                
                return (
                  <div
                    key={i}
                    className="p-1 border-r border-b bg-background relative"
                    onDrop={handleDrop(currentDayDate, hourIndex)}
                    onDragOver={handleDragOver}
                  >
                    {dayEvents.map((event) => {
                      const eventStart = new Date(event.start_time);
                      const eventHour = eventStart.getHours();
                      const eventMinute = eventStart.getMinutes();
                      
                      if (eventHour !== hourIndex) return null;

                      const eventEnd = new Date(event.end_time);
                      const durationMinutes = differenceInMinutes(eventEnd, eventStart);
                      const heightInPixels = (durationMinutes / 60) * 60;
                      const topOffset = (eventMinute / 60) * 60;

                      const conflict = conflicts.get(event.id);

                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          onClick={() => setSelectedEvent(event)}
                          style={{
                            height: `${heightInPixels}px`,
                            top: `${topOffset}px`,
                          }}
                          hasConflict={!!conflict}
                          conflictPosition={conflict?.position}
                          totalConflicts={conflict?.total}
                          draggable={!isUpdating}
                          onDragStart={handleDragStart(event)}
                          onDragEnd={handleDragEnd}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Details dialog can be added later for event details */}
    </>
  );
}

