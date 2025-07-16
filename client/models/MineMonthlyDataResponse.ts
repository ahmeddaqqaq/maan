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
    notes?: string;
    mineId: number;
    materialId: number;
    mine: MineResponse;
    material: MaterialResponse;
    createdAt: string;
    updatedAt: string;
};

