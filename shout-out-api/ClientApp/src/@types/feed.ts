export type FeedItem = {
    id: number,
    amount: number,
    senderId: number | null,
    senderName: string | null,
    senderAvatar: string | null,
    eventDate: Date,
    description: string | null,
    eventType: EventType,
    giphyGif: string | null,
    receiverUsers: Array<ReceiverUser>
}

export enum EventType {
    UserEvent = 0,
    SystemEvent = 1
}

export type ReceiverUser = {
    userId: number,
    userName: string,
    userAvatar: string | null
}