"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical, FiEdit3, FiTrash2 } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequestsWithClaimBackend, useDeleteRequestWithClaimBackend } from "@/hooks/useRequestsWithClaimBackend";
import EditRequestDialog from "./edit-request-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Request {
  id: number | string;
  description?: string;
  requestingEntityId?: number;
  targetEntityId?: number;
  contractId?: number;
  mineId?: number;
  materialId?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RequestsTableProps {
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

export function RequestsTable({ pageSize = 10, onPageSizeChange }: RequestsTableProps) {
  const t = useTranslations();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Using claim backend for requests frontend
  const { data: requestsData, isLoading } = useRequestsWithClaimBackend({
    skip: currentPage * pageSize,
    take: pageSize,
  });
  const deleteRequestMutation = useDeleteRequestWithClaimBackend();

  const handleEdit = (request: Request) => {
    setSelectedRequest(request);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm(t('requests.messages.confirmDelete'))) {
      try {
        await deleteRequestMutation.mutateAsync(Number(id));
      } catch (error) {
        console.error("Failed to delete request:", error);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="rounded-md bg-white shadow-sm">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const requests = requestsData?.data || [];
  const totalRequests = requestsData?.rows || 0;
  const totalPages = Math.ceil(totalRequests / pageSize);

  return (
    <>
      <div className="rounded-md bg-white shadow-sm">
        {/* Table Controls */}
        <div className="p-4 border-b flex justify-between items-center gap-3">
          <div className="flex items-center space-x-inline-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">{t('table.show')}</span>
            <Select
              defaultValue={String(pageSize)}
              onValueChange={(value) => {
                setCurrentPage(0);
                onPageSizeChange?.(Number(value));
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 15, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>{t('common.id')}</TableHead>
              <TableHead>{t('requests.fields.description')}</TableHead>
              <TableHead>{t('requests.fields.requestingEntity')}</TableHead>
              <TableHead>{t('requests.fields.targetEntity')}</TableHead>
              <TableHead>{t('requests.fields.startDate')}</TableHead>
              <TableHead>{t('requests.fields.endDate')}</TableHead>
              <TableHead>{t('common.createdAt')}</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {t('requests.noRequests')}
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request: Request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-mono text-sm">#{request.id}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.description || t('requests.fields.description')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Entity {request.requestingEntityId}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Entity {request.targetEntityId}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(request.startDate)}</TableCell>
                  <TableCell>{formatDate(request.endDate)}</TableCell>
                  <TableCell>{formatDate(request.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FiMoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(request)}
                          className="cursor-pointer"
                        >
                          <FiEdit3 className="me-2 h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(request.id)}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <FiTrash2 className="me-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              {t('pagination.showing', {
                start: currentPage * pageSize + 1,
                end: Math.min((currentPage + 1) * pageSize, totalRequests),
                total: totalRequests
              })} {t('requests.title').toLowerCase()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                {t('pagination.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                {t('pagination.next')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <EditRequestDialog
          request={selectedRequest}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}