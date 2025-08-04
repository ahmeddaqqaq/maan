/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EntityFindManyResponse = {
    properties: {
        data: {
            type: 'array',
            contains: {
                type: 'EntityResponse',
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
