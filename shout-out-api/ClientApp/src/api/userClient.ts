import { InviteRequestDto } from 'src/@types/user';
import axios from 'src/utils/axios';

export async function createUserAsync(newUserDto: InviteRequestDto, accessToken: string) {
    try {
        const response = await axios.post(`/api/user/inviteuser`, newUserDto, { headers: { 'Authorization': `Bearer ${accessToken}` }});
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}