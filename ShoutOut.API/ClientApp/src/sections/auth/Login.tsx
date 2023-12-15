import { Alert, Stack, Typography } from '@mui/material';
import { useLocales } from 'src/locales';
import LoginLayout from '../../layouts/login';
import AuthLoginForm from './AuthLoginForm';

export default function Login() {
  const { translate } = useLocales();

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">{`${translate('LoginPage.SignInToShoutOut')}`}</Typography>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        Email : <strong>admin@admin.hu</strong> / password :<strong> Abcd1</strong>
      </Alert>

      <AuthLoginForm />
    </LoginLayout>
  );
}
