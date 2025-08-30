"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MonthlyExpensesTable } from "./components/monthly-expenses-table";
import { CreateExpenseDialog } from "./components/create-expense-dialog";

export default function ExpensesPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المصروفات الشهرية</h2>
          <p className="text-gray-600">تتبع مصروفات المناجم الشهرية حسب المنجم</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          إضافة مصروف
        </Button>
      </div>

      <MonthlyExpensesTable />

      <CreateExpenseDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onExpenseCreated={() => {
          // Optionally refresh data or show success message
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}
