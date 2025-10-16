/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateWorkItemDto } from '../models/CreateWorkItemDto';
import type { UpdateWorkItemDto } from '../models/UpdateWorkItemDto';
import type { WorkItemDto } from '../models/WorkItemDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkItemsService {
    /**
     * @returns WorkItemDto OK
     * @throws ApiError
     */
    public static getApiWorkItems(): CancelablePromise<Array<WorkItemDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/WorkItems',
        });
    }
    /**
     * @param requestBody
     * @returns WorkItemDto OK
     * @throws ApiError
     */
    public static postApiWorkItems(
        requestBody?: CreateWorkItemDto,
    ): CancelablePromise<WorkItemDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/WorkItems',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns WorkItemDto OK
     * @throws ApiError
     */
    public static getApiWorkItems1(
        id: number,
    ): CancelablePromise<WorkItemDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/WorkItems/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static putApiWorkItems(
        id: number,
        requestBody?: UpdateWorkItemDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/WorkItems/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiWorkItems(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/WorkItems/{id}',
            path: {
                'id': id,
            },
        });
    }
}
