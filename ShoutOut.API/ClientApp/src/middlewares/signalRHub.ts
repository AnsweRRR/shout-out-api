import * as signalR from "@microsoft/signalr";
import { HubConnectionState, LogLevel } from "@microsoft/signalr";
import { HOST_API_KEY } from '../config-global';

export const hubConnectionBuilder = () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${HOST_API_KEY}/signalRHub`)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Error)
        .build();
    
    return connection;
};

export const startHubConnection = async (connection: signalR.HubConnection) => {
    if (connection.state !== HubConnectionState.Connected && connection.state !== HubConnectionState.Connecting) {
        try {
            await connection.start();
        } catch (error) {
            console.error(error);
        }
    } else {
        console.log(connection.state);
    }
};

export const addGivePointsEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("GivePointsEvent", (responseData: any) => {
        callback(responseData);
    });
};

export const addLikePostEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("LikePostEvent", (responseData: any) => {
        callback(responseData);
    });
};

export const addDislikePostEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("DislikePostEvent", (responseData: any) => {
        callback(responseData);
    });
};

export const addCommentEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("AddCommentEvent", (responseData: any) => {
        callback(responseData);
    });
};

export const editCommentEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("EditCommentEvent", (responseData: any) => {
        callback(responseData);
    });
};

export const deleteCommentEventListener = (callback: (responseData: any) => void, connection: signalR.HubConnection) => {
    connection.on("DeleteCommentEvent", (responseData: any) => {
        callback(responseData);
    });
};