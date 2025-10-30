import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import reducers
import verificationReducer from './verificationSlice';
import authReducer from './userSlice';
import ssoReducer from './ssoSlice';
import productReducer from './productSlice';
import categoryReducer from './categorySlice';
import cartReducer from './cartSlice';

// Persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'cart'], // Only persist auth and cart
};

const rootReducer = combineReducers({
  verification: verificationReducer,
  auth: authReducer,
  sso: ssoReducer,
  products: productReducer,
  categories: categoryReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
