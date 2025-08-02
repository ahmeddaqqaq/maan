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
import { MineResponse, MineService } from "../../../../../../client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MinesTableProps {
  retrigger: number;
}

export const MinesTable = ({ retrigger }: MinesTableProps) => {
  const [mines, setMines] = useState<MineResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 7;

  useEffect(() => {
    fetchMines();
  }, [retrigger, currentPage]);

  const fetchMines = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const skip = (currentPage - 1) * pageSize;
      const response = await MineService.mineControllerFindMany({
        skip,
        take: pageSize,
      });
      setMines(response.data || []);
      setTotalRows(response.rows || 0);
      setTotalPages(Math.ceil((response.rows || 0) / pageSize));
      if (isRefresh) {
        toast.success("تم تحديث المعادن بنجاح");
      }
    } catch (error) {
      toast.error("فشل في جلب المعادن");
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
    await fetchMines(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من أنك تريد حذف هذا المنجم؟")) return;

    try {
      await MineService.mineControllerDelete({ id });
      toast.success("تم حذف المنجم بنجاح");
      fetchMines();
    } catch (error) {
      toast.error("فشل في حذف المنجم");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل المعادن...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المعادن</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "جاري التحديث..." : "تحديث"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الموقع</TableHead>
              <TableHead className="text-right">العقد</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mines.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  لا توجد معادن
                </TableCell>
              </TableRow>
            ) : (
              mines.map((mine) => (
                <TableRow key={mine.id}>
                  <TableCell className="font-medium text-right">
                    {mine.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {mine.location || "غير متاح"}
                  </TableCell>
                  <TableCell className="text-right">
                    {mine.contract?.name || "غير متاح"}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-start space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          toast.info("ميزة التعديل قريباً");
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(mine.id)}
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
            {Math.min(currentPage * pageSize, totalRows)} من {totalRows} إدخال
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
    </div>
  );
};
