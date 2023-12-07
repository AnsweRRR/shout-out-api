import { useEffect, useState } from "react";
import { Box } from '@mui/material';
import { Reward } from "src/@types/reward";
import { Roles } from "src/@types/user";
import { useAuthContext } from "src/auth/useAuthContext";
import { useLocales } from "src/locales";
import { buyRewardAsync, deleteRewardAsync, editRewardAsync, getRewardsAsync } from 'src/api/rewardClient';
import { m } from "framer-motion";
import { useSnackbar } from '../snackbar';
import RewardCard from "./RewardCard";
import CreateRewardCard from "./CreateRewardCard";

export default function Rewards() {
    const { user, updatePointToHave } = useAuthContext();
    const currentRole = user?.role;
    const { translate } = useLocales();
    const { enqueueSnackbar } = useSnackbar();
    const [rewards, setRewards] = useState<Array<Reward>>([]);
    const cover = 'https://api-dev-minimal-v4.vercel.app/assets/images/covers/cover_6.jpg';

    const handleClaimButtonClick = async (id: number) => {
        if (user && id) {
            const result = await buyRewardAsync(id, user?.accessToken);
            if (result.status === 200) {
                enqueueSnackbar(`${translate('ApiCallResults.RewardClaimedSuccessfully')}`, { variant: 'success' });
                const userPointsLeftAfterClaim = result.data;
                updatePointToHave(userPointsLeftAfterClaim);
            } else {
                enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
            }
        }
    }
    
    const handleDeleteButtonClick = async (id: number) => {
        if (user && id) {
            const result = await deleteRewardAsync(id, user?.accessToken);
            if (result.status === 200) {
                enqueueSnackbar(`${translate('ApiCallResults.DeletedSuccessfully')}`, { variant: 'success' });
                setRewards((prevState) => prevState.filter(r => r.id !== id));
            } else {
                enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
            }
        }
    }

    const handleEditButtonClick = async (id: number, editedRewardDto: Reward) => {
        if (user) {
            const result = await editRewardAsync(id, editedRewardDto, user.accessToken);
            if (result.status === 200) {
                enqueueSnackbar(`${translate('ApiCallResults.EditedSuccessfully')}`, { variant: 'success' });
                
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
                enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController();

        const getRewards = async () => {
            const { signal } = controller;
            if (user) {
                const result = await getRewardsAsync(user?.accessToken, signal);
                setRewards(result.data);
            }
        }
        getRewards();

        return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const framerContainer = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
    };
      
    const framerItem = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <m.ul
            className="container"
            variants={framerContainer}
            initial="hidden"
            animate="visible"
        >
            <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                }}
            >
                    {currentRole === Roles.Admin && <CreateRewardCard setRewards={setRewards} cover={cover} />}

                    {rewards.sort((reward1, reward2) => reward1.cost! - reward2.cost!).map((reward) =>
                        <m.div key={reward.id} className="item" variants={framerItem}>
                            <RewardCard
                                key={reward.id}
                                reward={reward}
                                cover={cover}
                                userPoints={user?.pointToHave}
                                handleClaimButtonClick={handleClaimButtonClick}
                                handleDeleteButtonClick={handleDeleteButtonClick}
                                handleEditButtonClick={handleEditButtonClick}
                            />
                        </m.div>
                        )
                    }
            </Box>
        </m.ul>
    );
}