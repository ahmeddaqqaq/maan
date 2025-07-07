/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatisticsService {
    /**
     * Get revenue breakdown by entity
     * @param startDate Start date for filtering
     * @param endDate End date for filtering
     * @param period Period type for grouping
     * @param entityId Entity ID for filtering
     * @param mineId Mine ID for filtering
     * @param contractId Contract ID for filtering
     * @returns any Revenue statistics by entity
     * @throws ApiError
     */
    public static statisticsControllerGetRevenueByEntity(
        startDate?: string,
        endDate?: string,
        period?: 'monthly' | 'quarterly' | 'yearly',
        entityId?: number,
        mineId?: number,
        contractId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/statistics/revenue-by-entity',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'period': period,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
            },
        });
    }
    /**
     * Get invoice trends over time
     * @param startDate Start date for filtering
     * @param endDate End date for filtering
     * @param period Period type for grouping
     * @param entityId Entity ID for filtering
     * @param mineId Mine ID for filtering
     * @param contractId Contract ID for filtering
     * @returns any Invoice trends with revenue and count metrics
     * @throws ApiError
     */
    public static statisticsControllerGetInvoiceTrends(
        startDate?: string,
        endDate?: string,
        period?: 'monthly' | 'quarterly' | 'yearly',
        entityId?: number,
        mineId?: number,
        contractId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/statistics/invoice-trends',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'period': period,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
            },
        });
    }
    /**
     * Get top performing mines by claim volume
     * @param startDate Start date for filtering
     * @param endDate End date for filtering
     * @param period Period type for grouping
     * @param entityId Entity ID for filtering
     * @param mineId Mine ID for filtering
     * @param contractId Contract ID for filtering
     * @returns any Top performing mines with claim and extraction metrics
     * @throws ApiError
     */
    public static statisticsControllerGetTopPerformingMines(
        startDate?: string,
        endDate?: string,
        period?: 'monthly' | 'quarterly' | 'yearly',
        entityId?: number,
        mineId?: number,
        contractId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/statistics/top-performing-mines',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'period': period,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
            },
        });
    }
    /**
     * Get claims analytics including approval rates and processing times
     * @param startDate Start date for filtering
     * @param endDate End date for filtering
     * @param period Period type for grouping
     * @param entityId Entity ID for filtering
     * @param mineId Mine ID for filtering
     * @param contractId Contract ID for filtering
     * @returns any Claims analytics with status breakdown and performance metrics
     * @throws ApiError
     */
    public static statisticsControllerGetClaimsAnalytics(
        startDate?: string,
        endDate?: string,
        period?: 'monthly' | 'quarterly' | 'yearly',
        entityId?: number,
        mineId?: number,
        contractId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/statistics/claims-analytics',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'period': period,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
            },
        });
    }
    /**
     * Get comprehensive mine statistics
     * @param startDate Start date for filtering
     * @param endDate End date for filtering
     * @param period Period type for grouping
     * @param entityId Entity ID for filtering
     * @param mineId Mine ID for filtering
     * @param contractId Contract ID for filtering
     * @returns any Mine statistics including location distribution and material diversity
     * @throws ApiError
     */
    public static statisticsControllerGetMineStatistics(
        startDate?: string,
        endDate?: string,
        period?: 'monthly' | 'quarterly' | 'yearly',
        entityId?: number,
        mineId?: number,
        contractId?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/statistics/mine-statistics',
            query: {
                'startDate': startDate,
                'endDate': endDate,
                'period': period,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
            },
        });
    }
}
