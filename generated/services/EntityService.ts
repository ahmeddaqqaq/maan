/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateEntityDto } from '../models/CreateEntityDto';
import type { EntityFindManyResponse } from '../models/EntityFindManyResponse';
import type { EntityResponse } from '../models/EntityResponse';
import type { UpdateEntityDto } from '../models/UpdateEntityDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EntityService {
    /**
     * @returns any Entity successfully created
     * @throws ApiError
     */
    public static entityControllerCreate({
        requestBody,
    }: {
        requestBody: CreateEntityDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/entity',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns EntityFindManyResponse All entities successfully fetched
     * @throws ApiError
     */
    public static entityControllerFindMany({
        skip,
        take,
        search,
        isActive = true,
    }: {
        skip?: number,
        take?: number,
        search?: string,
        /**
         * Filter by active status. Default is true (returns only active records). Set to false to get inactive records, or omit to get active records.
         */
        isActive?: boolean,
    }): CancelablePromise<EntityFindManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/entity/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'isActive': isActive,
            },
        });
    }
    /**
     * @returns EntityResponse Entity successfully fetched
     * @throws ApiError
     */
    public static entityControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<EntityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/entity/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Entity successfully updated
     * @throws ApiError
     */
    public static entityControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateEntityDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/entity/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Entity successfully soft deleted (marked as inactive)
     * @throws ApiError
     */
    public static entityControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/entity/{id}',
            path: {
                'id': id,
            },
        });
    }
}
