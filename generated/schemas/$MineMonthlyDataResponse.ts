/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MineMonthlyDataResponse = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        month: {
            type: 'number',
            isRequired: true,
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
            description: `Diesel price for this month (for used materials)`,
        },
        quantityInCubicMeters: {
            type: 'number',
            description: `Quantity in cubic meters (for used materials)`,
        },
        totalPrice: {
            type: 'number',
            description: `Calculated total price (for used materials)`,
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
        mine: {
            type: 'MineResponse',
            isRequired: true,
        },
        entity: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
        material: {
            type: 'MaterialResponse',
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
        },
        updatedAt: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
