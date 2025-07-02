"use client";

import { useState } from "react";
import TopBar from "@/app/(pages)/components/top-bar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiSearch } from "react-icons/fi";
import { ClaimsTable } from "./components/claims-table";
import CreateClaimDialog from "./components/create-claim-dialog";
import { useMines, useClaims } from "@/hooks/useClaims";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { formatters } from "@/lib/export-utils";

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mineFilter, setMineFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { data: minesData } = useMines();
  const { data: claimsData } = useClaims({
    search: searchQuery || undefined,
    mineId: mineFilter === "all" || !mineFilter ? undefined : Number(mineFilter),
    status: statusFilter === "all" || !statusFilter ? undefined : statusFilter as 'PENDING' | 'APPROVED' | 'REJECTED',
  });

  // Define export columns for claims
  const exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'startDate', label: 'Start Date', formatter: formatters.date },
    { key: 'endDate', label: 'End Date', formatter: formatters.date },
    { key: 'mineId', label: 'Mine ID' },
    { key: 'entityId', label: 'Entity ID' },
    { key: 'contractId', label: 'Contract ID' },
    { key: 'materialId', label: 'Material ID' },
    { key: 'createdAt', label: 'Created Date', formatter: formatters.date },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Claims Management</h1>
              <p className="text-gray-600 mt-1">Track material extraction and production claims</p>
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
              <div className="relative flex-1 min-w-[300px]">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search claims..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={mineFilter} onValueChange={setMineFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by mine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mines</SelectItem>
                  {minesData?.data?.map((mine) => (
                    <SelectItem key={mine.id} value={mine.id.toString()}>
                      {mine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
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
            searchQuery={searchQuery}
            mineFilter={mineFilter === "all" || !mineFilter ? undefined : Number(mineFilter)}
            statusFilter={statusFilter === "all" || !statusFilter ? undefined : statusFilter as 'PENDING' | 'APPROVED' | 'REJECTED'}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}