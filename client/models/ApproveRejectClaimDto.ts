/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApproveRejectClaimDto = {
    /**
     * Status to set (APPROVED or REJECTED)
     */
    status: ApproveRejectClaimDto.status;
    /**
     * Optional reason for approval/rejection
     */
    reason?: string;
};
export namespace ApproveRejectClaimDto {
    /**
     * Status to set (APPROVED or REJECTED)
     */
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
    }
}

