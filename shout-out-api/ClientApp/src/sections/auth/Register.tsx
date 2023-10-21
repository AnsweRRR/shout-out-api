import { Link as RouterLink } from 'react-router-dom';
import { Stack, Typography, Link } from '@mui/material';
import { useLocales } from 'src/locales';
import LoginLayout from '../../layouts/login';
import { PATH_AUTH } from '../../routes/paths';
import AuthRegisterForm from './AuthRegisterForm';

export default function Register() {
  const { translate } = useLocales();

  return (
    <LoginLayout title={`${translate('RegisterPage.ManageTheJobMoreEffectivelyWithShoutOut')}`}>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">{`${translate('RegisterPage.AlreadyHaveAnCccount')}`}</Typography>

          <Link to={PATH_AUTH.login} component={RouterLink} variant="subtitle2">
            {`${translate('RegisterPage.SignIn')}`}
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />
    </LoginLayout>
  );
}
