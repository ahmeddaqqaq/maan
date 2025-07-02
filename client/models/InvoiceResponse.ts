/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MaterialSummary } from './MaterialSummary';

export type InvoiceResponse = {
    id: number;
    startDate: string;
    endDate: string;
    totalAmount: number;
    entityId: number;
    contractId?: number;
    materialSummary: Array<MaterialSummary>;
    createdAt: string;
    updatedAt: string;
    entity?: {
        id: number;
        name: string;
    };
    Contract?: {
        id: number;
        description?: string;
    };
    claims?: Array<any>;
};