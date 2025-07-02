"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestService } from '../../client';
import type { CreateRequestDto, UpdateRequestDto } from '../../client';
import { toast } from 'sonner';

interface UseRequestsFilters {
  skip?: number;
  take?: number;
  search?: string;
  description?: string;
  requestingEntityId?: number;
  targetEntityId?: number;
  contractId?: number;
  mineId?: number;
  materialId?: number;
  startDate?: string;
  endDate?: string;
}

export function useRequests(filters?: UseRequestsFilters) {
  return useQuery({
    queryKey: ['requests', filters],
    queryFn: async () => {
      return await RequestService.requestControllerFindMany(
        filters?.skip,
        filters?.take,
        filters?.description,
        filters?.requestingEntityId,
        filters?.targetEntityId,
        filters?.contractId,
        filters?.mineId,
        filters?.materialId,
        filters?.startDate,
        filters?.endDate
      );
    },
  });
}

export function useRequest(id: number) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: async () => {
      return await RequestService.requestControllerFindOne(id);
    },
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRequestDto) => {
      return await RequestService.requestControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request created successfully');
    },
    onError: (error: Error) => {
      const apiError = error as {body?: {error?: string}; message?: string};
      toast.error(apiError?.body?.error || apiError?.message || 'Failed to create request');
    },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateRequestDto }) => {
      return await RequestService.requestControllerUpdate(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['request'] });
      toast.success('Request updated successfully');
    },
    onError: (error: Error) => {
      const apiError = error as {body?: {error?: string}; message?: string};
      toast.error(apiError?.body?.error || apiError?.message || 'Failed to update request');
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await RequestService.requestControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request deleted successfully');
    },
    onError: (error: Error) => {
      const apiError = error as {body?: {error?: string}; message?: string};
      toast.error(apiError?.body?.error || apiError?.message || 'Failed to delete request');
    },
  });
}