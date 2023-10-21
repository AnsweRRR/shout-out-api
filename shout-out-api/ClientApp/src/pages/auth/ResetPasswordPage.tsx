import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useLocales } from 'src/locales';
import { PATH_AUTH } from '../../routes/paths';
import Iconify from '../../components/iconify';
import AuthResetPasswordForm from '../../sections/auth/AuthResetPasswordForm';
import { PasswordIcon } from '../../assets/icons';

export default function ResetPasswordPage() {
  const { translate } = useLocales();

  return (
    <>
      <Helmet>
        <title>{`${translate('ForgotPasswordPage.ResetPassword')}`}</title>
      </Helmet>

      <PasswordIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        {`${translate('ForgotPasswordPage.ForgotYourPassword')}`}
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        {`${translate('ForgotPasswordPage.PleaseEnterTheEmail')}`}
      </Typography>

      <AuthResetPasswordForm />

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        {`${translate('ForgotPasswordPage.ReturnToSignIn')}`}
      </Link>
    </>
  );
}
