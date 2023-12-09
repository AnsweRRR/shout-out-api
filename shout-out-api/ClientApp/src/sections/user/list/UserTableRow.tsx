import { useState } from 'react';
import {
  Stack,
  Button,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
import { useAuthContext } from 'src/auth/useAuthContext';
import { useLocales } from 'src/locales';
import { CustomAvatar } from 'src/components/custom-avatar';
import { IUserAccountGeneral, RolesToDisplay } from '../../../@types/user';
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';


// ----------------------------------------------------------------------

type Props = {
  row: IUserAccountGeneral;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onInactivateRow: VoidFunction;
  onReactivateRow: VoidFunction;
};

export default function UserTableRow({
  row,
  onEditRow,
  onDeleteRow,
  onInactivateRow,
  onReactivateRow,
}: Props) {
  const { avatarUrl, firstName, lastName, userName, email, role, isVerified, isActive, id } = row;
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openInactivateConfirm, setOpenInactivateConfirm] = useState(false);
  const [openReactivateConfirm, setOpenReactivateConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const { user } = useAuthContext();
  const { translate } = useLocales();

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleOpenInactivateConfirm = () => {
    setOpenInactivateConfirm(true);
  };

  const handleCloseInactivateConfirm = () => {
    setOpenInactivateConfirm(false);
  };

  const handleOpenReactivateConfirm = () => {
    setOpenReactivateConfirm(true);
  };

  const handleCloseReactivateConfirm = () => {
    setOpenReactivateConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CustomAvatar alt={firstName + lastName} name={firstName + lastName} src={avatarUrl} />

            <Typography variant="subtitle2" noWrap>
              {`${firstName} ${lastName}`}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {userName}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {email}
          </Typography>
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {RolesToDisplay[role]}
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell>

        <TableCell align="center">
          <Iconify
            icon='eva:checkmark-circle-fill'
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isActive && { color: 'error.main' }),
            }}
          />
        </TableCell>

        <TableCell align="right">
          {user?.id !== id &&
            <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          }
        </TableCell>

      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {/* <MenuItem
          onClick={() => {
            handleOpenDeleteConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          {`${translate('Maintenance.Delete')}`}
        </MenuItem> */}

        {isActive ? (
          <MenuItem
            onClick={() => {
              handleOpenInactivateConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            {`${translate('Maintenance.Inactivate')}`}
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleOpenReactivateConfirm();
              handleClosePopover();
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="eva:trash-2-outline" />
            {`${translate('Maintenance.Reactivate')}`}
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          {`${translate('Maintenance.Edit')}`}
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        title={`${translate('Maintenance.Delete')}`}
        content={`${translate('Maintenance.AreYouSureWantToDelete')}`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {`${translate('Maintenance.Delete')}`}
          </Button>
        }
      />

      <ConfirmDialog
        open={openInactivateConfirm}
        onClose={handleCloseInactivateConfirm}
        title={`${translate('Maintenance.Inactivate')}`}
        content={`${translate('Maintenance.AreYouSureWantToInactivate')}`}
        action={
          <Button variant="contained" color="error" onClick={onInactivateRow}>
            {`${translate('Maintenance.Inactivate')}`}
          </Button>
        }
      />

      <ConfirmDialog
        open={openReactivateConfirm}
        onClose={handleCloseReactivateConfirm}
        title={`${translate('Maintenance.Reactivate')}`}
        content={`${translate('Maintenance.AreYouSureWantToReactivate')}`}
        action={
          <Button variant="contained" color="success" onClick={onReactivateRow}>
            {`${translate('Maintenance.Reactivate')}`}
          </Button>
        }
      />
    </>
  );
}
