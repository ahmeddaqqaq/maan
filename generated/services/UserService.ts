/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserManyResponse } from '../models/UserManyResponse';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @returns any User successfully created
     * @throws ApiError
     */
    public static userControllerCreate({
        requestBody,
    }: {
        requestBody: CreateUserDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns UserManyResponse All users successfully fetched
     * @throws ApiError
     */
    public static userControllerFindMany({
        skip,
        take,
        search,
    }: {
        skip?: number,
        take?: number,
        search?: string,
    }): CancelablePromise<UserManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
            },
        });
    }
    /**
     * @returns UserResponse User successfully fetched
     * @throws ApiError
     */
    public static userControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any User successfully updated
     * @throws ApiError
     */
    public static userControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateUserDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any User successfully deleted
     * @throws ApiError
     */
    public static userControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }
}
