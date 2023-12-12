import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { FeedItem, Like, LikeDislikeResultDto } from "src/@types/feed";
import InfiniteScroll from "react-infinite-scroller";
import useLocales from "src/locales/useLocales";
import useResponsive from "src/hooks/useResponsive";
import { m } from "framer-motion";
import { addDislikePostEventListener, addGivePointsEventListener, addLikePostEventListener } from "src/middlewares/signalRHub";
import { useDispatch, useSelector } from "src/redux/store";
import { AppState } from "src/redux/rootReducerTypes";
import Spinner from "../giphyGIF/Spinner";
import PointEventCard from "./PointEventCard";
import FeedPointGive from "./FeedPointGive";
import Socials from "../social/Socials";
import PopularRewards from "./PopularRewards";
import NewPostButton from "./NewPostButton";

const scrollToTop = async () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
};

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const dispatch = useDispatch();
    const connection = useSelector((state: AppState) => state.signalRHubState.hubConnection);
    const isDesktop = useResponsive('up', 'lg');
    const [isNewPostsButtonVisible, setIsNewPostsButtonVisible] = useState<boolean>(false);
    const [temporaryHubResult, setTemporaryHubResult] = useState<any>({});
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const eventPerPage = 10;

    const getPointHistory = async (controller: AbortController) => {
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

            if (offset === 0) {
                setFeedItems(items);
            }
            else {
                setFeedItems(prevState => [...prevState, ...items]);
            }

            setIsLoading(false);
        }
    }

    const handleNewPostButtonClick = async () => {
        const controller = new AbortController();
        await scrollToTop();

        if (offset > 0) {
            setIsNewPostsButtonVisible(false);
            setIsLastPage(false);
            setOffset(0);
        } else {
            setIsNewPostsButtonVisible(false);
            getPointHistory(controller);
        }
        
        return () => controller.abort();
    }

    useEffect(() => {
        try {
            addGivePointsEventListener((result) => {
                console.log(result);
                setIsNewPostsButtonVisible(true);
            }, connection!);

            addLikePostEventListener((result: LikeDislikeResultDto) => {
                setTemporaryHubResult({...result, refreshByHub: true, isLikeEvent: true});
            }, connection!);

            addDislikePostEventListener((result) => {
                setTemporaryHubResult({...result, refreshByHub: true, isLikeEvent: false});
            }, connection!);
        }
        catch(error) {
            console.error(error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (temporaryHubResult.refreshByHub) {
            const newFeedItems = feedItems.map(item => {
                if (item.id === temporaryHubResult.feedItemId) {
                    if (temporaryHubResult.isLikeEvent) { // In case of like event...
                        const newLike = {
                            id: temporaryHubResult.feedItemId,
                            likedById: temporaryHubResult.likedById,
                            likedByName: temporaryHubResult.likedByName
                        };
                
                        const updatedLikes = item.likes ? [...item.likes, newLike] : [newLike];
                
                        return { ...item, likes: updatedLikes };
                    }
                    
                    // In case of dislike event...
                    const updatedLikes = item.likes ? item.likes.filter(like => like.likedById !== temporaryHubResult.likedById) : [];
                    return { ...item, likes: updatedLikes };
                }
                return item;
            });
        
            setFeedItems(newFeedItems);
            setTemporaryHubResult({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temporaryHubResult]);

    useEffect(() => {
        const controller = new AbortController();
        getPointHistory(controller);

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
                {isNewPostsButtonVisible && (<NewPostButton handleNewPostButtonClick={handleNewPostButtonClick} />)}
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