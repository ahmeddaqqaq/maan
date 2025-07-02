"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClaimService, MineService } from '../../client';
import type { CreateClaimDto, UpdateClaimDto, ApproveRejectClaimDto } from '../../client';
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

export function useClaims(filters?: UseClaimsFilters) {
  return useQuery({
    queryKey: ['claims', filters],
    queryFn: async () => {
      return await ClaimService.claimControllerFindMany(
        filters?.skip,
        filters?.take,
        filters?.search,
        filters?.status,
        filters?.entityId,
        filters?.mineId,
        filters?.contractId,
        filters?.requestId,
        filters?.startDate,
        filters?.endDate
      );
    },
  });
}

export function useClaim(id: number) {
  return useQuery({
    queryKey: ['claim', id],
    queryFn: async () => {
      return await ClaimService.claimControllerFindOne(id);
    },
    enabled: !!id,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateClaimDto) => {
      return await ClaimService.claimControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create claim';
      toast.error(errorMessage);
    },
  });
}

export function useUpdateClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateClaimDto }) => {
      return await ClaimService.claimControllerUpdate(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      toast.success('Claim updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update claim';
      toast.error(errorMessage);
    },
  });
}

export function useDeleteClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await ClaimService.claimControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast.success('Claim deleted successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to delete claim';
      toast.error(errorMessage);
    },
  });
}

export function useApproveRejectClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ApproveRejectClaimDto }) => {
      return await ClaimService.claimControllerApproveReject(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      toast.success('Claim status updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to update claim status';
      toast.error(errorMessage);
    },
  });
}

export function useMines() {
  return useQuery({
    queryKey: ['mines'],
    queryFn: async () => {
      return await MineService.mineControllerFindMany();
    },
  });
}