import { useEffect, useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Avatar, Divider, Typography, Stack, Button } from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { Roles } from 'src/@types/user';
import { Reward } from 'src/@types/reward';
import { useLocales } from "src/locales";
import { fShortenNumber } from '../../utils/formatNumber';
import Image from '../image';
import SvgColor from '../svg-color';
import ConfirmDialog from '../confirm-dialog';
import Iconify from '../iconify';
import EditRewardCardDialog from './EditRewardDialog';

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
  userPoints: number;
  handleClaimButtonClick: (id: number) => Promise<void>;
  handleDeleteButtonClick: (id: number) => Promise<void>;
  handleEditButtonClick: (id: number, editedRewardDto: Reward) => Promise<void>;
};

export default function RewardCard({ reward, cover, userPoints, handleClaimButtonClick, handleDeleteButtonClick, handleEditButtonClick }: Props) {
  const { id, name, description, cost, avatar } = reward;
  const { user } = useAuthContext();
  const currentRole = user?.role;
  const { translate } = useLocales();
  const FILLCOLOR = '#b9f6ca';
  const [percentage, setPercentage] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditorDialog, setOpenEditorDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const buttonStyle = {
    background: percentage < 100 ? `linear-gradient(to right, ${FILLCOLOR} ${percentage}%, white ${percentage}% ${100-percentage}%)` : 'inherit',
    minWidth: '100px'
  };

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
        {currentRole === Roles.Admin &&
          <>
            <Box
              sx={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 20,
              }}
            >
              <Button variant="text" onClick={() => setOpenEditorDialog(true)} >
                <Iconify icon="eva:edit-outline" />
              </Button>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 20,
              }}
              >
              <Button variant="text" sx={{ color: 'error.main' }} onClick={() => setOpenDeleteDialog(true)} >
                <Iconify icon="eva:trash-2-outline" />
              </Button>
            </Box>
          </>
        }

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
          
          <Image src={avatar as unknown as string} alt={avatar as unknown as string} ratio="21/9" />
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
              {`${translate('RewardCard.Cost')}`}
            </Typography>
            <Typography variant="subtitle1">{fShortenNumber(cost!)}</Typography>
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="outlined" onClick={() => setOpenDialog(true)} style={buttonStyle} disabled={percentage < 100}>
              {`${translate('RewardCard.Claim')}`}
            </Button>
          </Box>
        </Box>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title={`${translate('RewardCard.Claim')}`}
        content={<>{`${translate('RewardCard.AreYouSureWantToClaim')}`} &quot;<strong>{name}</strong>&quot; {`${translate('RewardCard.Item')}`}?</>}
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleClaimButtonClick(id!);
              setOpenDialog(false);
            }}
          >
            {`${translate('RewardCard.Claim')}`}
          </Button>
        }
      />

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        title={`${translate('RewardCard.Delete')}`}
        content={<>{`${translate('RewardCard.AreYouSureWantToDelete')}`} &quot;<strong>{name}</strong>&quot; {`${translate('RewardCard.Item')}`}?</>}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteButtonClick(id!);
              setOpenDeleteDialog(false);
            }}
          >
            {`${translate('RewardCard.Delete')}`}
          </Button>
        }
      />

      <EditRewardCardDialog
        reward={reward}
        open={openEditorDialog}
        onClose={() => setOpenEditorDialog(false)}
        onEditReward={handleEditButtonClick}
      />
    </>
  );
}