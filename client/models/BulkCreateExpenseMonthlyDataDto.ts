/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseDataDto } from './ExpenseDataDto';
export type BulkCreateExpenseMonthlyDataDto = {
    month: number;
    year: number;
    mineId: number;
    entityId: number;
    expenses: Array<ExpenseDataDto>;
};

