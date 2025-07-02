"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MaterialExtractedAndExpendedService } from '../../client';
import type { CreateMaterialExtractedAndExpendedDto } from '../../client';
import { toast } from 'sonner';

interface UseMaterialExtractedAndExpendedFilters {
  skip?: number;
  take?: number;
  search?: string;
}

export function useMaterialExtractedAndExpended(filters?: UseMaterialExtractedAndExpendedFilters) {
  return useQuery({
    queryKey: ['materialExtractedAndExpended', filters],
    queryFn: async () => {
      return await MaterialExtractedAndExpendedService.materialExtractedAndExpendedControllerFindMany(
        filters?.skip,
        filters?.take,
        filters?.search
      );
    },
  });
}

export function useCreateMaterialExtractedAndExpended() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMaterialExtractedAndExpendedDto) => {
      return await MaterialExtractedAndExpendedService.materialExtractedAndExpendedControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialExtractedAndExpended'] });
      toast.success('Material record created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create material record';
      toast.error(errorMessage);
    },
  });
}

export function useCreateMultipleMaterialExtractedAndExpended() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materials: CreateMaterialExtractedAndExpendedDto[]) => {
      const results = [];
      for (const material of materials) {
        const result = await MaterialExtractedAndExpendedService.materialExtractedAndExpendedControllerCreate(material);
        results.push(result);
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materialExtractedAndExpended'] });
      toast.success('All material records created successfully');
    },
    onError: (error: unknown) => {
      const errorMessage = (error as {body?: {error?: string}})?.body?.error || 'Failed to create material records';
      toast.error(errorMessage);
    },
  });
}