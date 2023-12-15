import { useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';import { resetPasswordAsync } from 'src/api/userClient';
import { useLocales } from 'src/locales';
import { ResetPasswordDto } from 'src/@types/user';
import { PATH_AUTH } from '../../routes/paths';
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFCodes } from '../../components/hook-form';

type FormValuesProps = {
  code1: string;
  code2: string;
  code3: string;
  code4: string;
  code5: string;
  code6: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AuthNewPasswordForm() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const minPasswordCharacters = 5;
  const [showPassword, setShowPassword] = useState(false);

  const emailRecovery = typeof window !== 'undefined' ? sessionStorage.getItem('email-recovery') : '';

  const VerifyCodeSchema = Yup.object().shape({
    code1: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    code2: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    code3: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    code4: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    code5: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    code6: Yup.string().required(`${translate('Maintenance.Validator.CodeIsRequired')}`),
    email: Yup.string().required(`${translate('Maintenance.Validator.EmailIsRequired')}`).email(`${translate('Maintenance.Validator.EmailMustBeAValidEmailAddress')}`),
    password: Yup.string()
      .min(minPasswordCharacters,  `${translate('Maintenance.Validator.PasswordMustBeAtLeast')} ${minPasswordCharacters} ${`${translate('Maintenance.Validator.Characters')}`}`)
      .required(`${translate('Maintenance.Validator.PasswordIsRequired')}`),
    confirmPassword: Yup.string()
      .required(`${translate('Maintenance.Validator.ConfirmPasswordIsRequired')}`)
      .oneOf([Yup.ref('password')], `${translate('Maintenance.Validator.PasswordsMustMatch')}`),
  });

  const defaultValues = {
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
    code6: '',
    email: emailRecovery || '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const resetPasswordDto: ResetPasswordDto = {
        email: data.email,
        sixDigitCode: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword
      }
      await resetPasswordAsync(resetPasswordDto);
      sessionStorage.removeItem('email-recovery');
      enqueueSnackbar(`${translate('ForgotPasswordPage.ChangePasswordSuccess')}`);
      navigate(PATH_AUTH.login);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField
          name="email"
          label={`${translate('LoginPage.EmailAddress')}`}
          disabled={!!emailRecovery}
          InputLabelProps={{ shrink: true }}
        />

        <RHFCodes keyName="code" inputs={['code1', 'code2', 'code3', 'code4', 'code5', 'code6']} />

        {(!!errors.code1 ||
          !!errors.code2 ||
          !!errors.code3 ||
          !!errors.code4 ||
          !!errors.code5 ||
          !!errors.code6) && (
          <FormHelperText error sx={{ px: 2 }}>
            {`${translate('Maintenance.Validator.CodeIsRequired')}`}
          </FormHelperText>
        )}

        <RHFTextField
          name="password"
          label={`${translate('LoginPage.Password')}`}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="confirmPassword"
          label={`${translate('Maintenance.ConfirmNewPassword')}`}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          {`${translate('ForgotPasswordPage.UpdatePassword')}`}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
