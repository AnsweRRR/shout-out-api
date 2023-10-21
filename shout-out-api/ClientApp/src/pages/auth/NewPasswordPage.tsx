import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useLocales } from 'src/locales';
import { PATH_AUTH } from '../../routes/paths';
import Iconify from '../../components/iconify';
import AuthNewPasswordForm from '../../sections/auth/AuthNewPasswordForm';
import { SentIcon } from '../../assets/icons';

export default function NewPasswordPage() {
  const { translate } = useLocales();
  
  return (
    <>
      <Helmet>
        <title>{`${translate('ForgotPasswordPage.NewPassword')}`}</title>
      </Helmet>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        {`${translate('ForgotPasswordPage.RequestSentSuccessfully')}`}
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 5 }}>
        {`${translate('ForgotPasswordPage.WeHaveSentA6DigitConfirmationEmailToYourEmail')}`}
        <br />
        {`${translate('ForgotPasswordPage.PleaseEnterTheCodeInBelowBoxToVerifyYourEmail')}`}
      </Typography>

      <AuthNewPasswordForm />

      <Typography variant="body2" sx={{ my: 3 }}>
        {`${translate('ForgotPasswordPage.DontHaveACode')}`} &nbsp;
        <Link
          variant="subtitle2"
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
        >
          {`${translate('ForgotPasswordPage.ResendCode')}`}
        </Link>
      </Typography>

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
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
