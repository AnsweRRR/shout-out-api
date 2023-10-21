import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useLocales } from 'src/locales';
import { PATH_PAGE } from 'src/routes/paths';
import { verifyInviteToken } from 'src/api/userClient';
import { RegisterDto } from 'src/@types/user';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import Iconify from '../../components/iconify';
import { useAuthContext } from '../../auth/useAuthContext';

type FormValuesProps = {
  userName: string;
  password: string;
  confirmPassword: string;
  afterSubmit?: string;
};

export default function AuthRegisterForm() {
  const { register } = useAuthContext();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { verificationToken } = useParams<{ verificationToken: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const minPasswordCharacters = 5;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    userName: Yup.string().required(`${translate('Maintenance.Validator.UserNameIsRequired')}`),
    password: Yup.string().required(`${translate('Maintenance.Validator.PasswordIsRequired')}`).min(minPasswordCharacters, `${translate('Maintenance.Validator.PasswordMustBeAtLeast')} ${minPasswordCharacters} ${`${translate('Maintenance.Validator.Characters')}`}`),
    confirmPassword: Yup.string().required(`${translate('Maintenance.Validator.ConfirmPasswordIsRequired')}`).oneOf([Yup.ref('password')], `${translate('Maintenance.Validator.PasswordsMustMatch')}`),
  });

  const defaultValues = {
    userName: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (register) {
        const registerDto: RegisterDto = {
          userName: data.userName,
          password: data.password,
          confirmPassword: data.confirmPassword,
          token: verificationToken!
        };

        await register(registerDto);
      }
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  useEffect(() => {
    if (!verificationToken) {
      navigate(PATH_PAGE.page404);
    } else {
      verifyInviteToken(verificationToken);
    }
  }, [verificationToken, navigate]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="userName" label={`${translate('Maintenance.UserName')}`} />

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
          label={`${translate('LoginPage.ConfirmPassword')}`}
          type={showConfirmPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitSuccessful || isSubmitting}
          sx={{
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            '&:hover': {
              bgcolor: 'text.primary',
              color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
            },
          }}
        >
          {`${translate('RegisterPage.CreateAccount')}`}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
