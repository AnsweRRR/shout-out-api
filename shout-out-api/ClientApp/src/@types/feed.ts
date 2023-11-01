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
    receiverUsers: Array<ReceiverUser>,
    likes?: Array<Like>,
    isLikedByCurrentUser?: boolean
}

export enum EventType {
    UserEvent = 0,
    SystemEvent = 1
}

export type Comment = {
    id?: number,
    text: string,
    giphyGifUrl?: string | null,
    senderId?: number,
    senderName?: string,
    senderAvatar?: string | null,
    createDate?: Date,
    editDate?: Date | null
}

export type Like = {
    id: number,
    likedById: number,
    likedByName: string
}

export type ReceiverUser = {
    userId: number,
    userName: string,
    userAvatar: string | null
}

export type SendPointsDto = {
    hashTags: Array<string>,
    amount: number,
    receiverUsers: Array<number>,
    giphyGifUrl?: string | null
}

export type ImageRenditionFileType = 'gif' | 'webp';