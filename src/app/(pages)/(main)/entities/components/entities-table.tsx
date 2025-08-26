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
import { EntityResponse, EntityService } from "../../../../../../client";
import { EditEntityDialog } from "./edit-entity-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface EntitiesTableProps {
  retrigger: number;
}

export const EntitiesTable = ({ retrigger }: EntitiesTableProps) => {
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityResponse | null>(null);
  const pageSize = 7;

  useEffect(() => {
    fetchEntities();
  }, [retrigger, currentPage]);

  const fetchEntities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const skip = (currentPage - 1) * pageSize;
      const response = await EntityService.entityControllerFindMany({
        skip,
        take: pageSize,
      });
      setEntities(response.data || []);
      setTotalRows(response.rows || 0);
      setTotalPages(Math.ceil((response.rows || 0) / pageSize));

      if (isRefresh) {
        toast.success("تم تحديث الجهات بنجاح");
      }
    } catch (error) {
      toast.error("فشل في جلب الجهات");
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
    await fetchEntities(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذه الجهة؟")) return;

    try {
      await EntityService.entityControllerDelete({ id });
      toast.success("تم حذف الجهة بنجاح");
      fetchEntities();
    } catch (error) {
      toast.error("فشل في حذف الجهة");
      console.error(error);
    }
  };

  const handleEdit = (entity: EntityResponse) => {
    setSelectedEntity(entity);
    setEditDialogOpen(true);
  };

  const handleEntityUpdated = () => {
    fetchEntities();
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل الجهات...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">الجهات</h3>
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
              <TableHead className="text-end"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-gray-500"
                >
                  لا توجد جهات
                </TableCell>
              </TableRow>
            ) : (
              entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium text-start">
                    {entity.name}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end space-x-reverse space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(entity)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(entity.id)}
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
            {Math.min(currentPage * pageSize, totalRows)} من أصل {totalRows} جهة
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

      <EditEntityDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        entity={selectedEntity}
        onEntityUpdated={handleEntityUpdated}
      />
    </div>
  );
};
