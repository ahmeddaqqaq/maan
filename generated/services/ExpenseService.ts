/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateExpenseDto } from '../models/CreateExpenseDto';
import type { ExpenseManyResponse } from '../models/ExpenseManyResponse';
import type { ExpenseResponse } from '../models/ExpenseResponse';
import type { UpdateExpenseDto } from '../models/UpdateExpenseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseService {
    /**
     * @returns any Expense successfully created
     * @throws ApiError
     */
    public static expenseControllerCreate({
        requestBody,
    }: {
        requestBody: CreateExpenseDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/expense',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ExpenseManyResponse All expenses successfully fetched
     * @throws ApiError
     */
    public static expenseControllerFindMany({
        skip,
        take,
        search,
        entityId,
        isActive = true,
    }: {
        skip?: number,
        take?: number,
        search?: string,
        entityId?: number,
        /**
         * Filter by active status. Default is true (returns only active records). Set to false to get inactive records, or omit to get active records.
         */
        isActive?: boolean,
    }): CancelablePromise<ExpenseManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/expense/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'entityId': entityId,
                'isActive': isActive,
            },
        });
    }
    /**
     * @returns ExpenseResponse Expense successfully fetched
     * @throws ApiError
     */
    public static expenseControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<ExpenseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/expense/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Expense successfully updated
     * @throws ApiError
     */
    public static expenseControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateExpenseDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/expense/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Expense successfully soft deleted (marked as inactive)
     * @throws ApiError
     */
    public static expenseControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/expense/{id}',
            path: {
                'id': id,
            },
        });
    }
}
