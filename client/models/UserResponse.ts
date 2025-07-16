/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponse = {
    id: number;
    username: string;
    email?: string;
    isActive: boolean;
    role: UserResponse.role;
    entity?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
};
export namespace UserResponse {
    export enum role {
        ADMIN = 'ADMIN',
        PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
        FINANCIAL_MANAGER = 'FINANCIAL_MANAGER',
        STANDARD_USER = 'STANDARD_USER',
    }
}

