"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { CreateExpenseDialog } from "./components/create-expense-dialog";
import { ExpensesTable } from "./components/expenses-table";
import { MonthlyExpensesTable } from "./components/monthly-expenses-table";

export default function ExpensesPage() {
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [retrigger, setRetrigger] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Expenses Management</h2>
          <p className="text-gray-600">Manage expenses and monthly expense data</p>
        </div>
        <Button onClick={() => setShowCreateExpense(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Expense Settings</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <ExpensesTable retrigger={retrigger} />
        </TabsContent>
        
        <TabsContent value="monthly">
          <MonthlyExpensesTable />
        </TabsContent>
      </Tabs>

      <CreateExpenseDialog
        open={showCreateExpense}
        onOpenChange={setShowCreateExpense}
        onExpenseCreated={() => setRetrigger(retrigger + 1)}
      />
    </div>
  );
}