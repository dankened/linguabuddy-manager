import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  type: string;
  class_id: string | null;
  teacher_id: string;
  class?: {
    id: string;
    name: string;
    language: string;
    level: string;
    days: string[];
    time: string;
  };
}

interface UseEventsFilters {
  classId?: string | null;
  language?: string | null;
  level?: string | null;
}

export function useEvents(
  currentDate: Date,
  viewType: "day" | "week" | "month",
  filters?: UseEventsFilters
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const getDateRange = () => {
    if (viewType === "month") {
      return {
        start: startOfMonth(currentDate).toISOString(),
        end: endOfMonth(currentDate).toISOString(),
      };
    } else if (viewType === "week") {
      return {
        start: startOfWeek(currentDate, { weekStartsOn: 0 }).toISOString(),
        end: endOfWeek(currentDate, { weekStartsOn: 0 }).toISOString(),
      };
    } else {
      return {
        start: startOfDay(currentDate).toISOString(),
        end: endOfDay(currentDate).toISOString(),
      };
    }
  };

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", currentDate, viewType, filters],
    queryFn: async () => {
      if (!user?.id) return [];

      const { start, end } = getDateRange();

      let query = supabase
        .from("events")
        .select(`
          *,
          class:classes(
            id,
            name,
            language,
            level,
            days,
            time
          )
        `)
        .gte("start_time", start)
        .lte("start_time", end)
        .order("start_time");

      // Apply filters
      if (filters?.classId) {
        query = query.eq("class_id", filters.classId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching events:", error);
        toast.error("Erro ao carregar eventos");
        return [];
      }

      // Filter by language and level if provided
      let filteredData = data || [];
      if (filters?.language || filters?.level) {
        filteredData = filteredData.filter((event) => {
          const classData = event.class as Event["class"];
          if (!classData) return true;
          
          const languageMatch = !filters.language || classData.language === filters.language;
          const levelMatch = !filters.level || classData.level === filters.level;
          
          return languageMatch && levelMatch;
        });
      }

      return filteredData as Event[];
    },
    enabled: !!user?.id,
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({
      eventId,
      start_time,
      end_time,
    }: {
      eventId: string;
      start_time: string;
      end_time: string;
    }) => {
      const { error } = await supabase
        .from("events")
        .update({ start_time, end_time, updated_at: new Date().toISOString() })
        .eq("id", eventId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Evento atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Error updating event:", error);
      toast.error("Erro ao atualizar evento");
    },
  });

  return {
    events,
    isLoading,
    updateEvent: updateEventMutation.mutate,
    isUpdating: updateEventMutation.isPending,
  };
}
