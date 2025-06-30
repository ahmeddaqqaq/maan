// app/page.tsx
"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { ProductionTable } from "./components/monthly-production-table";
import AddNewMonthlyProductionDialog from "../components/add-new-monthly-production-dialog";

interface productionTableData {
  id: string;
  workArea: string;
  category: string;
  material: string;
  qty: number;
  from: string;
  to: string;
}

export default function Home() {
  const productionData: productionTableData[] = [
    {
      id: "MP001",
      workArea: "Construction",
      category: "Steel",
      material: "Rebar",
      qty: 150,
      from: "2023-10-01",
      to: "2023-10-31",
    },
    {
      id: "MP002",
      workArea: "Electrical",
      category: "Wiring",
      material: "Copper Wire",
      qty: 500,
      from: "2023-10-15",
      to: "2023-11-15",
    },
    {
      id: "MP003",
      workArea: "Plumbing",
      category: "Pipes",
      material: "PVC",
      qty: 300,
      from: "2023-11-01",
      to: "2023-11-30",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Monthly Production
            </h1>
            <AddNewMonthlyProductionDialog />
          </div>
        </div>

        <ProductionTable data={productionData} />
      </div>
    </div>
  );
}
