import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string | number;
  productId: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variantId?: string | number;
  variantName?: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Load cart from AsyncStorage
const loadCart = async (): Promise<CartState> => {
  try {
    const cart = await AsyncStorage.getItem('cart');
    return cart ? JSON.parse(cart) : initialState;
  } catch (error) {
    console.error('Error loading cart:', error);
    return initialState;
  }
};

// Save cart to AsyncStorage
const saveCart = async (cart: CartState) => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Load cart from storage
    loadCartFromStorage: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
    
    // Add item to cart
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      // Update totals
      state.totalItems += 1;
      state.totalPrice += action.payload.price;
      
      // Save to AsyncStorage
      saveCart(state);
    },
    
    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string | number>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      
      if (index !== -1) {
        const item = state.items[index];
        
        // Update totals
        state.totalItems -= item.quantity;
        state.totalPrice -= item.price * item.quantity;
        
        // Remove item
        state.items.splice(index, 1);
        
        // Save to AsyncStorage
        saveCart(state);
      }
    },
    
    // Update item quantity
    updateQuantity: (state, action: PayloadAction<{id: string | number; quantity: number}>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        // Update totals
        state.totalItems += quantity - item.quantity;
        state.totalPrice += (quantity - item.quantity) * item.price;
        
        // Update quantity
        item.quantity = quantity;
        
        // Save to AsyncStorage
        saveCart(state);
      }
    },
    
    // Clear cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      // Clear from AsyncStorage
      AsyncStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, loadCartFromStorage } = cartSlice.actions;
export default cartSlice.reducer;

// Load cart from storage when app starts
export const initializeCart = () => async (dispatch: any) => {
  const cart = await loadCart();
  dispatch(loadCartFromStorage(cart));
};
