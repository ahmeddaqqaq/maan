/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponse = {
    id: string;
    username: string;
    email: string | null;
    isActive: boolean;
    entityId: number | null;
    role: UserResponse.role;
    updatedAt: string;
    createdAt: string;
};
export namespace UserResponse {
    export enum role {
        ADMIN = 'ADMIN',
        PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
        FINANCIAL_MANAGER = 'FINANCIAL_MANAGER',
        STANDARD_USER = 'STANDARD_USER',
    }
}

