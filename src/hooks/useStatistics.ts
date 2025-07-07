import { useQuery } from '@tanstack/react-query';
import { StatisticsService } from '../../client/services/StatisticsService';
import '../lib/api-config';

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  period?: 'monthly' | 'quarterly' | 'yearly';
  entityId?: number;
  mineId?: number;
  contractId?: number;
}

export const useRevenueByEntity = (filters: StatisticsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'revenue-by-entity', filters],
    queryFn: () => StatisticsService.statisticsControllerGetRevenueByEntity(
      filters.startDate,
      filters.endDate,
      filters.period,
      filters.entityId,
      filters.mineId,
      filters.contractId
    ),
    enabled: true,
  });
};

export const useInvoiceTrends = (filters: StatisticsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'invoice-trends', filters],
    queryFn: () => StatisticsService.statisticsControllerGetInvoiceTrends(
      filters.startDate,
      filters.endDate,
      filters.period,
      filters.entityId,
      filters.mineId,
      filters.contractId
    ),
    enabled: true,
  });
};

export const useTopPerformingMines = (filters: StatisticsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'top-performing-mines', filters],
    queryFn: () => StatisticsService.statisticsControllerGetTopPerformingMines(
      filters.startDate,
      filters.endDate,
      filters.period,
      filters.entityId,
      filters.mineId,
      filters.contractId
    ),
    enabled: true,
  });
};

export const useClaimsAnalytics = (filters: StatisticsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'claims-analytics', filters],
    queryFn: () => StatisticsService.statisticsControllerGetClaimsAnalytics(
      filters.startDate,
      filters.endDate,
      filters.period,
      filters.entityId,
      filters.mineId,
      filters.contractId
    ),
    enabled: true,
  });
};

export const useMineStatistics = (filters: StatisticsFilters) => {
  return useQuery({
    queryKey: ['statistics', 'mine-statistics', filters],
    queryFn: () => StatisticsService.statisticsControllerGetMineStatistics(
      filters.startDate,
      filters.endDate,
      filters.period,
      filters.entityId,
      filters.mineId,
      filters.contractId
    ),
    enabled: true,
  });
};