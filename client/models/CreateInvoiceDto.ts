/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInvoiceDto = {
    startDate: string;
    endDate: string;
    entityId: number;
    contractId?: number;
    /**
     * Array of claim IDs to include in this invoice
     */
    claimIds: Array<number>;
};

