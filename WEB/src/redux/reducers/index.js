import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import authReducer from './authReducer';
import messageReducer from './messageReducer';

const createNoopStorage = () => ({
  getItem() {
      return Promise.resolve(null);
  },
  setItem(_key, value) {
      return Promise.resolve(value);
  },
  removeItem() {
      return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
});

export { rootReducer, rootPersistConfig };
