import * as signalR from "@microsoft/signalr";
import { HubConnectionState, LogLevel } from "@microsoft/signalr";

export const hubConnectionBuilder = () => {
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/signalRHub")
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Error)
        .build();
    
    return connection;
};

export const startChatHubConnection = async (connection: signalR.HubConnection) => {
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