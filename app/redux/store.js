// PERSIST

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import verificationReducer from './verificationSlice';
import loginReducer from './userSlice';
import ssoReducer from './ssoSlice';
// import appReducer from './appSlice';

// import storage from 'redux-persist/lib/storage';
// import {combineReducers} from 'redux';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducer = combineReducers({
  user: loginReducer,
  verificationPopup: verificationReducer,
  //categoryData: categoryReducer,s
  // app: appReducer,
  sso: ssoReducer,
});

const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
