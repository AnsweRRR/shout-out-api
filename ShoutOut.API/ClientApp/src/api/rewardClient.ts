import { Reward } from 'src/@types/reward';
import axios from 'src/utils/axios';

export async function getRewardsAsync(accessToken: string, signal: AbortSignal) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.get(`/api/reward`, { headers, signal });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getMostPopularRewardsAsync(accessToken: string, signal: AbortSignal) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.get(`/api/reward/mostpopularrewards`, { headers, signal });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function createRewardAsync(newRewardDto: Reward, accessToken: string) {
    try {
        const headers = {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.post(`/api/reward/create`, newRewardDto, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function editRewardAsync(rewardId: number, rewardToEditDto: Reward, accessToken: string) {
    try {
        const headers = {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            id: rewardId
        };

        const response = await axios.patch(`/api/reward/edit`, rewardToEditDto, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function deleteRewardAsync(rewardId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            id: rewardId
        };

        const response = await axios.delete(`/api/reward/delete`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function buyRewardAsync(rewardId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.post(`/api/reward/buy?id=${rewardId}`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}