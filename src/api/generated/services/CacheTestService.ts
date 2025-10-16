/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CacheTestRequest } from '../models/CacheTestRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CacheTestService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static postApiCacheTestSet(
        requestBody?: CacheTestRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/CacheTest/set',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param key
     * @returns any OK
     * @throws ApiError
     */
    public static getApiCacheTestGet(
        key: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/CacheTest/get/{key}',
            path: {
                'key': key,
            },
        });
    }
    /**
     * @param key
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiCacheTestRemove(
        key: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/CacheTest/remove/{key}',
            path: {
                'key': key,
            },
        });
    }
    /**
     * @param key
     * @returns any OK
     * @throws ApiError
     */
    public static getApiCacheTestExists(
        key: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/CacheTest/exists/{key}',
            path: {
                'key': key,
            },
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiCacheTestInfo(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/CacheTest/info',
        });
    }
}
