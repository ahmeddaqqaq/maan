/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExpenseMonthlyDataResponse = {
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
        price: {
            type: 'number',
            isRequired: true,
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
        expenseId: {
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
        expense: {
            type: 'ExpenseResponse',
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
