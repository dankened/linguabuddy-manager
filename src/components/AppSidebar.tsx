
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CalendarIcon, GraduationCap, Home, Book } from "lucide-react";
import { Sidebar } from "./ui/sidebar";

export const AppSidebar = () => {
  const { pathname } = useLocation();

  return (
    <Sidebar className="fixed bg-card">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
          CursoPlanner
        </h2>
        <div className="space-y-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === "/" ? "bg-secondary text-white" : "text-gray-700"
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/classes"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === "/classes" ? "bg-secondary text-white" : "text-gray-700"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            Turmas
          </Link>
          <Link
            to="/calendar"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === "/calendar" ? "bg-secondary text-white" : "text-gray-700"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            Calendário
          </Link>
          <Link
            to="/materials"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === "/materials" ? "bg-secondary text-white" : "text-gray-700"
            )}
          >
            <Book className="h-4 w-4" />
            Materiais
          </Link>
        </div>
      </div>
    </Sidebar>
  );
};
