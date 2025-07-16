"use client";

import { useQuery } from '@tanstack/react-query';
import { MineService } from '../../client';

export function useMines() {
  return useQuery({
    queryKey: ['mines'],
    queryFn: async () => {
      return await MineService.mineControllerFindMany({});
    },
  });
}