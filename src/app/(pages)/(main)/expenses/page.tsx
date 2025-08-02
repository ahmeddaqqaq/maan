"use client";

import { MonthlyExpensesTable } from "./components/monthly-expenses-table";

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المصروفات الشهرية</h2>
          <p className="text-gray-600">تتبع مصروفات المناجم الشهرية حسب المنجم</p>
        </div>
      </div>

      <MonthlyExpensesTable />
    </div>
  );
}
