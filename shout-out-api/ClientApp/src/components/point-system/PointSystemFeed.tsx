import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedItem } from "src/@types/feed";
import PointEventCard from "./PointEventCard";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);

    useEffect(() => {
        const getPointHistory = async () => {
            if (user) {
                const result = await getPointsHistoryAsync(user?.accessToken);
                const items = result.data as Array<FeedItem>;
                setFeedItems(prevState => [...prevState, ...items]);
            }
        }
        getPointHistory();
    }, [user]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={2} />
            <Grid item xs={12} md={7}>
                {feedItems.map((item: FeedItem) => <PointEventCard key={item.id} event={item} />)}
            </Grid>
            <Grid item xs={12} md={2} />
        </Grid>
    );
}