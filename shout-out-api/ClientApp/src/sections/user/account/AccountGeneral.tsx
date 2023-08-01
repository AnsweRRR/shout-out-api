import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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
  // email: string;
  birthDay: Date | null;
  startAtCompany: Date | null;
  photoURL: CustomFile | string | null;
  phoneNumber: string | null;
};

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    userName: Yup.string().required('User name is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // birthDay: Yup.date().nullable().required('Birthday is required'),
    // startAtCompany: Yup.date().nullable().required('Start at company is required'),
  });

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    email: user?.email || '',
    birthDay: user?.birthDay || null,
    startAtCompany: user?.startAtCompany || null,
    photoURL: user?.photoURL || null,
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Update success!');
      console.log('DATA', data);
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
        setValue('photoURL', newFile, { shouldValidate: true });
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
              name="photoURL"
              maxSize={3145728}
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
                  <br /> max size of {fData(3145728)}
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
                // name="birthDay"
                label="Birthday"
                value={methods.watch('birthDay')}
                onChange={(date) => setValue('birthDay', date, { shouldValidate: true })}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                // name="startAtCompany"
                label="Start at company"
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
