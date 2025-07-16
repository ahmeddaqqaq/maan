"use client";

import { useQuery } from '@tanstack/react-query';
import { MineService } from '../../client';

// Claims functionality is not available - ClaimService doesn't exist
// export function useClaims(filters?: UseClaimsFilters) {
//   return useQuery({
//     queryKey: ['claims', filters],
//     queryFn: async () => {
//       return await ClaimService.claimControllerFindMany(
//         filters?.skip,
//         filters?.take,
//         filters?.search,
//         filters?.status,
//         filters?.entityId,
//         filters?.mineId,
//         filters?.contractId,
//         filters?.requestId,
//         filters?.startDate,
//         filters?.endDate
//       );
//     },
//   });
// }

export function useMines() {
  return useQuery({
    queryKey: ['mines'],
    queryFn: async () => {
      return await MineService.mineControllerFindMany({});
    },
  });
}