import { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedItem } from "src/@types/feed";
import PointEventCard from "./PointEventCard";
import FeedPointGive from "./FeedPointGive";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getPointHistory = async () => {
            if (user) {
                setIsLoading(true);
                const result = await getPointsHistoryAsync(user?.accessToken);
                const items = result.data as Array<FeedItem>;
                setFeedItems(prevState => [...prevState, ...items]);
                setIsLoading(false);
            }
        }
        getPointHistory();
    }, [user]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={2} />
                <Grid item xs={12} md={7}>
                    <FeedPointGive />
                    {isLoading ? <h1>Loading...</h1> : feedItems.map((item: FeedItem) => <PointEventCard key={item.id} event={item} />)}
                </Grid>
                <Grid item xs={12} md={2} />
            </Grid>
        </>
    );
}