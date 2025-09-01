/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateMineMonthlyDataDto = {
    properties: {
        month: {
            type: 'number',
            isRequired: true,
            maximum: 12,
            minimum: 1,
        },
        year: {
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
        mineId: {
            type: 'number',
            isRequired: true,
        },
        entityId: {
            type: 'number',
            isRequired: true,
        },
        materialId: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
