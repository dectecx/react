/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
import type { WorkItem } from './WorkItem';
export type UserWorkItemState = {
    stateId?: number;
    userId?: number;
    workItemId?: number;
    isChecked?: boolean;
    isConfirmed?: boolean;
    createdUser?: string | null;
    createdTime?: string;
    updatedUser?: string | null;
    updatedTime?: string | null;
    user?: User;
    workItem?: WorkItem;
};

