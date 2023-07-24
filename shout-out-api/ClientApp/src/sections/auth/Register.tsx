import { Link as RouterLink } from 'react-router-dom';
import { Stack, Typography, Link } from '@mui/material';
import LoginLayout from '../../layouts/login';
import { PATH_AUTH } from '../../routes/paths';
import AuthRegisterForm from './AuthRegisterForm';

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <LoginLayout title="Manage the job more effectively with Minimal">
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link to={PATH_AUTH.login} component={RouterLink} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />
    </LoginLayout>
  );
}
