import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { CommentDto, FeedItem, HubEventType, Like, LikeDislikeResultDto, TemporaryHubResultState } from "src/@types/feed";
import InfiniteScroll from "react-infinite-scroller";
import useLocales from "src/locales/useLocales";
import useResponsive from "src/hooks/useResponsive";
import { m } from "framer-motion";
import { addCommentEventListener, addDislikePostEventListener, addGivePointsEventListener, addLikePostEventListener, deleteCommentEventListener, editCommentEventListener } from "src/middlewares/signalRHub";
import { useSelector } from "src/redux/store";
import { AppState } from "src/redux/rootReducerTypes";
import Spinner from "../giphyGIF/Spinner";
import PointEventCard from "./PointEventCard";
import FeedPointGive from "./FeedPointGive";
import Socials from "../social/Socials";
import PopularRewards from "./PopularRewards";
import NewPostButton from "./NewPostButton";

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    const connection = useSelector((state: AppState) => state.signalRHubState.hubConnection);
    const isDesktop = useResponsive('up', 'lg');
    const [isNewPostsButtonVisible, setIsNewPostsButtonVisible] = useState<boolean>(false);
    const [temporaryHubResult, setTemporaryHubResult] = useState<TemporaryHubResultState | null>(null);
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const eventPerPage = 10;

    const scrollToTop = async () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const getPointHistory = async (controller: AbortController) => {
        const { signal } = controller;
        if (user) {
            setIsLoading(true);
            console.log(offset);
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
        // await scrollToTop();

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

    // hub listeners...
    useEffect(() => {
        try {
            addGivePointsEventListener((result) => {
                console.log(result);
                setIsNewPostsButtonVisible(true);
            }, connection!);

            addLikePostEventListener((result: LikeDislikeResultDto) => {
                setTemporaryHubResult({...result, refreshByHub: true, hubEventType: HubEventType.LikePostEventListener});
            }, connection!);

            addDislikePostEventListener((result) => {
                setTemporaryHubResult({...result, refreshByHub: true, hubEventType: HubEventType.DislikePostEventListener});
            }, connection!);

            addCommentEventListener((result) => {
                setTemporaryHubResult({...result, refreshByHub: true, hubEventType: HubEventType.AddCommentEventListener});
            }, connection!);

            editCommentEventListener((result) => {
                setTemporaryHubResult({...result, refreshByHub: true, hubEventType: HubEventType.EditCommentEventListener});
            }, connection!);

            deleteCommentEventListener((result) => {
                setTemporaryHubResult({...result, refreshByHub: true, hubEventType: HubEventType.DeleteCommentEventListener});
            }, connection!);
        }
        catch(error) {
            console.error(error);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* eslint-disable no-else-return */
    useEffect(() => {
        if (temporaryHubResult?.refreshByHub) {
            const newFeedItems = feedItems.map(item => {
                if (item.id === temporaryHubResult.pointHistoryId) {
                    switch(temporaryHubResult.hubEventType) {
                        case HubEventType.LikePostEventListener: {
                            const newLike : Like = {
                                id: temporaryHubResult.pointHistoryId!,
                                likedById: temporaryHubResult.likedById!,
                                likedByName: temporaryHubResult.likedByName!
                            };
                    
                            const updatedLikes = item.likes ? [...item.likes, newLike] : [newLike];
                            return { ...item, likes: updatedLikes };
                        }
                        case HubEventType.DislikePostEventListener: {
                            const updatedLikes = item.likes ? item.likes.filter(like => like.likedById !== temporaryHubResult.likedById) : [];
                            return { ...item, likes: updatedLikes };
                        }
                        case HubEventType.AddCommentEventListener: {
                            const newComment : CommentDto = {
                                id: temporaryHubResult.id,
                                pointHistoryId: temporaryHubResult.pointHistoryId,
                                text: temporaryHubResult.text!,
                                giphyGif: temporaryHubResult.giphyGif,
                                senderId: temporaryHubResult.senderId,
                                senderName: temporaryHubResult.senderName,
                                senderAvatar: temporaryHubResult.senderAvatar,                                
                                createDate: temporaryHubResult.createDate!,
                                editDate: temporaryHubResult.editDate
                            };

                            const updatedComments = item.comments ? [newComment, ...item.comments] : [newComment];
                            return { ...item, comments: updatedComments };
                        }
                        case HubEventType.EditCommentEventListener: {
                            const commentToEdit = item.comments?.find(comment => comment.id === temporaryHubResult.id);

                            if (commentToEdit) {
                                commentToEdit.text = temporaryHubResult.text;
                                commentToEdit.giphyGif = temporaryHubResult.giphyGif;
                                commentToEdit.editDate = temporaryHubResult.editDate;
                            }

                            return { ...item, commentToEdit }
                        }
                        case HubEventType.DeleteCommentEventListener: {
                            const updatedComments = item.comments ? item.comments.filter(comment => comment.id !== temporaryHubResult.id) : [];
                            return { ...item, comments: updatedComments };
                        }
                        default:
                            break;
                    }
                }
                return item;
            });        
            setFeedItems(newFeedItems);
            setTemporaryHubResult(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [temporaryHubResult]);
    /* eslint-enable no-else-return */

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
                        loadMore={(page: number) => {
                            console.log('page', page);
                            setOffset(page * eventPerPage);
                        }}
                        hasMore={!isLoading && !isLastPage}
                        initialLoad={false}
                        threshold={50}
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