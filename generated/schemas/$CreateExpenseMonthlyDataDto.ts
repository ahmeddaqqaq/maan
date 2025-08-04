/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateExpenseMonthlyDataDto = {
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
    },
} as const;
