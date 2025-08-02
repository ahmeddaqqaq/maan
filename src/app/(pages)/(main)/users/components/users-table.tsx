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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { UserResponse, UserService } from "../../../../../../client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UsersTableProps {
  retrigger: number;
}

export const UsersTable = ({ retrigger }: UsersTableProps) => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const pageSize = 7;

  useEffect(() => {
    fetchUsers();
  }, [retrigger, currentPage]);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const skip = (currentPage - 1) * pageSize;
      const response = await UserService.userControllerFindMany({
        skip,
        take: pageSize,
      });
      setUsers(response.data || []);
      setTotalRows(response.rows || 0);
      setTotalPages(Math.ceil((response.rows || 0) / pageSize));
      if (isRefresh) {
        toast.success("تم تحديث المستخدمين بنجاح");
      }
    } catch (error) {
      toast.error("فشل في جلب المستخدمين");
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
    await fetchUsers(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من أنك تريد حذف هذا المستخدم؟")) return;

    try {
      await UserService.userControllerDelete({ id });
      toast.success("تم حذف المستخدم بنجاح");
      fetchUsers();
    } catch (error) {
      toast.error("فشل في حذف المستخدم");
      console.error(error);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "PRODUCTION_MANAGER":
        return "default";
      case "FINANCIAL_MANAGER":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل المستخدمين...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المستخدمون</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 me-2 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "جاري التحديث..." : "تحديث"}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">اسم المستخدم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  لا توجد مستخدمون
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-right">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.email || "غير متاح"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "ADMIN"
                        ? "مدير"
                        : user.role === "PRODUCTION_MANAGER"
                        ? "مدير إنتاج"
                        : user.role === "FINANCIAL_MANAGER"
                        ? "مدير مالي"
                        : "مستخدم عادي"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "نشط" : "غير نشط"}
                    </Badge>
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
                        onClick={() => handleDelete(user.id)}
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
