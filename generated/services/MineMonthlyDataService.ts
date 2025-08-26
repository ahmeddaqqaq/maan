/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkCreateMineMonthlyDataDto } from '../models/BulkCreateMineMonthlyDataDto';
import type { CreateMineMonthlyDataDto } from '../models/CreateMineMonthlyDataDto';
import type { MineMonthlyDataManyResponse } from '../models/MineMonthlyDataManyResponse';
import type { MineMonthlyDataResponse } from '../models/MineMonthlyDataResponse';
import type { UpdateMineMonthlyDataDto } from '../models/UpdateMineMonthlyDataDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MineMonthlyDataService {
    /**
     * @returns any Mine monthly data successfully created
     * @throws ApiError
     */
    public static mineMonthlyDataControllerCreate({
        requestBody,
    }: {
        requestBody: CreateMineMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mine-monthly-data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns MineMonthlyDataManyResponse All mine monthly data successfully fetched
     * @throws ApiError
     */
    public static mineMonthlyDataControllerFindMany({
        skip,
        take,
        mineId,
        entityId,
        contractId,
        materialId,
        month,
        year,
        isUsed,
        isActive = true,
    }: {
        skip?: number,
        take?: number,
        /**
         * Filter by mine ID
         */
        mineId?: number,
        /**
         * Filter by entity ID
         */
        entityId?: number,
        /**
         * Filter by contract ID (through mine)
         */
        contractId?: number,
        /**
         * Filter by material ID
         */
        materialId?: number,
        /**
         * Filter by month (1-12)
         */
        month?: number,
        /**
         * Filter by year
         */
        year?: number,
        /**
         * Filter by used/overburden materials
         */
        isUsed?: boolean,
        /**
         * Filter by active status. Default is true (returns only active records). Set to false to get inactive records, or omit to get active records.
         */
        isActive?: boolean,
    }): CancelablePromise<MineMonthlyDataManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine-monthly-data/findMany',
            query: {
                'skip': skip,
                'take': take,
                'mineId': mineId,
                'entityId': entityId,
                'contractId': contractId,
                'materialId': materialId,
                'month': month,
                'year': year,
                'isUsed': isUsed,
                'isActive': isActive,
            },
        });
    }
    /**
     * @returns MineMonthlyDataResponse Mine monthly data successfully fetched
     * @throws ApiError
     */
    public static mineMonthlyDataControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<MineMonthlyDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine-monthly-data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Mine monthly data successfully updated
     * @throws ApiError
     */
    public static mineMonthlyDataControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateMineMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/mine-monthly-data/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Mine monthly data successfully soft deleted (marked as inactive)
     * @throws ApiError
     */
    public static mineMonthlyDataControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mine-monthly-data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Mine monthly data bulk created successfully
     * @throws ApiError
     */
    public static mineMonthlyDataControllerBulkCreate({
        requestBody,
    }: {
        requestBody: BulkCreateMineMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mine-monthly-data/bulk',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Materials for mine successfully fetched
     * @throws ApiError
     */
    public static mineMonthlyDataControllerGetMaterialsForEntity({
        entityId,
    }: {
        entityId: number,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine-monthly-data/materials/{entityId}',
            path: {
                'entityId': entityId,
            },
        });
    }
}
