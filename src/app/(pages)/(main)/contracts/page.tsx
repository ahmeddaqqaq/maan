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
import { ContractsTable } from "./components/contracts-table";
import CreateContractDialog from "./components/create-contract-dialog";
import { useContracts } from "@/hooks/useContracts";
import { useEntities } from "@/hooks/useUsers";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { formatters } from "@/lib/export-utils";

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts({
    search: searchQuery || undefined,
    statusFilter: statusFilter === "all" ? undefined : statusFilter,
    entityFilter: entityFilter === "all" ? undefined : entityFilter,
  });

  // Define export columns for contracts
  const exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'description', label: 'Description' },
    { key: 'ownerId', label: 'Owner ID' },
    { key: 'entityIds', label: 'Entity IDs', formatter: (value: number[]) => value?.join(', ') || '' },
    { key: 'createdAt', label: 'Created Date', formatter: formatters.date },
    { key: 'updatedAt', label: 'Updated Date', formatter: formatters.date },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Contracts Management</h1>
              <p className="text-gray-600 mt-1">Manage mining contracts, agreements, and configurations</p>
            </div>
            <div className="flex gap-3">
              <ExportDropdown 
                data={contractsData?.data || []}
                columns={exportColumns}
                filename="contracts-export"
              />
              <CreateContractDialog />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search contracts by description..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                  <SelectItem value="TERMINATED">Terminated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {entitiesData?.data?.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
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

          {/* Contracts Table */}
          <ContractsTable
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            entityFilter={entityFilter}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}