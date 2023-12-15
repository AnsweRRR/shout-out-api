import { useEffect, useRef, useState } from 'react';
import { ImageRenditionFileType } from 'src/@types/feed';
import InfiniteScroll from 'react-infinite-scroller';
import { useStyle } from 'src/hooks/useStyle';
import { GiphyGIFSearchBoxStyles } from 'src/utils/cssStyles';
import useSearchForm from 'src/hooks/useSearchForm';
import useDebounce from 'src/hooks/useDebounce';
import useMedia from 'src/hooks/useMedia';
import { useAuthContext } from 'src/auth/useAuthContext';
import useApi from 'src/hooks/useApi';
import { getComponentWrapperWidth, getDefaultMasonryConfig, getMasonryConfigExceptLast, getMediaBreakpoints } from 'src/utils/masonry';
import { useLocales } from 'src/locales';
import SearchForm from './SearchForm';
import ImageItem from './ImageItem';
import MasonryLayout from './MasonryLayout';
import Alert from './Alert';
import Spinner from './Spinner';
import PoweredByGiphy from './PoweredByGiphy';

type MasonryConfig = {
    mq?: string,
    columns: number,
    imageWidth: number,
    gutter: number
}

type Props = {
    imageRenditionFileType: ImageRenditionFileType,
    loadingImage?: null | string,
    masonryConfig: Array<MasonryConfig>,
    onSelect: Function,
}

const GiphyGIFSearchBox = (props: Props) => {
    const {
        imageRenditionFileType,
        loadingImage,
        masonryConfig,
        onSelect,
    } = props;
    useStyle('Index', GiphyGIFSearchBoxStyles);
    const { translate } = useLocales();
    const { query, handleInputChange, handleSubmit } = useSearchForm();
    const debouncedQuery = useDebounce(query, 500);

    const gifPerPage = 20;
    const [{ data, loading, error, lastPage }, fetchImages] = useApi();
    const { user } = useAuthContext();

    const masonryConfigMatchMedia = useMedia(
        getMediaBreakpoints(masonryConfig),
        getMasonryConfigExceptLast(masonryConfig),
        getDefaultMasonryConfig(masonryConfig),
    );

    // Fetch Giphy Api on component mount and on search query change
    const [firstRun, setFirstRun] = useState(true);
    const isFirstRun = useRef(true);
    useEffect(() => {
        fetchImages(user?.accessToken, gifPerPage, 0, false, query);

        if (isFirstRun.current) {
            isFirstRun.current = false;
            setFirstRun(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

    return (
        <div
            className="reactGiphySearchbox-componentWrapper"
            style={{ width: getComponentWrapperWidth(masonryConfigMatchMedia) }}
        >
            <SearchForm
                value={query}
                setValue={handleInputChange}
                onSubmit={handleSubmit}
                placeholder={`${translate('Gif.SearchForGif')}`}
            />

            <div
                className='reactGiphySearchbox-listWrapper'
                style={{ height: '300px' }}
            >
                {data.length === 0 && !loading && !error && !firstRun && <Alert message='No matches found.' />}

                {error && <Alert message='Oops! Something went wrong. Please, try again.' />}

                {loading && <Spinner message='Loading...' image={loadingImage} />}

                <InfiniteScroll
                    pageStart={0}
                    loadMore={(page: number) => fetchImages(user?.accessToken, gifPerPage, page * gifPerPage, true, query)}
                    hasMore={!loading && !lastPage}
                    useWindow={false}
                    initialLoad={false}
                    loader={
                        !firstRun ? (
                            <div key="loading">
                                {loading && <Spinner message='Loading...' image={loadingImage} />}
                            </div>
                        ) : undefined
                    }
                >
                {data.length > 0 && (
                    <MasonryLayout sizes={masonryConfig}>
                    {data.map((item: any) => (
                        <ImageItem
                            item={item}
                            size={masonryConfigMatchMedia.imageWidth}
                            key={item.id}
                            onSelect={onSelect}
                            backgroundColor='#eee'
                            imageRenditionName='fixedWidthDownsampled'
                            imageRenditionFileType={imageRenditionFileType}
                        />
                    ))}
                    </MasonryLayout>
                )}
                </InfiniteScroll>
            </div>
            <PoweredByGiphy />
        </div>
    )
}

export default GiphyGIFSearchBox;