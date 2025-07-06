"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RequestService, ClaimService } from '../../client';
import type { CreateRequestDto, UpdateRequestDto, ApproveRejectClaimDto } from '../../client';
import { toast } from 'sonner';

interface UseClaimsFilters {
  skip?: number;
  take?: number;
  search?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  entityId?: number;
  mineId?: number;
  contractId?: number;
  requestId?: number;
  startDate?: string;
  endDate?: string;
}

// Claims frontend using Request backend
export function useClaimsWithRequestBackend(filters?: UseClaimsFilters) {
  return useQuery({
    queryKey: ['claims-with-request-backend', filters],
    queryFn: async () => {
      return await RequestService.requestControllerFindMany(
        filters?.skip,
        filters?.take,
        undefined, // description filter not used for claims
        filters?.entityId,
        filters?.entityId, // using same entity for both requesting and target
        filters?.contractId,
        filters?.mineId,
        undefined, // materialId not used for claims
        filters?.startDate,
        filters?.endDate
      );
    },
  });
}

export function useCreateClaimWithRequestBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      startDate: string;
      endDate: string;
      status?: 'PENDING' | 'APPROVED' | 'REJECTED';
      mineId: number;
      entityId: number;
      contractId?: number;
      requestId?: number;
    }) => {
      // Convert claim data to request format
      const requestData: CreateRequestDto = {
        description: `Claim for Mine ${data.mineId}, Entity ${data.entityId}`,
        requestingEntityId: data.entityId,
        targetEntityId: data.entityId,
        contractId: data.contractId,
        mineId: data.mineId,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      return await RequestService.requestControllerCreate(requestData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims-with-request-backend'] });
      toast.success('Claim created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create claim';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateClaimWithRequestBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: number; 
      data: {
        startDate: string;
        endDate: string;
        status?: 'PENDING' | 'APPROVED' | 'REJECTED';
        mineId: number;
        entityId: number;
        contractId?: number;
        requestId?: number;
      }
    }) => {
      // Convert claim data to request format
      const requestData: UpdateRequestDto = {
        description: `Claim for Mine ${data.mineId}, Entity ${data.entityId}`,
        requestingEntityId: data.entityId,
        targetEntityId: data.entityId,
        contractId: data.contractId,
        mineId: data.mineId,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      return await RequestService.requestControllerUpdate(id, requestData);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['claims-with-request-backend'] });
      queryClient.invalidateQueries({ queryKey: ['claim-with-request-backend', id] });
      toast.success('Claim updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update claim';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteClaimWithRequestBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await RequestService.requestControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims-with-request-backend'] });
      toast.success('Claim deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to delete claim';
      toast.error(errorMessage);
    },
  });
}

export function useApproveRejectClaimWithRequestBackend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, reason }: { 
      id: number; 
      status: 'APPROVED' | 'REJECTED';
      reason?: string;
    }) => {
      const data: ApproveRejectClaimDto = {
        status: status as ApproveRejectClaimDto.status,
        reason,
      };
      return await ClaimService.claimControllerApproveReject(id, data);
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['claims-with-request-backend'] });
      toast.success(`Claim ${status.toLowerCase()} successfully`);
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update claim status';
      toast.error(errorMessage);
    },
  });
}