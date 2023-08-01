import { Alert, Stack, Typography } from '@mui/material';
import LoginLayout from '../../layouts/login';
import AuthLoginForm from './AuthLoginForm';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to Minimal</Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>admin@admin.hu</strong> / password :<strong> Abcd1</strong>
      </Alert>

      <AuthLoginForm />
    </LoginLayout>
  );
}
