/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkCreateExpenseMonthlyDataDto } from '../models/BulkCreateExpenseMonthlyDataDto';
import type { CreateExpenseMonthlyDataDto } from '../models/CreateExpenseMonthlyDataDto';
import type { ExpenseMonthlyDataManyResponse } from '../models/ExpenseMonthlyDataManyResponse';
import type { ExpenseMonthlyDataResponse } from '../models/ExpenseMonthlyDataResponse';
import type { UpdateExpenseMonthlyDataDto } from '../models/UpdateExpenseMonthlyDataDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseMonthlyDataService {
    /**
     * @returns any Expense monthly data successfully created
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerCreate({
        requestBody,
    }: {
        requestBody: CreateExpenseMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/expense-monthly-data',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ExpenseMonthlyDataManyResponse All expense monthly data successfully fetched
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerFindMany({
        skip,
        take,
        mineId,
        entityId,
        contractId,
        expenseId,
        month,
        year,
    }: {
        skip?: number,
        take?: number,
        /**
         * Filter by mine ID
         */
        mineId?: number,
        /**
         * Filter by entity ID
         */
        entityId?: number,
        /**
         * Filter by contract ID (through mine)
         */
        contractId?: number,
        /**
         * Filter by expense ID
         */
        expenseId?: number,
        /**
         * Filter by month (1-12)
         */
        month?: number,
        /**
         * Filter by year
         */
        year?: number,
    }): CancelablePromise<ExpenseMonthlyDataManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/expense-monthly-data/findMany',
            query: {
                'skip': skip,
                'take': take,
                'mineId': mineId,
                'entityId': entityId,
                'contractId': contractId,
                'expenseId': expenseId,
                'month': month,
                'year': year,
            },
        });
    }
    /**
     * @returns ExpenseMonthlyDataResponse Expense monthly data successfully fetched
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerFindOne({
        id,
    }: {
        id: number,
    }): CancelablePromise<ExpenseMonthlyDataResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/expense-monthly-data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Expense monthly data successfully updated
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerUpdate({
        id,
        requestBody,
    }: {
        id: number,
        requestBody: UpdateExpenseMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/expense-monthly-data/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Expense monthly data successfully deleted
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerDelete({
        id,
    }: {
        id: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/expense-monthly-data/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns any Expense monthly data bulk created successfully
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerBulkCreate({
        requestBody,
    }: {
        requestBody: BulkCreateExpenseMonthlyDataDto,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/expense-monthly-data/bulk',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any Expenses for mine successfully fetched
     * @throws ApiError
     */
    public static expenseMonthlyDataControllerGetExpensesForEntity({
        entityId,
    }: {
        entityId: number,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/expense-monthly-data/expenses/{entityId}',
            path: {
                'entityId': entityId,
            },
        });
    }
}
