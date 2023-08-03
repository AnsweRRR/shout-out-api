import { useEffect, useState } from "react";
import { Box } from '@mui/material';
import { Reward } from "src/@types/reward";
import { getRewardsAsync } from "src/api/rewardClient";
import { useAuthContext } from "src/auth/useAuthContext";
import RewardCard from "./RewardCard";
import CreateRewardCard from "./CreateRewardCard";

export default function Rewards() {
    const { user } = useAuthContext();
    const [rewards, setRewards] = useState<Array<Reward>>([]);
    const cover = 'https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_6.jpg';

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

            {rewards.map((reward) => <RewardCard key={reward.id} reward={reward} cover={cover} />)}
        </Box>
    );
}