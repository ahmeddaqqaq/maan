"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContractService, MaterialService } from '../../client';
import type { CreateContractDto, UpdateContractDto } from '../../client';
import { toast } from 'sonner';

interface UseContractsFilters {
  skip?: number;
  take?: number;
  search?: string;
  statusFilter?: string;
  entityFilter?: string;
}

export function useContracts(filters?: UseContractsFilters) {
  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: async () => {
      return await ContractService.contractControllerFindMany({});
    },
  });
}

export function useContract(id: number) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      return await ContractService.contractControllerFindOne({ id });
    },
    enabled: !!id,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContractDto) => {
      return await ContractService.contractControllerCreate({ requestBody: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract created successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create contract');
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateContractDto }) => {
      return await ContractService.contractControllerUpdate({ id, requestBody: data });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      toast.success('Contract updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update contract');
    },
  });
}

export function useDeleteContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await ContractService.contractControllerDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success('Contract deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete contract');
    },
  });
}

// Additional hooks for related data
export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      return await MaterialService.materialControllerFindMany({});
    },
  });
}