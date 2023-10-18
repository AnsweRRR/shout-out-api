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
    reward: Reward;
    open: boolean;
    onClose: VoidFunction;
    onEditReward: (id: number, reward: Reward) => void;
};

export default function EditRewardCardDialog({ reward, open, onClose, onEditReward }: Props) {
    const { translate } = useLocales();
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);

    const RewardSchema = Yup.object().shape({
        name: Yup.string().required(translate('Maintenance.Validator.NameIsRequired')),
        description: Yup.string().required(translate('Maintenance.Validator.DescriptionIsRequired')),
        cost: Yup.number().required(translate('Maintenance.Validator.CostIsRequired')),
        avatar: Yup.mixed().required(translate('Maintenance.Validator.AvatarIsRequired')),
    });

    const defaultValues = {
        id: reward.id!,
        name: reward.name!,
        description: reward.description!,
        cost: reward.cost!,
        avatar: reward.avatar!
    };

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(RewardSchema),
        defaultValues,
    });

    const {
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {
        try {
            onEditReward(data.id!, {
                name: data.name,
                description: data.description,
                cost: data.cost,
                avatar: isAvatarChanged ? data.avatar : null
            });

            onClose();
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
            setIsAvatarChanged(true);
        }
    },[setValue]
    );

    return (
        <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{`${translate('Maintenance.Edit')}`}</DialogTitle>

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
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {`${translate('Maintenance.Save')}`}
                    </LoadingButton>

                    <Button color="inherit" variant="outlined" onClick={onClose}>
                        {`${translate('Maintenance.Cancel')}`}
                    </Button>
                </DialogActions>
            </FormProvider>
        </Dialog>
    );
}