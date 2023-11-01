import { Box, Card, Chip, Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { FeedItem, ReceiverUser } from "src/@types/feed";
import { fHungarianDateTime } from "src/utils/formatTime";
import { CustomAvatar } from "../custom-avatar";

type Props = {
    event: FeedItem;
};

export default function PointSystemFeed({ event }: Props) {
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
                                        sx={{ width: 48, height: 48 }}
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
        </Card>
    );
}