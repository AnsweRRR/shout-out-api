import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';

// ----------------------------------------------------------------------

export interface AppState {

}

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers<AppState>({

});

export default rootReducer;
