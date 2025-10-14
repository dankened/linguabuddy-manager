
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Archive, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NewClassForm from "@/components/NewClassForm";
import ActiveClasses from "@/components/ActiveClasses";
import { useState } from "react";
import { Layout } from "@/components/Layout";

const Classes = () => {
  const [showInactive, setShowInactive] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowInactive(!showInactive)}
              className="flex items-center gap-2"
            >
              {showInactive ? (
                <>
                  <List className="h-4 w-4" />
                  Ver turmas ativas
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  Ver turmas inativas
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Cadastrar nova turma
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Nova Turma</DialogTitle>
                </DialogHeader>
                <NewClassForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

      <ActiveClasses showInactive={showInactive} />
    </div>
  );
};

export default Classes;
