
export type NotificationItem = {
    id: number,
    senderUserName: string | null,
    eventType: EventTypes,
    dateTime: Date,
    isRead: boolean,
    pointAmount: number | null,
    rewardName: string | null
};

export enum EventTypes { 
    GetPointsByUser = 0,
    GetPointsByBirthday = 1,
    GetPointsByJoinDate = 2,
    RewardClaimed = 3
}

export const RolesToDisplay: { [index: number]: string } = {
    [EventTypes.GetPointsByUser]: "GetPointsByUser",
    [EventTypes.GetPointsByBirthday]: "GetPointsByBirthday",
    [EventTypes.GetPointsByJoinDate]: "GetPointsByJoinDate",
    [EventTypes.RewardClaimed]: "RewardClaimed",
};