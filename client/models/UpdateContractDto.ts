/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateContractDto = {
    name?: string;
    description?: string;
    startDate?: string;
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
};

