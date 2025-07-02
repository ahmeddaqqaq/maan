/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateUserDto = {
    username: string;
    password: string;
    email?: string;
    isActive?: boolean;
    role: CreateUserDto.role;
    entityId: number;
};
export namespace CreateUserDto {
    export enum role {
        ADMIN = 'ADMIN',
        PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
        FINANCIAL_MANAGER = 'FINANCIAL_MANAGER',
        STANDARD_USER = 'STANDARD_USER',
    }
}

