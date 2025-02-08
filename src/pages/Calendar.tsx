
import { Layout } from "@/components/Layout";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { format, addMonths, subMonths, addWeeks, subWeeks } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const CalendarPage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [viewType, setViewType] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // Janeiro 2025

  const handlePrevious = () => {
    if (viewType === "month") {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewType === "month") {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const maxDate = new Date(2039, 11, 31); // Dezembro 2039 (15 anos a partir de 2025)
  const minDate = new Date(2025, 0, 1); // Janeiro 2025

  const canGoBack = currentDate > minDate;
  const canGoForward = currentDate < maxDate;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar aulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border">
              <Button
                variant={viewType === "week" ? "secondary" : "ghost"}
                className="rounded-r-none"
                onClick={() => setViewType("week")}
              >
                Semana
              </Button>
              <Button
                variant={viewType === "month" ? "secondary" : "ghost"}
                className="rounded-l-none"
                onClick={() => setViewType("month")}
              >
                Mês
              </Button>
            </div>
            <Button onClick={() => setShowCreateEvent(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar evento
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePrevious}
              disabled={!canGoBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNext}
              disabled={!canGoForward}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !currentDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => date && setCurrentDate(date)}
                  disabled={(date) =>
                    date > maxDate || date < minDate
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <CalendarView viewType={viewType} currentDate={currentDate} />

        <CreateEventDialog
          open={showCreateEvent}
          onOpenChange={setShowCreateEvent}
        />
      </div>
    </Layout>
  );
};

export default CalendarPage;
