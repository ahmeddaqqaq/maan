/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateUserDto = {
    username?: string;
    email?: string;
    isActive?: boolean;
    role?: UpdateUserDto.role;
    entityId?: number;
};
export namespace UpdateUserDto {
    export enum role {
        ADMIN = 'ADMIN',
        PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
        FINANCIAL_MANAGER = 'FINANCIAL_MANAGER',
        STANDARD_USER = 'STANDARD_USER',
    }
}

