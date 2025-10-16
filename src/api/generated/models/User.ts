/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserWorkItemState } from './UserWorkItemState';
export type User = {
    userId?: number;
    username?: string | null;
    passwordHash?: string | null;
    createdUser?: string | null;
    createdTime?: string;
    updatedUser?: string | null;
    updatedTime?: string | null;
    userWorkItemStates?: Array<UserWorkItemState> | null;
};

