import { Avatar, Box, Card, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { FeedItem, ReceiverUser } from "src/@types/feed";
import { fDateTime } from "src/utils/formatTime";

type Props = {
    event: FeedItem;
};

export default function PointSystemFeed({ event }: Props) {
    console.log(event);

    return (
        <Card sx={{ p: 3, marginBottom: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Tooltip title={event.senderName}>
                    <Avatar
                        alt={event.senderName!}
                        src={event.senderAvatar!}
                        sx={{ width: 48, height: 48 }}
                    />
                </Tooltip>
                
                <Chip label={`+ ${event.amount}`} />

                {event.receiverUsers.map((receiverUser: ReceiverUser) => 
                    <Tooltip key={receiverUser.userId} title={receiverUser.userName} >
                        <Avatar
                            alt={receiverUser.userName}
                            src={receiverUser.userAvatar!}
                            sx={{ width: 48, height: 48 }}
                        />
                    </Tooltip>
                )}

                <Box style={{ marginLeft: "auto" }}>
                    <Chip label={fDateTime(event.eventDate)} />
                </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 3}}>
                <Typography>{event.senderName}</Typography>
                <Typography>@ToUserName</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 1}}>
                <Typography>{event.description}</Typography>
            </Stack>

            {event.giphyGif &&
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box>
                        <img src={event.giphyGif} alt="Giphy GIF" />
                    </Box>
                </Stack>
            }
        </Card>
    );
}