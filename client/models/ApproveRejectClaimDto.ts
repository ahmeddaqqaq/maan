/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApproveRejectClaimDto = {
    /**
     * Status to set (APPROVED or REJECTED)
     */
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    /**
     * Optional reason for approval/rejection
     */
    reason?: string;
};