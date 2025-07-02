/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRequestDto } from '../models/CreateRequestDto';
import type { UpdateRequestDto } from '../models/UpdateRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RequestService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static requestControllerCreate(
        requestBody: CreateRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/request',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param description
     * @param requestingEntityId
     * @param targetEntityId
     * @param contractId
     * @param mineId
     * @param materialId
     * @param startDate
     * @param endDate
     * @returns any
     * @throws ApiError
     */
    public static requestControllerFindMany(
        skip?: number,
        take?: number,
        description?: string,
        requestingEntityId?: number,
        targetEntityId?: number,
        contractId?: number,
        mineId?: number,
        materialId?: number,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/request/findMany',
            query: {
                'skip': skip,
                'take': take,
                'description': description,
                'requestingEntityId': requestingEntityId,
                'targetEntityId': targetEntityId,
                'contractId': contractId,
                'mineId': mineId,
                'materialId': materialId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static requestControllerFindOne(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/request/{id}',
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
    public static requestControllerUpdate(
        id: number,
        requestBody: UpdateRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/request/{id}',
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
    public static requestControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/request/{id}',
            path: {
                'id': id,
            },
        });
    }
}
