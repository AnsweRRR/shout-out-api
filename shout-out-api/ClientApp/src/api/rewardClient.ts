import axios from 'src/utils/axios';

export async function getRewardsAsync(accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.get(`/api/reward`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function createRewardAsync(newRewardDto: any, accessToken: string) {
    try {
        const headers = {
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

export async function editRewardAsync(rewardId: number, rewardToEditDto: any, accessToken: string) {
    try {
        const headers = {
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

        const params = {
            id: rewardId
        };

        const response = await axios.post(`/api/reward/buy`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}