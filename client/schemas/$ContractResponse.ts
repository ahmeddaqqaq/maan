/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ContractResponse = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        name: {
            type: 'string',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        startDate: {
            type: 'string',
            isRequired: true,
        },
        endDate: {
            type: 'string',
        },
        dieselPrice: {
            type: 'number',
            description: `Diesel price in the contract`,
        },
        extractionPrice: {
            type: 'number',
            description: `Extraction price in the contract`,
        },
        phosphatePrice: {
            type: 'number',
            description: `Phosphate price in the contract`,
        },
        entity: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
            isRequired: true,
        },
        mines: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
            isRequired: true,
        },
        materials: {
            type: 'array',
            contains: {
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            },
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
