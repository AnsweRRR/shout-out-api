import { useState } from "react";
import { Box, Button, Card, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { useLocales } from "src/locales";
import Iconify from "../iconify";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const MAX_POINTS_TO_GIVE = 100;
    const [isSendEnabled, setIsSendEnabled] = useState(false);

    return (
        <Card sx={{ p: 3, marginBottom: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        minWidth: '36px',
                                        padding: '0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    >
                                        <Iconify icon="ph:at-bold" width={24} />
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        minWidth: '36px',
                                        padding: '0',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: '8px'
                                    }}
                                    >
                                        <Iconify icon="ic:baseline-plus" width={24} />
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                            <Typography style={{ textAlign: 'center', fontSize: 12 }}>
                                {`${translate('Header.PointsToGive')}`}
                            </Typography>

                            <Typography style={{ textAlign: 'center' }}>
                                {`${MAX_POINTS_TO_GIVE} / ${user!.pointsToGive}`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <TextField
                    variant="standard"
                    placeholder="@felhasználónév +10 hozzászólás..."
                    multiline
                    minRows={3}
                    maxRows={6}
                    sx={{ width: '100%', border: 'none' }}
                    InputProps={{ disableUnderline: true }}
                />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                <IconButton sx={{ padding: 0 }}>
                    <Iconify icon="fluent:emoji-32-regular" width={20} />
                    <Iconify icon="material-symbols:gif" width={40} />
                </IconButton>

                <Button disabled={!isSendEnabled} type="submit" variant="contained">
                    {`${translate('Feed.Send')}`}
                </Button>
            </Stack>
        </Card>
    );
}