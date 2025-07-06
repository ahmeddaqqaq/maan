"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClaimService } from '../../client';
import type { CreateClaimDto, UpdateClaimDto } from '../../client';
import { toast } from 'sonner';

interface UseRequestsFilters {
  skip?: number;
  take?: number;
  description?: string;
  requestingEntityId?: number;
  targetEntityId?: number;
  contractId?: number;
  mineId?: number;
  materialId?: number;
  startDate?: string;
  endDate?: string;
}

// Requests frontend using Claim backend
export function useRequestsWithClaimBackend(filters?: UseRequestsFilters) {
  return useQuery({
    queryKey: ['requests-with-claim-backend', filters],
    queryFn: async () => {
      return await ClaimService.claimControllerFindMany(
        filters?.skip,
        filters?.take,
        undefined, // search not used for requests
        "PENDING", // default status for requests
        filters?.requestingEntityId,
        filters?.mineId,
        filters?.contractId,
        undefined, // requestId not used
        filters?.startDate,
        filters?.endDate
      );
    },
  });
}

export function useCreateRequestWithClaimBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      description?: string;
      requestingEntityId: number;
      targetEntityId: number;
      contractId?: number;
      mineId?: number;
      materialId?: number;
      startDate: string;
      endDate: string;
    }) => {
      // Convert request data to claim format
      const claimData: CreateClaimDto = {
        startDate: data.startDate,
        endDate: data.endDate,
        status: "PENDING" as CreateClaimDto.status,
        mineId: data.mineId || 1, // Default mine if not specified
        entityId: data.requestingEntityId,
        contractId: data.contractId,
      };
      return await ClaimService.claimControllerCreate(claimData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-with-claim-backend'] });
      toast.success('Request created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create request';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateRequestWithClaimBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: number; 
      data: {
        description?: string;
        requestingEntityId: number;
        targetEntityId: number;
        contractId?: number;
        mineId?: number;
        materialId?: number;
        startDate: string;
        endDate: string;
      }
    }) => {
      // Convert request data to claim format
      const claimData: UpdateClaimDto = {
        startDate: data.startDate,
        endDate: data.endDate,
        status: "PENDING" as CreateClaimDto.status,
        mineId: data.mineId || 1, // Default mine if not specified
        entityId: data.requestingEntityId,
        contractId: data.contractId,
      };
      return await ClaimService.claimControllerUpdate(id, claimData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['requests-with-claim-backend'] });
      queryClient.invalidateQueries({ queryKey: ['request-with-claim-backend', id] });
      toast.success('Request updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update request';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteRequestWithClaimBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await ClaimService.claimControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests-with-claim-backend'] });
      toast.success('Request deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to delete request';
      toast.error(errorMessage);
    },
  });
}