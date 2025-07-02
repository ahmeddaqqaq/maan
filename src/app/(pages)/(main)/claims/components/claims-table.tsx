"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClaims, useDeleteClaim, useApproveRejectClaim } from "@/hooks/useClaims";
import { Skeleton } from "@/components/ui/skeleton";
import EditClaimDialog from "./edit-claim-dialog";

// Define a proper type for the claim object
interface Claim {
  id: number | string;
  startDate?: string;
  endDate?: string;
  mineId?: number;
  entityId?: number;
  contractId?: number;
  requestId?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
  updatedAt?: string;
}

interface ClaimsTableProps {
  searchQuery?: string;
  statusFilter?: 'PENDING' | 'APPROVED' | 'REJECTED';
  entityFilter?: number;
  mineFilter?: number;
  contractFilter?: number;
  requestFilter?: number;
  pageSize?: number;
}

export function ClaimsTable({ 
  searchQuery = "",
  statusFilter,
  entityFilter,
  mineFilter,
  contractFilter,
  requestFilter,
  pageSize = 10 
}: ClaimsTableProps) {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [deleteClaimId, setDeleteClaimId] = useState<number | null>(null);
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: claimsData, isLoading, error } = useClaims({
    skip: currentPage * pageSize,
    take: pageSize,
    search: searchQuery || undefined,
    status: statusFilter,
    entityId: entityFilter,
    mineId: mineFilter,
    contractId: contractFilter,
    requestId: requestFilter,
  });

  const deleteClaimMutation = useDeleteClaim();
  const approveRejectClaimMutation = useApproveRejectClaim();

  const handleSelectClaim = (claimId: string, checked: boolean) => {
    if (checked) {
      setSelectedClaims(prev => [...prev, claimId]);
    } else {
      setSelectedClaims(prev => prev.filter(id => id !== claimId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && claimsData?.data) {
      setSelectedClaims(claimsData.data.map((claim: Claim) => claim.id?.toString() || ""));
    } else {
      setSelectedClaims([]);
    }
  };

  const handleDeleteClaim = async (id: number) => {
    await deleteClaimMutation.mutateAsync(id);
    setDeleteClaimId(null);
  };

  const handleApproveClaim = async (id: number) => {
    await approveRejectClaimMutation.mutateAsync({
      id,
      data: { status: 'APPROVED' as 'PENDING' | 'APPROVED' | 'REJECTED' }
    });
  };

  const handleRejectClaim = async (id: number) => {
    await approveRejectClaimMutation.mutateAsync({
      id,
      data: { status: 'REJECTED' as 'PENDING' | 'APPROVED' | 'REJECTED' }
    });
  };

  const getStatusBadgeColor = (status?: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
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

  if (error) {
    return (
      <div className="rounded-md bg-white shadow-sm p-8 text-center">
        <p className="text-red-600">Error loading claims: {error.message}</p>
      </div>
    );
  }

  const claims = claimsData?.data || [];
  const totalClaims = claimsData?.rows || 0;
  const totalPages = Math.ceil(totalClaims / pageSize);

  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={claims.length > 0 && selectedClaims.length === claims.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Mine</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Request</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No claims found
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim: Claim) => (
              <TableRow key={claim.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedClaims.includes(claim.id?.toString() || "")}
                    onCheckedChange={(checked) => handleSelectClaim(claim.id?.toString() || "", checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">#{claim.id}</TableCell>
                <TableCell>
                  {claim.mineId ? (
                    <Badge variant="outline">Mine {claim.mineId}</Badge>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {claim.entityId ? (
                    <Badge variant="outline">Entity {claim.entityId}</Badge>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {claim.requestId ? (
                    <Badge variant="outline">Request #{claim.requestId}</Badge>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  {claim.contractId ? (
                    <Badge variant="outline">Contract {claim.contractId}</Badge>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">{formatDate(claim.startDate)}</TableCell>
                <TableCell className="text-sm">{formatDate(claim.endDate)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(claim.status || 'PENDING')}>
                    {claim.status || 'PENDING'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FiMoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingClaim(claim)}
                        className="cursor-pointer"
                      >
                        <FiEdit3 className="mr-2 h-4 w-4" />
                        Edit Claim
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FiEye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {claim.status === 'PENDING' && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleApproveClaim(Number(claim.id))}
                            className="cursor-pointer text-green-600"
                            disabled={approveRejectClaimMutation.isPending}
                          >
                            <FiCheck className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRejectClaim(Number(claim.id))}
                            className="cursor-pointer text-orange-600"
                            disabled={approveRejectClaimMutation.isPending}
                          >
                            <FiX className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteClaimId(Number(claim.id))}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Delete Claim
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
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalClaims)} of {totalClaims} claims
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Claim Dialog */}
      {editingClaim && (
        <EditClaimDialog
          claim={editingClaim}
          open={!!editingClaim}
          onOpenChange={(open) => !open && setEditingClaim(null)}
        />
      )}

      {/* Delete Claim Confirmation */}
      <AlertDialog open={!!deleteClaimId} onOpenChange={() => setDeleteClaimId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Claim</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this claim? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteClaimId && handleDeleteClaim(deleteClaimId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteClaimMutation.isPending}
            >
              {deleteClaimMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}