import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import productsReducer, { resetProducts } from './productSlice';
import categoriesReducer, { resetCategories } from './categorySlice';

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productsReducer,
  categories: categoriesReducer,
  // Add other reducers here
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer = (state: any, action: any) => {
  // Clear all state to initial state when a logout action is dispatched
  if (action.type === 'auth/logout/fulfilled') {
    // Reset products and categories state
    resetProducts();
    resetCategories();
    // Clear the rest of the state
    state = undefined;
  }
  
  return appReducer(state, action);
};

export default rootReducer;
