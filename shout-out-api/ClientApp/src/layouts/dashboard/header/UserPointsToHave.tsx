import { Typography } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";


export default function UserPointsToHave() {
    const { user } = useAuthContext();

    return (
        <Typography>
            {user?.pointToHave}
        </Typography>
    );
}