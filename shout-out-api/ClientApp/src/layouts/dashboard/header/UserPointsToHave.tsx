import { Tooltip, Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { useLocales } from "src/locales";


export default function UserPointsToHave() {
    const { user } = useAuthContext();
    const { translate } = useLocales();

    return (
        <Tooltip title={`${translate('Header.PointsToGive')}`}>
            <Typography>
                {user?.pointToHave}
            </Typography>
        </Tooltip>
    );
}