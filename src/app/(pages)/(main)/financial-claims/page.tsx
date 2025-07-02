// app/page.tsx
"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { FinancialClaimsTable } from "./components/financial-claims-table";
// import { AffiliatedTable } from "./components/affiliated-companies-table";

interface FinancialTableData {
  id: string;
  company: string;
  expenseType: string;
  amount: string;
  date: string;
}

export default function FinancialClaimsPage() {
  const financialData: FinancialTableData[] = [
    {
      id: "MP001",
      company: "Gulf Mining & Resources",
      expenseType: "Travel",
      amount: "350.00",
      date: "12 Dec, 2025",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Financial Claims
            </h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FiPlus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <FinancialClaimsTable data={financialData} />
      </div>
    </div>
  );
}
