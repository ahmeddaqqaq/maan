"use client";

import { useQuery } from '@tanstack/react-query';
import { MaterialService } from '../../client';

interface UseMaterialsFilters {
  skip?: number;
  take?: number;
  search?: string;
}

export function useMaterials(filters?: UseMaterialsFilters) {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      return await MaterialService.materialControllerFindMany({});
    },
  });
}

export function useMaterial(id: number) {
  return useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      return await MaterialService.materialControllerFindOne({ id });
    },
    enabled: !!id,
  });
}