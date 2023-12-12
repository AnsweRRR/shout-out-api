import { Typography, Box, Button } from "@mui/material";
import useLocales from "src/locales/useLocales";
import Iconify from "../iconify/Iconify";

interface Props {
    handleNewPostButtonClick: () => Promise<() => void>
}

export default function NewPostButton(props: Props) {
    const { handleNewPostButtonClick } = props;
    const { translate } = useLocales();

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 100,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2
            }}
        >
            <Button
                onClick={handleNewPostButtonClick}
                size="medium"
                variant="contained"
                sx={{ borderRadius: 20 }}
            >
                <Typography>{`${translate('FeedPage.NewPosts')}`}</Typography>
                &nbsp;
                <Iconify icon="eva:arrow-circle-up-outline" width={24} />
            </Button>
        </Box>
    );
}