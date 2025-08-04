/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateContractDto = {
    properties: {
        name: {
            type: 'string',
            isRequired: true,
        },
        entityId: {
            type: 'number',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        startDate: {
            type: 'string',
            isRequired: true,
        },
        endDate: {
            type: 'string',
        },
        dieselPrice: {
            type: 'number',
            description: `Diesel price in the contract`,
        },
        extractionPrice: {
            type: 'number',
            description: `Extraction price in the contract`,
        },
        phosphatePrice: {
            type: 'number',
            description: `Phosphate price in the contract`,
        },
    },
} as const;
