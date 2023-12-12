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
    comments?: Array<CommentDto>,
    isLikedByCurrentUser?: boolean
}

export enum EventType {
    UserEvent = 0,
    SystemEvent = 1
}

export enum HubEventType {
    GivePointsEventListener = 1,
    LikePostEventListener = 2,
    DislikePostEventListener = 3,
    AddCommentEventListener = 4,
    EditCommentEventListener = 5,
    DeleteCommentEventListener = 6,
}

export type CommentDto = {
    id?: number,
    pointHistoryId?: number,
    text?: string,
    giphyGif?: string | undefined |null,
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

export type TemporaryHubResultState = {
    refreshByHub?: boolean,
    pointHistoryId?: number,
    // like
    likedById?: number,
    likedByName?: string,

    // comment
    id?: number,
    senderId?: number,
    senderName?: string,
    senderAvatar?: string | null,
    text?: string,
    giphyGif?: string,
    createDate?: Date,
    editDate?: Date,
    
    hubEventType: HubEventType
}

export type LikeDislikeResultDto = {
    pointHistoryId: number,
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