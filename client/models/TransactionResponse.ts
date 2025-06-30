/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddOnsResponse } from './AddOnsResponse';
import type { CarResponse } from './CarResponse';
import type { CustomerResponse } from './CustomerResponse';
import type { ImageResponse } from './ImageResponse';
import type { InvoiceResponse } from './InvoiceResponse';
import type { ServiceResponse } from './ServiceResponse';
import type { SupervisorResponse } from './SupervisorResponse';
import type { TechnicianResponse } from './TechnicianResponse';
export type TransactionResponse = {
    id: string;
    status: TransactionResponse.status;
    customerId: string;
    carId: string;
    customer: CustomerResponse;
    car: CarResponse;
    service: ServiceResponse;
    addOns: Array<AddOnsResponse>;
    invoice: InvoiceResponse;
    images: Array<ImageResponse>;
    supervisor: SupervisorResponse;
    technicians: Array<TechnicianResponse>;
    deliverTime: string;
    createdAt: string;
    updatedAt: string;
};
export namespace TransactionResponse {
    export enum status {
        SCHEDULED = 'scheduled',
        STAGE_ONE = 'stageOne',
        STAGE_TWO = 'stageTwo',
        COMPLETED = 'completed',
        CANCELLED = 'cancelled',
    }
}

