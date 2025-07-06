"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import TopBar from "@/app/(pages)/components/top-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractsTable } from "./components/contracts-table";
import CreateContractDialog from "./components/create-contract-dialog";

export default function ContractsPage() {
  const t = useTranslations();
  const [pageSize, setPageSize] = useState(10);

  // Define export columns for contracts
  return (
    <div className="flex flex-col h-full">
      {/* <TopBar /> */}

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {t('contracts.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('contracts.description')}
              </p>
            </div>
            <div className="flex gap-3">
              <CreateContractDialog />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => setPageSize(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contracts Table */}
          <ContractsTable pageSize={pageSize} />
        </div>
      </div>
    </div>
  );
}
