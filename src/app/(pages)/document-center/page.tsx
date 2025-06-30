// app/page.tsx
"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { Button } from "@/components/ui/button";
import { FiPlus, FiUpload } from "react-icons/fi";
import { ReportTable } from "./components/reporst-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContractTable } from "./components/contract-table";

interface reportTableData {
  id: string;
  name: string;
  type: string;
  module: string;
  generatedOn: string;
}

interface contractTableData {
  id: string;
  contract?: File;
  contractWith: string;
  workArea: string;
  contractDate: string;
}

export default function DocumentCenter() {
  const reportData: reportTableData[] = [
    {
      id: "MP001",
      name: "Q1 Production Summary",
      type: "Summary",
      module: "Production",
      generatedOn: "2023-10-01",
    },
  ];

  const contractData: contractTableData[] = [
    {
      id: "C001",
      contract: new File(["dummy content"], "Agreement_Q1.pdf", {
        type: "application/pdf",
      }),
      contractWith: "Gulf Mining & Resources",
      workArea: "Northern Production Unit",
      contractDate: "2024-01-10",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Document Center
            </h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FiUpload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>

        <Tabs defaultValue="report" className="w-full">
          <TabsList>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="contract">Contracts</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            <ReportTable data={reportData} />
          </TabsContent>
          <TabsContent value="contract">
            <ContractTable data={contractData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
