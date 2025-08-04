/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateContractDto = {
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        startDate: {
            type: 'string',
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
