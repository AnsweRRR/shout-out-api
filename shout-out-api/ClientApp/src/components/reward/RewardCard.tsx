import { useContext, useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, IconButton, Button } from '@mui/material';
import { Reward } from 'src/@types/reward';
import { useAuthContext } from 'src/auth/useAuthContext';
import { buyRewardAsync } from 'src/api/rewardClient';
import { useSnackbar } from '../snackbar';
import { fShortenNumber } from '../../utils/formatNumber';
import Image from '../image';
import SvgColor from '../svg-color';
import ConfirmDialog from '../confirm-dialog';

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
  reward: Reward;
  cover: string;
};

export default function RewardCard({ reward, cover }: Props) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { id, name, description, cost, avatar } = reward;

  const FILLCOLOR = '#b9f6ca';
  const [percentage, setPercentage] = useState(0);
  const [userPoints, setUserPoints] = useState<number>((user?.pointToHave !== null || user?.pointToHave !== undefined) ? user?.pointToHave : 0);
  const [openDialog, setOpenDialog] = useState(false);

  const buttonStyle = {
    background: percentage < 100 ? `linear-gradient(to right, ${FILLCOLOR} ${percentage}%, white ${percentage}% ${100-percentage}%)` : 'inherit',
    minWidth: '100px'
  };

  const handleClaimButtonClick = async () => {
    if (user && id) {
      const result = await buyRewardAsync(id, user?.accessToken);
      if (result.status === 200) {
        enqueueSnackbar('Reward claimed successfully!', { variant: 'success' });
        const userPointsLeftAfterClaim = result.data;
        setUserPoints(userPointsLeftAfterClaim);
      } else {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    }
  }

  useEffect(() => {
    if (cost !== null && cost !== undefined && userPoints !== null && userPoints !== undefined) {
      setPercentage((userPoints / cost!) * 100);
    } else {
      setPercentage(0);
    }
  }, [cost, userPoints]);

  return (
    <>
      <Card sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
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

          <Avatar
            alt={name!}
            src={avatar as unknown as string}
            sx={{
              width: 64,
              height: 64,
              zIndex: 11,
              left: 0,
              right: 0,
              bottom: -32,
              mx: 'auto',
              position: 'absolute',
            }}
          />

          <StyledOverlay />

          <Image src={cover} alt={cover} ratio="21/9" />
        </Box>

        <Typography variant="subtitle1" sx={{ mt: 6, mb: 0.5 }}>
          {name}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mt: 1, mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {description}
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" sx={{ py: 3, marginTop: 'auto' }}>
          <Box>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Cost
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(cost!)}</Typography>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="outlined" onClick={() => setOpenDialog(true)} style={buttonStyle} disabled={percentage < 100}>
              Claim
            </Button>
          </Box>

          <Box>
            <Typography variant="caption" component="div" sx={{ mb: 0.75, color: 'text.disabled' }}>
              Total Post
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(cost!)}</Typography>
          </Box>
        </Box>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Claim"
        content={
          <>
            Are you sure want to claim &quot;<strong>{name}</strong>&quot; item?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleClaimButtonClick();
              setOpenDialog(false);
            }}
          >
            Claim
          </Button>
        }
      />
    </>
  );
}