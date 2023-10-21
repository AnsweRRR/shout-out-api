import * as Yup from 'yup';
import { createUserAsync } from 'src/api/userClient';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/useAuthContext';
import { PATH_APP } from '../../routes/paths';
import { IUserAccountGeneral, InviteRequestDto, Roles } from '../../@types/user';
import { CustomFile } from '../../components/upload';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Omit<IUserAccountGeneral, 'avatarUrl'> {
  avatarUrl: CustomFile | string | null;
}

type Props = {
  isEdit?: boolean;
  currentUser?: IUserAccountGeneral;
};

export default function UserNewEditForm({ isEdit = false, currentUser }: Props) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const { translate } = useLocales();

  const NewUserSchema = Yup.object().shape({
    firstName: Yup.string().required(translate('Maintenance.Validator.FirstNameIsRequired')),
    lastName: Yup.string().required(translate('Maintenance.Validator.LastNameIsRequired')),
    email: Yup.string().required(translate('Maintenance.Validator.EmailIsRequired')).email(translate('Maintenance.Validator.EmailMustBeAValidEmailAddress')),
    role: Yup.mixed<Roles>().required(translate('Maintenance.Validator.RoleIsRequired')),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      userName: currentUser?.userName || '',
      email: currentUser?.email || '',
      avatarUrl: currentUser?.avatarUrl || null,
      role: currentUser?.role || Roles.User,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!isEdit) {
        const newUserDto: InviteRequestDto = {
          email: data.email,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName
        }
        await createUserAsync(newUserDto, user?.accessToken);
      } else {
        // TODO: edit here...
      }
      
      reset();
      enqueueSnackbar(!isEdit ? `${translate('ApiCallResults.CreatedSuccessfully')}` : `${translate('ApiCallResults.EditedSuccessfully')}`);
      navigate(PATH_APP.user.list);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label={`${translate('Maintenance.FirstName')}`} />
              <RHFTextField name="lastName" label={`${translate('Maintenance.LastName')}`}/>
              <RHFTextField name="email" label={`${translate('Maintenance.EmailAddress')}`} />

              <RHFSelect native name="role" label={`${translate('Maintenance.Role')}`} placeholder={`${translate('Maintenance.Role')}`}>
                <option value={Roles.Admin} label={`${translate('Maintenance.Admin')}`}>{Roles.Admin}</option>
                <option value={Roles.User} label={`${translate('Maintenance.User')}`}>{Roles.User}</option>
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? `${translate('Maintenance.CreateUser')}` : `${translate('Maintenance.SaveChanges')}`}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
