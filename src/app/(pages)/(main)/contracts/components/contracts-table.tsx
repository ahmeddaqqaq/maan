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
  FiSettings,
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
import { useContracts, useDeleteContract } from "@/hooks/useContracts";
import { Skeleton } from "@/components/ui/skeleton";
import EditContractDialog from "./edit-contract-dialog";

// Define a proper type for the contract object
interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

interface ContractsTableProps {
  searchQuery?: string;
  statusFilter?: string;
  entityFilter?: string;
  pageSize?: number;
}

export function ContractsTable({
  searchQuery = "",
  statusFilter,
  entityFilter,
  pageSize = 10,
}: ContractsTableProps) {
  const [selectedContracts, setSelectedContracts] = useState<string[]>([]);
  const [deleteContractId, setDeleteContractId] = useState<number | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: contractsData,
    isLoading,
    error,
  } = useContracts({
    skip: currentPage * pageSize,
    take: pageSize,
    search: searchQuery || undefined,
    statusFilter: statusFilter || undefined,
    entityFilter: entityFilter || undefined,
  });

  const deleteContractMutation = useDeleteContract();

  const handleSelectContract = (contractId: string, checked: boolean) => {
    if (checked) {
      setSelectedContracts((prev) => [...prev, contractId]);
    } else {
      setSelectedContracts((prev) => prev.filter((id) => id !== contractId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && contractsData?.data) {
      setSelectedContracts(
        contractsData.data.map(
          (contract: Contract) => contract.id?.toString() || ""
        )
      );
    } else {
      setSelectedContracts([]);
    }
  };

  const handleDeleteContract = async (id: number) => {
    await deleteContractMutation.mutateAsync(id);
    setDeleteContractId(null);
  };

  const getStatusBadgeColor = (status?: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      ACTIVE: "bg-green-100 text-green-800",
      EXPIRED: "bg-red-100 text-red-800",
      TERMINATED: "bg-yellow-100 text-yellow-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
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
        <p className="text-red-600">Error loading contracts: {error.message}</p>
      </div>
    );
  }

  const contracts = contractsData?.data || [];
  const totalContracts = contractsData?.rows || 0;
  const totalPages = Math.ceil(totalContracts / pageSize);

  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={
                  contracts.length > 0 &&
                  selectedContracts.length === contracts.length
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Entities</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No contracts found
              </TableCell>
            </TableRow>
          ) : (
            contracts.map((contract: Contract) => (
              <TableRow key={contract.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedContracts.includes(
                      contract.id?.toString() || ""
                    )}
                    onCheckedChange={(checked) =>
                      handleSelectContract(
                        contract.id?.toString() || "",
                        checked as boolean
                      )
                    }
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {contract.id}
                </TableCell>
                <TableCell className="font-medium">
                  {contract.description || "No description"}
                </TableCell>
                <TableCell>{contract.ownerId}</TableCell>
                <TableCell>
                  {contract.entityIds ? (
                    <span className="text-sm text-gray-600">
                      {contract.entityIds.length} entities
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">No entities</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor("ACTIVE")}>
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date().toLocaleDateString()}
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
                        onClick={() => setEditingContract(contract)}
                        className="cursor-pointer"
                      >
                        <FiEdit3 className="mr-2 h-4 w-4" />
                        Edit Contract
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FiEye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FiSettings className="mr-2 h-4 w-4" />
                        Configure Pricing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteContractId(Number(contract.id))}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Delete Contract
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
            Showing {currentPage * pageSize + 1} to{" "}
            {Math.min((currentPage + 1) * pageSize, totalContracts)} of{" "}
            {totalContracts} contracts
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Contract Dialog */}
      {editingContract && (
        <EditContractDialog
          contract={editingContract}
          open={!!editingContract}
          onOpenChange={(open) => !open && setEditingContract(null)}
        />
      )}

      {/* Delete Contract Confirmation */}
      <AlertDialog
        open={!!deleteContractId}
        onOpenChange={() => setDeleteContractId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this contract? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteContractId && handleDeleteContract(deleteContractId)
              }
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteContractMutation.isPending}
            >
              {deleteContractMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
