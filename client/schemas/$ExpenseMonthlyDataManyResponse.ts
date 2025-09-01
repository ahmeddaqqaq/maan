/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ExpenseMonthlyDataManyResponse = {
    properties: {
        data: {
            type: 'array',
            contains: {
                type: 'ExpenseMonthlyDataResponse',
            },
            isRequired: true,
        },
        rows: {
            type: 'number',
            isRequired: true,
        },
        take: {
            type: 'number',
            isRequired: true,
        },
        skip: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
