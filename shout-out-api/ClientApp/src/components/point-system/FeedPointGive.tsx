import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import { Avatar, Box, Button, Card, Grid, IconButton, Popover, Stack, Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { useStyle } from 'src/hooks/useStyle';
import { useLocales } from "src/locales";
import { CloseIcon } from "src/theme/overrides/CustomIcons";
import { useSelector } from "react-redux";
import { AppState } from "src/redux/rootReducerTypes";
import { MentionsInputStyles } from "src/utils/cssStyles";
import { FeedItem, SendPointsDto } from "src/@types/feed";
import { ExtendedSuggestionDataItem } from "src/@types/user";
import { givePointsAsync } from "src/api/feedClient";
import Iconify from "../iconify";
import GiphyGIFSearchBox from "../giphyGIF/GiphyGIFSearchBox";
import { useSnackbar } from "../snackbar";

interface Props {
    setFeedItems: Dispatch<SetStateAction<FeedItem[]>>;
}

export default function PointSystemFeed(props: Props) {
    const { setFeedItems } = props;
    const { user, updatePointToGive } = useAuthContext();
    const { translate } = useLocales();
    const { enqueueSnackbar } = useSnackbar();
    useStyle('MentionsInput', MentionsInputStyles);
    const MAX_POINTS_TO_GIVE = 100;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isSendEnabled, setIsSendEnabled] = useState(false);
    const [gifAnchorEl, setGifAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [selectedGiphyUrl, setSelectedGiphyUrl] = useState<string | null>(null);
    const [taggedUsers, setTaggedUsers] = useState<Array<string> | null | undefined>([]);
    const [pointAmountToGive, setPointAmountToGive] = useState<number | null>(null);
    const [hashTags, setHashTags] = useState<Array<string> | null>(null);
    const { users } = useSelector((state: AppState) => state.usersState);
    const [inputData, setInputData] = useState('');

    const handleSendPoints = async () => {
        const userIds = taggedUsers?.map(userId => userId as unknown as number);

        if (hashTags && hashTags.length > 0 && pointAmountToGive && userIds && user?.pointsToGive > (userIds.length * pointAmountToGive)) {
            const payload: SendPointsDto = {
                hashTags,
                amount: pointAmountToGive,
                receiverUsers: userIds,
                giphyGifUrl: selectedGiphyUrl
            }
            
            const result = await givePointsAsync(payload, user?.accessToken);
            if (result.status === 200) {
                enqueueSnackbar(`${translate('ApiCallResults.SentSuccessfully')}`, { variant: 'success' });
                setTaggedUsers([]);
                setInputData('');
                setSelectedGiphyUrl(null);
                const { amount, description, eventDate, eventType, giphyGif, id, pointsToGiveAfterSend, receiverUsers, senderAvatar, senderId, senderName } = result.data;
                const newlyCreateFeedItem: FeedItem = {
                    id,
                    amount,
                    senderId,
                    senderName,
                    senderAvatar,
                    eventDate,
                    description,
                    eventType,
                    giphyGif,
                    receiverUsers
                }
                setFeedItems(prevState => [newlyCreateFeedItem, ...prevState, ]);
                updatePointToGive(pointsToGiveAfterSend);
            } else {
                enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
            }
        } else {
            enqueueSnackbar(`${translate('ApiCallResults.SomethingWentWrong')}`, { variant: 'error' });
        }
    };

    const handleTaggerButtonClick = () => {
        if (textareaRef.current) {
            setInputData(prevState => `${prevState} @`);
            textareaRef.current.focus();
        }
    };

    const handlePlusButtonClick = () => {
        if (textareaRef.current) {
            const plusCount = (inputData.match(/\+/g) || []).length;
            if (plusCount !== 0) {
                return;
            }
            setInputData(prevState => `${prevState} +`);
            textareaRef.current.focus();
        }
    };

    const handleSelectGif = (selectedGif: any) => {
        setSelectedGiphyUrl(selectedGif.images.fixedHeight.url);
        setGifAnchorEl(null);
    };

    const onMentionChange = (event: any) => {
        const newInputValue = event.target.value;
        const plusCount = (newInputValue.match(/\+/g) || []).length;

        if (plusCount > 1) {
            return;
        }

        setInputData(event.target.value);
    };

    useEffect(() => {
        const words = inputData.split(" ");

        // Tagged users
        const pattern = /[^(]+(?=\))/g;
        const selectedUsers = inputData.match(pattern);
        setTaggedUsers(selectedUsers);

        // Hashtags
        const enteredHashTags = words.filter(word => word.startsWith('#'));
        setHashTags(enteredHashTags);

        // Point amount to give
        const enteredPointToGive = words.find(word => word.startsWith('+'));
        const parsedEnteredPointToGive = enteredPointToGive ? parseInt(enteredPointToGive, 10) : null;
        if (enteredPointToGive) {
            setPointAmountToGive(enteredPointToGive as unknown as number);
        } else {
            setPointAmountToGive(null);
        }

        // Send button enable/disable
        if (enteredHashTags && enteredHashTags.length > 0 && parsedEnteredPointToGive && selectedUsers && user?.pointsToGive > (selectedUsers.length * parsedEnteredPointToGive)) {
            setIsSendEnabled(true);
        } else {
            setIsSendEnabled(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputData]);

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
                                        onClick={handlePlusButtonClick}
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
                    <div className="direction-input-wrapper">
                        <div className="input-wrapper">
                            <MentionsInput
                                inputRef={textareaRef}
                                className="direction-input"
                                onChange={(e) => onMentionChange(e)}
                                value={inputData}
                                placeholder={`${translate('FeedPage.PlaceHolderExample')}`}
                            >
                                <Mention
                                    className="temp"
                                    trigger="@"
                                    data={users.filter(possibleUser => !taggedUsers?.includes(possibleUser.id.toString()))}
                                    markup="@[__display__](__id__)"
                                    renderSuggestion={( suggestion: ExtendedSuggestionDataItem ) => 
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Avatar alt={suggestion.display} src={suggestion.avatar} />
                                            <Typography variant="subtitle2" noWrap>
                                                {suggestion.display}
                                            </Typography>
                                        </Stack>
                                    }
                                />
                            </MentionsInput>
                        </div>
                    </div>
                </Stack>

                {selectedGiphyUrl &&
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        style={{ position: 'relative' }}
                    >
                        <Box style={{ position: 'relative' }}>
                            <IconButton
                                onClick={() => setSelectedGiphyUrl(null)}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <img src={selectedGiphyUrl} alt="selectedGiphyUrl" />
                        </Box>
                    </Stack>
                }

                <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                    <IconButton onClick={(event) => setGifAnchorEl(event.currentTarget)} sx={{ padding: 0 }}>
                        <Iconify icon="fluent:emoji-32-regular" width={20} />
                        <Iconify icon="material-symbols:gif" width={40} />
                    </IconButton>

                    <Button disabled={!isSendEnabled} type="submit" variant="contained" onClick={handleSendPoints}>
                        {`${translate('FeedPage.Send')}`}
                    </Button>
                </Stack>
            </Card>

            <Popover
                open={Boolean(gifAnchorEl)}
                onClose={() => setGifAnchorEl(null)}
                anchorEl={gifAnchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                    <Box sx={{ marginTop: '10px' }} className="searchboxWrapper">
                    <GiphyGIFSearchBox
                        imageRenditionFileType="gif"
                        onSelect={(item: any) => handleSelectGif(item)}
                        masonryConfig={[
                            { columns: 2, imageWidth: 110, gutter: 5 },
                            { mq: '700px', columns: 3, imageWidth: 120, gutter: 5 }
                        ]}
                    />
                </Box>
            </Popover>
        </>
    );
}