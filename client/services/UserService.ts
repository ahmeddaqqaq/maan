/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserDto } from '../models/CreateUserDto';
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserFindManyResponse } from '../models/UserFindManyResponse';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param requestBody
     * @returns any User successfully created
     * @throws ApiError
     */
    public static userControllerCreate(
        requestBody: CreateUserDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @returns UserFindManyResponse All users successfully fetched
     * @throws ApiError
     */
    public static userControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
    ): CancelablePromise<UserFindManyResponse> {
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
     * @param id
     * @returns UserResponse User successfully fetched
     * @throws ApiError
     */
    public static userControllerFindOne(
        id: number,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any User successfully updated
     * @throws ApiError
     */
    public static userControllerUpdate(
        id: number,
        requestBody: UpdateUserDto,
    ): CancelablePromise<any> {
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
     * @param id
     * @returns any User successfully deleted
     * @throws ApiError
     */
    public static userControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/{id}',
            path: {
                'id': id,
            },
        });
    }
}
