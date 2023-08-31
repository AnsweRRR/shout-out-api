import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import PointEventCard from "./PointEventCard";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const [feedItems, setFeedItems] = useState([]);

    useEffect(() => {
        const getRewards = async () => {
            if (user) {
                const result = await getPointsHistoryAsync(user?.accessToken);
                setFeedItems(result.data);
            }
        }
        getRewards();
    }, [user]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={2} />
                <Grid item xs={12} md={7}>
                    <PointEventCard />
                    <PointEventCard />
                </Grid>
                <Grid item xs={12} md={2} />
            </Grid>
        </>
    );
}