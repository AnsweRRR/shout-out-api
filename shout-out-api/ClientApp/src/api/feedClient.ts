import { CommentDto } from 'src/@types/feed';
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

export async function likeAsync(feedItemId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.patch(`/api/pointSystem/like?id=${feedItemId}`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function dislikeAsync(feedItemId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.patch(`/api/pointSystem/dislike?id=${feedItemId}`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function addCommentAsync(model: CommentDto, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.post(`/api/pointSystem/addcomment`, model, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function editCommentAsync(commentId: number, comment: CommentDto, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.patch(`/api/pointSystem/editcomment?id=${commentId}`, comment, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function deleteCommentAsync(commentId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const response = await axios.delete(`/api/pointSystem/deletecomment?id=${commentId}`, { headers });
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