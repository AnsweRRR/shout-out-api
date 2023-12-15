import axios from "src/utils/axios";

export async function getSocialInfo(accessToken: string, signal: AbortSignal) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.get(`/api/social`, { headers, signal });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}