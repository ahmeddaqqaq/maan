/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MaterialSummary } from './MaterialSummary';
import type { MoneyTotals } from './MoneyTotals';
export type InvoiceResponse = {
    id: number;
    startDate: string;
    endDate: string;
    totalAmount: number;
    entityId: number;
    contractId?: number;
    materialSummary: Array<MaterialSummary>;
    moneyTotals: MoneyTotals;
    createdAt: string;
    updatedAt: string;
};

