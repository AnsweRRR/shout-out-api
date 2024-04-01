import { Dispatch, SetStateAction, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import { Reward } from 'src/@types/reward';
import { createRewardAsync } from 'src/api/rewardClient';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useLocales } from "src/locales";
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from '../snackbar';
import Image from '../image';
import SvgColor from '../svg-color';
import CreateRewardCardDialog from './CreateRewardDialog';

// ----------------------------------------------------------------------

const StyledOverlay = styled('div')(({ theme }) => ({
  top: 0,
  left: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  position: 'absolute',
  backgroundColor: alpha(theme.palette.grey[900], 0.64),
}));

// ----------------------------------------------------------------------

type Props = {
    setRewards: Dispatch<SetStateAction<Reward[]>>
    cover: string;
};

export default function CreateRewardCard({ setRewards, cover }: Props) {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const { enqueueSnackbar } = useSnackbar();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onCreateReward = async (reward: Reward) => {
        if (user) {
            setIsLoading(true);
            const result = await createRewardAsync(reward, user.accessToken);
            if (result.status === 200 || result.status === 201) {
                setIsDialogOpen(false);
                enqueueSnackbar(`${translate('ApiCallResults.CreatedSuccessfully')}`, { variant: 'success' });
                setRewards((prevRewards) => [...prevRewards, result.data]);
            } else{
                enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
            }
            setIsLoading(false);
        }
    }

    return (
        <>
            <Card sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                    <SvgColor
                    src="/assets/shape_avatar.svg"
                    sx={{
                        width: 144,
                        height: 62,
                        zIndex: 10,
                        left: 0,
                        right: 0,
                        bottom: -26,
                        mx: 'auto',
                        position: 'absolute',
                        color: 'background.paper',
                    }}
                    />

                    <StyledOverlay />

                    <Image src={cover} alt={cover} ratio="21/9" />
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Box sx={{ py: 3 }}>
                    <IconButton onClick={() => setIsDialogOpen(true)} sx={{ fontSize: 48 }}>
                        <AddIcon />
                    </IconButton>
                </Box>

                <Typography>{`${translate('RewardCard.CreateNewReward')}`}</Typography>
            </Card>

            <CreateRewardCardDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onCreateReward={onCreateReward}
                isLoading={isLoading}
            />
        </>
    );
}