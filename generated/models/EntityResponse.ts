/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContractResponse } from './ContractResponse';
import type { MaterialResponse } from './MaterialResponse';
import type { MineResponse } from './MineResponse';
import type { UserResponse } from './UserResponse';
export type EntityResponse = {
    id: number;
    name: string;
    users: Array<UserResponse>;
    mines: Array<MineResponse>;
    materials: Array<MaterialResponse>;
    contracts: Array<ContractResponse>;
    updatedAt: string;
    createdAt: string;
};

