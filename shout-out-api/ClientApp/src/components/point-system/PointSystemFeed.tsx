import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import { PATH_APP } from "src/routes/paths";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedContext, FeedItem } from "src/@types/feed";
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
    const location = useLocation();
    const isDesktop = useResponsive('up', 'lg');
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const eventPerPage = 10;
    
    useEffect(() => {
        if (location.pathname === PATH_APP.feed.receivedPoints) {
            console.log('Current route:', location.pathname);
            console.log('receivedPoints');
        } else if (location.pathname === PATH_APP.feed.givenPoints) {
            console.log('Current route:', location.pathname);
            console.log('givenPoints');
        } else {
            console.log('Current route:', location.pathname);
            console.log('main');
        }
        
    }, [location]);

    useEffect(() => {
        const controller = new AbortController();

        let feedContext: FeedContext = FeedContext.Main;

        if (location.pathname === PATH_APP.feed.receivedPoints) {
            console.log('Current route:', location.pathname);
            console.log('receivedPoints');
            feedContext = FeedContext.ReceivedPoints;
        } else if (location.pathname === PATH_APP.feed.givenPoints) {
            console.log('Current route:', location.pathname);
            console.log('givenPoints');
            feedContext = FeedContext.GivenPoints;
        } else {
            console.log('Current route:', location.pathname);
            console.log('main');
            feedContext = FeedContext.Main
        }

        const getPointHistory = async () => {
            const { signal } = controller;
            if (user) {
                setIsLoading(true);
                const result = await getPointsHistoryAsync(offset, eventPerPage, feedContext, user?.accessToken, signal);
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
    }, [offset, location]);

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