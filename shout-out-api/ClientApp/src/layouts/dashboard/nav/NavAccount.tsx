import { Link as RouterLink } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
import { Roles, RolesToDisplay } from 'src/@types/user';
import { useAuthContext } from '../../../auth/useAuthContext';
import { PATH_APP } from '../../../routes/paths';
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  /* eslint-disable-next-line no-unsafe-optional-chaining */
  const DISPLAY_NAME = user?.userName ? user?.userName : `${user?.firstName} ${user?.lastName}`;

  return (
    <Link component={RouterLink} to={PATH_APP.user.account} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src={user?.avatar} alt={DISPLAY_NAME} name={DISPLAY_NAME} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {DISPLAY_NAME}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {RolesToDisplay[user?.role]}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}