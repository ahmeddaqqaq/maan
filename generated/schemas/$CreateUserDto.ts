/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateUserDto = {
    properties: {
        username: {
            type: 'string',
            isRequired: true,
        },
        password: {
            type: 'string',
            isRequired: true,
        },
        email: {
            type: 'string',
        },
        isActive: {
            type: 'boolean',
        },
        role: {
            type: 'Enum',
            isRequired: true,
        },
        entityId: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
