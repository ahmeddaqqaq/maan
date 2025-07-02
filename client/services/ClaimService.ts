/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateClaimDto } from '../models/CreateClaimDto';
import type { UpdateClaimDto } from '../models/UpdateClaimDto';
import type { ApproveRejectClaimDto } from '../models/ApproveRejectClaimDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ClaimService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static claimControllerCreate(
        requestBody: CreateClaimDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/claim',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @param status
     * @param entityId
     * @param mineId
     * @param contractId
     * @param requestId
     * @param startDate
     * @param endDate
     * @returns any
     * @throws ApiError
     */
    public static claimControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
        status?: 'PENDING' | 'APPROVED' | 'REJECTED',
        entityId?: number,
        mineId?: number,
        contractId?: number,
        requestId?: number,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/claim/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'status': status,
                'entityId': entityId,
                'mineId': mineId,
                'contractId': contractId,
                'requestId': requestId,
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
    public static claimControllerFindOne(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/claim/{id}',
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
    public static claimControllerUpdate(
        id: number,
        requestBody: UpdateClaimDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/claim/{id}',
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
    public static claimControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/claim/{id}',
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
    public static claimControllerApproveReject(
        id: number,
        requestBody: ApproveRejectClaimDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/claim/{id}/approve-reject',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
