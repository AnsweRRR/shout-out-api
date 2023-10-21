import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { resetPasswordRequestAsync } from 'src/api/userClient';
import { useLocales } from 'src/locales';
import { PATH_AUTH } from '../../routes/paths';
import FormProvider, { RHFTextField } from '../../components/hook-form';

type FormValuesProps = {
  email: string;
};

export default function AuthResetPasswordForm() {
  const navigate = useNavigate();
  const { translate } = useLocales();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required(`${translate('Maintenance.Validator.EmailIsRequired')}`).email(`${translate('Maintenance.Validator.EmailMustBeAValidEmailAddress')}`),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const result = await resetPasswordRequestAsync(data.email);
      sessionStorage.setItem('email-recovery', data.email);
      navigate(PATH_AUTH.newPassword);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="email" label={`${translate('LoginPage.EmailAddress')}`} />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        {`${translate('ForgotPasswordPage.SendRequest')}`}
      </LoadingButton>
    </FormProvider>
  );
}
