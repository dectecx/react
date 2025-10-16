/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TestDataService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiTestDataCreateTestUsers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TestData/create-test-users',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiTestDataLoginTestAdmin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TestData/login-test-admin',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static postApiTestDataLoginTestUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TestData/login-test-user',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static getApiTestDataTestUsersStatus(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TestData/test-users-status',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static deleteApiTestDataDeleteTestUsers(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/TestData/delete-test-users',
        });
    }
}
