/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserResponse = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        username: {
            type: 'string',
            isRequired: true,
        },
        email: {
            type: 'string',
        },
        isActive: {
            type: 'boolean',
            isRequired: true,
        },
        role: {
            type: 'Enum',
            isRequired: true,
        },
        entity: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
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
