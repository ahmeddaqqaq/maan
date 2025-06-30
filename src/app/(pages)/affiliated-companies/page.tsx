// app/page.tsx
"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { AffiliatedTable } from "./components/affiliated-companies-table";
import AddNewMonthlyProductionDialog from "../components/add-new-monthly-production-dialog";
import AddNewAffiliatedCompaniesDialog from "../components/add-new-affiliated-companies-dialog";

interface affiliatedTableData {
  id: string;
  name: string;
  phoneNumber: string;
  location: string;
}

export default function () {
  const affiliatedData: affiliatedTableData[] = [
    {
      id: "MP001",
      name: "Gulf Mining & Resources",
      phoneNumber: "+966 11 456 8798",
      location: "Riyadh",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Affiliated Companies
            </h1>
            <AddNewAffiliatedCompaniesDialog />
          </div>
        </div>

        <AffiliatedTable data={affiliatedData} />
      </div>
    </div>
  );
}
