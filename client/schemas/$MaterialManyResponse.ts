/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MaterialManyResponse = {
    properties: {
        data: {
            type: 'array',
            contains: {
                type: 'MaterialResponse',
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
