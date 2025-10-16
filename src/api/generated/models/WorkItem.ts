/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserWorkItemState } from './UserWorkItemState';
export type WorkItem = {
    id?: number;
    title?: string | null;
    description?: string | null;
    status?: string | null;
    createdUser?: string | null;
    createdTime?: string;
    updatedUser?: string | null;
    updatedTime?: string | null;
    userWorkItemStates?: Array<UserWorkItemState> | null;
};

