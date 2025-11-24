import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Event } from "@/hooks/useEvents";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick: () => void;
  style?: {
    height?: string;
    top?: string;
  };
  hasConflict?: boolean;
  conflictPosition?: number;
  totalConflicts?: number;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function EventCard({
  event,
  onClick,
  style,
  hasConflict = false,
  conflictPosition = 0,
  totalConflicts = 1,
  draggable = false,
  onDragStart,
  onDragEnd,
}: EventCardProps) {
  const startTime = format(new Date(event.start_time), "HH:mm", { locale: ptBR });
  const endTime = format(new Date(event.end_time), "HH:mm", { locale: ptBR });
  
  const classData = event.class;
  const displayTitle = classData 
    ? `${classData.language} - ${classData.level}` 
    : event.title;

  // Calculate width when there are conflicts
  const widthPercentage = hasConflict ? `${100 / totalConflicts}%` : "100%";
  const leftPosition = hasConflict ? `${(conflictPosition * 100) / totalConflicts}%` : "0";

  return (
    <button
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        "absolute px-2 py-1 rounded text-xs text-white truncate cursor-pointer hover:opacity-90 transition-opacity",
        hasConflict && "border-2 border-yellow-400",
        draggable && "cursor-move"
      )}
      style={{
        ...style,
        backgroundColor: classData ? "#8B5CF6" : "#D946EF",
        width: widthPercentage,
        left: leftPosition,
      }}
      title={`${displayTitle}\n${startTime} - ${endTime}`}
    >
      {draggable && (
        <GripVertical className="h-3 w-3 inline-block mr-1 opacity-70" />
      )}
      {displayTitle}
      <div className="text-[10px] opacity-80">
        {startTime} - {endTime}
      </div>
    </button>
  );
}
