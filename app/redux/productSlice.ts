import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Add a reset action that can be used to reset the state
export const resetProducts = createAction('products/reset');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallServiceFor } from '../services/call_services_for';
import ApiConfig from '../config/api-config';

interface ProductState {
  products: any[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState }) => {
    const state: any = getState();
    const { lastFetched } = state.products;
    
    // Check if we have a recent cache
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      const cachedProducts = await AsyncStorage.getItem('cachedProducts');
      if (cachedProducts) {
        return { products: JSON.parse(cachedProducts), fromCache: true };
      }
    }

    try {
      const url = ApiConfig.BASE_URL + ApiConfig.FETCH_LIST_PRODUCTS;
      const response = await CallServiceFor(url, 'get', {});
      
      if (response.status === 200) {
        // Cache the products
        await AsyncStorage.setItem('cachedProducts', JSON.stringify(response.data));
        return { products: response?.data, fromCache: false };
      }
      throw new Error('Failed to fetch products');
    } catch (error) {
      // If API call fails, try to return cached data
      const cachedProducts = await AsyncStorage.getItem('cachedProducts');
      if (cachedProducts) {
        return { products: JSON.parse(cachedProducts), fromCache: true };
      }
      throw error;
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        if (!action.payload.fromCache) {
          state.lastFetched = Date.now();
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(resetProducts, () => initialState);
  },
});

export default productSlice.reducer;
