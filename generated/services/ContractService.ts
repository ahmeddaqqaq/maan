/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContractManyResponse } from '../models/ContractManyResponse';
import type { ContractResponse } from '../models/ContractResponse';
import type { CreateContractDto } from '../models/CreateContractDto';
import type { UpdateContractDto } from '../models/UpdateContractDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContractService {
    /**
     * @returns any Contract successfully created
     * @throws ApiError
     */
    public static contractControllerCreate({
        requestBody,
    }: {
        requestBody: CreateContractDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contract',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ContractManyResponse All contracts successfully fetched
     * @throws ApiError
     */
    public static contractControllerFindMany({
        skip,
        take,
        search,
        entityId,
        isActive = true,
    }: {
        skip?: number,
        take?: number,
        search?: string,
        entityId?: number,
        /**
         * Filter by active status. Default is true (returns only active records). Set to false to get inactive records, or omit to get active records.
         */
        isActive?: boolean,
    }): CancelablePromise<ContractManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contract/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'entityId': entityId,
                'isActive': isActive,
            },
        });
    }
    /**
     * @returns ContractResponse Contract successfully fetched
     * @throws ApiError
     */
    public static contractControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<ContractResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contract/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Contract successfully updated
     * @throws ApiError
     */
    public static contractControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateContractDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/contract/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Contract successfully soft deleted (marked as inactive)
     * @throws ApiError
     */
    public static contractControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/contract/{id}',
            path: {
                'id': id,
            },
        });
    }
}
