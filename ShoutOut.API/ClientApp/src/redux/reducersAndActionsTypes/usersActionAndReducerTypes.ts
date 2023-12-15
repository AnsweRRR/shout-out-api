import { UserDataToSelectDto } from "src/@types/user";

export type UsersActionTypes = UpdateUsersAction | InitFetchUsersAction | EndFetchUsersAction;

export const UPDATE_USERS = "UPDATE_USERS";
export interface UpdateUsersAction {
    type: typeof UPDATE_USERS;
    updateUsersActionPayload: UpdateUsersActionPayload;
}

export const INIT_FETCH_USERS = "INIT_FETCH_USERS";
export interface InitFetchUsersAction {
    type: typeof INIT_FETCH_USERS;
}

export const END_FETCH_USERS = "END_FETCH_USERS";
export interface EndFetchUsersAction {
    type: typeof END_FETCH_USERS;
}

export interface UpdateUsersActionPayload {
    users: Array<UserDataToSelectDto>
};