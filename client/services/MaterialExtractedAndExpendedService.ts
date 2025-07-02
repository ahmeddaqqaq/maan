/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMaterialExtractedAndExpendedDto } from '../models/CreateMaterialExtractedAndExpendedDto';
import type { UpdateMaterialExtractedAndExpendedDto } from '../models/UpdateMaterialExtractedAndExpendedDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MaterialExtractedAndExpendedService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static materialExtractedAndExpendedControllerCreate(
        requestBody: CreateMaterialExtractedAndExpendedDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/material-extracted-and-expended',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @returns any
     * @throws ApiError
     */
    public static materialExtractedAndExpendedControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/material-extracted-and-expended/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static materialExtractedAndExpendedControllerFindOne(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/material-extracted-and-expended/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static materialExtractedAndExpendedControllerUpdate(
        id: number,
        requestBody: UpdateMaterialExtractedAndExpendedDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/material-extracted-and-expended/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static materialExtractedAndExpendedControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/material-extracted-and-expended/{id}',
            path: {
                'id': id,
            },
        });
    }
}
