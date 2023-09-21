import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Grid, IconButton, Popover, Stack, TextField, Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { useLocales } from "src/locales";
import Iconify from "../iconify";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const MAX_POINTS_TO_GIVE = 100;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isSendEnabled, setIsSendEnabled] = useState(false);
    const [taggerAnchorEl, setTaggerAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [gifAnchorEl, setGifAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleTaggerButtonClick = () => {
        if (textareaRef.current) {
            textareaRef.current.value += '@';
            textareaRef.current.focus();
        }
    };

    return (
        <>
            <Card sx={{ p: 3, marginBottom: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                    <Grid container>
                        <Grid item xs={6} md={6}>
                            <Box>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Button
                                        onClick={handleTaggerButtonClick}
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
                        placeholder={`${translate('Feed.PlaceHolderExample')}`}
                        multiline
                        minRows={3}
                        maxRows={6}
                        sx={{ width: '100%', border: 'none' }}
                        InputProps={{ disableUnderline: true }}
                        inputRef={textareaRef}
                    />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                    <IconButton onClick={(event) => setGifAnchorEl(event.currentTarget)} sx={{ padding: 0 }}>
                        <Iconify icon="fluent:emoji-32-regular" width={20} />
                        <Iconify icon="material-symbols:gif" width={40} />
                    </IconButton>

                    <Button disabled={!isSendEnabled} type="submit" variant="contained">
                        {`${translate('Feed.Send')}`}
                    </Button>
                </Stack>
            </Card>

            <Popover
                open={Boolean(taggerAnchorEl)}
                onClose={() => setTaggerAnchorEl(null)}
                anchorEl={taggerAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>Ide kerül majd a user lista.</Typography>
            </Popover>

            <Popover
                open={Boolean(gifAnchorEl)}
                onClose={() => setGifAnchorEl(null)}
                anchorEl={gifAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>Ide kerül majd a Gif box.</Typography>
            </Popover>
        </>
    );
}