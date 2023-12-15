import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { AppState } from './rootReducerTypes';
import usersReducer from './reducersAndActions/usersActionAndReducer';
import signalRHubReducer from './signalRHubSlicer';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers<AppState>({
  usersState: usersReducer,
  signalRHubState: signalRHubReducer
});

export default rootReducer;