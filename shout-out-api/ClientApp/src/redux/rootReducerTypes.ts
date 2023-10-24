import { UserDataToSelectDto } from "src/@types/user"

export interface AppState {
    usersState: UsersState,
}

export interface UsersState {
    users: Array<UserDataToSelectDto>,
    isLoadingUsers: boolean
};