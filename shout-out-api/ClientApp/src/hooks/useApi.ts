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

    const fetchImages = async (accessToken: string, offset: number, isMore: boolean, filterName?: string | null) => {
        if (isMore) {
            dispatch({ type: 'FETCH_MORE_INIT' });
        } else {
            dispatch({ type: 'FETCH_INIT' });
        }

        try {
            const response = await getGiphyGifsAsync(accessToken, offset, filterName);

            if (response.status === 200) {
                // Successful API call
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
                // Handle API error
                dispatch({ type: 'FETCH_FAILURE' });
            }
        } catch (error) {
            // Handle network or other errors
            console.error(error);
            dispatch({ type: 'FETCH_FAILURE' });
        }
    };


    /*
    const fetchImages = (url: string, isMore: boolean) => {
        if (isMore) {
            dispatch({ type: 'FETCH_MORE_INIT' });
        } else {
            dispatch({ type: 'FETCH_INIT' });
        }

        fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(json => {
                    throw json
                });
            }

            return response.json()
        })
        .then(response => {
            if (!response.pagination) {
                return dispatch({ type: 'FETCH_FAILURE' });
            }

            if (isMore) {
                return dispatch({
                    type: 'FETCH_MORE_SUCCESS',
                    payload: response.data,
                    pagination: response.pagination,
                });
            }

            return dispatch({
                type: 'FETCH_SUCCESS',
                payload: response.data,
                pagination: response.pagination
            });
        })
        .catch(() => {
            dispatch({ type: 'FETCH_FAILURE' });
        })
    }
    */

    return [state, fetchImages];
}

export default useApi;