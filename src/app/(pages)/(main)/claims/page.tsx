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
import { ClaimsTable } from "./components/claims-table";
import CreateClaimDialog from "./components/create-claim-dialog";
import { useClaims } from "@/hooks/useClaims";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { formatters } from "@/lib/export-utils";

export default function ClaimsPage() {
  const t = useTranslations();
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [mineFilter, setMineFilter] = useState("all");

  const { data: claimsData } = useClaims({
    take: pageSize,
    status:
      statusFilter !== "all"
        ? (statusFilter as "PENDING" | "APPROVED" | "REJECTED")
        : undefined,
    mineId: mineFilter !== "all" ? Number(mineFilter) : undefined,
  });

  // Define export columns for claims
  const exportColumns = [
    { key: "id", label: t("common.id") },
    {
      key: "startDate",
      label: t("claims.fields.startDate"),
      formatter: formatters.date,
    },
    {
      key: "endDate",
      label: t("claims.fields.endDate"),
      formatter: formatters.date,
    },
    { key: "status", label: t("common.status") },
    { key: "mineId", label: t("claims.fields.mineId") },
    { key: "entityId", label: t("claims.fields.entityId") },
    { key: "contractId", label: t("claims.fields.contractId") },
    { key: "requestId", label: t("claims.fields.requestId") },
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
                {t("claims.title")}
              </h1>
            </div>
            <div className="flex gap-3">
              <ExportDropdown
                data={claimsData?.data || []}
                columns={exportColumns}
                filename="claims-export"
              />
              <CreateClaimDialog />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("claims.filters.byStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("claims.filters.allStatuses")}
                  </SelectItem>
                  <SelectItem value="PENDING">{t("common.pending")}</SelectItem>
                  <SelectItem value="APPROVED">
                    {t("common.approved")}
                  </SelectItem>
                  <SelectItem value="REJECTED">
                    {t("common.rejected")}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={mineFilter} onValueChange={setMineFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("claims.filters.byMine")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("claims.filters.allMines")}
                  </SelectItem>
                  {/* Mine options will be populated dynamically */}
                </SelectContent>
              </Select>

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

          {/* Claims Table */}
          <ClaimsTable
            statusFilter={statusFilter}
            mineFilter={mineFilter}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
