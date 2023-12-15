import { useReducer } from 'react';
import { getGiphyGifsAsync } from 'src/api/feedClient';
import giphyGIFReducer from 'src/redux/giphyGIFReducer';

const useApi = () => {
    const [state, dispatch] = useReducer(giphyGIFReducer, {
        loading: false,
        error: false,
        data: [],
        lastPage: false,
    });

    const fetchImages = async (accessToken: string, limit: number, offset: number, isMore: boolean, filterName?: string | null) => {
        if (isMore) {
            dispatch({ type: 'FETCH_MORE_INIT' });
        } else {
            dispatch({ type: 'FETCH_INIT' });
        }

        try {
            const response = await getGiphyGifsAsync(accessToken, limit, offset, filterName);

            if (response.status === 200) {
                const { data } = response;

                if (isMore) {
                    dispatch({
                        type: 'FETCH_MORE_SUCCESS',
                        payload: data.data,
                        pagination: response.data.pagination
                    });
                } else {
                    dispatch({
                        type: 'FETCH_SUCCESS',
                        payload: data.data,
                        pagination: response.data.pagination
                    });
                }
            } else {
                dispatch({ type: 'FETCH_FAILURE' });
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: 'FETCH_FAILURE' });
        }
    };

    return [state, fetchImages];
}

export default useApi;