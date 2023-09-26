import { useReducer } from 'react';
import giphyGIFReducer from 'src/redux/giphyGIFReducer';

const useApi = () => {
    const [state, dispatch] = useReducer(giphyGIFReducer, {
        loading: false,
        error: false,
        data: [],
        lastPage: false,
    });

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

    return [state, fetchImages];
}

export default useApi;