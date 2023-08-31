import { Avatar, Box, Card, Chip, Stack, Tooltip, Typography } from "@mui/material";

export default function PointSystemFeed() {
    return (
        <Card sx={{ p: 3, marginBottom: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Tooltip title="teszt">
                    <Avatar
                        alt="asd"
                        src="/assets/illustrations/illustration_dashboard.png"
                        sx={{ width: 48, height: 48 }}
                    />
                </Tooltip>
                
                <Chip label="+10" />

                <Tooltip title="teszt">
                    <Avatar
                        alt="asd"
                        src="/assets/illustrations/illustration_dashboard.png"
                        sx={{ width: 48, height: 48 }}
                    />
                </Tooltip>


                <Box style={{ marginLeft: "auto" }}>
                    <Chip label="2023.08.31" />
                </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 3}}>
                <Typography>FromUserName</Typography>
                <Typography>@ToUserName</Typography>
                <Typography>#IndoklásMertKurvaJófejvagy</Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ marginTop: 3}}>
                <Box>
                    Ide jön majd a giphy gif
                </Box>
            </Stack>
        </Card>
    );
}