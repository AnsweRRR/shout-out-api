import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Widget, addResponseMessage, toggleMsgLoader } from 'react-chat-widget';
import { useAuthContext } from "src/auth/useAuthContext";
import { getPointsHistoryAsync } from "src/api/feedClient";
import { getOpenAIResponseAsync } from "src/api/openAIClient";
import { FeedItem } from "src/@types/feed";
import InfiniteScroll from "react-infinite-scroller";
import useLocales from "src/locales/useLocales";
import { useStyle } from 'src/hooks/useStyle';
// import useResponsive from "src/hooks/useResponsive";
import { chatWidgetStyles } from "src/utils/cssStyles";
import Spinner from "../giphyGIF/Spinner";
import PointEventCard from "./PointEventCard";
import FeedPointGive from "./FeedPointGive";
import Socials from "../social/Socials";
// import PopularRewards from "./PopularRewards";

import 'react-chat-widget/lib/styles.css';

export default function PointSystemFeed() {
    const { user } = useAuthContext();
    const { translate } = useLocales();
    // const isDesktop = useResponsive('up', 'lg');
    useStyle('Widget', chatWidgetStyles);
    const OPEN_AI_IMAGE_SRC = `${process.env.PUBLIC_URL}/assets/icons/components/openAI-logo.png`;
    const [feedItems, setFeedItems] = useState<Array<FeedItem>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const eventPerPage = 10;

    const handleNewResponse = async (input: string) => {
        const controller = new AbortController();
        const { signal } = controller;
        if (user) {
            toggleMsgLoader();
            const result = await getOpenAIResponseAsync(input, user?.accessToken, signal);
            const { data } = result;
            toggleMsgLoader();
            addResponseMessage(data);
        }

        return () => controller.abort();
    }

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

    return (
        <>
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

            <Widget
                title={`${translate('OpenAIWidget.OpenAI')}`}
                subtitle={`${translate('OpenAIWidget.YouCanAskAnythingFromTheOpenAI')}`}
                senderPlaceHolder={`${translate('OpenAIWidget.AskSomething')}`}                
                handleNewUserMessage={handleNewResponse}
                emojis={false}
                profileClientAvatar={user?.avatar && `${user.avatar}`}
                profileAvatar={OPEN_AI_IMAGE_SRC}
            />
        </>
    );
}