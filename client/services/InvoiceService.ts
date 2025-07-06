/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInvoiceDto } from '../models/CreateInvoiceDto';
import type { InvoiceFindManyResponse } from '../models/InvoiceFindManyResponse';
import type { InvoiceResponse } from '../models/InvoiceResponse';
import type { UpdateInvoiceDto } from '../models/UpdateInvoiceDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoiceService {
    /**
     * @param requestBody
     * @returns InvoiceResponse Invoice successfully created
     * @throws ApiError
     */
    public static invoiceControllerCreate(
        requestBody: CreateInvoiceDto,
    ): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/invoice',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param skip
     * @param take
     * @param search
     * @param entityId
     * @param contractId
     * @param startDate
     * @param endDate
     * @returns InvoiceFindManyResponse All invoices successfully fetched
     * @throws ApiError
     */
    public static invoiceControllerFindMany(
        skip?: number,
        take?: number,
        search?: string,
        entityId?: number,
        contractId?: number,
        startDate?: string,
        endDate?: string,
    ): CancelablePromise<InvoiceFindManyResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoice/findMany',
            query: {
                'skip': skip,
                'take': take,
                'search': search,
                'entityId': entityId,
                'contractId': contractId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }
    /**
     * @param id
     * @returns InvoiceResponse Invoice successfully fetched
     * @throws ApiError
     */
    public static invoiceControllerFindOne(
        id: number,
    ): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/invoice/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns InvoiceResponse Invoice successfully updated
     * @throws ApiError
     */
    public static invoiceControllerUpdate(
        id: number,
        requestBody: UpdateInvoiceDto,
    ): CancelablePromise<InvoiceResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/invoice/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any Invoice successfully deleted
     * @throws ApiError
     */
    public static invoiceControllerDelete(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/invoice/{id}',
            path: {
                'id': id,
            },
        });
    }
}
