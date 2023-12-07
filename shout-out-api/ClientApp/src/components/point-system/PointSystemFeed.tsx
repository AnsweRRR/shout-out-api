import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedItem } from "src/@types/feed";
import InfiniteScroll from "react-infinite-scroller";
import useLocales from "src/locales/useLocales";
import useResponsive from "src/hooks/useResponsive";
import { m } from "framer-motion";
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
        const controller = new AbortController();

        const getPointHistory = async () => {
            const { signal } = controller;
            if (user) {
                setIsLoading(true);
                const result = await getPointsHistoryAsync(offset, eventPerPage, user?.accessToken, signal);
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

        return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [offset]);

    const framerContainer = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
          }
        }
    };
      
    const framerItem = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={2} />
            <Grid item xs={12} md={7}>
                <FeedPointGive setFeedItems={setFeedItems} />

                <m.ul
                    className="container"
                    variants={framerContainer}
                    initial="hidden"
                    animate="visible"
                >
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
                        
                        {feedItems.map((item: FeedItem) => (
                            <m.div key={item.id} className="item" variants={framerItem}>
                                <PointEventCard key={item.id} event={item} feedItems={feedItems} setFeedItems={setFeedItems} />
                            </m.div>
                        ))}

                        <Socials />
                    </InfiniteScroll>
                </m.ul>
            </Grid>
            <Grid item xs={12} md={2}>
                {/* {isDesktop && <PopularRewards />} */}
            </Grid>
        </Grid>
    );
}