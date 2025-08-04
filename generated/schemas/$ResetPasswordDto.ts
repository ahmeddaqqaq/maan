/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ResetPasswordDto = {
    properties: {
        userId: {
            type: 'number',
            description: `ID of the user whose password will be reset`,
            isRequired: true,
        },
        newPassword: {
            type: 'string',
            description: `New password for the user`,
            isRequired: true,
            minLength: 6,
        },
    },
} as const;
