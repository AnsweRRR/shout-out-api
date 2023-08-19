import { useEffect, useState } from "react";
import { Box } from '@mui/material';
import { Reward } from "src/@types/reward";
import { useAuthContext } from "src/auth/useAuthContext";
import { buyRewardAsync, deleteRewardAsync, editRewardAsync, getRewardsAsync } from 'src/api/rewardClient';
import { useSnackbar } from '../snackbar';
import RewardCard from "./RewardCard";
import CreateRewardCard from "./CreateRewardCard";

export default function Rewards() {
    const { user, updatePointToHave } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();
    const [rewards, setRewards] = useState<Array<Reward>>([]);
    const cover = 'https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_6.jpg';

    const handleClaimButtonClick = async (id: number) => {
        if (user && id) {
            const result = await buyRewardAsync(id, user?.accessToken);
            if (result.status === 200) {
                enqueueSnackbar('Reward claimed successfully!', { variant: 'success' });
                const userPointsLeftAfterClaim = result.data;
                updatePointToHave(userPointsLeftAfterClaim);
            } else {
                enqueueSnackbar('Something went wrong!', { variant: 'error' });
            }
        }
    }
    
    const handleDeleteButtonClick = async (id: number) => {
        if (user && id) {
            const result = await deleteRewardAsync(id, user?.accessToken);
            if (result.status === 200) {
                enqueueSnackbar('Reward deleted successfully!', { variant: 'success' });
                setRewards((prevState) => prevState.filter(r => r.id !== id));
            } else {
                enqueueSnackbar('Something went wrong!', { variant: 'error' });
            }
        }
    }

    const handleEditButtonClick = async (id: number, editedRewardDto: Reward) => {
        if (user) {
            const result = await editRewardAsync(id, editedRewardDto, user.accessToken);
            if (result.status === 200) {
                enqueueSnackbar('Edit success!', { variant: 'success' });
                
                const indexToEdit = rewards.findIndex(reward => reward.id === id);
                if (indexToEdit !== null && indexToEdit !== undefined) {
                    setRewards(prevState => {
                        const updatedRewards = [...prevState];
                
                        updatedRewards[indexToEdit] = {
                            ...updatedRewards[indexToEdit],
                            name: result.data.name,
                            description: result.data.description,
                            cost: result.data.cost,
                            avatar: result.data.avatar
                        };
                
                        return updatedRewards;
                    });
                }
            } else{
                enqueueSnackbar('Something went wrong!', { variant: 'error' });
            }
        }
    }

    useEffect(() => {
        const getRewards = async () => {
            if (user) {
                const result = await getRewardsAsync(user?.accessToken);
                setRewards(result.data);
            }
        }
        getRewards();
    }, [user]);

    return (
        <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
            }}
        >
            <CreateRewardCard setRewards={setRewards} cover={cover} />

            {rewards.sort((reward1, reward2) => reward1.cost! - reward2.cost!).map((reward) =>
                <RewardCard
                    key={reward.id}
                    reward={reward}
                    cover={cover}
                    userPoints={user?.pointToHave}
                    handleClaimButtonClick={handleClaimButtonClick}
                    handleDeleteButtonClick={handleDeleteButtonClick}
                    handleEditButtonClick={handleEditButtonClick}
                />)
            }
        </Box>
    );
}