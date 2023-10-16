import axios from 'src/utils/axios';

export async function getPointsHistoryAsync(offset: number, take: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            offset,
            take
        };

        const response = await axios.get(`/api/pointSystem/history`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function givePointsAsync(dto: any, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.post(`/api/pointSystem/givepoints`, dto, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getGiphyGifsAsync(accessToken: string, limit: number, offset: number, filterName?: string | null) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            limit,
            offset,
            filterName
        };

        const response = await axios.get(`/api/pointSystem/giphy`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}