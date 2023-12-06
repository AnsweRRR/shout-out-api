import axios from "src/utils/axios";

export async function getOpenAIResponseAsync(input: string, accessToken: string, signal: AbortSignal) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            input
        };

        const response = await axios.get(`/api/openAI/getChatResponseFromOpenAI`, { params, headers, signal });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}