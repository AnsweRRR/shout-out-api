import axios from 'src/utils/axios';

export async function getNotificationsAsync(offset: number, take: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            offset,
            take
        };

        const response = await axios.get(`/api/notification`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getAmountOfUnreadNotificationsAsync(accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.get(`/api/notification/amountofunreadnotifications`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function markNotificationAsReadAsync(notificationId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            id: notificationId
        };

        const response = await axios.post(`/api/notification/mark-as-read`, params, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function markAllNotificationAsReadAsync(accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.post(`/api/notification/mark-all-as-read`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}