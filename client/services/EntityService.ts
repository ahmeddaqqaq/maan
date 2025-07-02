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
     * @param requestBody
     * @returns any Entity successfully created
     * @throws ApiError
     */
    public static entityControllerCreate(
        requestBody: CreateEntityDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/entity',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @returns EntityFindManyResponse All entities successfully fetched
     * @throws ApiError
     */
    public static entityControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
    ): CancelablePromise<EntityFindManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/entity/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
            },
        });
    }
    /**
     * @param id
     * @returns EntityResponse Entity successfully fetched
     * @throws ApiError
     */
    public static entityControllerFindOne(
        id: number,
    ): CancelablePromise<EntityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/entity/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any Entity successfully updated
     * @throws ApiError
     */
    public static entityControllerUpdate(
        id: number,
        requestBody: UpdateEntityDto,
    ): CancelablePromise<any> {
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
     * @param id
     * @returns any Entity successfully deleted
     * @throws ApiError
     */
    public static entityControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/entity/{id}',
            path: {
                'id': id,
            },
        });
    }
}
