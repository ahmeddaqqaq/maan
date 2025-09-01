/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContractResponse = {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate?: string;
    /**
     * Diesel price in the contract
     */
    dieselPrice?: number;
    /**
     * Extraction price in the contract
     */
    extractionPrice?: number;
    /**
     * Phosphate price in the contract
     */
    phosphatePrice?: number;
    entity: Record<string, any>;
    mines: Array<Record<string, any>>;
    materials: Array<Record<string, any>>;
    createdAt: string;
    updatedAt: string;
};

