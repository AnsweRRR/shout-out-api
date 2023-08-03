import { Helmet } from "react-helmet-async";
import { Container } from '@mui/material';
import PointSystemFeed from "src/components/point-system/PointSystemFeed";
import { useSettingsContext } from '../../components/settings';


export default function FeedPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>ShoutOut Feed</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <PointSystemFeed />
            </Container>
        </>
    );
}