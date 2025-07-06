"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TopBar from "@/app/(pages)/components/top-bar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestsTable } from "./components/requests-table";
import CreateRequestDialog from "./components/create-request-dialog";
import { useRequestsWithClaimBackend } from "@/hooks/useRequestsWithClaimBackend";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { formatters } from "@/lib/export-utils";

export default function RequestsPage() {
  const t = useTranslations();
  const [pageSize, setPageSize] = useState(10);
  // Using claim backend for requests frontend
  const { data: requestsData } = useRequestsWithClaimBackend({
    take: pageSize,
  });

  // Define export columns for requests
  const exportColumns = [
    { key: "id", label: t("common.id") },
    { key: "description", label: t("requests.fields.description") },
    {
      key: "startDate",
      label: t("requests.fields.startDate"),
      formatter: formatters.date,
    },
    {
      key: "endDate",
      label: t("requests.fields.endDate"),
      formatter: formatters.date,
    },
    { key: "requestingEntityId", label: t("requests.fields.requestingEntity") },
    { key: "targetEntityId", label: t("requests.fields.targetEntity") },
    { key: "contractId", label: t("requests.fields.contract") },
    { key: "mineId", label: t("requests.fields.mine") },
    { key: "materialId", label: t("requests.fields.material") },
    {
      key: "createdAt",
      label: t("common.createdAt"),
      formatter: formatters.date,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* <TopBar /> */}

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {t("requests.title")}
              </h1>
            </div>
            <div className="flex gap-3">
              <ExportDropdown
                data={requestsData?.data || []}
                columns={exportColumns}
                filename="request-export"
              />
              <CreateRequestDialog />
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

          {/* Requests Table */}
          <RequestsTable pageSize={pageSize} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  );
}
