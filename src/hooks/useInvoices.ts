"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InvoiceService } from '../../client';
import type { CreateInvoiceDto, UpdateInvoiceDto } from '../../client';
import { toast } from 'sonner';

interface UseInvoicesFilters {
  skip?: number;
  take?: number;
  search?: string;
  entityId?: number;
  contractId?: number;
  startDate?: string;
  endDate?: string;
}

export function useInvoices(filters?: UseInvoicesFilters) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      return await InvoiceService.invoiceControllerFindMany(
        filters?.skip,
        filters?.take,
        filters?.search,
        filters?.entityId,
        filters?.contractId,
        filters?.startDate,
        filters?.endDate
      );
    },
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      return await InvoiceService.invoiceControllerFindOne(id);
    },
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvoiceDto) => {
      return await InvoiceService.invoiceControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create invoice';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateInvoiceDto }) => {
      return await InvoiceService.invoiceControllerUpdate(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
      toast.success('Invoice updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update invoice';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await InvoiceService.invoiceControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to delete invoice';
      toast.error(errorMessage);
    },
  });
}