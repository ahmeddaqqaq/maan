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
        materialId,
        month,
        year,
    }: {
        skip?: number,
        take?: number,
        mineId?: number,
        materialId?: number,
        month?: number,
        year?: number,
    }): CancelablePromise<MineMonthlyDataManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine-monthly-data/findMany',
            query: {
                'skip': skip,
                'take': take,
                'mineId': mineId,
                'materialId': materialId,
                'month': month,
                'year': year,
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
     * @returns any Mine monthly data successfully deleted
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
    public static mineMonthlyDataControllerGetMaterialsForMine({
        mineId,
    }: {
        mineId: number,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine-monthly-data/materials/{mineId}',
            path: {
                'mineId': mineId,
            },
        });
    }
}
