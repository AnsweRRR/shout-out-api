import { NavigateFunction } from 'react-router';
import { ChangePasswordDto, EditUserDto, InviteRequestDto, ResetPasswordDto } from 'src/@types/user';
import { PATH_PAGE } from 'src/routes/paths';
import axios from 'src/utils/axios';

export async function createUserAsync(newUserDto: InviteRequestDto, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.post(`/api/user/inviteuser`, newUserDto, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function editOwnUserAccountAsync(userDto: EditUserDto, accessToken: string) {
    try {
        const headers = {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.patch(`/api/user/editownuseraccount`, userDto, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function verifyInviteToken(verificationToken: string) {
    try {
        const response = await axios.get(`/api/user/verifyInviteToken`, { params: { verificationToken } });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getUsersAsync(accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.get(`/api/user/users`, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function getUserDataAsync(userId: number, accessToken: string, navigate: NavigateFunction) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };
        const params = {
            userId
        };

        const response = await axios.get(`/api/user/userdata`, { params, headers });
        return response;
    }
    catch(error) {
        navigate(PATH_PAGE.page404);
        console.error(error);
        throw error;
    }
}

export async function deleteUsersAsync(userId: number, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const params = {
            userId
        };

        const response = await axios.delete(`/api/user/delete`, { params, headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function resetPasswordRequestAsync(email: string) {
    try {
        const response = await axios.post(`/api/user/resetpasswordrequest?email=${email}`);
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function resetPasswordAsync(resetPasswordDto: ResetPasswordDto) {
    try {
        const response = await axios.post(`/api/user/resetpassword`, resetPasswordDto);
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}

export async function changePasswordAsync(changePasswordDto: ChangePasswordDto, accessToken: string) {
    try {
        const headers = {
            'Authorization': `Bearer ${accessToken}`
        };

        const response = await axios.post(`/api/user/changepassword`, changePasswordDto, { headers });
        return response;
    }
    catch(error) {
        console.error(error);
        throw error;
    }
}