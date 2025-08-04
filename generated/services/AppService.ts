/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppService {
    /**
     * @returns string Application ping successful
     * @throws ApiError
     */
    public static appControllerPing(): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/healthCheck',
        });
    }
}
