import { Box, Card, Grid, Stack, TextField } from "@mui/material";
import GiphyGIFSearchBox from "../giphyGIF/GiphyGIFSearchBox";


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
            <Box sx={{ marginTop: '10px' }} className="searchboxWrapper">
                <GiphyGIFSearchBox
                    apiKey="9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7"
                    imageRenditionFileType="gif"
                    library="gifs"
                    onSelect={(item: any) => console.log(item)}
                    masonryConfig={[
                        { columns: 2, imageWidth: 110, gutter: 5 },
                        { mq: '700px', columns: 3, imageWidth: 120, gutter: 5 }
                    ]}
                />
            </Box>
        </Card>
    );
}