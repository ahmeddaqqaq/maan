/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MaterialResponse } from './MaterialResponse';
import type { MineResponse } from './MineResponse';
export type MineMonthlyDataResponse = {
    id: number;
    month: number;
    year: number;
    quantity: number;
    /**
     * true for used material, false for overburden
     */
    isUsed: boolean;
    /**
     * Diesel price for this month (for used materials)
     */
    dieselPriceThisMonth?: number;
    /**
     * Quantity in cubic meters (for used materials)
     */
    quantityInCubicMeters?: number;
    /**
     * Calculated total price (for used materials)
     */
    totalPrice?: number;
    notes?: string;
    mineId: number;
    entityId: number;
    materialId: number;
    mine: MineResponse;
    entity: Record<string, any>;
    material: MaterialResponse;
    createdAt: string;
    updatedAt: string;
};

