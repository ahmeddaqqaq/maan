"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
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
import { InvoicesTable } from "./components/invoices-table";
import CreateInvoiceDialog from "./components/create-invoice-dialog";
import { useEntities } from "@/hooks/useUsers";
import { useInvoices } from "@/hooks/useInvoices";
import { useContracts } from "@/hooks/useContracts";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { formatters } from "@/lib/export-utils";

export default function InvoicesPage() {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts();
  const { data: invoicesData } = useInvoices({
    search: searchQuery || undefined,
    entityId:
      entityFilter === "all" || !entityFilter
        ? undefined
        : Number(entityFilter),
    contractId:
      contractFilter === "all" || !contractFilter
        ? undefined
        : Number(contractFilter),
  });

  // Define export columns for invoices
  const exportColumns = [
    {
      key: "id",
      label: t('invoices.fields.invoiceNumber'),
      formatter: (value: unknown) => {
        if (typeof value === "number" || typeof value === "string") {
          return `INV-${String(value).padStart(6, "0")}`;
        }
        return "INV-000000";
      },
    },
    {
      key: "entity",
      label: t('invoices.fields.entity'),
      formatter: (value: unknown) => {
        if (value && typeof value === "object" && "name" in value) {
          return (value as { name?: string }).name || "N/A";
        }
        return "N/A";
      },
    },
    {
      key: "Contract",
      label: t('invoices.fields.contract'),
      formatter: (value: unknown) => {
        if (value && typeof value === "object") {
          const contract = value as { description?: string; id?: number };
          return contract.description || String(contract.id) || "N/A";
        }
        return "N/A";
      },
    },
    {
      key: "totalAmount",
      label: t('invoices.fields.amount'),
      formatter: formatters.currency,
    },
    {
      key: "claims",
      label: t('invoices.fields.claimsCount'),
      formatter: (value: unknown) => {
        if (Array.isArray(value)) {
          return String(value.length);
        }
        return "0";
      },
    },
    {
      key: "materialSummary",
      label: t('invoices.fields.materialSummary'),
      formatter: (value: unknown) => {
        if (Array.isArray(value) && value.length > 0) {
          return value
            .map(
              (m: { materialName: string; netAmount: number; unit: string }) =>
                `${m.materialName}: ${m.netAmount} ${m.unit}`
            )
            .join("; ");
        }
        return t('invoices.noMaterials');
      },
    },
    { key: "startDate", label: t('invoices.fields.startDate'), formatter: formatters.date },
    { key: "endDate", label: t('invoices.fields.endDate'), formatter: formatters.date },
    { key: "createdAt", label: t('common.createdAt'), formatter: formatters.date },
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
                {t('invoices.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('invoices.description')}
              </p>
            </div>
            <div className="flex gap-3">
              <ExportDropdown
                data={invoicesData?.data || []}
                columns={exportColumns}
                filename="invoices-export"
              />
              <CreateInvoiceDialog />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[300px]">
                <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder={t('common.search')}
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('invoices.filters.filterByContract')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('invoices.filters.allContracts')}</SelectItem>
                  {contractsData?.data?.map(
                    (contract: {
                      id: number | string;
                      description?: string;
                    }) => (
                      <SelectItem
                        key={contract.id}
                        value={contract.id.toString()}
                      >
                        {t('invoices.filters.contractNumber', { id: contract.id })}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>

              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('invoices.filters.filterByEntity')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('invoices.filters.allEntities')}</SelectItem>
                  {entitiesData?.data?.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.name}
                    </SelectItem>
                  ))}
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

          {/* Invoices Table */}
          <InvoicesTable
            searchQuery={searchQuery}
            entityFilter={
              entityFilter === "all" || !entityFilter
                ? undefined
                : Number(entityFilter)
            }
            contractFilter={
              contractFilter === "all" || !contractFilter
                ? undefined
                : Number(contractFilter)
            }
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
