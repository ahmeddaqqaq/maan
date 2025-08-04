/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResetPasswordDto } from '../models/ResetPasswordDto';
import type { SignInDto } from '../models/SignInDto';
import type { TokensDto } from '../models/TokensDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @returns TokensDto User authenticated successfully
     * @throws ApiError
     */
    public static authControllerLogin({
        requestBody,
    }: {
        requestBody: SignInDto,
    }): CancelablePromise<TokensDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns TokensDto Tokens refreshed successfully
     * @throws ApiError
     */
    public static authControllerRefresh(): CancelablePromise<TokensDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
        });
    }
    /**
     * @returns any User logged out successfully
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
        });
    }
    /**
     * @returns any Password reset successfully
     * @throws ApiError
     */
    public static authControllerResetPassword({
        requestBody,
    }: {
        requestBody: ResetPasswordDto,
    }): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/admin/reset-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
