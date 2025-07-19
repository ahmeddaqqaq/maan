/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateMineMonthlyDataDto = {
    month: number;
    year: number;
    quantity: number;
    /**
     * true for used material, false for overburden
     */
    isUsed: boolean;
    /**
     * Diesel price for this month (required for used materials)
     */
    dieselPriceThisMonth?: number;
    /**
     * Quantity in cubic meters (for used materials)
     */
    quantityInCubicMeters?: number;
    notes?: string;
    mineId: number;
    entityId: number;
    materialId: number;
};

