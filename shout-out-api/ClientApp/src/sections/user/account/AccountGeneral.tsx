import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { EditUserDto } from 'src/@types/user';
import { editOwnUserAccountAsync } from 'src/api/userClient';
import { useAuthContext } from '../../../auth/useAuthContext';
import { fData } from '../../../utils/formatNumber';
import { CustomFile } from '../../../components/upload';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  firstName: string;
  lastName: string;
  userName: string;
  birthday: Date | null;
  startAtCompany: Date | null;
  avatar: CustomFile | string | null;
  phoneNumber: string | null;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    userName: Yup.string().required('User name is required'),
    // birthday: Yup.date().nullable().required('Birthday is required'),
    // startAtCompany: Yup.date().nullable().required('Start at company is required'),
  });

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    email: user?.email || '',
    birthday: user?.birthday || null,
    startAtCompany: user?.startAtCompany || null,
    avatar: user?.avatar || null,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {

      const editUserDto: EditUserDto = {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        avatar: data.avatar,
        birthday: data.birthday,
        startAtCompany: data.startAtCompany
      };
      await editOwnUserAccountAsync(editUserDto, user?.accessToken);

      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="avatar"
              maxSize={10000000}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(10000000)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
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
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
              <RHFTextField name="userName" label="User name" />

              <DatePicker
                label="Birthday"
                disabled={methods.watch('birthday') !== null}
                value={methods.watch('birthday')}
                onChange={(date) => setValue('birthday', date, { shouldValidate: true })}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                label="Start at company"
                disabled={methods.watch('startAtCompany') !== null}
                value={methods.watch('startAtCompany')}
                onChange={(date) => setValue('startAtCompany', date, { shouldValidate: true })}
                renderInput={(params) => <TextField {...params} />}
              />

              <RHFTextField disabled name="email" label="Email Address" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
