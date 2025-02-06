
import { Layout } from "@/components/Layout";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateEventDialog } from "@/components/CreateEventDialog";

const Calendar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [viewType, setViewType] = useState<"week" | "month">("week");

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
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Março 2024</h2>
          </div>
        </div>

        <CalendarView viewType={viewType} />

        <CreateEventDialog
          open={showCreateEvent}
          onOpenChange={setShowCreateEvent}
        />
      </div>
    </Layout>
  );
};

export default Calendar;
