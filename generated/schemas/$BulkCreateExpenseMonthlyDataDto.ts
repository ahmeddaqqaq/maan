/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BulkCreateExpenseMonthlyDataDto = {
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
        mineId: {
            type: 'number',
            isRequired: true,
        },
        entityId: {
            type: 'number',
            isRequired: true,
        },
        expenses: {
            type: 'array',
            contains: {
                type: 'ExpenseDataDto',
            },
            isRequired: true,
        },
    },
} as const;
