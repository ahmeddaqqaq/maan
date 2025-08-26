"use client";

import { useState, useEffect } from "react";
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
import { ExpenseService, ExpenseResponse } from "../../../../../../client";
import { EditExpenseDialog } from "./edit-expense-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ExpensesTableProps {
  retrigger: number;
}

export const ExpensesTable = ({ retrigger }: ExpensesTableProps) => {
  const [expenses, setExpenses] = useState<ExpenseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseResponse | null>(null);
  const pageSize = 7;

  useEffect(() => {
    fetchExpenses();
  }, [retrigger, currentPage]);

  const fetchExpenses = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const skip = (currentPage - 1) * pageSize;
      const response = await ExpenseService.expenseControllerFindMany({
        skip,
        take: pageSize,
      });
      setExpenses(response.data || []);
      setTotalRows(response.rows || 0);
      setTotalPages(Math.ceil((response.rows || 0) / pageSize));

      if (isRefresh) {
        toast.success("تم تحديث المصاريف بنجاح");
      }
    } catch (error) {
      toast.error("فشل في جلب المصاريف");
      console.error(error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    await fetchExpenses(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;

    try {
      await ExpenseService.expenseControllerDelete({ id });
      toast.success("تم حذف المصروف بنجاح");
      fetchExpenses();
    } catch (error) {
      toast.error("فشل في حذف المصروف");
      console.error(error);
    }
  };

  const handleEdit = (expense: ExpenseResponse) => {
    setSelectedExpense(expense);
    setEditDialogOpen(true);
  };

  const handleExpenseUpdated = () => {
    fetchExpenses();
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل المصاريف...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المصاريف</h3>
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
              <TableHead className="text-start">الاسم</TableHead>
              <TableHead className="text-start">الوحدة</TableHead>
              <TableHead className="text-start">معرف الشركة</TableHead>
              <TableHead className="text-end"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  لا توجد مصاريف
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium text-start">
                    {expense.name}
                  </TableCell>
                  <TableCell className="text-start">{expense.unit}</TableCell>
                  <TableCell className="text-start">
                    {expense.entity?.id || "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end space-x-reverse space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
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
            {Math.min(currentPage * pageSize, totalRows)} من {totalRows} مدخلات
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

      <EditExpenseDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        expense={selectedExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />
    </div>
  );
};
