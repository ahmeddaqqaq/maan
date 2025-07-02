/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMaterialDto } from '../models/CreateMaterialDto';
import type { MaterialFindManyResponse } from '../models/MaterialFindManyResponse';
import type { MaterialResponse } from '../models/MaterialResponse';
import type { UpdateMaterialDto } from '../models/UpdateMaterialDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MaterialService {
    /**
     * @param requestBody
     * @returns any Material successfully created
     * @throws ApiError
     */
    public static materialControllerCreate(
        requestBody: CreateMaterialDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/material',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @returns MaterialFindManyResponse All materials successfully fetched
     * @throws ApiError
     */
    public static materialControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
    ): CancelablePromise<MaterialFindManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/material/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
            },
        });
    }
    /**
     * @param id
     * @returns MaterialResponse Material successfully fetched
     * @throws ApiError
     */
    public static materialControllerFindOne(
        id: number,
    ): CancelablePromise<MaterialResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/material/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Material successfully updated
     * @throws ApiError
     */
    public static materialControllerUpdate(
        id: number,
        requestBody: UpdateMaterialDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/material/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Material successfully deleted
     * @throws ApiError
     */
    public static materialControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/material/{id}',
            path: {
                'id': id,
            },
        });
    }
}
