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
import { MaterialResponse, MaterialService } from "../../../../../../client";
import { EditMaterialDialog } from "./edit-material-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MaterialsTableProps {
  retrigger: number;
}

export const MaterialsTable = ({ retrigger }: MaterialsTableProps) => {
  const [materials, setMaterials] = useState<MaterialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponse | null>(null);
  const pageSize = 7;

  useEffect(() => {
    fetchMaterials();
  }, [retrigger, currentPage]);

  const fetchMaterials = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const skip = (currentPage - 1) * pageSize;
      const response = await MaterialService.materialControllerFindMany({
        skip,
        take: pageSize,
      });
      setMaterials(response.data || []);
      setTotalRows(response.rows || 0);
      setTotalPages(Math.ceil((response.rows || 0) / pageSize));
      if (isRefresh) {
        toast.success("تم تحديث المواد بنجاح");
      }
    } catch (error) {
      toast.error("فشل في جلب المواد");
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
    await fetchMaterials(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه المادة؟")) return;

    try {
      await MaterialService.materialControllerDelete({ id });
      toast.success("تم حذف المادة بنجاح");
      fetchMaterials();
    } catch (error) {
      toast.error("فشل في حذف المادة");
      console.error(error);
    }
  };

  const handleEdit = (material: MaterialResponse) => {
    setSelectedMaterial(material);
    setEditDialogOpen(true);
  };

  const handleMaterialUpdated = () => {
    fetchMaterials();
  };

  if (loading) {
    return <div className="text-center py-8">جارٍ تحميل المواد...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">المواد</h3>
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
              <TableHead className="text-start">الحالة</TableHead>
              <TableHead className="text-start">معرّف الجهة</TableHead>
              <TableHead className="text-end"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  لم يتم العثور على مواد
                </TableCell>
              </TableRow>
            ) : (
              materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium text-start">
                    {material.name}
                  </TableCell>
                  <TableCell className="text-start">{material.unit}</TableCell>
                  <TableCell className="text-start">
                    <Badge
                      variant={material.isActive ? "default" : "secondary"}
                    >
                      {material.isActive ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-start">
                    {material.entity?.id || "غير متوفر"}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end space-x-reverse space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(material)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
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
            {Math.min(currentPage * pageSize, totalRows)} من {totalRows} عنصر
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

      <EditMaterialDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        material={selectedMaterial}
        onMaterialUpdated={handleMaterialUpdated}
      />
    </div>
  );
};
