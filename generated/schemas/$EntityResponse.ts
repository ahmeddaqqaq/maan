/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EntityResponse = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        users: {
            type: 'array',
            contains: {
                type: 'UserResponse',
            },
            isRequired: true,
        },
        mines: {
            type: 'array',
            contains: {
                type: 'MineResponse',
            },
            isRequired: true,
        },
        materials: {
            type: 'array',
            contains: {
                type: 'MaterialResponse',
            },
            isRequired: true,
        },
        contracts: {
            type: 'array',
            contains: {
                type: 'ContractResponse',
            },
            isRequired: true,
        },
        updatedAt: {
            type: 'string',
            isRequired: true,
        },
        createdAt: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
