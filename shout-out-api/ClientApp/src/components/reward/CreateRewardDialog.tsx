import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Reward } from 'src/@types/reward';
import { Box, Stack, Dialog, Button, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useLocales } from "src/locales";
import { fData } from 'src/utils/formatNumber';
import { useCallback, useState } from 'react';
import { CustomFile } from '../upload';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../hook-form';

// ----------------------------------------------------------------------

interface FormValuesProps extends Reward {
    name: string;
    description: string;
    cost: number | null | undefined;
    avatar: CustomFile | string | null;
}

type Props = {
    open: boolean;
    onClose: VoidFunction;
    onCreateReward: (reward: Reward) => void;
    isLoading: boolean;
};

export default function CreateRewardCardDialog({ open, onClose, onCreateReward, isLoading }: Props) {
    const { translate } = useLocales();

    const NewRewardSchema = Yup.object().shape({
        name: Yup.string().required(translate('Maintenance.Validator.NameIsRequired')),
        description: Yup.string().required(translate('Maintenance.Validator.DescriptionIsRequired')),
        cost: Yup.number().min(0, translate('Maintenance.Validator.MustBeGreaterThanZero')).required(translate('Maintenance.Validator.CostIsRequired')),
        avatar: Yup.mixed().required(translate('Maintenance.Validator.AvatarIsRequired')),
    });

    const defaultValues = {
        name: '',
        description: '',
        cost: undefined,
        avatar: null
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(NewRewardSchema),
        defaultValues,
    });

    const {
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {
        try {
            onCreateReward({
                name: data.name,
                description: data.description,
                cost: data.cost,
                avatar: data.avatar
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        });

        if (file) {
            setValue('avatar', newFile, { shouldValidate: true });
        }
    },[setValue]
    );

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{`${translate('Maintenance.CreateNewReward')}`}</DialogTitle>

                <DialogContent dividers>
                    <Stack spacing={3} sx={{ marginTop: '20px' }}>
                        <Box
                            rowGap={3}
                            columnGap={2}
                            display="grid"
                            gridTemplateColumns={{
                                xs: 'repeat(1, 1fr)',
                                sm: 'repeat(2, 1fr)',
                            }}
                            sx={{mt: '10px'}}
                        >
                            <RHFTextField name="name" label={`${translate('Maintenance.Name')}`} />
                            <RHFTextField name="cost" label={`${translate('Maintenance.Cost')}`} type='number' />
                        </Box>

                        <RHFTextField name="description" label={`${translate('Maintenance.Description')}`} multiline rows={3} />

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
                                    {`${translate('Maintenance.Allowed')}`} *.jpeg, *.jpg, *.png, *.gif
                                    <br /> {`${translate('Maintenance.MaxSizeOf')}`} {fData(10000000)}
                                </Typography>
                            }
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <LoadingButton type="submit" variant="contained" disabled={isLoading} loading={isSubmitting}>
                        {`${translate('Maintenance.Create')}`}
                    </LoadingButton>

                    <Button color="inherit" variant="outlined" onClick={onClose}>
                        {`${translate('Maintenance.Cancel')}`}
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}