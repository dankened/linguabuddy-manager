
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface RevenueSource {
  name: string;
  amount: number;
  count: number;
}

interface RevenueDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalRevenue: number;
}

const RevenueDetailsDialog = ({
  open,
  onOpenChange,
  totalRevenue,
}: RevenueDetailsDialogProps) => {
  // Mock data for revenue sources
  const revenueSources: RevenueSource[] = [
    {
      name: "Turmas de Inglês",
      amount: 450.00,
      count: 5,
    },
    {
      name: "Turmas de Espanhol",
      amount: 380.00,
      count: 4,
    },
    {
      name: "Turmas de Francês",
      amount: 280.00,
      count: 2,
    },
    {
      name: "Aulas Particulares",
      amount: 470.00,
      count: 3,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhamento da Receita</DialogTitle>
          <DialogDescription>
            Receita mensal total: R$ {totalRevenue.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {revenueSources.map((source) => (
            <Card key={source.name} className="overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{source.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {source.count} {source.count === 1 ? "aluno" : "alunos"}
                  </p>
                </div>
                <div className="text-primary font-medium">
                  R$ {source.amount.toFixed(2)}
                </div>
              </div>
              <div 
                className="h-1 bg-primary-light" 
                style={{ 
                  width: `${(source.amount / totalRevenue) * 100}%`,
                }}
              />
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueDetailsDialog;
