import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { changePasswordAsync } from 'src/api/userClient';
import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/useAuthContext';
import { ChangePasswordDto, IUserAccountChangePassword } from '../../../@types/user';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

type FormValuesProps = IUserAccountChangePassword;

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { translate } = useLocales();
  const minPasswordCharacters = 5;

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required(`${translate('Maintenance.Validator.OldPasswordIsRequired')}`),
    newPassword: Yup.string()
      .required(`${translate('Maintenance.Validator.NewPasswordIsRequired')}`)
      .min(minPasswordCharacters, `${translate('Maintenance.Validator.PasswordMustBeAtLeast')} ${minPasswordCharacters} ${`${translate('Maintenance.Validator.Characters')}`}`)
      .test('no-match', `${translate('Maintenance.Validator.NewPasswordMustBeDifferentThanOldPassword')}`, (value, { parent }) => value !== parent.oldPassword), 
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], `${translate('Maintenance.Validator.PasswordsMustMatch')}`),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (user) {
        const changePasswordDto: ChangePasswordDto = {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmNewPassword
        }
        const result = await changePasswordAsync(changePasswordDto, user?.accessToken);
        reset();
        enqueueSnackbar(`${translate('ApiCallResults.EditedSuccessfully')}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField name="oldPassword" type="password" label={`${translate('Maintenance.OldPassword')}`} />

          <RHFTextField
            name="newPassword"
            type="password"
            label={`${translate('Maintenance.NewPassword')}`}
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> {`${translate('Maintenance.Validator.PasswordMustBeMinimum')} ${minPasswordCharacters}+`}
              </Stack>
            }
          />

          <RHFTextField name="confirmNewPassword" type="password" label={`${translate('Maintenance.ConfirmNewPassword')}`} />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {`${translate('Maintenance.SaveChanges')}`}
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}