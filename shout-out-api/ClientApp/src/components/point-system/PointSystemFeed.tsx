import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedItem } from "src/@types/feed";
import InfiniteScroll from "react-infinite-scroller";
import useLocales from "src/locales/useLocales";
import useResponsive from "src/hooks/useResponsive";
import Spinner from "../giphyGIF/Spinner";
import PointEventCard from "./PointEventCard";
import FeedPointGive from "./FeedPointGive";
import Socials from "../social/Socials";
import PopularRewards from "./PopularRewards";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const isDesktop = useResponsive('up', 'lg');
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const eventPerPage = 10;

    useEffect(() => {
        const getPointHistory = async () => {
            if (user) {
                setIsLoading(true);
                const result = await getPointsHistoryAsync(offset, eventPerPage, user?.accessToken);
                const items = result.data as Array<FeedItem>;
                if (items.length < eventPerPage) {
                    setIsLastPage(true);
                }
                else {
                    setIsLastPage(false);
                }
                setFeedItems(prevState => [...prevState, ...items]);
                setIsLoading(false);
            }
        }

        getPointHistory();
    }, [user, offset]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={2} />
            <Grid item xs={12} md={7}>
                <FeedPointGive setFeedItems={setFeedItems} />

                <InfiniteScroll
                    pageStart={0}
                    loadMore={(page: number) => setOffset(page * eventPerPage)}
                    hasMore={!isLoading && !isLastPage}
                    // useWindow={false}
                    initialLoad={false}
                    loader={(
                        <div key="loading">
                            {isLoading && <Spinner message={`${translate(`FeedPage.Loading`)}`} image={null} />}
                        </div>
                    )}
                >
                    {feedItems.map((item: FeedItem) => <PointEventCard key={item.id} event={item} feedItems={feedItems} setFeedItems={setFeedItems} />)}

                    <Socials />
                </InfiniteScroll>
            </Grid>
            <Grid item xs={12} md={2}>
                {/* {isDesktop && <PopularRewards />} */}
            </Grid>
        </Grid>
    );
}