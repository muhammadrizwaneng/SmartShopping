import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './verificationSlice';

const store = configureStore({
  reducer: {
    slice: sliceReducer,
  },
});
export default store;
