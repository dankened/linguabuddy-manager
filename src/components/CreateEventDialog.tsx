
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({ open, onOpenChange }: CreateEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Evento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input placeholder="Título do evento" />
          </div>
          <div className="grid gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extra">Aula extra</SelectItem>
                <SelectItem value="conversation">Conversação</SelectItem>
                <SelectItem value="monitoring">Monitoria</SelectItem>
                <SelectItem value="test">Prova</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input type="date" />
            <Input type="time" />
          </div>
          <div className="grid gap-2">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar turmas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class1">Inglês Básico</SelectItem>
                <SelectItem value="class2">Espanhol Intermediário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Criar evento</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
