import { Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { useLocales } from "src/locales";
import { useTheme } from '@mui/material/styles';

export default function UserPointsToHave() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const theme = useTheme();

    return (
        <>
            <Tooltip title={`${translate('Header.PointsToHave')}`}>
                <Typography color={ theme.palette.mode === 'light' ? 'grey' : 'inherit'}>
                    {user?.pointToHave}
                </Typography>
            </Tooltip>

            <img src='/logo/logo_full_coin.png' alt='points-to-have' style={{ maxHeight: '20px', marginLeft: 3 }} />
        </>
    );
}