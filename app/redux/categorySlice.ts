import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Add a logout action that can be used to reset the state
export const resetCategories = createAction('categories/reset');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallServiceFor } from '../services/call_services_for';
import ApiConfig from '../config/api-config';

interface CategoryState {
  categories: any[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState }) => {
    const state: any = getState();
    const { lastFetched } = state.categories;
    
    // Check if we have a recent cache
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      const cachedCategories = await AsyncStorage.getItem('cachedCategories');
      if (cachedCategories) {
        return { categories: JSON.parse(cachedCategories), fromCache: true };
      }
    }

    try {
      const url = ApiConfig.BASE_URL + ApiConfig.FETCH_CATEGORIES_WITH_PRODUCT_COUNTS;
      const response = await CallServiceFor(url, 'get', {});
      
      if (response.status === 200) {
        // Cache the categories
        await AsyncStorage.setItem('cachedCategories', JSON.stringify(response.data));
        return { categories: response?.data, fromCache: false };
      }
      throw new Error('Failed to fetch categories');
    } catch (error) {
      // If API call fails, try to return cached data
      const cachedCategories = await AsyncStorage.getItem('cachedCategories');
      if (cachedCategories) {
        return { categories: JSON.parse(cachedCategories), fromCache: true };
      }
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        if (!action.payload.fromCache) {
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(resetCategories, () => initialState);
  },
});

export default categorySlice.reducer;
