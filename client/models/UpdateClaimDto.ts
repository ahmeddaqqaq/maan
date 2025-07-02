/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateClaimDto = {
    startDate?: string;
    endDate?: string;
    status?: UpdateClaimDto.status;
    mineId?: number;
    entityId?: number;
    contractId?: number;
    requestId?: number;
};
export namespace UpdateClaimDto {
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
    }
}

