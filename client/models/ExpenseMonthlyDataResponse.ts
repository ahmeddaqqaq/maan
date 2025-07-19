/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseResponse } from './ExpenseResponse';
import type { MineResponse } from './MineResponse';
export type ExpenseMonthlyDataResponse = {
    id: number;
    month: number;
    year: number;
    price: number;
    notes?: string;
    mineId: number;
    entityId: number;
    expenseId: number;
    mine: MineResponse;
    entity: Record<string, any>;
    expense: ExpenseResponse;
    createdAt: string;
    updatedAt: string;
};

