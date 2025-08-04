/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BulkCreateMineMonthlyDataDto = {
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
        materials: {
            type: 'array',
            contains: {
                type: 'MaterialDataDto',
            },
            isRequired: true,
        },
    },
} as const;
