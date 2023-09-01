import { Box, Button, Card, Grid, Stack, TextField } from "@mui/material";


export default function PointSystemFeed() {
    return (
        <Card sx={{ p: 3, marginBottom: 3 }}>
            <Stack direction="row" alignItems="center" spacing={2} style={{ justifyContent: 'space-between' }}>
                <Grid container>
                    <Grid item xs={6} md={6}>
                        <Box>
                            <p>This is a div node 2</p>
                        </Box>
                    </Grid>

                    <Grid item xs={6} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Box>
                            <p>This is a div node 2</p>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2}>
                <TextField
                    variant="outlined"
                    placeholder="@felhasználónév +10 hozzászólás..."
                    multiline
                    rows={3}
                    maxRows={6}
                    sx={{ width: '100%', border: 'none' }}
                />
            </Stack>
        </Card>
    );
}