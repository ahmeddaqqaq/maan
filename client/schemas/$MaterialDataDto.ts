/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MaterialDataDto = {
    properties: {
        materialId: {
            type: 'number',
            isRequired: true,
        },
        quantity: {
            type: 'number',
            isRequired: true,
        },
        isUsed: {
            type: 'boolean',
            description: `true for used material, false for overburden`,
            isRequired: true,
        },
        dieselPriceThisMonth: {
            type: 'number',
            description: `Diesel price for this month (required for used materials)`,
        },
        quantityInCubicMeters: {
            type: 'number',
            description: `Quantity in cubic meters (for used materials)`,
        },
        notes: {
            type: 'string',
        },
    },
} as const;
