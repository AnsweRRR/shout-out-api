import { Helmet } from "react-helmet-async";
import { Container } from '@mui/material';
import Rewards from "src/components/reward/Rewards";
import { useSettingsContext } from '../../components/settings';

export default function RewardPage() {
    const { themeStretch } = useSettingsContext();

    return (
        <>
            <Helmet>
                <title>Rewards</title>
            </Helmet>

            <Container maxWidth={themeStretch ? false : 'lg'}>
                <Rewards />
            </Container>
        </>
    );
}