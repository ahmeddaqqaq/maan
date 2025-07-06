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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical, FiEdit3, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";
import { useClaims, useDeleteClaim, useApproveRejectClaim } from "@/hooks/useClaims";
import EditClaimDialog from "./edit-claim-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Claim {
  id: number | string;
  startDate?: string;
  endDate?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  mineId?: number;
  entityId?: number;
  contractId?: number;
  requestId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ClaimsTableProps {
  statusFilter?: string;
  mineFilter?: string;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

export function ClaimsTable({ 
  statusFilter = "all",
  mineFilter = "all",
  pageSize = 10, 
  onPageSizeChange 
}: ClaimsTableProps) {
  const t = useTranslations();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  
  const { data: claimsData, isLoading } = useClaims({
    skip: currentPage * pageSize,
    take: pageSize,
    status: statusFilter !== "all" ? statusFilter as "PENDING" | "APPROVED" | "REJECTED" : undefined,
    mineId: mineFilter !== "all" ? Number(mineFilter) : undefined,
  });
  const deleteClaimMutation = useDeleteClaim();
  const approveRejectClaimMutation = useApproveRejectClaim();

  const handleEdit = (claim: Claim) => {
    setSelectedClaim(claim);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm(t('claims.messages.confirmDelete'))) {
      try {
        await deleteClaimMutation.mutateAsync(Number(id));
      } catch (error) {
        console.error("Failed to delete claim:", error);
      }
    }
  };

  const handleApprove = async (id: number | string) => {
    if (window.confirm(t('claims.messages.confirmApprove'))) {
      try {
        await approveRejectClaimMutation.mutateAsync({
          id: Number(id),
          data: { status: "APPROVED" as any }
        });
      } catch (error) {
        console.error("Failed to approve claim:", error);
      }
    }
  };

  const handleReject = async (id: number | string) => {
    if (window.confirm(t('claims.messages.confirmReject'))) {
      try {
        await approveRejectClaimMutation.mutateAsync({
          id: Number(id),
          data: { status: "REJECTED" as any }
        });
      } catch (error) {
        console.error("Failed to reject claim:", error);
      }
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatStatus = (status?: string) => {
    return status || "PENDING";
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

  const claims = claimsData?.data || [];
  const totalClaims = claimsData?.rows || 0;
  const totalPages = Math.ceil(totalClaims / pageSize);

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
              <TableHead>{t('claims.fields.startDate')}</TableHead>
              <TableHead>{t('claims.fields.endDate')}</TableHead>
              <TableHead>{t('common.status')}</TableHead>
              <TableHead>{t('claims.fields.mineId')}</TableHead>
              <TableHead>{t('claims.fields.entityId')}</TableHead>
              <TableHead>{t('claims.fields.contractId')}</TableHead>
              <TableHead>{t('common.createdAt')}</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {t('claims.noClaims')}
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim: Claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-mono text-sm">#{claim.id}</TableCell>
                  <TableCell>{formatDate(claim.startDate)}</TableCell>
                  <TableCell>{formatDate(claim.endDate)}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(claim.status)}>
                      {formatStatus(claim.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.mineId || "N/A"}</TableCell>
                  <TableCell>{claim.entityId || "N/A"}</TableCell>
                  <TableCell>{claim.contractId || "N/A"}</TableCell>
                  <TableCell>{formatDate(claim.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <FiMoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEdit(claim)}
                          className="cursor-pointer"
                        >
                          <FiEdit3 className="me-2 h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleApprove(claim.id)}
                          className="cursor-pointer text-green-600 focus:text-green-600"
                        >
                          <FiCheck className="me-2 h-4 w-4" />
                          {t('common.approve')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleReject(claim.id)}
                          className="cursor-pointer text-orange-600 focus:text-orange-600"
                        >
                          <FiX className="me-2 h-4 w-4" />
                          {t('common.reject')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(claim.id)}
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
                end: Math.min((currentPage + 1) * pageSize, totalClaims),
                total: totalClaims
              })} {t('claims.title').toLowerCase()}
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

      {selectedClaim && (
        <EditClaimDialog
          claim={selectedClaim}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </>
  );
}