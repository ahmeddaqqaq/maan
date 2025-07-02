/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMineDto } from '../models/CreateMineDto';
import type { MineFindManyResponse } from '../models/MineFindManyResponse';
import type { MineResponse } from '../models/MineResponse';
import type { UpdateMineDto } from '../models/UpdateMineDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MineService {
    /**
     * @param requestBody
     * @returns any Mine successfully created
     * @throws ApiError
     */
    public static mineControllerCreate(
        requestBody: CreateMineDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mine',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @returns MineFindManyResponse All mines successfully fetched
     * @throws ApiError
     */
    public static mineControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
    ): CancelablePromise<MineFindManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
            },
        });
    }
    /**
     * @param id
     * @returns MineResponse Mine successfully fetched
     * @throws ApiError
     */
    public static mineControllerFindOne(
        id: number,
    ): CancelablePromise<MineResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mine/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Mine successfully updated
     * @throws ApiError
     */
    public static mineControllerUpdate(
        id: number,
        requestBody: UpdateMineDto,
    ): CancelablePromise<any> {
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
     * @param id
     * @returns any Mine successfully deleted
     * @throws ApiError
     */
    public static mineControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mine/{id}',
            path: {
                'id': id,
            },
        });
    }
}
