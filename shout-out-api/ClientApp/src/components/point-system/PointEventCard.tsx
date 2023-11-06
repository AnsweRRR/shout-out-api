import { Dispatch, SetStateAction, useState, useRef } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Box, Card, Chip, Divider, Grid, IconButton, Stack, Tooltip, Typography, TextField, List, ListItemText, ListItemButton, Button, Popover } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { CommentDto, FeedItem, ReceiverUser } from "src/@types/feed";
import { fHungarianDateTime } from "src/utils/formatTime";
import useLocales from "src/locales/useLocales";
import { addCommentAsync, editCommentAsync, dislikeAsync, likeAsync } from "src/api/feedClient";
import { CloseIcon } from "src/theme/overrides/CustomIcons";
import { useAuthContext } from "src/auth/useAuthContext";
import { CustomAvatar } from "../custom-avatar";
import Iconify from "../iconify/Iconify";
import GiphyGIFSearchBox from "../giphyGIF/GiphyGIFSearchBox";

type Props = {
    event: FeedItem;
    feedItems: FeedItem[];
    setFeedItems: Dispatch<SetStateAction<FeedItem[]>>;
};

const DISPLAY_COMMENTS_TAKE = 3;

export default function PointSystemFeed({ event, feedItems, setFeedItems }: Props) {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const commentRef = useRef();

    const initialCommentState = {
        pointHistoryId: event.id,
        text: '',
        giphyGifUrl: null
    }

    const [gifAnchorEl, setGifAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [comments, setComments] = useState<Array<CommentDto>>(event.comments ? event.comments : []);
    const [commentToSend, setCommentToSend] = useState<CommentDto>(initialCommentState);
    const [isCommentInputVisible, setIsCommentInputVisible] = useState<boolean>(false);
    const [isCommentAreaVisible, setIsCommentAreaVisible] = useState<boolean>(true);
    const [displayCommentsCount, setDisplayCommentsCount] = useState<number>(DISPLAY_COMMENTS_TAKE);

    const likedByNames = event.likes?.map(like => like.likedByName);
    const resultString = likedByNames ? likedByNames.join(", ") : '';

    const handleLikeDislikeClicked = async () => {
        if (event.isLikedByCurrentUser) {
            const result = await dislikeAsync(event.id, user?.accessToken);
            if (result.status === 200) {
                const updatedData = feedItems.map((item) => {
                    if (item.id === event.id) {
                        return { ...item, isLikedByCurrentUser: false };
                    }
                    return item;
                });

                setFeedItems(updatedData);
            }
        } else {
            const result = await likeAsync(event.id, user?.accessToken);
            if (result.status === 200) {
                const updatedData = feedItems.map((item) => {
                    if (item.id === event.id) {
                        return { ...item, isLikedByCurrentUser: true };
                    }
                    return item;
                });

                setFeedItems(updatedData);
            }
        }
    };

    const handleCommentClicked = () => {
        if (!isCommentInputVisible) {
            setIsCommentInputVisible(true);
        } else {
            setIsCommentInputVisible(false);
        }
    }

    const handleSendComment = async () => {
        if (commentToSend.text || commentToSend.giphyGif) {
            const result = await addCommentAsync(commentToSend ,user?.accessToken);
            const { data } = result;
            if (result.status === 200) {
                setCommentToSend(initialCommentState);
                setComments(prevState => [data, ...prevState]);
            }
        }
    }

    const handleEditComment = async (commentId: number) => {
        if (commentToSend.text) {
            const result = await editCommentAsync(commentId, commentToSend ,user?.accessToken);
            const { data } = result;
            if (result.status === 200) {
                // TODO: update comment...
            }
        }
    }

    const handleOpenComments = async () => {
        if (!isCommentAreaVisible) {
            setIsCommentAreaVisible(true);
        } else {
            setIsCommentAreaVisible(false);
        }
    }

    const handleShowMoreComments = () => {
        setDisplayCommentsCount(prevState => {
            const commentCountToDisplay = prevState + DISPLAY_COMMENTS_TAKE;
            return commentCountToDisplay;
        });
    }

    const handleSelectGif = (selectedGif: any) => {
        setCommentToSend(comment => ({
            ...comment,
            giphyGif: selectedGif.images.fixedHeight.url
        }));
        setGifAnchorEl(null);
    };

    return (
        <Card sx={{ p: 3, marginBottom: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Grid container>
                    <Grid item xs={8} md={8}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                        <Tooltip title={event.senderId !== null ? event.senderName : 'ShoutOut'}>
                            <CustomAvatar
                                src={event.senderAvatar!}
                                alt={event.senderName!}
                                name={event.senderName!}
                                sx={{ width: 48, height: 48 }}
                            />
                        </Tooltip>
                    
                        <Chip label={`+ ${event.amount}`} />

                        {event.receiverUsers.map((receiverUser: ReceiverUser, index: number) =>
                            <Box
                                key={receiverUser.userId}
                                style={{
                                    display: 'flex',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    marginLeft: index !== 0 ? '-16px' : '16px'
                                }}
                            >
                                <Tooltip title={receiverUser.userName} >
                                    <CustomAvatar
                                        src={receiverUser.userAvatar!}
                                        alt={receiverUser.userName}
                                        name={receiverUser.userName}
                                        sx={{ width: 48, height: 48, ":hover": { zIndex: 1, height: 52, width: 52} }}
                                    />
                                </Tooltip>
                            </Box>
                        )}
                        </Stack>
                    </Grid>

                    <Grid item xs={4} md={4}>
                        <Box style={{ marginLeft: "auto", textAlign: "right" }}>
                            <Chip label={fHungarianDateTime(event.eventDate)} />
                        </Box>
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="column" alignItems="flex-start" spacing={1} sx={{ marginTop: 3 }}>
                <Typography>{event.senderName}</Typography>
                <Typography style={{ margin: 0 }}>🎉</Typography>
                <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                    {event.receiverUsers.map((receiverUser: ReceiverUser) => (
                    <Typography style={{ marginLeft: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} key={receiverUser.userId}>
                        &nbsp;{`@${receiverUser.userName}`}
                    </Typography>
                    ))}
                </div>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 1}}>
                <Typography>{event.description}</Typography>
            </Stack>

            {event.giphyGif &&
                <Stack direction="row" alignItems="center" spacing={2} style={{ marginBottom: 10 }}>
                    <Box>
                        <img src={event.giphyGif} alt="Giphy GIF" />
                    </Box>
                </Stack>
            }

            <Divider />

            <Stack direction="row" alignItems="center" style={{  marginBottom: 2 }}>
                <Tooltip title={resultString}>
                    <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleLikeDislikeClicked}
                        sx={ event.isLikedByCurrentUser ? { color: 'red' } : { color: 'text.secondary' }}
                    >
                        <Iconify icon="eva:heart-fill" width={24} />
                        <Typography>{`${translate('FeedPage.Like')}`}</Typography>
                    </IconButton>
                </Tooltip>

                <IconButton
                        size="small"
                        color="inherit"
                        onClick={handleCommentClicked}
                        sx={{ color: 'text.secondary' }}
                    >
                        <Iconify icon="eva:message-circle-fill" width={24} />
                        <Typography>{`${translate('FeedPage.Comment')}`}</Typography>
                </IconButton>

                <Stack style={{ marginLeft: 'auto' }}>
                    {comments && comments?.length > 0 && (
                        <IconButton onClick={handleOpenComments} style={{ backgroundColor: 'transparent' }}>
                            <Typography>{`${comments.length} ${translate('FeedPage.Comment')}`}</Typography>
                        </IconButton>
                    )}
                </Stack>
            </Stack>

            <Divider />

            {comments.length > displayCommentsCount && (
                <Stack>
                    <IconButton onClick={handleShowMoreComments} style={{ backgroundColor: 'transparent' }}>
                        <Typography>
                            {`${translate('FeedPage.MoreComments')}...`}
                        </Typography>
                    </IconButton>
                </Stack>
            )}

            {isCommentAreaVisible && comments && comments?.length > 0 && (
                <List disablePadding>
                    {comments.slice(0, displayCommentsCount).sort((a, b) => new Date(a.createDate!).getTime() - new Date(b.createDate!).getTime()).map(comment => {
                        console.log(comment)

                        return (
                            <Stack key={comment.id}>
                                <ListItemButton
                                    disableGutters
                                    sx={{ p: 1, cursor: 'default' }}
                                >
                                    <Grid container>
                                        <Grid item xs={1} md={1}>
                                            <CustomAvatar
                                                src={comment.senderAvatar!}
                                                alt={comment.senderName}
                                                name={comment.senderName}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        </Grid>
    
                                        <Grid item xs={10} md={10}>
                                            <ListItemText
                                                primary={comment.text}
                                                primaryTypographyProps={{ variant: 'subtitle2'}}
                                                sx={{ paddingLeft: 1, maxWidth: '85%' }}
                                            />
                                            {comment.giphyGif && (
                                                <Box style={{ position: 'relative' }}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={2}
                                                        style={{ position: 'relative' }}
                                                    >
                                                        {/* <IconButton
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
                                                        </IconButton> */}
                                                        <img style={{ maxWidth: '100px', maxHeight: '100px' }} src={comment.giphyGif} alt="GiphyUrl" />
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Grid>
    
                                        <Grid item xs={1} md={1}>
                                            <Typography
                                                noWrap
                                                variant="body2"
                                                component="span"
                                                sx={{ mb: 1.5, fontSize: 12, color: 'text.disabled' }}
                                            >
                                                {!comment.editDate
                                                    ? formatDistanceToNowStrict(new Date(comment.createDate!), { addSuffix: false })
                                                    : formatDistanceToNowStrict(new Date(comment.editDate!), { addSuffix: false })}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItemButton>
                                <Divider />
                            </Stack>
                        )
                    })}
                </List>
            )}

            {isCommentInputVisible && 
                <>
                    <Stack direction="row" alignItems="flex-end" justifyContent="flex-end" >
                        <TextField
                            value={commentToSend.text}
                            onChange={e => setCommentToSend(comment => ({
                                ...comment,
                                text: e.target.value
                            }))}
                            inputRef={commentRef}
                            variant="standard"
                            placeholder={`${translate('FeedPage.Comment')}...`}
                            multiline
                            minRows={1}
                            maxRows={10}
                            sx={{ width: '100%', padding: 1 }}
                            InputProps={{ disableUnderline: true }}
                        />

                        <IconButton disabled={!commentToSend.text && !commentToSend.giphyGif} onClick={handleSendComment}>
                            <SendIcon />
                        </IconButton>
                    </Stack>

                    {commentToSend.giphyGif &&
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            style={{ position: 'relative' }}
                        >
                            <Box style={{ position: 'relative' }}>
                                <IconButton
                                    onClick={() => setCommentToSend(comment => ({
                                        ...comment,
                                        giphyGif: null
                                    }))}
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
                                <img src={commentToSend.giphyGif} alt="selectedGiphyUrl" />
                            </Box>
                        </Stack>
                    }

                    <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                        <IconButton onClick={(e) => setGifAnchorEl(e.currentTarget)} sx={{ padding: 0 }}>
                            <Iconify icon="fluent:emoji-32-regular" width={20} />
                            <Iconify icon="material-symbols:gif" width={40} />
                        </IconButton>
                    </Stack>

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
            }
        </Card>
    );
}