/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMineDto } from '../models/CreateMineDto';
import type { MineManyResponse } from '../models/MineManyResponse';
import type { MineResponse } from '../models/MineResponse';
import type { UpdateMineDto } from '../models/UpdateMineDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MineService {
    /**
     * @returns any Mine successfully created
     * @throws ApiError
     */
    public static mineControllerCreate({
        requestBody,
    }: {
        requestBody: CreateMineDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mine',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns MineManyResponse All mines successfully fetched
     * @throws ApiError
     */
    public static mineControllerFindMany({
        skip,
        take,
        search,
        contractId,
    }: {
        skip?: number,
        take?: number,
        search?: string,
        contractId?: number,
    }): CancelablePromise<MineManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'contractId': contractId,
            },
        });
    }
    /**
     * @returns MineResponse Mine successfully fetched
     * @throws ApiError
     */
    public static mineControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<MineResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Mine successfully updated
     * @throws ApiError
     */
    public static mineControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateMineDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/mine/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Mine successfully deleted
     * @throws ApiError
     */
    public static mineControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mine/{id}',
            path: {
                'id': id,
            },
        });
    }
}
