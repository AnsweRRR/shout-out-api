import { END_FETCH_USERS, EndFetchUsersAction, INIT_FETCH_USERS, InitFetchUsersAction, UPDATE_USERS, UpdateUsersAction, UpdateUsersActionPayload, UsersActionTypes } from "../reducersAndActionsTypes/usersActionAndReducerTypes";
import { UsersState } from "../rootReducerTypes";

export function updateUsers(usersPayload: UpdateUsersActionPayload): UpdateUsersAction {
  return {
    type: UPDATE_USERS,
    updateUsersActionPayload: usersPayload,
  };
}

export function initalizeFetchUsers(): InitFetchUsersAction {
  return {
    type: INIT_FETCH_USERS
  };
}

export function endFetchUsers(): EndFetchUsersAction {
  return {
    type: END_FETCH_USERS
  };
}

// eslint-disable-next-line @typescript-eslint/default-param-last
export default function usersReducer(state: UsersState = initialState, action: UsersActionTypes): UsersState {
  switch (action.type) {
    case 'UPDATE_USERS':
      return {
        ...state,
        users: action.updateUsersActionPayload.users,
        isLoadingUsers: false
      };
    case 'INIT_FETCH_USERS':
      return {
        ...state,
        isLoadingUsers: true
      };
    case 'END_FETCH_USERS':
      return {
        ...state,
        isLoadingUsers: false
      };
    default:
      return state;
  }
}

export const initialState: UsersState = {
  users: [],
  isLoadingUsers: false
};