"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ContractResponse, ContractService } from "../../../../../../client";
import { EditContractDialog } from "./edit-contract-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ContractsTableProps {
  retrigger: number;
}

export const ContractsTable = ({ retrigger }: ContractsTableProps) => {
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] =
    useState<ContractResponse | null>(null);
  const pageSize = 7;

  const fetchContracts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const skip = (currentPage - 1) * pageSize;
        const response = await ContractService.contractControllerFindMany({
          skip,
          take: pageSize,
        });
        setContracts(response.data || []);
        setTotalRows(response.rows || 0);
        setTotalPages(Math.ceil((response.rows || 0) / pageSize));
        if (isRefresh) {
          toast.success("تم تحديث العقود بنجاح");
        }
      } catch (error) {
        toast.error("فشل في جلب العقود");
        console.error(error);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [currentPage]
  );

  useEffect(() => {
    fetchContracts();
  }, [retrigger, currentPage, fetchContracts]);

  const handleRefresh = async () => {
    await fetchContracts(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا العقد؟")) return;

    try {
      await ContractService.contractControllerDelete({ id });
      toast.success("تم حذف العقد بنجاح");
      fetchContracts();
    } catch (error) {
      toast.error("فشل في حذف العقد");
      console.error(error);
    }
  };

  const handleEdit = (contract: ContractResponse) => {
    setSelectedContract(contract);
    setEditDialogOpen(true);
  };

  const handleContractUpdated = () => {
    fetchContracts();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل العقود...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">العقود</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 me-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "جارٍ التحديث..." : "تحديث"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">تاريخ البدء</TableHead>
              <TableHead className="text-right">تاريخ الانتهاء</TableHead>
              <TableHead className="text-right">سعر الديزل</TableHead>
              <TableHead className="text-right">سعر الاستخراج</TableHead>
              <TableHead className="text-right">سعر الفوسفات</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  لا توجد عقود
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium text-right">
                    {contract.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-right">
                    {contract.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDate(contract.startDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {contract.endDate
                      ? formatDate(contract.endDate)
                      : "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-right">
                    {contract.dieselPrice
                      ? `$${contract.dieselPrice}`
                      : "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-right">
                    {contract.extractionPrice
                      ? `$${contract.extractionPrice}`
                      : "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-right">
                    {contract.phosphatePrice
                      ? `$${contract.phosphatePrice}`
                      : "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-start space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contract)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(contract.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            عرض {(currentPage - 1) * pageSize + 1} إلى{" "}
            {Math.min(currentPage * pageSize, totalRows)} من أصل {totalRows} عقد
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      handlePageChange(currentPage + 1);
                  }}
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <EditContractDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        contract={selectedContract}
        onContractUpdated={handleContractUpdated}
      />
    </div>
  );
};
