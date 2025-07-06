"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
  FiDownload,
  FiSend,
  FiCheck,
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
import { useInvoices, useDeleteInvoice } from "@/hooks/useInvoices";
import { Skeleton } from "@/components/ui/skeleton";
import EditInvoiceDialog from "./edit-invoice-dialog";
import type { InvoiceResponse } from "../../../../../../client";

type Invoice = InvoiceResponse;

interface InvoicesTableProps {
  searchQuery?: string;
  entityFilter?: number;
  contractFilter?: number;
  pageSize?: number;
}

export function InvoicesTable({ 
  searchQuery = "",
  entityFilter,
  contractFilter,
  pageSize = 10 
}: InvoicesTableProps) {
  const t = useTranslations();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { data: invoicesData, isLoading, error } = useInvoices({
    skip: currentPage * pageSize,
    take: pageSize,
    search: searchQuery || undefined,
    entityId: entityFilter,
    contractId: contractFilter,
  });

  const deleteInvoiceMutation = useDeleteInvoice();

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && invoicesData?.data) {
      setSelectedInvoices(invoicesData.data.map((invoice: Invoice) => invoice.id?.toString() || ""));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    await deleteInvoiceMutation.mutateAsync(id);
    setDeleteInvoiceId(null);
  };


  const formatDate = (dateString?: string) => {
    if (!dateString) return t('common.noData');
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
        <p className="text-red-600">Error loading invoices: {error.message}</p>
      </div>
    );
  }

  const invoices = invoicesData?.data || [];
  const totalInvoices = invoicesData?.rows || 0;
  const totalPages = Math.ceil(totalInvoices / pageSize);

  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
              />
            </TableHead>
            <TableHead>{t('invoices.fields.invoiceNumber')}</TableHead>
            <TableHead>{t('invoices.fields.entity')}</TableHead>
            <TableHead>{t('invoices.fields.contract')}</TableHead>
            <TableHead>{t('invoices.fields.claimsCount')}</TableHead>
            <TableHead>{t('invoices.fields.amount')}</TableHead>
            <TableHead>{t('invoices.fields.materialSummary')}</TableHead>
            <TableHead>{t('invoices.fields.startDate')}</TableHead>
            <TableHead>{t('invoices.fields.endDate')}</TableHead>
            <TableHead>{t('common.createdAt')}</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                {t('invoices.noInvoices')}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice: Invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedInvoices.includes(invoice.id?.toString() || "")}
                    onCheckedChange={(checked) => handleSelectInvoice(invoice.id?.toString() || "", checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm">INV-{String(invoice.id).padStart(6, '0')}</TableCell>
                <TableCell>
                    <Badge variant="outline">Entity {invoice.entityId}</Badge>
                </TableCell>
                <TableCell>
                  {invoice.contractId ? (
                    <Badge variant="outline">Contract {invoice.contractId}</Badge>
                  ) : (
                    <span className="text-gray-400">{t('common.noData')}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {t('invoices.title')}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  <span className="text-green-600">
                    ${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    {invoice.materialSummary?.slice(0, 2).map((material, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate mr-2">{material.materialName}:</span>
                        <span className="font-medium">{material.netAmount} {material.unit}</span>
                      </div>
                    ))}
                    {invoice.materialSummary && invoice.materialSummary.length > 2 && (
                      <div className="text-gray-500">+{invoice.materialSummary.length - 2} more</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{formatDate(invoice.startDate)}</TableCell>
                <TableCell className="text-sm">{formatDate(invoice.endDate)}</TableCell>
                <TableCell className="text-sm">{formatDate(invoice.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <FiMoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingInvoice(invoice)}
                        className="cursor-pointer"
                      >
                        <FiEdit3 className="mr-2 h-4 w-4" />
                        {t('invoices.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FiEye className="mr-2 h-4 w-4" />
                        {t('common.view')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <FiDownload className="mr-2 h-4 w-4" />
                        {t('invoices.actions.downloadPDF')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-blue-600">
                        <FiSend className="mr-2 h-4 w-4" />
                        {t('invoices.actions.sendInvoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-green-600">
                        <FiCheck className="mr-2 h-4 w-4" />
                        {t('invoices.actions.markPaid')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteInvoiceId(Number(invoice.id))}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        {t('invoices.delete')}
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
            {t('pagination.showing', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, totalInvoices), total: totalInvoices })}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              {t('pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Edit Invoice Dialog */}
      {editingInvoice && (
        <EditInvoiceDialog
          invoice={editingInvoice}
          open={!!editingInvoice}
          onOpenChange={(open) => !open && setEditingInvoice(null)}
        />
      )}

      {/* Delete Invoice Confirmation */}
      <AlertDialog open={!!deleteInvoiceId} onOpenChange={() => setDeleteInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('invoices.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('invoices.messages.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteInvoiceId && handleDeleteInvoice(deleteInvoiceId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteInvoiceMutation.isPending}
            >
              {deleteInvoiceMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}