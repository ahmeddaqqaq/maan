/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateClaimDto = {
    startDate: string;
    endDate: string;
    status?: CreateClaimDto.status;
    mineId: number;
    entityId: number;
    contractId?: number;
    requestId?: number;
};
export namespace CreateClaimDto {
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
    }
}

