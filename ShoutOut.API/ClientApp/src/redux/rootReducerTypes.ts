import { UserDataToSelectDto } from "src/@types/user"
import { ISignalRHubConnectionState } from "./signalRHubSlicer"

export interface AppState {
    usersState: UsersState,
    signalRHubState: ISignalRHubConnectionState
}

export interface UsersState {
    users: Array<UserDataToSelectDto>,
    isLoadingUsers: boolean
};