import { HubConnection } from "@microsoft/signalr";
import { createSlice } from "@reduxjs/toolkit";

export type ISignalRHubConnectionState = {
    hubConnection?: HubConnection;
}

const initialState: ISignalRHubConnectionState = { }

const slice = createSlice({
    name: 'signalRHub',
    initialState,
    reducers: {
        setHubConnection(state, action) {
            const connection = action.payload;
            state.hubConnection = connection;
        }
    }
});

export default slice.reducer;

export const { setHubConnection } = slice.actions;

